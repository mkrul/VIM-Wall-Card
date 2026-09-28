import AppKit

let size = 1024
let image = NSImage(size: NSSize(width: size, height: size), flipped: false) { rect in
    NSColor(srgbRed: 16 / 255, green: 22 / 255, blue: 20 / 255, alpha: 1).setFill()
    rect.fill()
    let paragraph = NSMutableParagraphStyle()
    paragraph.alignment = .center
    let font = NSFont.systemFont(ofSize: 520, weight: .medium)
    let attrs: [NSAttributedString.Key: Any] = [
        .font: font,
        .foregroundColor: NSColor(srgbRed: 110 / 255, green: 196 / 255, blue: 154 / 255, alpha: 1),
        .paragraphStyle: paragraph
    ]
    let text = "Vi" as NSString
    let box = text.size(withAttributes: attrs)
    let drawRect = NSRect(
        x: 0,
        y: (rect.height - box.height) / 2 - 28,
        width: rect.width,
        height: box.height
    )
    text.draw(in: drawRect, withAttributes: attrs)
    return true
}

guard let tiff = image.tiffRepresentation,
      let rep = NSBitmapImageRep(data: tiff),
      let png = rep.representation(using: .png, properties: [:]) else {
    fputs("Could not draw the icon\n", stderr)
    exit(1)
}

let out = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "icon.png"
try png.write(to: URL(fileURLWithPath: out))
