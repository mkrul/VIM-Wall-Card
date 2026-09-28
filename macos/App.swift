import Cocoa
import WebKit

final class AppDelegate: NSObject, NSApplicationDelegate, NSWindowDelegate, WKScriptMessageHandler {
    private var window: NSWindow!
    private var webView: WKWebView!
    private var projectRoot: URL!
    private let cardWidth: CGFloat = 400
    private let cardHeight: CGFloat = 564
    private var savedOrigin: NSPoint?
    private var suppressFrameSave = false
    private var frameRestoreWork: DispatchWorkItem?
    private let frameOriginKey = "VimWallCardOrigin"

    func applicationDidFinishLaunching(_ notification: Notification) {
        let bundle = URL(fileURLWithPath: Bundle.main.bundlePath).resolvingSymlinksInPath()
        projectRoot = bundle.deletingLastPathComponent()
        let index = projectRoot.appendingPathComponent("index.html")
        let background = NSColor(srgbRed: 16 / 255, green: 22 / 255, blue: 20 / 255, alpha: 1)

        let controller = WKUserContentController()
        controller.add(self, name: "card")
        let config = WKWebViewConfiguration()
        config.userContentController = controller
        let webView = WKWebView(frame: NSRect(x: 0, y: 0, width: 400, height: 564), configuration: config)
        webView.underPageBackgroundColor = background
        webView.allowsMagnification = false
        self.webView = webView

        let window = NSWindow(
            contentRect: NSRect(x: 0, y: 0, width: 400, height: 564),
            styleMask: [.titled, .closable, .miniaturizable, .resizable],
            backing: .buffered,
            defer: false
        )
        window.title = "Vim Wall Card"
        window.contentView = webView
        window.minSize = NSSize(width: 400, height: 480)
        window.delegate = self
        window.isReleasedWhenClosed = false
        window.tabbingMode = .disallowed
        window.appearance = NSAppearance(named: .darkAqua)
        window.backgroundColor = background
        self.window = window

        if let origin = loadOrigin(), frameFits(origin) {
            var frame = window.frame
            frame.origin = origin
            window.setFrame(frame, display: true)
            savedOrigin = origin
        } else {
            placeOnTallestScreen()
        }
        rememberFrame()
        watchScreenChanges()

        window.makeKeyAndOrderFront(nil)
        NSApp.activate(ignoringOtherApps: true)

        if FileManager.default.fileExists(atPath: index.path) {
            webView.loadFileURL(index, allowingReadAccessTo: projectRoot)
        } else {
            let alert = NSAlert()
            alert.messageText = "Could not find the card"
            alert.informativeText = "index.html should sit next to Vim Wall Card.app."
            alert.runModal()
            NSApp.terminate(nil)
        }
    }

    private func tallestScreen() -> NSScreen? {
        NSScreen.screens.max(by: { $0.visibleFrame.height < $1.visibleFrame.height }) ?? window.screen
    }

    private func placeOnTallestScreen() {
        guard let screen = tallestScreen() else { return }
        let visible = screen.visibleFrame
        let fitted = window.frameRect(forContentRect: NSRect(x: 0, y: 0, width: cardWidth, height: min(cardHeight, visible.height)))
        let frame = NSRect(
            x: visible.minX,
            y: visible.maxY - fitted.height,
            width: fitted.width,
            height: fitted.height
        )
        window.setFrame(frame, display: true)
    }

    private func fitContent(_ contentHeight: CGFloat) {
        guard contentHeight > 200 else { return }
        let screen = window.screen ?? tallestScreen()
        guard let screen else { return }
        let visible = screen.visibleFrame
        let width = cardWidth
        var height = cardHeight
        let frame = window.frameRect(forContentRect: NSRect(x: 0, y: 0, width: width, height: height))
        if frame.height > visible.height {
            let chrome = frame.height - height
            height = max(200, visible.height - chrome)
        }
        window.setContentSize(NSSize(width: width, height: height))
        rememberFrameIfStable()
    }

    private func watchScreenChanges() {
        NSWorkspace.shared.notificationCenter.addObserver(
            self,
            selector: #selector(screensChanged),
            name: NSWorkspace.didWakeNotification,
            object: nil
        )
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(screensChanged),
            name: NSApplication.didChangeScreenParametersNotification,
            object: nil
        )
    }

    @objc private func screensChanged() {
        scheduleFrameRestore(attempt: 0)
    }

    private func scheduleFrameRestore(attempt: Int) {
        frameRestoreWork?.cancel()
        let delays = [0.35, 1.0, 2.5]
        guard attempt < delays.count else { return }
        let work = DispatchWorkItem { [weak self] in
            self?.restoreSavedFrameIfPossible()
            self?.scheduleFrameRestore(attempt: attempt + 1)
        }
        frameRestoreWork = work
        DispatchQueue.main.asyncAfter(deadline: .now() + delays[attempt], execute: work)
    }

    private func loadOrigin() -> NSPoint? {
        guard let values = UserDefaults.standard.array(forKey: frameOriginKey) as? [Double], values.count == 2 else {
            return nil
        }
        return NSPoint(x: values[0], y: values[1])
    }

    private func frameFits(_ origin: NSPoint) -> Bool {
        let rect = NSRect(origin: origin, size: window.frame.size)
        return NSScreen.screens.contains { $0.frame.intersects(rect.insetBy(dx: 8, dy: 8)) }
    }

    private func rememberFrame() {
        guard !suppressFrameSave else { return }
        let frame = window.frame
        guard frame.width > 40, frame.height > 40 else { return }
        savedOrigin = frame.origin
        UserDefaults.standard.set([Double(frame.origin.x), Double(frame.origin.y)], forKey: frameOriginKey)
    }

    private func rememberFrameIfStable() {
        if let saved = savedOrigin, abs(window.frame.origin.x - saved.x) > 30 {
            return
        }
        rememberFrame()
    }

    private func userIsMovingWindow() -> Bool {
        guard let type = NSApp.currentEvent?.type else { return false }
        switch type {
        case .leftMouseDragged, .leftMouseUp, .leftMouseDown:
            return true
        default:
            return false
        }
    }

    func windowDidMove(_ notification: Notification) {
        guard !suppressFrameSave, userIsMovingWindow() else { return }
        rememberFrame()
    }

    func windowDidEndLiveResize(_ notification: Notification) {
        rememberFrame()
    }

    private func restoreSavedFrameIfPossible() {
        guard let saved = savedOrigin ?? loadOrigin() else { return }
        guard frameFits(saved) else { return }
        let current = window.frame.origin
        if abs(current.x - saved.x) < 2, abs(current.y - saved.y) < 2 {
            return
        }
        suppressFrameSave = true
        var frame = window.frame
        frame.origin = saved
        window.setFrame(frame, display: true)
        suppressFrameSave = false
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        true
    }

    func applicationShouldHandleReopen(_ sender: NSApplication, hasVisibleWindows flag: Bool) -> Bool {
        window.makeKeyAndOrderFront(nil)
        return true
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard message.name == "card", let body = message.body as? [String: Any] else {
            return
        }
        DispatchQueue.main.async {
            if let fit = body["fit"] as? NSNumber {
                self.fitContent(CGFloat(fit.doubleValue))
            }
        }
    }
}

let delegate = AppDelegate()
let app = NSApplication.shared
app.setActivationPolicy(.regular)
app.delegate = delegate
app.run()
