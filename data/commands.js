(function (root) {
  const commands = [];
  const ids = new Set();

  function add(entry) {
    if (!entry.find || !entry.find.length) {
      throw new Error("No find words for " + entry.id);
    }
    if (ids.has(entry.id)) {
      throw new Error("Duplicate id " + entry.id);
    }
    ids.add(entry.id);
    commands.push(entry);
  }

  function C(id, cat, keys, title, why, find, notes, extra) {
    add(Object.assign({
      id: id,
      cat: cat,
      keys: keys,
      title: title,
      why: why,
      find: find,
      notes: notes || [],
      mode: "Normal",
      aliases: [],
      card: false,
      badge: "",
      related: [],
      indexDisplayKey: true,
      rank: 40
    }, extra || {}, {
      id: id,
      cat: cat,
      keys: keys,
      title: title,
      why: why,
      find: find
    }));
  }

  C("count-primer", "Basics", "5j", "Use a number to repeat the next command", "A number typed first repeats the next command.", ["count", "times", "multiple", "several", "how many", "5j", "3w", "10dd", "prefix number", "repeat count"], [
    "5j moves down five lines. 3w moves three words. 10dd deletes ten lines.",
    "The number can also sit on the motion: d3w deletes three words.",
    "2dd deletes two lines. d2j deletes three, because j lands two lines down and the lines in between are included."
  ], { card: true, rank: 10, indexDisplayKey: false });

  C("operator-primer", "Basics", "d{motion}", "Delete, change, or copy through a motion", "d, c, and y wait for a motion or a text object, then act on that text.", ["operator", "motion", "combine", "compose", "delete through", "change through", "copy through", "yank through", "grammar"], [
    "d deletes, c deletes and leaves you typing, and y copies.",
    "A doubled operator acts on the line: dd, cc, and yy.",
    "Deleting also stores the text, so p can put it back. Delete into the black-hole register when you want the previous copy left alone."
  ], { card: true, rank: 20, indexDisplayKey: false });

  C("left", "Move", "h", "Move left", "Moves the cursor one character to the left.", ["left", "backspace", "previous character", "hjkl", "arrow left"], ["A count repeats it. 4h moves four characters left.", "The arrow keys move the cursor too. h, j, k, and l do the same thing."], { card: true, aliases: ["left"] });
  C("down", "Move", "j", "Move down", "Moves the cursor down one line.", ["down", "next line", "line down", "hjkl", "arrow down"], ["j keeps the column when it can. gj moves down a screen line when the line is wrapped."], { card: true, aliases: ["down"] });
  C("up", "Move", "k", "Move up", "Moves the cursor up one line.", ["up", "previous line", "line up", "hjkl", "arrow up"], ["gk moves up a screen line when the line is wrapped."], { card: true, aliases: ["up"] });
  C("right", "Move", "l", "Move right", "Moves the cursor one character to the right.", ["right", "forward character", "next character", "hjkl", "arrow right", "space"], ["Space also moves right."], { card: true, aliases: ["l", "space"] });
  C("next-word", "Move", "w", "Move to the next word", "Moves to the start of the next word.", ["next word", "forward word", "word forward", "start of next word"], ["A word is letters, digits, and underscores, plus whatever iskeyword contains. W moves to the next WORD, which is any run of non-blank characters, so punctuation stays attached."], { card: true });
  C("prev-word", "Move", "b", "Move to the previous word", "Moves to the start of the previous word.", ["previous word", "back word", "word back", "beginning of word", "start of word"], ["B does the same for a WORD, punctuation included."], { card: true });
  C("end-word", "Move", "e", "Move to the end of the word", "Moves to the last character of the word.", ["end of word", "word end", "last letter of word"], ["ge moves to the end of the previous word. E and gE are the WORD versions."], { card: true, aliases: ["e"] });
  C("end-prev-word", "Move", "ge", "Move to the end of the previous word", "Moves to the last character of the word before this one.", ["end of previous word", "back to end of word", "ge"], ["gE is the same motion for a WORD."]);
  C("next-WORD", "Move", "W", "Move to the next WORD", "Moves to the next run of non-blank characters.", ["WORD", "big word", "punctuation", "nonblank", "non blank", "string of characters"], ["Use this when punctuation should stay stuck to the word, as in a file path or a URL."]);
  C("prev-WORD", "Move", "B", "Move to the previous WORD", "Moves back to the previous run of non-blank characters.", ["previous WORD", "back WORD", "big word back", "punctuation"], ["E moves to the end of a WORD."]);
  C("end-WORD", "Move", "E", "Move to the end of a WORD", "Moves to the last character of a run of non-blank characters.", ["end of WORD", "end of big word", "punctuation end"], []);
  C("line-start", "Move", "0", "Move to the start of the line", "Moves to the first column, including the indent.", ["start of line", "beginning of line", "first column", "home", "bol"], ["^ moves to the first non-blank character instead. Home often does the same as 0."], { card: true, aliases: ["0", "Home"] });
  C("line-first", "Move", "^", "Move to the first non-blank character", "Moves to the first character on the line that is not a space or a tab.", ["first non-blank", "first character", "skip indent", "beginning of text", "first non whitespace"], ["0 includes the indent. ^ skips it."], { card: true });
  C("line-end", "Move", "$", "Move to the end of the line", "Moves to the last character on the line.", ["end of line", "last character", "eol", "end key", "line end"], ["g_ moves to the last character that is not a space or a tab. End often does the same as $."], { card: true, aliases: ["$", "End"] });
  C("line-last-nonblank", "Move", "g_", "Move to the last non-blank character", "Moves to the last character on the line that is not a space or a tab.", ["last non-blank", "last non whitespace", "trim end", "end of text"], ["$ lands on the true end of the line, after any trailing spaces."]);
  C("screen-line-down", "Move", "gj", "Move down one screen line", "Moves down one row of the screen when a long line is wrapped.", ["screen line", "display line", "wrapped line", "visual line", "soft wrap down"], ["j moves to the next real line, even when that line is drawn across several rows. gj follows the rows you see."]);
  C("screen-line-up", "Move", "gk", "Move up one screen line", "Moves up one row of the screen when a long line is wrapped.", ["screen line up", "wrapped line up", "display line up"], ["g0, g^, and g$ are the start, first non-blank, and end of the screen line."]);
  C("screen-line-edges", "Move", "g0", "Move along the screen line", "g0, g^, and g$ move to the start, first non-blank, and end of the wrapped row.", ["screen line start", "screen line end", "wrapped start", "wrapped end"], [], { aliases: ["g^", "g$", "gm"] });
  C("file-top", "Move", "gg", "Go to the top of the file", "Moves to the first line.", ["top", "beginning of file", "start of file", "first line", "bof"], ["42gg goes to line 42, the same place as 42G."], { card: true, aliases: ["gg", "1G"] });
  C("file-end", "Move", "G", "Go to a line, or the end of the file", "G alone goes to the last line. 42G goes to line 42.", ["go to line", "goto line", "line number", "end of file", "bottom of file", "last line", "eof", "jump to line"], ["42gg and :42 go to that line as well.", "The address is a line in the file, not a row on the screen."], { card: true, aliases: ["G", "42G", ":42"] });
  C("paragraph-back", "Move", "{", "Move to the previous paragraph", "Moves back to the blank line before this paragraph.", ["previous paragraph", "paragraph back", "blank line back", "block up"], ["A paragraph ends at a blank line."]);
  C("paragraph-forward", "Move", "}", "Move to the next paragraph", "Moves forward to the next blank line.", ["next paragraph", "paragraph forward", "blank line forward"], ["d} deletes through the end of the paragraph."]);
  C("sentence-back", "Move", "(", "Move to the previous sentence", "Moves back to the start of the sentence.", ["previous sentence", "sentence back"], ["A sentence ends at a period, exclamation mark, or question mark followed by a space."]);
  C("sentence-forward", "Move", ")", "Move to the next sentence", "Moves to the start of the next sentence.", ["next sentence", "sentence forward"], []);
  C("section-back", "Move", "[[", "Move to the previous section", "Moves back to a section start, often a brace in the first column.", ["previous section", "section back", "brace in first column", "previous function"], ["This is not a language-aware function jump. It looks for a section boundary, which in many file types is a { in column 1."]);
  C("section-forward", "Move", "]]", "Move to the next section", "Moves forward to the next section start.", ["next section", "section forward", "next brace in column", "next function"], ["[] and ][ move to the matching section ends."], { aliases: ["[]", "]["] });
  C("match-pair", "Move", "%", "Jump to the matching bracket", "Jumps between (), [], and {}.", ["matching bracket", "match bracket", "matching paren", "match paren", "matching brace", "delimiter", "percent", "pair"], ["Put the cursor on a bracket first.", "If the matchit plugin is on, % also jumps between pairs such as if and endif. Vim ships matchit but does not always turn it on. Neovim turns it on."], { card: true });
  C("find-char", "Move", "f", "Find a character on this line", "f then a character jumps forward to that character.", ["find character", "find char", "jump to character", "search character on line", "ft"], ["F searches backward. t stops on the character before it, and T does that backward.", "; repeats the search. , repeats it in the other direction."], { card: true, aliases: ["f{char}"] });
  C("find-char-back", "Move", "F", "Find a character backward on this line", "F then a character jumps backward to that character.", ["find character backward", "search character backward", "previous character on line"], []);
  C("till-char", "Move", "t", "Move until just before a character", "t then a character stops on the character before the match.", ["until character", "till character", "till", "until", "before character", "up to character", "stop before"], ["Use dt, to delete up to but not including that character. df, deletes through the character."]);
  C("till-char-back", "Move", "T", "Move backward until just before a character", "T then a character searches backward and stops beside the match.", ["till backward", "until backward", "before character backward"], []);
  C("repeat-find", "Move", ";", "Repeat the last character find", "Repeats the last f, F, t, or T in the same direction.", ["repeat find", "repeat f", "again character", "semicolon"], ["The comma key repeats that find in the opposite direction. n repeats a / search, and . repeats a change. They are three different repeats."]);
  C("repeat-find-back", "Move", ",", "Repeat the character find the other way", "Repeats the last f, F, t, or T in the opposite direction.", ["repeat find backward", "opposite find", "comma repeat"], []);
  C("screen-top", "Move", "H", "Move to the top line on the screen", "Moves the cursor to the first line currently visible.", ["top of screen", "top of window", "high", "first visible line"], ["gg moves to the first line of the file. H stays on this screen."]);
  C("screen-middle", "Move", "M", "Move to the middle line on the screen", "Moves the cursor to the middle of the visible window.", ["middle of screen", "middle of window", "center cursor", "mid"], ["zz keeps the cursor on its line and scrolls that line to the center. M moves the cursor to whatever line is already in the middle."]);
  C("screen-bottom", "Move", "L", "Move to the bottom line on the screen", "Moves the cursor to the last line currently visible.", ["bottom of screen", "bottom of window", "low", "last visible line"], ["G moves to the last line of the file."]);
  C("half-down", "Move", "Ctrl-d", "Scroll half a page down", "Moves the view and the cursor about half a screen down.", ["half page down", "scroll down", "page half", "ctrl-d", "control d"], ["Ctrl-u scrolls half a page up. Ctrl-f and Ctrl-b scroll a full page.", "In insert mode, Ctrl-d shifts the indent left. It does not scroll."], { card: true });
  C("half-up", "Move", "Ctrl-u", "Scroll half a page up", "Moves the view and the cursor about half a screen up.", ["half page up", "scroll up", "ctrl-u", "control u"], ["In insert mode, Ctrl-u deletes back to the start of the line."], { card: true });
  C("page-down", "Move", "Ctrl-f", "Scroll a page down", "Moves forward about one screen.", ["page down", "pagedown", "full page down", "scroll page", "ctrl-f"], ["Page Down often sends this key."]);
  C("page-up", "Move", "Ctrl-b", "Scroll a page up", "Moves back about one screen.", ["page up", "pageup", "full page up", "ctrl-b"], ["Page Up often sends this key."]);
  C("scroll-line-down", "Move", "Ctrl-e", "Scroll the view down one line", "Moves the text up one line and tries to leave the cursor where it is.", ["scroll one line", "scroll without moving cursor", "nudge down", "ctrl-e"], ["In insert mode, Ctrl-e copies the character from the line below. It does not scroll."]);
  C("scroll-line-up", "Move", "Ctrl-y", "Scroll the view up one line", "Moves the text down one line and tries to leave the cursor where it is.", ["scroll one line up", "nudge up", "ctrl-y"], ["In insert mode, Ctrl-y copies the character from the line above."]);
  C("center-line", "Move", "zz", "Center this line on the screen", "Scrolls so the cursor's line sits in the middle of the window.", ["center", "centre", "center line", "center screen", "middle line"], ["zt puts the line at the top. zb puts it at the bottom.", "M is different: it moves the cursor to the line that is already in the middle."], { card: true });
  C("line-to-top", "Move", "zt", "Put this line at the top of the screen", "Scrolls so the cursor's line becomes the first visible line.", ["line to top", "scroll line to top", "top of window this line"], ["z then Enter does the same and also moves to the first non-blank character."]);
  C("line-to-bottom", "Move", "zb", "Put this line at the bottom of the screen", "Scrolls so the cursor's line becomes the last visible line.", ["line to bottom", "scroll line to bottom"], []);
  C("column", "Move", "|", "Go to a screen column", "Moves to the column given by a count. 20| goes to column 20.", ["column", "screen column", "go to column", "horizontal position"], ["The first column is column 1."]);
  C("next-line-first", "Move", "Enter", "First non-blank on the next line", "Moves down and lands on the first character that is not indent.", ["enter", "return", "carriage return", "next line first character", "plus"], ["+ does the same. - does it upward."], { aliases: ["+", "Return", "<CR>"] });
  C("prev-line-first", "Move", "-", "First non-blank on the previous line", "Moves up and lands on the first character that is not indent.", ["previous line first character", "minus line"], []);
  C("horiz-scroll", "Move", "zl", "Scroll sideways", "zl scrolls right. zh scrolls left. zL and zH scroll a half screen.", ["horizontal scroll", "scroll right", "scroll left", "sidescroll"], ["zs puts the cursor's character at the left edge. ze puts it at the right."], { aliases: ["zh", "zL", "zH", "zs", "ze"] });
  C("search-word", "Move", "*", "Search for the word under the cursor", "Sets the search to the word under the cursor and jumps to the next one.", ["word under cursor", "search word", "find word", "next occurrence of word", "asterisk", "star"], ["The match is a whole word. g* allows a partial match.", "# searches backward. n and N walk the matches afterward."], { card: true });
  C("search-word-back", "Move", "#", "Search backward for the word under the cursor", "Sets the search to the word under the cursor and jumps to the previous one.", ["search word backward", "previous occurrence of word", "hash", "pound", "find word backward"], ["g# is the partial-word version."]);
  C("search-word-partial", "Move", "g*", "Search for this word even inside a longer one", "Searches forward for the word under the cursor without requiring a whole-word boundary.", ["partial word", "word fragment", "search inside word", "gstar"], ["g# searches backward the same way."], { aliases: ["g#"] });
  C("next-match", "Move", "n", "Go to the next search match", "Jumps to the next match of the last / or ? search.", ["next match", "next search", "find next", "next occurrence", "repeat search"], ["N jumps to the previous match. The direction follows the original search, so after ? the next match is upward."], { card: true });
  C("prev-match", "Move", "N", "Go to the previous search match", "Jumps to the previous match of the last search.", ["previous match", "previous search", "find previous", "search backward result", "last match"], []);
  C("jump-back", "Marks and jumps", "Ctrl-o", "Go back to the previous jump", "Walks backward through the jump list.", ["jump back", "go back", "previous location", "where was i", "older jump", "ctrl-o", "navigate back"], ["A jump is a move that changes location in a big way, such as a search, gg, G, or %. h and j are not jumps.", "Ctrl-i walks forward again. In a terminal, Tab is often the same key as Ctrl-i, so Tab can jump forward instead of inserting a tab."], { card: true });
  C("jump-forward", "Marks and jumps", "Ctrl-i", "Go forward to a newer jump", "Walks forward through the jump list after Ctrl-o.", ["jump forward", "newer jump", "go forward", "ctrl-i", "tab jumps", "why does tab jump"], ["If Tab jumps through the file, it is this command. Tab and Ctrl-i are the same key in most terminals."]);
  C("jump-list", "Marks and jumps", ":jumps", "Show the jump list", "Lists the places Ctrl-o and Ctrl-i walk through.", ["jump list", "list jumps", "where have i been"], []);
  C("last-jump-exact", "Marks and jumps", "``", "Jump back to the exact previous position", "Returns to the cursor position from before the last jump.", ["back to position", "exact previous position", "double backtick", "jump back position"], ["'' returns to that line, on the first non-blank character, rather than the exact column."], { aliases: ["``"] });
  C("last-jump-line", "Marks and jumps", "''", "Jump back to the previous line", "Returns to the line you were on before the last jump.", ["back to line", "previous position line", "double quote mark"], []);
  C("last-change-pos", "Marks and jumps", "`.", "Jump to the last change", "Moves to the position of the last change.", ["last change", "last edit", "where did i edit", "go to last modification", "last change position"], ["g; walks to older changes one at a time. gi resumes insert mode where insert mode last stopped."], { card: true });
  C("older-change", "Marks and jumps", "g;", "Go to an older change", "Walks backward through the change list.", ["older change", "previous change", "change list", "earlier edit"], ["g, walks forward. :changes shows the list."], { aliases: ["g,"] });
  C("change-list", "Marks and jumps", ":changes", "Show the change list", "Lists the positions g; and g, walk through.", ["list changes", "change history positions"], []);
  C("last-insert-pos", "Marks and jumps", "`^", "Jump to where insert mode last stopped", "Moves to the last place you left insert mode.", ["last insert position", "where i stopped typing", "insert spot"], ["gi goes there and enters insert mode."]);
  C("change-bounds", "Marks and jumps", "`[", "Jump to the start or end of the last change", "`[ is the start of the last change or yank. `] is the end.", ["start of last change", "end of last change", "what did i just change", "changed text bounds"], ["'< and '> are the bounds of the last visual selection."], { aliases: ["`]"] });
  C("goto-file", "Move", "gf", "Open the file under the cursor", "Edits the file whose name is under the cursor.", ["file under cursor", "open file under cursor", "go to file", "goto file", "header file", "include", "files"], ["Vim looks through the path option and suffixesadd.", "gF does the same and also jumps to a line number written after the name, such as file.js:42.", "Ctrl-w f opens it in a split. Ctrl-w gf opens it in a tab."], { card: true, aliases: ["gf"] });
  C("goto-file-line", "Move", "gF", "Open the file under the cursor at a line number", "Opens the path under the cursor and jumps to a trailing line number.", ["file and line", "open at line", "filename colon line"], []);
  C("open-url", "Move", "gx", "Open the link or path under the cursor", "Opens the URL or file path under the cursor outside of a normal edit.", ["open url", "open link", "browse", "hyperlink", "gx"], ["In Vim, gx comes from the netrw plugin that ships with Vim. In current Neovim, gx hands the path to the system opener."]);
  C("local-def", "Move", "gd", "Find where this identifier is assigned in the file", "Searches the current scope for the word under the cursor.", ["gd", "local definition", "assignment in function", "where defined locally", "symbol in file"], ["This is a search, not a language server. gD searches from the top of the file instead of the current scope."]);
  C("global-def", "Move", "gD", "Find this identifier from the top of the file", "Searches from the first line for the word under the cursor.", ["global definition", "search from top", "first assignment"], []);
  C("no-lsp", "Move", "", "Go to a definition in another file", "Stock Vim has no command that asks a language server where a symbol is defined.", ["definition", "go to definition", "goto definition", "declaration", "lsp", "language server", "intellisense", "symbol", "jump to definition"], ["gd searches this scope for the word. gD searches from the top of the file.", "Ctrl-] jumps to a ctags tag when a tags file exists.", "A real go-to-definition command comes from a plugin or a language client, not from stock Vim."], { indexDisplayKey: false });
  C("tag-jump", "Build and diff", "Ctrl-]", "Jump to the tag under the cursor", "Jumps to the definition recorded for this word in the tags file.", ["tag", "ctags", "jump to tag", "go to tag", "tags file", "ctrl-]"], ["Build the tags file from the shell with ctags -R. Without that file, this command has nowhere to go.", "g] lists matching tags when more than one exists. Ctrl-t or :pop goes back."]);
  C("tag-back", "Build and diff", "Ctrl-t", "Go back from a tag jump", "Pops back to where you were before Ctrl-].", ["tag back", "pop tag", "return from tag", "ctrl-t"], [":pop does the same. :tags shows the stack."]);
  C("tag-list", "Build and diff", "g]", "List tags that match this word", "Shows the matching tags and lets you pick one.", ["list tags", "tselect", "ambiguous tag", "choose tag"], [":tselect {name} opens the same kind of list. Ctrl-w ] jumps to the tag in a new split."], { aliases: [":tselect", ":tag"] });
  C("arrows", "Move", "Arrow keys", "Move with the arrow keys", "The arrow keys move one character or one line, the same as h, j, k, and l.", ["arrow", "arrows", "cursor keys", "arrow keys"], ["Vim does not treat Ctrl-Left as a word motion unless a mapping or the terminal sets that up. w and b are the word motions."], { indexDisplayKey: false });

  C("delete-char", "Edit", "x", "Delete the character under the cursor", "Deletes one character and stores it so p can put it back.", ["delete character", "remove character", "erase character", "del", "delete letter"], ["A count deletes that many characters. X deletes the character before the cursor.", "s deletes the character and leaves you typing."], { card: true });
  C("delete-before", "Edit", "X", "Delete the character before the cursor", "Deletes one character to the left.", ["backspace", "delete before", "delete previous character", "erase left"], ["In insert mode, Backspace deletes the character before the cursor."]);
  C("substitute-char", "Edit", "s", "Delete a character and type", "Deletes the character under the cursor and starts insert mode.", ["substitute character", "replace character and type", "overwrite character", "change character"], ["r replaces the character and stays in normal mode. R is replace mode, which keeps overwriting as you type."]);
  C("replace-char", "Edit", "r", "Replace one character", "Replaces the character under the cursor with the next key you press.", ["replace character", "change one character", "overwrite one", "fix typo"], ["r then Enter splits the line at the cursor.", "R enters replace mode until you press Escape."], { card: true });
  C("replace-mode", "Edit", "R", "Overwrite text as you type", "Enters replace mode. Each character you type replaces the one under the cursor.", ["replace mode", "overwrite", "type over", "overtype", "insert over"], ["Backspace restores a character you replaced. gR is virtual replace, which keeps the rest of the line from shifting when a tab is involved."]);
  C("delete-line", "Edit", "dd", "Delete the line", "Deletes the whole line, including its line break.", ["delete line", "remove line", "cut line", "erase line", "kill line", "dd"], ["5dd deletes five lines.", "dj deletes this line and the next one. d2j deletes three lines, because the motion lands two lines down.", "The deleted line is stored. p puts it back below the cursor. \"_dd deletes it and leaves your last copy alone."], { card: true, aliases: ["dd"] });
  C("delete-two-lines", "Edit", "dj", "Delete this line and the next", "Deletes the current line and the line below it.", ["delete two lines", "delete this and next", "remove two lines"], ["j is a line motion, so dj is linewise. Use 2dd when you want a count of lines. 2dd deletes two. d2j deletes three."]);
  C("delete-to-end", "Edit", "D", "Delete to the end of the line", "Deletes from the cursor through the last character on the line.", ["delete to end", "delete rest of line", "remove to end", "clear rest of line", "kill to end"], ["d$ is the same command. d0 deletes back to the first column. d^ deletes back to the first non-blank character."], { card: true, aliases: ["D", "d$"] });
  C("delete-to-start", "Edit", "d0", "Delete back to the start of the line", "Deletes from the cursor back to column 1.", ["delete to start", "delete to beginning", "remove back to start", "clear to bol"], ["d^ stops at the first non-blank character and leaves the indent."], { aliases: ["d0"] });
  C("delete-to-first", "Edit", "d^", "Delete back to the first non-blank character", "Deletes from the cursor back to the indent, and leaves the indent.", ["delete to indent", "delete to first character", "clear back to text"], []);
  C("delete-to-bottom", "Edit", "dG", "Delete through the end of the file", "Deletes from the current line through the last line.", ["delete to end of file", "delete rest of file", "clear below", "remove to bottom"], ["dgg deletes from here through the first line. :%d deletes every line."]);
  C("delete-to-top", "Edit", "dgg", "Delete through the start of the file", "Deletes from the current line through the first line.", ["delete to top", "delete above", "clear to start of file"], []);
  C("delete-word-motion", "Edit", "dw", "Delete from here to the next word", "Deletes from the cursor through the start of the next word.", ["dw", "delete until next word", "delete rest of word", "remove from cursor"], ["This starts at the cursor. If the cursor is in the middle of the word, the start of the word stays.", "daw deletes the whole word and the space beside it, wherever the cursor sits. diw deletes the whole word and leaves the space."]);
  C("change-word-motion", "Edit", "cw", "Change from here to the end of the word", "Deletes through the end of the word and starts insert mode.", ["cw", "change rest of word", "replace rest of word"], ["cw is a special case. On a non-blank character it behaves like ce, so it does not take the space after the word.", "ciw changes the whole word no matter where the cursor sits inside it. That is the reliable one."]);
  C("delete-to-char", "Edit", "dt", "Delete until a character", "dt then a character deletes up to, but not including, that character.", ["delete until", "delete before character", "remove up to", "delete till"], ["df then a character deletes through that character, including it.", "ct and cf do the same and then start insert mode."], { aliases: ["dt{char}"] });
  C("delete-through-char", "Edit", "df", "Delete through a character", "df then a character deletes up to and including that character.", ["delete through character", "delete including character", "remove through"], [], { aliases: ["df{char}"] });
  C("change-line", "Edit", "cc", "Change the whole line", "Deletes the line and starts insert mode on the indent.", ["change line", "replace line", "edit line", "retype line", "overwrite line"], ["S is the same command. C changes from the cursor to the end of the line."], { aliases: ["S", "cc"] });
  C("change-to-end", "Edit", "C", "Change to the end of the line", "Deletes from the cursor to the end of the line and starts insert mode.", ["change to end", "replace to end", "edit rest of line", "retype rest"], ["c$ is the same command."], { aliases: ["C", "c$"] });
  C("copy-line", "Edit", "yy", "Copy the line", "Copies the whole line. Vim calls this a yank.", ["copy line", "yank line", "yy", "duplicate text line", "copy this line"], ["Y does the same thing in stock Vim. It copies whole lines, not from the cursor to the end.", "y$ copies from the cursor to the end of the line.", "p puts a copied line on the line below."], { card: true, aliases: ["yy", "Y"] });
  C("copy-to-end", "Edit", "y$", "Copy to the end of the line", "Copies from the cursor through the end of the line.", ["yank to end", "copy rest of line", "copy to eol"], ["Y copies the whole line. Map Y to y$ if you want Y to mean this."]);
  C("yank-rest", "Edit", "yG", "Copy through the end of the file", "Copies from the current line through the last line.", ["copy rest of file", "yank to end of file", "copy below"], [":%y copies every line. :%y+ copies every line to the system clipboard."]);
  C("yank-all", "Edit", ":%y", "Copy every line", "Copies the whole buffer.", ["yank all", "copy entire file", "copy whole file", "copy buffer", "select all copy"], [":%y+ copies it to the system clipboard when clipboard support is compiled in.", "ggVG selects the whole file. From that selection, \"+y copies it as well."], { aliases: [":%y", ":%yank"] });
  C("yank-all-clip", "Edit", ":%y+", "Copy the whole file to the clipboard", "Copies every line into the system clipboard.", ["copy entire file clipboard", "yank all clipboard", "copy file to clipboard", "select all and copy"], ["This needs a Vim built with clipboard support. :version shows +clipboard when that is present.", "On a Mac, \"+ and \"* are usually the same clipboard."]);
  C("paste", "Edit", "p", "Paste after the cursor", "Puts the last copy or delete back after the cursor.", ["paste", "put", "paste after", "paste below", "insert yanked"], ["A copied or deleted line lands on the line below, because a linewise copy includes the line break.", "A characterwise copy lands after the cursor on the same line.", "P puts the text before the cursor, or above the line when the copy is linewise."], { card: true });
  C("paste-before", "Edit", "P", "Paste before the cursor", "Puts the last copy or delete back before the cursor.", ["paste before", "paste above", "put before", "paste previous"], ["For a copied line, P puts the line above the current one."]);
  C("paste-cursor-after", "Edit", "gp", "Paste and leave the cursor at the end", "Puts the text after the cursor and moves the cursor to the end of what was pasted.", ["paste and move", "put cursor after paste", "gp"], ["gP does this when pasting before the cursor."], { aliases: ["gP"] });
  C("paste-indent", "Edit", "]p", "Paste and match the indent", "Puts a copied line below this one and shifts it to the current indent.", ["paste fix indent", "paste adjust indent", "put with indent", "reindent paste"], ["[p puts the line above and adjusts the indent the same way."], { aliases: ["[p"] });
  C("paste-last-yank", "Edit", "\"0p", "Paste the last copy, not the last delete", "Puts the text from the yank register, which holds the last copy.", ["paste last yank", "paste what i copied", "not the delete", "register 0", "last copy"], ["A delete overwrites the unnamed register that p uses. The last yank is still in register 0.", "\"_d deletes without touching that register at all."]);
  C("clipboard-copy", "Edit", "\"+y", "Copy to the system clipboard", "Yanks into the + register, which is the system clipboard when Vim has clipboard support.", ["clipboard", "system clipboard", "copy to clipboard", "os clipboard", "pbcopy", "external paste", "plus register", "mac clipboard"], ["\"+yy copies the line. Check :version for +clipboard. Without it, this register is not the system clipboard.", "On a Mac, \"* and \"+ are usually the same clipboard."], { card: true, aliases: ["\"+y", "+y", "\"+yy", "\"*y"] });
  C("clipboard-paste", "Edit", "\"+p", "Paste from the system clipboard", "Puts the system clipboard after the cursor.", ["paste from clipboard", "paste external", "os paste", "clipboard paste", "plus paste"], ["\"+P pastes before the cursor. In insert mode, Ctrl-r + inserts the clipboard at the cursor."], { aliases: ["\"+p", "+p", "\"*p"] });
  C("black-hole", "Edit", "\"_d", "Delete without losing what you copied", "Deletes into the black-hole register, so the unnamed register stays as it was.", ["black hole", "blackhole", "delete without yank", "delete without copy", "dont clobber", "preserve yank", "void register"], ["\"_dd deletes a line this way. Afterward, p still pastes what you copied before.", "A normal dd stores the line and makes p paste that line instead."], { card: true, aliases: ["\"_d", "\"_dd", "_d"] });
  C("named-register", "Edit", "\"ayy", "Copy into a named register", "Copies the line into register a.", ["named register", "register a", "save a copy", "multiple clipboards", "yank to register"], ["\"ap pastes register a. Registers a through z work this way.", "An uppercase name appends. \"Ayy adds another line to register a.", ":reg shows what every register holds."], { aliases: ["\"ayy", "\"ap", "\"a"] });
  C("uppercase-line", "Edit", "gUU", "Uppercase the line", "Makes every letter on the line uppercase.", ["uppercase line", "upper case line", "capitalize line", "all caps line", "make line uppercase"], ["gUw uppercases through the next word. gUiw uppercases the word under the cursor.", "In visual mode, U uppercases the selection and u lowercases it."], { card: true, aliases: ["gUU", "gUgU"] });
  C("lowercase-line", "Edit", "guu", "Lowercase the line", "Makes every letter on the line lowercase.", ["lowercase line", "lower case line", "downcase line", "uncapitalize line"], ["guiw lowercases the word under the cursor. g~~ swaps the case of the whole line."], { aliases: ["guu", "gugu"] });
  C("toggle-case-line", "Edit", "g~~", "Swap the case of the line", "Toggles uppercase and lowercase for every letter on the line.", ["toggle case line", "swap case line", "invert case line"], [], { aliases: ["g~~", "g~g~"] });
  C("toggle-case-char", "Edit", "~", "Swap the case of one character", "Toggles the case of the character under the cursor and moves right.", ["toggle case", "swap case", "invert case", "switch case character"], ["~ with a count toggles that many characters.", "With :set tildeop, ~ becomes an operator and waits for a motion. That is off by default."]);
  C("join-lines", "Edit", "J", "Join lines", "Joins the next line onto this one, with a space between them.", ["join", "join lines", "merge lines", "concatenate lines", "remove linebreak", "unwrap"], ["J joins two lines. 3J joins three lines into one.", "After a period, exclamation mark, or question mark, Vim may insert two spaces. That comes from the joinspaces option.", "gJ joins without inserting or removing a space."], { card: true });
  C("join-nospace", "Edit", "gJ", "Join lines without adding a space", "Joins the next line onto this one and does not insert a space.", ["join without space", "concat no space", "merge lines tight"], []);
  C("split-line", "Edit", "r Enter", "Split the line", "r then Enter replaces the character under the cursor with a line break.", ["split line", "break line", "insert newline", "new line in the middle", "break here"], ["From insert mode, Enter splits the line at the cursor and keeps you typing.", "J joins the line back together."], { aliases: ["r<CR>"] });
  C("indent-line", "Edit", ">>", "Indent the line", "Shifts the line right by one shiftwidth.", ["indent", "indent line", "shift right", "tab in", "increase indent"], ["A count indents that many lines. 3>> indents three.", ">ip indents a paragraph. In visual mode, > indents the selection.", "<< shifts left."], { card: true });
  C("unindent-line", "Edit", "<<", "Unindent the line", "Shifts the line left by one shiftwidth.", ["unindent", "dedent", "outdent", "shift left", "decrease indent", "back indent"], ["<ip unindents a paragraph."], { card: true });
  C("reindent-line", "Edit", "==", "Reindent the line", "Fixes the indent of this line using the indent rules for the file type.", ["reindent line", "fix indent", "autoindent line", "correct indent"], ["=ip reindents a paragraph. gg=G reindents the whole file.", "The indent comes from indentexpr, cindent, or equalprg, depending on the file."]);
  C("reindent-file", "Edit", "gg=G", "Reindent the whole file", "Fixes the indent from the first line through the last.", ["reindent file", "fix indentation", "indent file", "format indent", "reindent buffer"], ["This uses the same indent rules as ==. It rewrites indent. It does not reflow paragraphs. gqap does that."]);
  C("format-paragraph", "Edit", "gqap", "Reflow the paragraph", "Rewraps the paragraph to the text width.", ["format paragraph", "reflow", "wrap paragraph", "hard wrap", "reformat paragraph", "fill paragraph"], ["gq is the format operator. gqap formats a paragraph. gqq formats the current line.", "Vim uses textwidth, formatexpr, or formatprg. If textwidth is 0 and no formatter is set, the text may not change.", "gwap formats without moving the cursor."], { aliases: ["gqap", "gwap", "gqq"] });
  C("increment", "Edit", "Ctrl-a", "Add to the number under the cursor", "Increases the number under or after the cursor.", ["increment", "increase number", "add one", "plus one", "count up", "ctrl-a"], ["Ctrl-x decreases the number.", "A count adds that much. 10 then Ctrl-a adds ten.", "A leading zero can make Vim treat the number as octal, so 007 becomes 010. :set nrformats-=octal turns that off.", "In insert mode, Ctrl-a inserts the last text you typed. It does not add to a number."], { card: true });
  C("decrement", "Edit", "Ctrl-x", "Subtract from the number under the cursor", "Decreases the number under or after the cursor.", ["decrement", "decrease number", "subtract", "minus one", "count down", "ctrl-x"], ["In insert mode, Ctrl-x starts a completion family. It does not change the number."]);
  C("increment-sequence", "Edit", "g Ctrl-a", "Turn a column of numbers into a sequence", "In a visual selection, adds an increasing amount on each line.", ["number sequence", "increment each line", "column of numbers", "renumber", "1 2 3"], ["Select the numbers with Ctrl-v, then press g Ctrl-a. Each line increases by one more than the line above.", "The same octal trap as Ctrl-a applies to leading zeros."]);
  C("transpose-chars", "Edit", "xp", "Transpose two characters", "Deletes the character under the cursor and puts it after the next one.", ["transpose", "swap characters", "transpose characters", "switch letters", "exchange characters"], ["This is x then p. The cursor ends up on the character that moved."]);
  C("transpose-lines", "Edit", "ddp", "Swap this line with the next", "Deletes this line and puts it below the line that follows.", ["swap lines", "transpose lines", "exchange lines", "move line with next"], ["ddp is dd then p. To move a line without thinking about that, :m .+1 moves it down and :m .-2 moves it up."]);
  C("duplicate-line", "Edit", "yyp", "Duplicate the line", "Copies this line and puts the copy on the line below.", ["duplicate line", "copy line below", "clone line", "repeat line"], [":t. does the same from the command line.", "yyp is yy then p."], { card: true });
  C("copy-line-ex", "Edit", ":t.", "Copy this line below itself", "Copies the current line to just below the current line.", ["copy line ex", "co", "t command", "duplicate with t"], [":t is short for :copy. :t0 copies the line to the top of the file."], { aliases: [":t.", ":co.", ":copy"] });
  C("move-line-down", "Edit", ":m .+1", "Move this line down", "Puts the current line below the line under it.", ["move line down", "line down command", "shift line down"], ["The address is the line it should land below. :m .+1 lands below the next line, which is one line down."], { aliases: [":m .+1", ":m+1", ":move .+1"] });
  C("move-line-up", "Edit", ":m .-2", "Move this line up", "Puts the current line above the line it is on.", ["move line up", "line up command", "shift line up"], ["The address is the line it should land below. Moving up one line uses -2, because the current line still counts until the move happens."], { aliases: [":m .-2", ":m-2", ":move .-2"] });
  C("move-line-top", "Edit", ":m0", "Move this line to the top", "Puts the current line on line 1.", ["move line to top", "move to start", "send line to top"], [":m$ moves the line to the end of the file."], { aliases: [":m0"] });
  C("move-line-bottom", "Edit", ":m$", "Move this line to the end", "Puts the current line after the last line.", ["move line to bottom", "move line to end", "send line to end"], [], { aliases: [":m$"] });
  C("repeat-change", "Edit", ".", "Repeat the last change", "Repeats the last insert or the last change command.", ["repeat", "repeat last change", "do again", "dot", "period", "last command"], [". repeats a change. It does not repeat a motion by itself, and it does not repeat undo.", "n repeats a search. ; repeats f, F, t, or T. @@ repeats a macro.", "A count replaces the count used the first time."], { card: true });
  C("undo", "Edit", "u", "Undo the last change", "Undoes one change.", ["undo", "revert change", "go back change", "ctrl-z undo"], ["Ctrl-r redoes what you undid.", "U is different. U restores the current line to the way it was when you moved onto it.", "In a terminal, Ctrl-z suspends Vim. It is not undo."], { card: true });
  C("redo", "Edit", "Ctrl-r", "Redo an undone change", "Reapplies a change that u undid.", ["redo", "redo undo", "ctrl-r", "repeat undone"], ["In insert mode, Ctrl-r inserts a register. It does not redo.", "g+ and :later also move forward through the undo history."], { card: true });
  C("undo-line", "Edit", "U", "Restore this line", "Puts the current line back to the way it was when the cursor arrived on it.", ["undo line", "restore line", "revert line", "undo all on line"], ["Pressing U again undoes that restore. u is the ordinary one-change undo."]);
  C("earlier", "Edit", ":earlier 10m", "Undo back to a time", "Restores the buffer to the way it was ten minutes ago.", ["undo minutes", "undo time", "time travel", "earlier", "10 minutes ago", "seconds ago"], [":earlier 30s uses seconds. :earlier 1h uses hours. :earlier 1f goes back one file write.", ":later moves forward again. :undolist shows the undo branches."], { aliases: [":earlier", ":later"], indexDisplayKey: false });
  C("undo-tree", "Edit", "g-", "Walk the undo history in time order", "Moves to an older text state, including onto another undo branch.", ["undo tree", "undo branch", "older text state", "g minus"], ["u follows the branch you are on. g- follows time, which can land on a branch you had abandoned.", "g+ and :later move toward newer states."], { aliases: ["g-", "g+"] });
  C("undo-list", "Edit", ":undolist", "Show the undo branches", "Lists the undo states and which ones branch.", ["undo list", "list undo", "undo history"], []);
  C("select-all", "Visual", "ggVG", "Select the whole file", "Goes to the top and selects through the last line.", ["select all", "highlight all", "visual all", "select file", "select buffer"], ["From that selection, d deletes it, y copies it, and \"+y copies it to the clipboard.", ":%d deletes every line without selecting. :%y copies every line."], { aliases: ["ggVG", "ggvG"] });
  C("clear-file", "Edit", ":%d", "Delete every line", "Deletes the whole buffer.", ["clear file", "delete all lines", "empty buffer", "wipe contents", "clear buffer"], ["The text goes into a register. :%d _ deletes it into the black-hole register.", "This does not delete the file on disk until you write."], { aliases: [":%d", ":%delete"] });

  C("insert", "Insert", "i", "Insert before the cursor", "Enters insert mode in front of the character under the cursor.", ["insert", "insert mode", "start typing", "type before", "edit text"], ["Escape or Ctrl-[ returns to normal mode.", "I inserts at the first non-blank character. gI inserts in column 1."], { card: true, mode: "Normal" });
  C("insert-first", "Insert", "I", "Insert at the first non-blank character", "Enters insert mode at the start of the text on this line.", ["insert at beginning", "insert at first character", "type at start of text", "insert after indent"], ["i inserts at the cursor. A inserts at the end of the line."], { card: true });
  C("insert-column", "Insert", "gI", "Insert in the first column", "Enters insert mode in column 1, before the indent.", ["insert at column 1", "insert before indent", "type at start of line"], ["I stops at the first non-blank character. gI does not."]);
  C("append", "Insert", "a", "Insert after the cursor", "Enters insert mode after the character under the cursor.", ["append", "insert after", "type after", "add after cursor"], ["A inserts at the end of the line."], { card: true });
  C("append-end", "Insert", "A", "Insert at the end of the line", "Enters insert mode after the last character on the line.", ["append at end", "insert at end", "type at end", "add at eol", "go to end and type"], ["I inserts at the first non-blank character."], { card: true });
  C("open-below", "Insert", "o", "Open a line below and type", "Creates a line under the current one and enters insert mode.", ["new line below", "open line below", "insert line under", "add line below"], ["O does this above the current line."], { card: true });
  C("open-above", "Insert", "O", "Open a line above and type", "Creates a line above the current one and enters insert mode.", ["new line above", "open line above", "insert line over", "add line above"], [], { card: true });
  C("insert-resume", "Insert", "gi", "Resume insert where you left it", "Enters insert mode at the last place insert mode stopped.", ["resume insert", "back to insert", "continue typing", "last insert spot"], ["`^ jumps to that spot and stays in normal mode."]);
  C("leave-insert", "Insert", "Esc", "Leave insert mode", "Returns to normal mode.", ["escape", "esc", "normal mode", "stop insert", "exit insert", "leave insert", "ctrl-["], ["Ctrl-[ is the same key as Escape.", "Ctrl-c also leaves insert mode, but it does not expand an abbreviation and it does not run InsertLeave."], { card: true, mode: "Insert", aliases: ["Escape", "Ctrl-[", "<Esc>"] });
  C("leave-insert-ctrl-c", "Insert", "Ctrl-c", "Leave insert mode immediately", "Returns to normal mode without expanding an abbreviation.", ["ctrl-c insert", "cancel insert", "exit insert ctrl-c"], ["Escape is the ordinary way out. Ctrl-c skips abbreviation expansion and InsertLeave."], { mode: "Insert" });
  C("insert-delete-word", "Insert", "Ctrl-w", "Delete the word before the cursor", "While typing, deletes back to the start of the word.", ["insert delete word", "delete word backward", "erase previous word", "ctrl-w insert", "backspace word"], ["This is insert mode. In normal mode, Ctrl-w starts a window command.", "Ctrl-u in insert mode deletes back to the start of the line."], { mode: "Insert", card: true });
  C("insert-delete-line", "Insert", "Ctrl-u", "Delete back to the start of the line", "While typing, deletes the characters before the cursor on this line.", ["insert delete line", "clear to start while typing", "ctrl-u insert", "erase line backward"], ["In normal mode, Ctrl-u scrolls half a page up."], { mode: "Insert" });
  C("insert-indent", "Insert", "Ctrl-t", "Indent while typing", "Shifts this line right by one shiftwidth, from insert mode.", ["insert indent", "indent while typing", "ctrl-t", "shift right insert"], ["Ctrl-d shifts the line left."], { mode: "Insert" });
  C("insert-unindent", "Insert", "Ctrl-d", "Unindent while typing", "Shifts this line left by one shiftwidth, from insert mode.", ["insert unindent", "dedent while typing", "ctrl-d insert"], ["In normal mode, Ctrl-d scrolls half a page down."], { mode: "Insert" });
  C("complete-next", "Insert", "Ctrl-n", "Complete the word", "Offers words found from the complete option. Ctrl-n is the next match.", ["autocomplete", "completion", "complete word", "suggest word", "ctrl-n", "intellisense word"], ["By default the words come from this buffer, other windows, loaded buffers, tags, and included files.", "Ctrl-p is the previous match.", "Ctrl-x starts a specific family: Ctrl-x Ctrl-f for file names, Ctrl-x Ctrl-l for whole lines, Ctrl-x Ctrl-o for omni completion."], { mode: "Insert", card: true });
  C("complete-prev", "Insert", "Ctrl-p", "Previous completion match", "Steps backward through the same word list as Ctrl-n.", ["previous completion", "complete backward", "ctrl-p"], [], { mode: "Insert" });
  C("complete-file", "Insert", "Ctrl-x Ctrl-f", "Complete a file name", "Completes a path from the directories Vim will look in.", ["filename completion", "complete file", "path completion", "ctrl-x ctrl-f"], [], { mode: "Insert" });
  C("complete-line", "Insert", "Ctrl-x Ctrl-l", "Complete a whole line", "Offers lines that start with the characters before the cursor.", ["line completion", "complete line", "ctrl-x ctrl-l"], [], { mode: "Insert" });
  C("complete-omni", "Insert", "Ctrl-x Ctrl-o", "Omni completion", "Completes using the omnifunc for this file type.", ["omni", "omnicomplete", "syntax completion", "ctrl-x ctrl-o"], ["Nothing is offered when omnifunc is empty. A file type plugin is what usually sets it."], { mode: "Insert" });
  C("complete-dict", "Insert", "Ctrl-x Ctrl-k", "Complete from the dictionary", "Offers words from the dictionary option.", ["dictionary completion", "word list completion", "ctrl-x ctrl-k"], ["Set dictionary to a word-list file first."], { mode: "Insert" });
  C("complete-spell", "Insert", "Ctrl-x Ctrl-s", "Complete a spelling suggestion", "Offers spelling fixes for the word before the cursor.", ["spell completion", "spelling suggest while typing", "ctrl-x ctrl-s"], [":set spell has to be on for the word list to be useful."], { mode: "Insert" });
  C("complete-buffer", "Insert", "Ctrl-x Ctrl-n", "Complete from this buffer only", "Offers keywords found in the current file.", ["complete this file", "buffer keywords", "ctrl-x ctrl-n"], [], { mode: "Insert" });
  C("insert-char-above", "Insert", "Ctrl-y", "Copy the character from the line above", "Inserts the character in the same column on the previous line.", ["copy character above", "char from above", "repeat column above", "accept completion", "ctrl-y"], ["If the completion menu is open, Ctrl-y accepts the selected match instead of copying the character above.", "Ctrl-e copies the character from the line below, unless the completion menu is open, in which case Ctrl-e cancels the match."], { mode: "Insert" });
  C("insert-char-below", "Insert", "Ctrl-e", "Copy the character from the line below", "Inserts the character in the same column on the next line.", ["copy character below", "char from below"], ["If the completion menu is open, Ctrl-e cancels the match instead. In normal mode, Ctrl-e scrolls."], { mode: "Insert" });
  C("insert-register", "Insert", "Ctrl-r", "Insert a register while typing", "Ctrl-r then a register name inserts that register.", ["insert register", "paste while typing", "ctrl-r insert", "paste in insert mode"], ["Ctrl-r \" inserts the last copy or delete. Ctrl-r + inserts the system clipboard. Ctrl-r % inserts the file name.", "In normal mode, Ctrl-r is redo."], { mode: "Insert", aliases: ["Ctrl-r \""] });
  C("insert-expression", "Insert", "Ctrl-r =", "Insert the result of an expression", "Ctrl-r = lets you type an expression, then inserts its value.", ["expression", "calculate", "math", "insert result", "eval"], ["Ctrl-r =1+2 and Enter inserts 3.", "From normal mode, \"=1+2 then Enter, then p, puts the result."], { mode: "Insert" });
  C("insert-filename", "Insert", "Ctrl-r %", "Insert the current file name", "While typing, inserts the name of the file being edited.", ["insert filename", "current file name", "paste filename"], ["Ctrl-r # inserts the alternate file name."], { mode: "Insert" });
  C("insert-one-normal", "Insert", "Ctrl-o", "Run one normal command, then keep typing", "Runs a single normal-mode command and returns to insert mode.", ["one normal command", "normal from insert", "ctrl-o insert", "move while inserting"], ["Ctrl-o then w moves one word and comes back to insert. Ctrl-o then zz centers the line.", "In normal mode, Ctrl-o walks back through the jump list."], { mode: "Insert" });
  C("insert-literal", "Insert", "Ctrl-v", "Insert the next character literally", "Inserts the next key as a character, including a tab, a control character, or a digit code.", ["literal character", "insert tab", "insert control character", "raw character", "ctrl-v insert"], ["Ctrl-q does the same when the terminal takes Ctrl-v.", "In normal mode, Ctrl-v starts a rectangular selection instead."], { mode: "Insert", aliases: ["Ctrl-q"] });
  C("digraph", "Insert", "Ctrl-k", "Insert a digraph", "Ctrl-k then two characters inserts the matching special character.", ["digraph", "special character", "compose character", "accented", "unicode character", "ctrl-k"], [":digraphs lists the two-character codes."], { mode: "Insert" });
  C("digraphs-list", "Command line", ":digraphs", "List digraph codes", "Shows the two-character codes Ctrl-k accepts.", ["list digraphs", "special character codes"], [], { mode: "Command", aliases: [":digraphs", ":dig"] });
  C("insert-last-text", "Insert", "Ctrl-a", "Insert the last text you typed", "Inserts the text from the previous time you were in insert mode.", ["repeat insert", "insert again", "last insertion", "ctrl-a insert", "type that again"], ["Ctrl-@ does the same and then leaves insert mode.", "In normal mode, Ctrl-a adds to the number under the cursor."], { mode: "Insert", aliases: ["Ctrl-@"] });

  C("visual", "Visual", "v", "Select characters", "Starts characterwise visual mode. Motions extend the selection.", ["visual", "select", "highlight characters", "character visual"], ["From the selection, d deletes, y copies, c changes, and > indents.", "Escape leaves visual mode."], { card: true, mode: "Visual" });
  C("visual-line", "Visual", "V", "Select whole lines", "Starts linewise visual mode.", ["visual line", "select line", "select lines", "line visual", "highlight lines"], ["V then j extends the selection by one line."], { card: true, mode: "Visual" });
  C("visual-block", "Visual", "Ctrl-v", "Select a block", "Starts block visual mode, so you can select a rectangle of characters.", ["visual block", "block select", "column select", "rectangle", "ctrl-v", "blockwise"], ["Ctrl-q does this when the terminal takes Ctrl-v.", "After the block is selected, I types at the start of each line and A types at the end. The text appears on every line when you press Escape."], { card: true, mode: "Visual", aliases: ["Ctrl-v", "Ctrl-q"] });
  C("visual-other-end", "Visual", "o", "Move to the other end of the selection", "In visual mode, jumps the cursor to the other end so you can adjust that side.", ["other end", "swap selection end", "change anchor", "visual o"], ["In block visual mode, O moves to the other corner."], { mode: "Visual" });
  C("visual-reselect", "Visual", "gv", "Reselect the last visual selection", "Selects the text you last selected.", ["reselect", "select again", "restore selection", "gv"], ["Useful after > or < drops the selection and you want to indent again."]);
  C("visual-block-insert", "Visual", "Ctrl-v I", "Insert text on each line of a visual block", "After a block selection, I inserts the text you type onto every selected line.", ["visual block insert", "block insert", "insert column", "prepend each line", "comment leader", "add text to each line"], ["Select the column with Ctrl-v, press I, type, then Escape. The text is added when you press Escape, not as you type.", "Use this to put a comment leader at the start of several lines. Stock Vim has no separate comment command."], { mode: "Visual" });
  C("visual-block-append", "Visual", "Ctrl-v A", "Type the same text at the end of a block", "After a block selection, A appends the text you type to each selected line.", ["block append", "append column", "add at end of block", "suffix each line"], ["When the lines have different lengths, press $ after selecting the block and before A, so each line gets the text at its real end."], { mode: "Visual", aliases: ["Ctrl-v $ A"] });
  C("visual-lower", "Visual", "u", "Lowercase the selection", "In visual mode, makes the selected letters lowercase.", ["lowercase selection", "downcase selection", "visual u"], ["U uppercases the selection. ~ swaps case."], { mode: "Visual" });
  C("visual-upper", "Visual", "U", "Uppercase the selection", "In visual mode, makes the selected letters uppercase.", ["uppercase selection", "capitalize selection", "visual U"], [], { mode: "Visual" });
  C("indent-selection", "Visual", ">", "Indent the selection", "Shifts the selected lines right.", ["indent selection", "shift selection right", "visual indent"], ["< shifts the selection left. gv reselects it if you want to shift again."], { mode: "Visual" });

  C("search-forward", "Search", "/", "Search forward", "Asks for a pattern and jumps to the next match.", ["search", "find", "search forward", "slash", "look for"], ["? searches backward.", "n goes to the next match. N goes to the previous one.", "While the prompt is open, Ctrl-g jumps to the next match and Ctrl-t jumps to the previous one. Enter accepts the pattern. Ctrl-c cancels."], { card: true, mode: "Normal" });
  C("search-back", "Search", "?", "Search backward", "Asks for a pattern and jumps to the previous match.", ["search backward", "find backward", "search up", "question mark", "reverse search"], [], { mode: "Normal" });
  C("search-prompt-next", "Search", "Ctrl-g", "Next match while typing a search", "During a / or ? prompt, jumps to the next match without leaving the prompt.", ["next match while searching", "search preview next", "ctrl-g search"], ["Ctrl-t jumps to the previous match. This is only while the search prompt is open.", "In normal mode, Ctrl-g shows the file name and the cursor position."], { mode: "Search" });
  C("clear-highlight", "Search", ":noh", "Clear the search highlight", "Turns the match highlighting off until the next search.", ["clear highlight", "clear search", "noh", "nohlsearch", "remove highlight", "hide matches", "turn off yellow"], ["This does not disable highlighting. The next / or n lights the matches up again.", ":set nohlsearch turns the feature off until you set it back on."], { card: true, mode: "Command", aliases: [":noh", ":nohlsearch"] });
  C("highlight-on", "Search", ":set hlsearch", "Highlight search matches", "Keeps every match of the last search lit.", ["highlight search", "hlsearch", "show matches", "light up matches"], ["Pair it with :set incsearch if you want matches to update while you type the pattern."], { mode: "Command", aliases: [":set hlsearch", ":set hls"] });
  C("highlight-off", "Search", ":set nohlsearch", "Turn search highlighting off", "Disables match highlighting until you turn it on again.", ["turn off highlight", "disable highlight", "no hlsearch", "stop highlighting"], [":noh only clears the current matches. This turns the option off."], { mode: "Command", aliases: [":set nohlsearch", ":set nohls"] });
  C("incsearch", "Search", ":set incsearch", "Show matches as you type the search", "Moves to the match while the / prompt is still open.", ["incremental search", "search as you type", "incsearch", "live search"], [], { mode: "Command", aliases: [":set incsearch", ":set is"] });
  C("ignore-case", "Search", ":set ignorecase", "Ignore case while searching", "Makes / and ? treat capitals and small letters as the same.", ["ignore case", "case insensitive", "ignorecase", "search any case"], ["With :set smartcase as well, a pattern that contains a capital letter becomes case-sensitive again."], { mode: "Command", aliases: [":set ignorecase", ":set ic"] });
  C("smart-case", "Search", ":set smartcase", "Match case when the search has a capital letter", "A search is case-insensitive until you type an uppercase letter.", ["smart case", "smartcase", "case sensitive when capital", "ignore case unless uppercase"], ["This does nothing unless ignorecase is also on."], { mode: "Command", aliases: [":set smartcase", ":set scs"] });
  C("wrapscan", "Search", ":set wrapscan", "Let search wrap around the file", "After the last match, n continues at the top of the file.", ["search wrap", "wrapscan", "search from top", "wrap around"], [":set nowrapscan makes n stop at the last match."], { mode: "Command", aliases: [":set wrapscan", ":set nowrapscan"] });
  C("replace-file", "Search", ":%s/old/new/g", "Replace in the whole file", "Replaces every old on each line with new.", ["replace", "replace all", "find and replace", "search and replace", "substitute", "change all", "rename all"], ["g means every match on the line. Without g, only the first match on each line changes.", "The pattern is a Vim pattern. A dot matches any character. Use \\. for a literal dot, or start the pattern with \\V for a mostly literal match.", "c asks before each change: :%s/old/new/gc"], { card: true, mode: "Command", indexDisplayKey: false, aliases: [":%s", ":s", ":substitute"] });
  C("replace-confirm", "Search", ":%s/old/new/gc", "Replace and ask each time", "Replaces matches in the file, and asks before each one.", ["confirm replace", "ask each", "replace with confirm", "y n replace", "substitute confirm"], ["y replaces this match, n skips it, a replaces the rest, q quits, l replaces this one and quits."], { mode: "Command", indexDisplayKey: false });
  C("replace-selection", "Search", ":'<,'>s/old/new/g", "Replace on the selected lines", "From visual mode, : already fills in the line range. s/old/new/g then replaces on those lines.", ["replace in selection", "replace selected lines", "substitute visual", "change in highlight"], ["The range is whole lines. A selection in the middle of a line still changes the rest of that line.", "To change only the highlighted characters, put \\%V in front of the pattern."], { mode: "Command", indexDisplayKey: false });
  C("replace-selection-only", "Search", ":'<,'>s/\\%Vold/new/g", "Replace only inside the selection", "Limits the substitute to the characters that were highlighted.", ["replace only selection", "visual only", "inside visual", "percent v", "not the whole line"], ["Press : from visual mode so the '<,'> range stays, then add \\%V at the start of the pattern."], { mode: "Command", indexDisplayKey: false });
  C("replace-word", "Search", ":%s/\\<old\\>/new/g", "Replace a whole word", "Replaces old only when it is a whole word, not part of a longer word.", ["whole word", "word boundary", "replace word only", "not inside words"], ["\\< is the start of a word and \\> is the end."], { mode: "Command", indexDisplayKey: false });
  C("replace-last-search", "Search", ":%s//new/g", "Replace the last search", "An empty pattern means the last search pattern.", ["replace last search", "substitute last search", "empty pattern", "reuse search"], ["Search with / or * first, then run this to change those matches."], { mode: "Command", indexDisplayKey: false, aliases: [":%s//"] });
  C("replace-count", "Search", ":%s/old//gn", "Count matches without changing them", "Reports how many matches there are and does not edit the buffer.", ["count matches", "how many matches", "count occurrences", "n flag"], ["The n flag means do not substitute. g counts every match on the line."], { mode: "Command", indexDisplayKey: false });
  C("very-magic", "Search", "\\v", "Make a pattern very magic", "\\v at the start of a pattern makes most punctuation special, so groups use ( ) instead of \\( \\).", ["very magic", "regex", "regular expression", "less escaping", "magic"], ["\\V does the opposite and treats almost everything as literal. You still escape a backslash.", "Example: :%s/\\v(foo|bar)/X/g"]);
  C("repeat-sub", "Search", "&", "Repeat the last substitute on this line", "Runs the last :s again on the current line, with the same flags.", ["repeat substitute", "repeat replace", "again substitute", "ampersand"], ["g& repeats it on every line in the file.", ":s with no pattern also repeats the last substitute."]);
  C("repeat-sub-all", "Search", "g&", "Repeat the last substitute on the whole file", "Runs the last substitute on every line, with the same flags.", ["repeat replace file", "global repeat substitute", "again on all lines"], ["& repeats it on the current line only."]);
  C("change-next-match", "Search", "cgn", "Change the next match, then repeat with dot", "Changes the next search hit and leaves you typing. After Escape, . changes the one after that.", ["change next match", "replace next", "repeat on next match", "cgn", "dot next match"], ["Search first with / or *.", "n skips a match without changing it. . changes the next one the same way.", "dgn deletes the next match. ygn copies it."], { aliases: ["cgn", "dgn", "ygn"] });
  C("search-history", "Search", "q/", "Open the search history", "Opens a window of past search patterns. Edit one and press Enter to run it.", ["search history", "previous searches", "pattern history"], ["q? opens the backward-search history. q: opens the command-line history."], { aliases: ["q/", "q?"] });

  C("save", "Files", ":w", "Save the file", "Writes the buffer to disk.", ["save", "write", "save file", "write file", "persist", "store"], [":w filename writes a copy to that name and you keep editing the original.", ":saveas filename writes the file and switches the buffer to the new name.", ":wa writes every changed buffer."], { card: true, mode: "Command", aliases: [":w", ":write", ":update"] });
  C("save-all", "Files", ":wa", "Save every changed file", "Writes all modified buffers.", ["save all", "write all", "save everything", "wall"], [":wqa writes all and then quits."], { mode: "Command", aliases: [":wa", ":wall"] });
  C("save-as", "Files", ":saveas", "Save as a new name and edit that file", "Writes the buffer to a new name and makes that the current file.", ["save as", "rename file", "saveas", "save a copy and switch"], [":w newname writes a copy and leaves you editing the original."], { mode: "Command", aliases: [":saveas", ":sav"], indexDisplayKey: false });
  C("write-copy", "Files", ":w newname", "Write a copy without switching files", "Writes the buffer to another name. The buffer you are editing does not change.", ["write a copy", "save a copy", "export buffer", "write to other name"], [], { mode: "Command", indexDisplayKey: false, aliases: [":w"] });
  C("quit", "Files", ":q", "Quit", "Closes the window. Quits Vim when it is the last window.", ["quit", "exit", "close vim", "leave"], [":q fails when the buffer has unsaved changes. :q! quits anyway.", ":qa quits every window."], { card: true, mode: "Command", aliases: [":q", ":quit"] });
  C("quit-force", "Files", ":q!", "Quit without saving", "Throws away unsaved changes in this window and quits.", ["quit without saving", "force quit", "discard and quit", "exit without saving", "abandon changes"], [":qa! does this for every window. ZQ is the normal-mode key for the same thing."], { card: true, mode: "Command", aliases: [":q!", ":quit!"] });
  C("quit-all", "Files", ":qa", "Quit every window", "Closes all windows and leaves Vim.", ["quit all", "exit all", "close all windows", "qa"], ["It fails if a buffer has unsaved changes. :qa! discards those changes. :wqa saves them first."], { mode: "Command", aliases: [":qa", ":qall"] });
  C("quit-all-force", "Files", ":qa!", "Quit everything without saving", "Leaves Vim and discards unsaved changes in every buffer.", ["force quit all", "discard all and quit", "exit all without saving"], [], { mode: "Command", aliases: [":qa!", ":qall!"] });
  C("save-quit", "Files", ":wq", "Save and quit", "Writes this file and closes the window.", ["save and quit", "write and quit", "save exit", "wq"], ["ZZ does this from normal mode. :x writes only if the buffer changed, then quits."], { card: true, mode: "Command", aliases: [":wq", ":x", ":xit"] });
  C("save-quit-all", "Files", ":wqa", "Save everything and quit", "Writes every changed buffer and leaves Vim.", ["save all and quit", "write all and quit", "exit and save"], [" :xa is the same command."], { mode: "Command", aliases: [":wqa", ":xa", ":wqall"] });
  C("save-quit-zz", "Files", "ZZ", "Save and quit from normal mode", "Writes the file if it changed, then closes the window.", ["zz save", "shift zz", "save quit keys", "normal save and quit"], [":wq and :x are the command-line versions. ZQ quits without saving."], { card: true });
  C("quit-zq", "Files", "ZQ", "Quit without saving from normal mode", "Closes the window and discards unsaved changes.", ["zq", "normal force quit", "quit keys"], [":q! is the command-line version."]);
  C("edit-file", "Files", ":e", "Open a file", "Edits a file in the current window.", ["open file", "edit file", "load file", "switch file", "files"], [":e with no name reloads the current file when the buffer has no unsaved changes.", ":e! reloads from disk and discards unsaved changes.", "Tab completes file names."], { card: true, mode: "Command", aliases: [":e", ":edit"], indexDisplayKey: false });
  C("reload-discard", "Files", ":e!", "Reload the file and discard changes", "Replaces the buffer with the copy on disk.", ["reload", "reload file", "revert file", "discard changes", "reload from disk", "throw away edits"], [":e without ! reloads only when you have not changed the buffer."], { mode: "Command", aliases: [":e!"] });
  C("checktime", "Files", ":checktime", "See if the file changed on disk", "Checks the timestamp and warns when the file on disk is newer.", ["file changed", "external change", "reload if changed", "disk changed", "autoread"], ["With :set autoread, Vim reloads the file when you haven't changed the buffer."], { mode: "Command" });
  C("empty-buffer", "Files", ":enew", "Open an empty buffer", "Starts a new unnamed buffer in this window.", ["new file", "empty buffer", "untitled", "scratch buffer"], [], { mode: "Command", aliases: [":enew"] });
  C("delete-buffer", "Files", ":bd", "Unload this buffer", "Removes the buffer from the buffer list and closes windows showing it.", ["delete buffer", "close buffer", "unload buffer", "bd"], ["It fails when the buffer is modified, unless you use :bd!.", ":bw wipes the buffer so it no longer appears in :ls at all."], { mode: "Command", aliases: [":bd", ":bdelete", ":bw"] });
  C("next-buffer", "Files", ":bn", "Go to the next buffer", "Edits the next buffer in the buffer list.", ["next buffer", "next file", "cycle buffer", "bnext"], [":bp goes to the previous buffer. :bfirst and :blast go to the ends.", "Ctrl-^ toggles between this buffer and the alternate one."], { card: true, mode: "Command", aliases: [":bn", ":bnext"] });
  C("prev-buffer", "Files", ":bp", "Go to the previous buffer", "Edits the previous buffer in the buffer list.", ["previous buffer", "prior buffer", "bprevious", "back buffer"], [], { mode: "Command", aliases: [":bp", ":bprevious"] });
  C("list-buffers", "Files", ":ls", "List buffers", "Shows the buffer list.", ["list buffers", "show buffers", "buffers", "open files list"], ["% is the current buffer. # is the alternate. + means unsaved changes. h means hidden.", ":b and the start of a name switches to that buffer. :sb opens it in a split."], { card: true, mode: "Command", aliases: [":ls", ":buffers", ":files"] });
  C("switch-buffer", "Files", ":b", "Switch to a buffer by name", "Edits the buffer whose name starts with what you type.", ["switch buffer", "go to buffer", "buffer name", "open buffer"], [":sb name opens that buffer in a split."], { mode: "Command", aliases: [":b", ":buffer", ":sb"], indexDisplayKey: false });
  C("alternate-buffer", "Files", "Ctrl-^", "Toggle the alternate file", "Switches between the current buffer and the previous one.", ["alternate file", "previous file", "switch back", "ctrl-6", "last buffer"], ["Ctrl-6 is the same command. :b# edits the alternate buffer.", ":e # does it too."], { card: true, aliases: ["Ctrl-^", "Ctrl-6", ":b#", ":e #"] });
  C("find-file", "Files", ":find", "Find a file on the path", "Opens a file by searching the directories in the path option.", ["find file", "search path", "path option", "gf command line"], ["gf does this for the name under the cursor. :set path+=** lets :find look in subdirectories. That search can be slow on a large tree."], { mode: "Command", aliases: [":find", ":fin"], indexDisplayKey: false });
  C("insert-file", "Files", ":r", "Insert a file under the cursor", "Reads a file and puts its contents on the line below the cursor.", ["insert file", "read file", "paste file contents"], [":r !ls inserts the output of a shell command instead."], { mode: "Command", aliases: [":r", ":read"], indexDisplayKey: false });
  C("file-directory", "Files", ":cd %:h", "Change to this file's directory", "Sets the working directory to the folder that contains the current file.", ["cd", "change directory", "file directory", "directory of this file", "lcd"], ["% is the file name and :h is its directory.", ":lcd %:h changes the directory for this window only. :pwd prints the working directory."], { mode: "Command", aliases: [":cd %:h", ":lcd %:h", ":pwd"] });
  C("full-path", "Files", "1 Ctrl-g", "Show the full path and the cursor position", "Ctrl-g shows the file name and where you are. A count shows the full path.", ["full path", "current file path", "where am i", "file position", "cursor position"], [":echo expand('%:p') also prints the full path."], { aliases: ["Ctrl-g", "1 Ctrl-g"] });
  C("explore", "Files", ":Ex", "Open Vim's file browser", "Opens netrw, the file browser that ships with Vim.", ["file browser", "explore", "netrw", "directory listing", "open folder"], [":Sex opens it in a horizontal split. :Vex opens a vertical split. :Tex opens a tab.", "Neovim does not include netrw. This command is Vim's."], { mode: "Command", badge: "Vim", aliases: [":Ex", ":Explore", ":Sex", ":Vex", ":Tex"] });
  C("permission-save", "Files", ":w !sudo tee % >/dev/null", "Save a file you do not have permission to write", "Sends the buffer through sudo tee so the file can be replaced as root.", ["sudo", "permission denied", "readonly", "cannot save", "can't save", "force write", "root save", "tee"], ["This runs a shell command that replaces the file. Use it only on the file you mean to overwrite.", "Vim may still mark the buffer as changed afterward. :e! reloads the file you just wrote."], { mode: "Command" });
  C("hex-edit", "Files", ":%!xxd", "Edit the buffer as hex", "Filters the buffer through xxd so you can edit the bytes.", ["hex", "hex edit", "xxd", "binary", "bytes"], ["When you are done, :%!xxd -r turns it back into the original bytes. Write the file only after that reversal.", "xxd ships with a typical Vim install."], { mode: "Command", aliases: [":%!xxd", ":%!xxd -r"] });

  C("split-horizontal", "Windows and tabs", "Ctrl-w s", "Split the window horizontally", "Opens the same buffer in a new window above or below.", ["split", "horizontal split", "split window", "split horizontally", "two panes"], [":split filename opens another file in that split.", ":set splitbelow makes the new window open below."], { card: true, aliases: ["Ctrl-w s", ":split", ":sp", ":new"] });
  C("split-vertical", "Windows and tabs", "Ctrl-w v", "Split the window vertically", "Opens the same buffer in a window beside this one.", ["vertical split", "vsplit", "side by side", "split vertically", "column split"], [":vsplit filename opens another file beside this one.", ":set splitright makes the new window open on the right."], { card: true, aliases: ["Ctrl-w v", ":vsplit", ":vs", ":vnew"] });
  C("window-move", "Windows and tabs", "Ctrl-w w", "Move to another window", "Ctrl-w then h, j, k, or l moves to the window in that direction.", ["move window", "switch window", "go to window", "change pane", "focus window", "ctrl-w", "ctrl-w hjkl"], ["Ctrl-w w cycles to the next window. Ctrl-w W cycles backward. Ctrl-w p goes back to the previous window.", "The arrow keys work after Ctrl-w as well.", "In insert mode, Ctrl-w deletes the word before the cursor. The window commands are normal mode."], { card: true, aliases: ["Ctrl-w h", "Ctrl-w j", "Ctrl-w k", "Ctrl-w l", "Ctrl-w w", "Ctrl-w p"] });
  C("window-close", "Windows and tabs", "Ctrl-w c", "Close this window", "Closes the current window and stays in Vim.", ["close window", "close split", "close pane", "hide window"], ["If this is the only window, the close is refused.", "Ctrl-w q quits the window, and quits Vim when it is the only one.", "Unsaved changes still need :w, or :q! if you mean to discard them."], { aliases: ["Ctrl-w c", ":close"] });
  C("window-quit", "Windows and tabs", "Ctrl-w q", "Quit this window", "Quits the current window. Quits Vim when no other window is open.", ["quit window", "quit split", "close and maybe quit"], ["Ctrl-w c never quits Vim. It refuses to close the last window."], { aliases: ["Ctrl-w q"] });
  C("window-only", "Windows and tabs", "Ctrl-w o", "Close the other windows", "Leaves this window and closes the rest.", ["only window", "close other windows", "close other splits", "one window", "maximize alone"], [":only is the same command.", "Other buffers stay in the buffer list. :set hidden lets you leave a changed buffer without writing it."], { card: true, aliases: ["Ctrl-w o", ":only"] });
  C("window-equal", "Windows and tabs", "Ctrl-w =", "Make the windows the same size", "Gives every window an equal share of the screen.", ["equal windows", "balance windows", "equal size", "same size splits", "equalize", "equalize splits", "equalize windows", "balance splits"], []);
  C("window-max-height", "Windows and tabs", "Ctrl-w _", "Make this window as tall as possible", "Gives the current window the full height.", ["maximize height", "full height", "tall window", "max split height"], ["Ctrl-w | makes it as wide as possible."], { aliases: ["Ctrl-w _"] });
  C("window-max-width", "Windows and tabs", "Ctrl-w |", "Make this window as wide as possible", "Gives the current window the full width.", ["maximize width", "full width", "wide window", "max split width"], []);
  C("window-resize", "Windows and tabs", "Ctrl-w +", "Resize the window", "Ctrl-w + and Ctrl-w - change the height. Ctrl-w > and Ctrl-w < change the width.", ["resize window", "resize split", "taller", "shorter", "wider", "narrower"], ["A count is a number of rows or columns. 5 then Ctrl-w + adds five rows."], { aliases: ["Ctrl-w +", "Ctrl-w -", "Ctrl-w >", "Ctrl-w <"] });
  C("window-move-edge", "Windows and tabs", "Ctrl-w H", "Move this window to an edge", "Ctrl-w H, J, K, or L moves the window to the far left, bottom, top, or right.", ["move window to edge", "rearrange splits", "window far left", "window far right"], ["The capital letter is the edge. The lowercase letter only moves the cursor."], { aliases: ["Ctrl-w H", "Ctrl-w J", "Ctrl-w K", "Ctrl-w L"] });
  C("window-rotate", "Windows and tabs", "Ctrl-w r", "Rotate the windows", "Cycles the windows downward or rightward.", ["rotate windows", "cycle splits", "rearrange"], ["Ctrl-w R rotates the other way. Ctrl-w x exchanges this window with the next."], { aliases: ["Ctrl-w r", "Ctrl-w R", "Ctrl-w x"] });
  C("window-to-tab", "Windows and tabs", "Ctrl-w T", "Move this window into its own tab", "Breaks the current window out into a new tab.", ["window to tab", "split to tab", "break out tab"], []);
  C("window-file", "Windows and tabs", "Ctrl-w f", "Open the file under the cursor in a split", "Splits and edits the path under the cursor.", ["open file in split", "gf split", "file under cursor split"], ["Ctrl-w F also uses a line number written after the file name."], { aliases: ["Ctrl-w f", "Ctrl-w F"] });
  C("window-file-tab", "Windows and tabs", "Ctrl-w gf", "Open the file under the cursor in a tab", "Opens the path under the cursor in a new tab.", ["open file in tab", "gf tab", "file under cursor tab"], ["Ctrl-w gF also jumps to a trailing line number."], { aliases: ["Ctrl-w gf", "Ctrl-w gF"] });
  C("split-direction", "Windows and tabs", ":set splitbelow splitright", "Open new splits below and to the right", "Makes :split open underneath and :vsplit open on the right.", ["split below", "split right", "open below", "open to the right", "split direction"], ["The defaults open above and to the left."], { mode: "Command" });
  C("tab-new", "Windows and tabs", ":tabnew", "Open a new tab", "Opens a tab. A file name opens that file in the tab.", ["new tab", "open tab", "create tab", "tabnew"], ["Ctrl-w T moves the current window into a new tab instead of editing another file."], { card: true, mode: "Command", aliases: [":tabnew", ":tabe", ":tabedit"] });
  C("tab-close", "Windows and tabs", ":tabc", "Close this tab", "Closes the current tab and its windows.", ["close tab", "tab close", "tabc"], [":tabonly closes the other tabs."], { mode: "Command", aliases: [":tabc", ":tabclose"] });
  C("tab-only", "Windows and tabs", ":tabo", "Close the other tabs", "Leaves this tab and closes the rest.", ["close other tabs", "only tab", "tabonly"], [], { mode: "Command", aliases: [":tabo", ":tabonly"] });
  C("tab-next", "Windows and tabs", "gt", "Go to the next tab", "Switches to the next tab. After the last tab, it wraps to the first.", ["next tab", "switch tab", "cycle tabs", "gt"], ["gT goes to the previous tab. 3gt goes to tab 3."], { card: true, aliases: ["gt", ":tabn", ":tabnext"] });
  C("tab-prev", "Windows and tabs", "gT", "Go to the previous tab", "Switches to the previous tab.", ["previous tab", "prior tab", "gT"], [], { aliases: ["gT", ":tabp", ":tabprevious"] });
  C("tab-go", "Windows and tabs", "3gt", "Go to a tab by number", "A count before gt jumps to that tab. The first tab is 1.", ["go to tab", "tab number", "switch to tab 2"], [":tabs lists the tabs and their numbers."], { indexDisplayKey: false, aliases: [":tabs"] });
  C("tab-move", "Windows and tabs", ":tabmove", "Move this tab", ":tabmove 0 moves the tab to the front. :tabmove moves it to the end.", ["move tab", "reorder tabs", "tabmove"], [], { mode: "Command", aliases: [":tabmove", ":tabm"] });

  C("set-mark", "Marks and jumps", "ma", "Set a mark", "ma stores the cursor position in mark a.", ["set mark", "bookmark", "mark position", "remember place", "ma"], ["Marks a through z belong to this file. Marks A through Z work across files.", "`a jumps back to the exact position. 'a jumps to that line."], { card: true, aliases: ["ma", "m"] });
  C("jump-mark", "Marks and jumps", "`a", "Jump to a mark", "Moves to the exact position stored in mark a.", ["jump to mark", "go to mark", "goto mark", "back to mark"], ["'a jumps to the line of the mark, on the first non-blank character.", ":marks lists them. :delmarks a deletes mark a."], { card: true, aliases: ["`a", "'a"] });
  C("global-mark", "Marks and jumps", "mA", "Set a mark that works in any file", "A capital mark remembers a position and which file it was in.", ["global mark", "file mark", "cross file mark", "mark A"], ["`A jumps to that file and position."], { aliases: ["mA", "`A"] });
  C("list-marks", "Marks and jumps", ":marks", "List marks", "Shows the marks, including the recent-file marks 0 through 9.", ["list marks", "show marks", "bookmarks list"], ["'0 is where you were in the last file you left, when viminfo or shada is saving marks."], { mode: "Command" });
  C("delete-marks", "Marks and jumps", ":delmarks", "Delete marks", "Deletes the marks you name. :delmarks a b deletes a and b.", ["delete mark", "clear mark", "remove bookmark", "delmarks"], [":delmarks! deletes every lowercase mark in this buffer."], { mode: "Command", aliases: [":delmarks", ":delm"] });
  C("last-file-mark", "Marks and jumps", "'0", "Jump back to the last file you left", "Opens the previous file at the position where you left it.", ["last file", "reopen last position", "where i left off", "recent file", "mark 0", "closed", "last file closed", "file i closed"], ["This comes from viminfo in Vim and shada in Neovim. Both save it by default.", ":marks shows '0 through '9, the files you left most recently."]);

  C("record-macro", "Macros and registers", "qa", "Record a macro", "qa starts recording keystrokes into register a. q stops the recording.", ["record macro", "start macro", "record keys", "qa", "macro"], ["@a plays it back. @@ plays the last macro again. 10@a plays it ten times.", "qA appends more keys onto register a instead of replacing it."], { card: true, aliases: ["qa", "q"] });
  C("stop-macro", "Macros and registers", "q", "Stop recording a macro", "While a recording is running, q ends it.", ["stop recording", "end macro", "finish recording", "stop macro"], ["When you are not recording, q waits for a register name and starts a recording."]);
  C("play-macro", "Macros and registers", "@a", "Play a macro", "Runs the keystrokes stored in register a.", ["play macro", "run macro", "replay", "execute macro", "at a"], ["@@ repeats that macro. A count plays it that many times."], { card: true, aliases: ["@a", "@@", "@"] });
  C("repeat-macro", "Macros and registers", "@@", "Repeat the last macro", "Plays the macro you just played, again.", ["repeat macro", "play macro again", "at at"], []);
  C("replay-line", "Macros and registers", ":'<,'>normal @a", "Run a macro on each selected line", "From a visual selection, runs the macro once per line.", ["macro on each line", "run on selection", "apply macro", "normal on lines", "repeat down the file"], [":%normal @a runs it on every line.", "The macro should be written as if it starts at the beginning of a line, or it should move itself."], { mode: "Command", indexDisplayKey: false, aliases: [":normal", ":%normal @a"] });
  C("run-register-ex", "Macros and registers", ":@a", "Run a register as commands", "Executes the text in register a as command-line commands.", ["run register", "execute register", "ex from register", "at colon"], ["@a in normal mode plays keystrokes. :@a runs ex commands. They are not the same.", ":@: repeats the last command line."], { mode: "Command", aliases: [":@a", ":@:"] });
  C("show-registers", "Macros and registers", ":reg", "Show the registers", "Lists yank, delete, named, and read-only registers.", ["show registers", "list registers", "registers", "clipboard contents", "what is copied"], ["\" is the last yank or delete. 0 is the last yank. 1 through 9 are recent deletes.", ". is the last inserted text. % is the file name. : is the last command. / is the last search."], { mode: "Command", aliases: [":reg", ":registers"] });
  C("command-window", "Macros and registers", "q:", "Open the command history as a buffer", "Lets you edit a past command and press Enter to run it.", ["command history", "command line window", "edit command", "past commands"], ["Ctrl-c closes it without running a command. Up and Down on the command line also walk the history.", "From the command line itself, Ctrl-f opens this window too."], { aliases: ["q:", ":history"] });
  C("cmdline-word", "Command line", "Ctrl-r Ctrl-w", "Put the word under the cursor on the command line", "While typing a command, inserts the word under the cursor.", ["command line word", "insert word into command", "c_ctrl-r ctrl-w"], ["Ctrl-r Ctrl-a inserts the WORD. Ctrl-r Ctrl-f inserts the file name under the cursor."], { mode: "Command" });

  C("toggle-fold", "Folds", "za", "Toggle a fold", "Opens the fold under the cursor, or closes it if it is open.", ["fold", "toggle fold", "collapse", "expand", "za"], ["zo opens a fold. zc closes it. zR opens every fold. zM closes every fold.", "zf{motion} creates a fold. zfip folds a paragraph."], { card: true, aliases: ["za", "zo", "zc"] });
  C("open-folds", "Folds", "zR", "Open every fold", "Opens all folds in the window.", ["open all folds", "expand all", "unfold all", "zR"], ["zr opens them one level. zM closes every fold. zm closes one level."], { aliases: ["zR", "zr"] });
  C("close-folds", "Folds", "zM", "Close every fold", "Closes all folds in the window.", ["close all folds", "collapse all", "fold all", "zM"], [], { aliases: ["zM", "zm"] });
  C("create-fold", "Folds", "zf", "Create a fold", "zf then a motion folds that text. In visual mode, zf folds the selection.", ["create fold", "make fold", "new fold", "zf", "fold paragraph"], ["zfip folds the paragraph.", "zd deletes the fold under the cursor. zE deletes every fold in the window.", "These manual folds last until you change the fold method or close the window, unless you save the view."], { aliases: ["zf", "zfip"] });
  C("folding-off", "Folds", "zi", "Turn folding on or off", "Toggles whether folds are used in this window.", ["disable folds", "enable folds", "folding off", "zi"], []);
  C("fold-method", "Folds", ":set foldmethod=indent", "Choose how folds are made", "Sets the fold method. indent folds by indent. syntax, marker, expr, diff, and manual are the other choices.", ["fold method", "fold by indent", "fold by syntax", "foldmethod", "how folds work"], ["manual folds are the ones you make with zf.", "marker folds use {{{ and }}} in the file."], { mode: "Command", aliases: [":set foldmethod"] });
  C("save-view", "Folds", ":mkview", "Save folds and the window layout", "Writes the current view, including manual folds, so :loadview can restore it.", ["save folds", "remember folds", "save view", "loadview", "session folds"], [":loadview restores the view for this file."], { mode: "Command", aliases: [":mkview", ":loadview"] });

  C("next-error", "Build and diff", ":cn", "Go to the next error", "Jumps to the next entry in the quickfix list.", ["next error", "next result", "quickfix next", "cnext"], [":cp goes to the previous one. :cfirst and :clast go to the ends.", ":copen shows the list. :cclose hides it."], { mode: "Command", aliases: [":cn", ":cnext", ":cp", ":cprev"] });
  C("error-list", "Build and diff", ":copen", "Show the error list", "Opens the quickfix window.", ["error list", "quickfix", "show errors", "copen", "location list"], [":cclose closes it. :lopen is the window-local location list, which :lvimgrep fills.", ":cnext walks the quickfix list. :lnext walks the location list."], { mode: "Command", aliases: [":copen", ":cclose", ":lopen", ":lnext"] });
  C("make", "Build and diff", ":make", "Run make and jump to errors", "Runs makeprg, usually make, and fills the quickfix list from the output.", ["make", "compile", "build", "run make"], ["The error format has to match the compiler output. :cn jumps to the next error."], { mode: "Command", aliases: [":make", ":mak"] });
  C("vimgrep", "Build and diff", ":vimgrep", "Search files with a Vim pattern", "Searches files and fills the quickfix list.", ["find in files", "search project", "vimgrep", "grep files", "search codebase"], [":vimgrep /pattern/ **/*.js searches those files. Then :copen shows the hits.", "Vim patterns are not shell grep patterns. :grep uses the external grepprg instead, which may be grep or something you configured.", ":lvimgrep fills the location list so it does not replace the quickfix list."], { mode: "Command", aliases: [":vimgrep", ":lvimgrep", ":grep"], indexDisplayKey: false });
  C("quickfix-do", "Build and diff", ":cdo", "Run a command on every quickfix entry", "Runs an ex command in each file in the quickfix list.", ["cdo", "each error", "each search hit", "bufdo", "argdo", "all files"], [":cdo %s/old/new/ge | update replaces in each quickfix file and writes it.", ":bufdo walks every buffer. :argdo walks the argument list. :windo walks windows."], { mode: "Command", aliases: [":cdo", ":bufdo", ":argdo", ":windo"] });
  C("diff-start", "Build and diff", ":diffsplit", "Diff this file against another", "Opens another file and shows the two buffers as a diff.", ["diff", "vimdiff", "compare files", "diffsplit", "two files", "diff two files", "compare two files"], [":diffthis marks the current window for diffing if both windows are already open. :diffoff turns it off.", ":diffupdate refreshes the highlighting."], { mode: "Command", aliases: [":diffsplit", ":diffthis", ":diffs"] });
  C("diff-off", "Build and diff", ":diffoff", "Turn diff mode off", "Leaves diff mode in this window.", ["end diff", "stop diff", "diffoff"], [":diffoff! turns it off in every window."], { mode: "Command" });
  C("diff-next", "Build and diff", "]c", "Go to the next diff hunk", "Moves to the next change in diff mode.", ["next diff", "next hunk", "next change diff", "diff next"], ["[c moves to the previous hunk."], { aliases: ["]c", "[c"] });
  C("diff-get", "Build and diff", "do", "Take the change from the other file", "In diff mode, replaces this hunk with the version from the other window.", ["diff get", "take other", "get from other", "accept incoming", "merge change", "merge conflict", "conflict", "resolve conflict"], ["dp puts this hunk into the other window.", "In a three-way diff, :diffget //2 and :diffget //3 name the other two buffers. Which one is which depends on how the diff was opened."], { aliases: ["do", ":diffget"] });
  C("diff-put", "Build and diff", "dp", "Put this change into the other file", "In diff mode, copies this hunk into the other window.", ["diff put", "put to other", "send change", "push hunk"], [], { aliases: ["dp", ":diffput"] });
  C("spell-on", "Build and diff", ":set spell", "Turn spell checking on", "Marks words that are not in the spell file.", ["spell", "spellcheck", "spelling", "spell check"], [":set spelllang=en_us chooses the language. :set nospell turns it off.", "]s jumps to the next bad word. z= shows suggestions."], { mode: "Command", aliases: [":set spell", ":set spelllang=en_us", ":set nospell"] });
  C("spell-next", "Build and diff", "]s", "Go to the next misspelling", "Moves to the next word the spell checker marks.", ["next misspelling", "next spelling", "bad word", "spell next"], ["[s moves to the previous one. ]S skips rare words and words from another region."], { aliases: ["]s", "[s"] });
  C("spell-fix", "Build and diff", "z=", "Show spelling suggestions", "Lists replacements for the word under the cursor. Type a number and press Enter.", ["spell suggestion", "spell fix", "spelling suggestion", "correct spelling"], ["zg marks the word as good. zw marks it as bad. zug and zuw undo those."], { aliases: ["z="] });
  C("spell-good", "Build and diff", "zg", "Mark a word as spelled correctly", "Adds the word under the cursor to the spell file as a good word.", ["add word", "good word", "spell good", "learn word", "dictionary add"], ["zw marks it as a bad word. zug removes a word you added with zg."], { aliases: ["zg", "zw", "zug"] });

  C("line-numbers", "Settings", ":set number", "Show line numbers", "Shows the line number of every line.", ["line numbers", "show numbers", "number", "nu", "gutter numbers"], [":set nonumber hides them. :set number! toggles them.", ":set relativenumber shows distances from the cursor instead."], { card: true, mode: "Command", aliases: [":set number", ":set nu", ":set nonumber", ":set number!"] });
  C("relative-numbers", "Settings", ":set relativenumber", "Show relative line numbers", "Shows how many lines away each line is from the cursor.", ["relative line numbers", "relative numbers", "rnu", "distance"], [":set number relativenumber shows the real number on the current line and relative numbers on the others."], { mode: "Command", aliases: [":set relativenumber", ":set rnu"] });
  C("hybrid-numbers", "Settings", ":set number relativenumber", "Show the current line number and relative numbers", "The cursor line keeps its real number. The other lines show the distance.", ["hybrid line numbers", "both numbers", "relative and absolute"], [], { mode: "Command" });
  C("spaces", "Settings", ":set expandtab shiftwidth=4", "Use spaces for indent", "Makes Tab and >> insert spaces. shiftwidth is how many.", ["spaces", "spaces instead of tabs", "expandtab", "soft tabs", "4 spaces", "indent width"], ["Set tabstop and softtabstop to the same width when you want Tab, backspace, and indent to agree.", ":set noexpandtab goes back to real tab characters.", ":retab rewrites the existing indent to match. It changes the buffer."], { mode: "Command", aliases: [":set expandtab", ":set shiftwidth", ":set tabstop", ":set softtabstop", ":set noexpandtab"] });
  C("retab", "Settings", ":retab", "Rewrite tabs and spaces to match the settings", "Converts existing indent between tabs and spaces using expandtab, tabstop, and shiftwidth.", ["retab", "convert tabs", "tabs to spaces", "spaces to tabs"], ["This rewrites the buffer. Look at the diff before you write the file."], { mode: "Command" });
  C("show-whitespace", "Settings", ":set list", "Show tabs, trailing spaces, and line endings", "Draws invisible characters so you can see them.", ["show whitespace", "show tabs", "show trailing spaces", "invisible characters", "listchars"], [":set list! toggles it.", ":set listchars=tab:>-,trail:· chooses the glyphs. The default already shows tabs and trailing spaces."], { mode: "Command", aliases: [":set list", ":set list!"] });
  C("wrap", "Settings", ":set wrap", "Wrap long lines on the screen", "Draws long lines on more than one row. The file still contains one line.", ["wrap", "soft wrap", "line wrap", "wrap lines"], [":set nowrap turns that off and you scroll sideways instead.", ":set linebreak wraps at a word boundary.", "gj and gk move by screen row while wrap is on."], { mode: "Command", aliases: [":set wrap", ":set nowrap", ":set linebreak"] });
  C("color-column", "Settings", ":set colorcolumn=80", "Show a column guide", "Draws a marker at the column you name.", ["color column", "80 columns", "line length", "ruler column", "right margin"], [":set colorcolumn=80,120 shows two. :set colorcolumn= empties it."], { mode: "Command", aliases: [":set colorcolumn"] });
  C("scroll-margin", "Settings", ":set scrolloff=8", "Keep context above and below the cursor", "Scrolls early so eight lines stay visible above and below the cursor when they exist.", ["scrolloff", "scroll margin", "keep lines above cursor", "context lines"], [":set sidescrolloff does this for horizontal scrolling."], { mode: "Command", aliases: [":set scrolloff"] });
  C("cursor-line", "Settings", ":set cursorline", "Highlight the cursor line", "Draws the current line in the cursor-line color.", ["cursor line", "highlight line", "current line highlight"], [":set cursorline! toggles it."], { mode: "Command", aliases: [":set cursorline"] });
  C("mouse", "Settings", ":set mouse=a", "Let the mouse move the cursor and select", "Enables the mouse in normal, visual, insert, and command-line modes.", ["mouse", "click", "trackpad", "select with mouse"], ["A terminal has to pass mouse events through. :set mouse= turns the mouse off."], { mode: "Command", aliases: [":set mouse=a", ":set mouse="] });
  C("hidden-buffers", "Settings", ":set hidden", "Leave a changed buffer without writing it", "Lets you switch buffers while a buffer still has unsaved changes.", ["hidden", "switch buffer without saving", "unsaved buffer", "hidden buffers"], ["The changes are still in the buffer. They are not saved until :w. :ls shows a + on a changed buffer."], { mode: "Command", aliases: [":set hidden"] });
  C("persistent-undo", "Settings", ":set undofile", "Keep undo history after the file is closed", "Writes undo history so the next session can still undo.", ["persistent undo", "undo after close", "undofile", "undo file"], ["Vim has to be able to write the undo file. :set undodir=~/.vim/undo points it at a directory that exists.", "This is off by default in stock Vim and stock Neovim."], { mode: "Command", aliases: [":set undofile", ":set undodir"] });
  C("paste-mode", "Settings", ":set paste", "Paste into terminal Vim without the indent fighting you", "Turns off indent and mappings so a pasted block stays as copied.", ["paste mode", "bracketed paste", "paste without indent", "set paste"], ["Turn it off with :set nopaste after the paste.", "Neovim does not have this option. It uses bracketed paste instead."], { mode: "Command", badge: "Vim", aliases: [":set paste", ":set nopaste"] });
  C("syntax", "Settings", ":syntax on", "Turn syntax highlighting on", "Colors the buffer using the syntax rules for the file type.", ["syntax", "syntax highlighting", "colors", "highlight code"], [":syntax off turns it off. :set filetype=python forces a file type."], { mode: "Command", aliases: [":syntax on", ":syntax off"] });
  C("filetype", "Settings", ":set filetype=", "Set the file type", "Sets filetype, which chooses indent, syntax, and plugins for that language.", ["file type", "filetype", "set syntax language", "force python"], [":filetype detect runs detection again."], { mode: "Command", aliases: [":set filetype", ":filetype detect"], indexDisplayKey: false });
  C("colorscheme", "Settings", ":colorscheme", "Change the color scheme", "Loads a color scheme. Tab lists the names Vim can find.", ["colorscheme", "color scheme", "theme", "colours"], [], { mode: "Command", aliases: [":colorscheme", ":colo"], indexDisplayKey: false });
  C("toggle-option", "Settings", ":set number!", "Toggle a boolean option", "A ! after a boolean option flips it.", ["toggle option", "toggle setting", "invert option", "bang set"], [":set invnumber does the same. :set number? prints the current value."], { mode: "Command", aliases: [":set"] });
  C("show-option", "Settings", ":set number?", "Show one option", "Prints the value of an option.", ["show option", "print setting", "what is number", "query option"], [":set with no name shows options that differ from the default.", ":options opens a window of options you can change."], { mode: "Command", aliases: [":set?", ":options"] });
  C("where-option", "Settings", ":verbose set shiftwidth?", "Show where an option was set", "Prints the value and the script or command that last set it.", ["where set", "who set this", "verbose set", "option source"], [":verbose nmap <keys> does the same for a mapping."], { mode: "Command", aliases: [":verbose set"] });
  C("wildmenu", "Settings", ":set wildmenu", "Complete commands with a menu", "Shows command-line completion matches as you press Tab.", ["wildmenu", "tab complete commands", "command completion", "wildmode"], ["Ctrl-d on the command line lists the matches.", ":set wildmode=longest:full,full completes the shared part first, then cycles full matches."], { mode: "Command", aliases: [":set wildmenu", ":set wildmode"] });
  C("showmatch-option", "Settings", ":set showmatch", "Flash the matching bracket as you type", "Briefly jumps to the partner when you type a closing bracket.", ["showmatch", "flash bracket", "matching paren as you type"], [], { mode: "Command", aliases: [":set showmatch"] });
  C("leader", "Settings", "<leader>", "The leader key", "Many mappings start with the leader. The default leader is backslash.", ["leader", "leader key", "backslash", "mapleader", "prefix key"], ["A vimrc sets it with let mapleader = \" \" before the mappings that use it.", ":echo exists('g:mapleader') ? g:mapleader : '\\' shows the current leader."], { indexDisplayKey: false });
  C("show-mapping", "Settings", ":verbose nmap", "See what a key runs", "Shows the normal-mode mapping for a key, and where it was defined.", ["mapping", "what key", "what does this key do", "see mapping", "keymap", "verbose nmap"], [":nmap lists normal mappings. :imap lists insert mappings. :vmap lists visual mappings.", ":nunmap <keys> removes a normal mapping."], { mode: "Command", aliases: [":nmap", ":imap", ":vmap", ":verbose nmap"], indexDisplayKey: false });
  C("map-key", "Settings", ":nnoremap", "Map a key without recursion", "Binds a key sequence in normal mode. nnoremap does not expand the right-hand side as another mapping.", ["nnoremap", "map a key", "remap", "bind key", "key binding"], [":inoremap is the insert-mode version. :vnoremap is visual mode.", "Prefer nnoremap over nmap so the right-hand side cannot call itself."], { mode: "Command", aliases: [":nnoremap", ":inoremap", ":vnoremap"] });
  C("inccommand", "Settings", ":set inccommand=nosplit", "Preview a substitute as you type it", "Shows the :s replacement in the buffer while the command line is still open.", ["preview replace", "live substitute", "inccommand", "substitute preview"], ["This is a Neovim option. Vim does not have it.", "split opens the preview in a separate window. nosplit updates the buffer in place."], { mode: "Command", badge: "Neovim", aliases: [":set inccommand"] });
  C("comment-gap", "Settings", "", "Comment a line", "Stock Vim has no command that comments or uncomments code.", ["comment", "uncomment", "comment out", "toggle comment", "remark", "disable line", "gc", "commentary"], ["Select a column with Ctrl-v, press I, type the comment leader, then Escape. That inserts the leader on each selected line.", "Select that same column later and press x to delete it.", "A comment toggle such as gc comes from a plugin. It is not a built-in key."], { indexDisplayKey: false });
  C("surround-gap", "Settings", "", "Change the quotes or brackets around text", "Stock Vim has no command that changes the surrounding marks and leaves the inside.", ["surround", "wrap", "wrap in quotes", "change quotes", "change brackets", "enclose", "cs", "vim-surround", "sandwich"], ["ci\" changes the text inside the quotes and leaves the quote marks. ca\" deletes the marks as well.", "Changing \" into ' around existing text is what a surround plugin is for. In stock Vim, a substitute on the line such as :s/\"/'/g changes every double quote on that line."], { indexDisplayKey: false });

  C("help", "Command line", ":h", "Open help", "Opens the help for a topic. :h alone opens the help home.", ["help", "documentation", "manual", "how does", "explain command"], [":h dd opens the help for dd. :h :w opens the help for :w. Tab completes help tags.", "Help opens in a split. Ctrl-w c closes that window.", "Ctrl-] follows a tag in the help, and Ctrl-t or Ctrl-o goes back."], { card: true, mode: "Command", aliases: [":h", ":help"], indexDisplayKey: false });
  C("helpgrep", "Command line", ":helpgrep", "Search the help files", "Searches every help file and fills the quickfix list.", ["search help", "helpgrep", "find in documentation"], [":copen shows the hits after it finishes."], { mode: "Command", aliases: [":helpgrep", ":helpg"], indexDisplayKey: false });
  C("blank-lines", "Command line", ":g/^\\s*$/d", "Delete blank lines", "Deletes every line that is empty or contains only whitespace.", ["delete blank lines", "remove empty lines", "delete empty lines", "strip blank lines"], [":g/pattern/d deletes every line that matches. :v/pattern/d deletes every line that does not match.", "A dot in a pattern matches any character. Anchor with ^ and $ when you mean a whole line."], { mode: "Command", aliases: [":g/^\\s*$/d"] });
  C("global-delete", "Command line", ":g/pattern/d", "Delete lines that contain a match", "Deletes every line matching the pattern.", ["delete lines containing", "delete matching lines", "remove lines with", "global delete"], ["The command after g can be something other than delete. :g/pattern/m$ moves matching lines to the end.", ":g/pattern/normal @a runs a macro on each matching line."], { mode: "Command", indexDisplayKey: false, aliases: [":g", ":global"] });
  C("global-keep", "Command line", ":v/pattern/d", "Delete lines that do not contain a match", "Keeps the matching lines and deletes the rest.", ["keep lines", "delete lines that do not", "inverse global", "vglobal", "filter lines"], [":v is :g with the match inverted."], { mode: "Command", indexDisplayKey: false, aliases: [":v", ":vglobal"] });
  C("trailing-space", "Command line", ":%s/\\s\\+$//e", "Remove trailing whitespace", "Deletes spaces and tabs at the end of every line.", ["trailing whitespace", "trailing spaces", "trailing space", "strip trailing", "trim lines", "remove end spaces"], ["The e flag keeps the command quiet when there is nothing to remove."], { mode: "Command" });
  C("sort-lines", "Command line", ":sort", "Sort lines", "Sorts the buffer, or the selected lines if you press : from visual mode.", ["sort", "sort lines", "alphabetical", "order lines", "unique", "sort unique", "dedupe", "distinct lines"], [":sort! sorts in reverse. :sort u sorts and keeps one copy of each line. :sort n sorts by number. :sort i ignores case.", "This is Vim's sort, not an external program."], { mode: "Command", aliases: [":sort", ":sort!", ":sort u", ":sort n"] });
  C("filter-buffer", "Command line", ":%!", "Run the buffer through a shell command", "Replaces the buffer, or a range, with the command's output.", ["filter", "pipe buffer", "external command", "shell filter", "format with command"], ["A motion version exists too: !ip then a command filters the paragraph.", ":w !command sends the buffer to a command without replacing the buffer."], { mode: "Command", aliases: [":%!", "!{motion}"] });
  C("shell", "Command line", ":!", "Run a shell command", "Runs a command and shows the output. The buffer stays as it is.", ["shell", "run command", "bang", "terminal command", "external"], [":r !command inserts the output on the line below the cursor."], { mode: "Command", aliases: [":!", ":r !"] });
  C("range", "Command line", ":10,20", "Run a command on specific lines", "A range before a command limits it to those lines.", ["range", "line range", "between lines", "specific lines", "from line to line"], [":10,20d deletes lines 10 through 20. :.,$d deletes from the current line to the end. :%d deletes every line.", "From visual mode, : inserts '<,'>, which is the selected line range.", ". is the current line. $ is the last line. +3 is three lines down."], { mode: "Command", indexDisplayKey: false, aliases: [":10,20", ":%"] });
  C("edit-vimrc", "Command line", ":e $MYVIMRC", "Open your vimrc", "Edits the startup file Vim is using.", ["vimrc", "config", "configuration", "edit vimrc", "init.vim", "init.lua"], ["Neovim reads init.lua or init.vim. $MYVIMRC is set when a vimrc was loaded.", ":source $MYVIMRC reloads a vimrc. An init.lua is reloaded with :source $MYVIMRC as well when that variable points at it."], { mode: "Command", aliases: [":e $MYVIMRC"] });
  C("source-vimrc", "Command line", ":source $MYVIMRC", "Reload your vimrc", "Runs the startup file again in this session.", ["reload vimrc", "source vimrc", "reload config", "apply vimrc"], [":source % runs the file you are editing."], { mode: "Command", aliases: [":source $MYVIMRC", ":source %", ":so"] });
  C("session", "Command line", ":mksession", "Save the session", "Writes a script that restores the windows, tabs, and files.", ["session", "save session", "restore session", "mksession", "workspace"], [":mksession! Session.vim overwrites that file. :source Session.vim loads it.", "From the shell, vim -S Session.vim opens that session."], { mode: "Command", aliases: [":mksession", ":source"] });
  C("terminal", "Command line", ":terminal", "Open a terminal", "Opens a shell in a window.", ["terminal", "shell window", "term", "console"], ["The shell gets the keys. Ctrl-\\ Ctrl-n returns to normal mode so you can move, copy, and switch windows.", "In Vim you can also press Ctrl-w N. Press i to go back to the shell."], { mode: "Command", aliases: [":terminal", ":term"] });
  C("leave-terminal", "Command line", "Ctrl-\\ Ctrl-n", "Leave terminal mode", "Returns from the shell window to normal mode.", ["exit terminal", "terminal normal", "leave shell", "ctrl backslash n", "stop terminal"], ["This does not close the shell. i or a goes back to typing in the shell.", "Exit the shell itself with the shell's exit command."], { mode: "Insert", aliases: ["Ctrl-\\ Ctrl-n", "Ctrl-w N"] });
  C("man-page", "Command line", "K", "Look up the word under the cursor", "Runs keywordprg on the word under the cursor. The default is man.", ["man page", "keyword", "lookup", "documentation word", "K"], [":Man ls opens a man page in a buffer when the man plugin is loaded. That plugin ships with Vim's runtime."], { aliases: [":Man"] });
  C("char-info", "Command line", "ga", "Show the code for this character", "Shows the decimal, hexadecimal, and octal value of the character under the cursor.", ["character code", "ascii", "unicode", "codepoint", "ga", "digraph value"], ["g8 shows the UTF-8 bytes of the character."], { aliases: ["ga", "g8"] });
  C("word-count", "Command line", "g Ctrl-g", "Count words, bytes, and characters", "Shows the cursor position and the word, character, and byte counts.", ["word count", "character count", "byte count", "file stats", "wc"], ["Ctrl-g shows the file name and position. A count before Ctrl-g shows the full path."], { aliases: ["g Ctrl-g"] });
  C("redraw", "Command line", "Ctrl-l", "Redraw the screen", "Clears a garbled screen and draws the window again.", ["redraw", "refresh screen", "clear screen", "ctrl-l"], ["This does not clear the search highlight. :noh does that."]);
  C("suspend", "Command line", "Ctrl-z", "Suspend Vim and return to the shell", "In a terminal, stops Vim and gives you the shell. fg brings Vim back.", ["suspend", "background", "ctrl-z", "job control", "fg"], ["This is not undo. Undo is u.", "A GUI build may ignore this key."]);
  C("abbreviation", "Command line", ":iabbrev", "Expand an abbreviation as you type", "Defines a short word that becomes a longer one when you type it in insert mode.", ["abbreviation", "abbrev", "snippet text", "iabbrev", "expand word"], [":iabbrev adn and makes adn become and when you press space or escape after it.", "Ctrl-c leaves insert mode without expanding an abbreviation."], { mode: "Command", aliases: [":iabbrev", ":iab"] });
  C("rot13", "Edit", "g??", "ROT13 the line", "Applies ROT13 to the current line.", ["rot13", "rotate letters"], ["g?{motion} does it to a motion. This is a novelty operator, not a case change. Use gU, gu, or ~ for case."], { aliases: ["g??", "g?"] });
  C("virtualedit", "Settings", ":set virtualedit=all", "Move the cursor past the end of the line", "Lets the cursor sit where there is no character yet.", ["virtualedit", "cursor past end", "click past end", "virtual space"], [":set virtualedit= turns it off."], { mode: "Command", aliases: [":set virtualedit"] });

  const verbs = [
    { id: "d", keys: "d", name: "Delete", mode: "Normal", find: ["delete", "remove", "cut", "erase", "kill", "drop"], why: (label) => "Deletes " + label + "." },
    { id: "c", keys: "c", name: "Change", mode: "Normal", find: ["change", "replace", "rewrite", "retype", "edit", "overwrite"], why: (label) => "Deletes " + label + ", then leaves you typing the replacement." },
    { id: "y", keys: "y", name: "Copy", mode: "Normal", find: ["copy", "yank", "duplicate"], why: (label) => "Copies " + label + "." },
    { id: "v", keys: "v", name: "Select", mode: "Visual", find: ["select", "selection", "visual"], why: (label) => "Selects " + label + "." },
    { id: "gu", keys: "gu", name: "Lowercase", mode: "Normal", find: ["lowercase", "downcase", "lower case", "small letters"], why: (label) => "Makes " + label + " lowercase." },
    { id: "gU", keys: "gU", name: "Uppercase", mode: "Normal", find: ["uppercase", "upper case", "capitalize", "all caps"], why: (label) => "Makes " + label + " uppercase." },
    { id: "g~", keys: "g~", name: "Toggle case of", mode: "Normal", find: ["toggle case", "swap case", "invert case"], why: (label) => "Swaps the case of " + label + "." }
  ];

  const forms = [
    { id: "inner", name: "inside", words: ["inside", "inner", "within", "between", "contents", "content"], pick: (object) => object.inner, aliases: (object) => object.innerAliases, label: (object) => object.innerLabel },
    { id: "around", name: "around", words: ["around", "surrounding", "outer", "including", "whole"], pick: (object) => object.around, aliases: (object) => object.aroundAliases, label: (object) => object.aroundLabel }
  ];

  const objects = [
    {
      id: "word",
      inner: "iw",
      around: "aw",
      innerAliases: ["iw"],
      aroundAliases: ["aw"],
      titleNoun: "a word",
      innerLabel: "only the word under the cursor, not the space around it",
      aroundLabel: "the word under the cursor and the space beside it",
      words: ["word", "words"],
      phrases: ["a word", "the word", "word"],
      notes: ["The cursor can sit anywhere on the word. A word is letters, digits, and underscores, plus the characters in iskeyword."],
      aroundNotes: ["If the word is at the end of the line, the space before it is used, because there is no space after it."]
    },
    {
      id: "big-word",
      inner: "iW",
      around: "aW",
      innerAliases: ["iW"],
      aroundAliases: ["aW"],
      titleNoun: "a big WORD",
      innerLabel: "only the WORD under the cursor",
      aroundLabel: "the WORD under the cursor and the space beside it",
      words: ["word", "bigword", "punctuation", "nonblank"],
      phrases: ["a WORD", "a big word", "punctuation"],
      notes: ["A WORD is a run of characters that are not spaces. Punctuation stays attached, which is what you want for a path or a URL."],
      aroundNotes: ["If this is the last WORD on the line, the space before it is used."]
    },
    {
      id: "dquote",
      inner: "i\"",
      around: "a\"",
      innerAliases: ["i\""],
      aroundAliases: ["a\""],
      titleNoun: "double quotes",
      innerLabel: "the text between the double quotes on this line",
      aroundLabel: "the double quotes on this line and the text between them",
      words: ["quote", "quotes", "double", "string", "strings", "quotation", "brackets"],
      phrases: ["double quotes", "quotes", "a string", "quotation marks"],
      notes: ["Vim looks for the quotes on the current line. The cursor can be on either quote or between them. The quotes have to be on one line."]
    },
    {
      id: "squote",
      inner: "i'",
      around: "a'",
      innerAliases: ["i'"],
      aroundAliases: ["a'"],
      titleNoun: "single quotes",
      innerLabel: "the text between the single quotes on this line",
      aroundLabel: "the single quotes on this line and the text between them",
      words: ["quote", "quotes", "single", "apostrophe", "string"],
      phrases: ["single quotes", "apostrophes", "single quote"],
      notes: ["Vim looks for the quotes on the current line. They do not span lines."]
    },
    {
      id: "tick",
      inner: "i`",
      around: "a`",
      innerAliases: ["i`"],
      aroundAliases: ["a`"],
      titleNoun: "backticks",
      innerLabel: "the text between the backticks on this line",
      aroundLabel: "the backticks on this line and the text between them",
      words: ["backtick", "backticks", "grave", "code span"],
      phrases: ["backticks", "back ticks", "graves"],
      notes: ["Vim looks for the backticks on the current line."]
    },
    {
      id: "paren",
      inner: "i(",
      around: "a(",
      innerAliases: ["i(", "i)", "ib"],
      aroundAliases: ["a(", "a)", "ab"],
      titleNoun: "parentheses",
      innerLabel: "the text inside the parentheses",
      aroundLabel: "the parentheses and the text inside them",
      words: ["parentheses", "parenthesis", "paren", "parens", "round", "brackets"],
      phrases: ["parentheses", "parens", "parenthesis", "round brackets"],
      notes: ["Put the cursor inside the pair or on one of the parentheses. i), ib, and i( are the same. a), ab, and a( are the same."]
    },
    {
      id: "bracket",
      inner: "i[",
      around: "a[",
      innerAliases: ["i[", "i]"],
      aroundAliases: ["a[", "a]"],
      titleNoun: "square brackets",
      innerLabel: "the text inside the square brackets",
      aroundLabel: "the square brackets and the text inside them",
      words: ["bracket", "brackets", "square"],
      phrases: ["square brackets", "brackets"],
      notes: ["Put the cursor inside the pair or on a bracket. i] is the same as i[."]
    },
    {
      id: "brace",
      inner: "i{",
      around: "a{",
      innerAliases: ["i{", "i}", "iB"],
      aroundAliases: ["a{", "a}", "aB"],
      titleNoun: "braces",
      innerLabel: "the text inside the braces",
      aroundLabel: "the braces and the text inside them",
      words: ["brace", "braces", "curly", "squiggly", "squiggle"],
      phrases: ["braces", "curly braces", "curly brackets"],
      notes: ["Put the cursor inside the pair or on a brace. i} and iB are the same as i{. a} and aB are the same as a{."]
    },
    {
      id: "angle",
      inner: "i<",
      around: "a<",
      innerAliases: ["i<", "i>"],
      aroundAliases: ["a<", "a>"],
      titleNoun: "angle brackets",
      innerLabel: "the text inside the angle brackets",
      aroundLabel: "the angle brackets and the text inside them",
      words: ["angle", "angles", "chevron", "chevrons"],
      phrases: ["angle brackets", "chevrons"],
      notes: ["These are < and >. For an HTML tag, including its name, use it and at."]
    },
    {
      id: "tag",
      inner: "it",
      around: "at",
      innerAliases: ["it"],
      aroundAliases: ["at"],
      titleNoun: "an HTML tag",
      innerLabel: "the text inside the HTML or XML tag",
      aroundLabel: "the HTML or XML tag and the text inside it",
      words: ["tag", "html", "xml", "element", "div"],
      phrases: ["a tag", "an html tag", "the tag", "an element"],
      notes: ["The tag is the one that encloses the cursor. Around includes the opening and closing tags. Inside leaves the tags in place."]
    },
    {
      id: "sentence",
      inner: "is",
      around: "as",
      innerAliases: ["is"],
      aroundAliases: ["as"],
      titleNoun: "a sentence",
      innerLabel: "the sentence",
      aroundLabel: "the sentence and the space after it",
      words: ["sentence", "sentences"],
      phrases: ["a sentence", "the sentence"],
      notes: ["A sentence ends at a period, exclamation mark, or question mark followed by whitespace."]
    },
    {
      id: "paragraph",
      inner: "ip",
      around: "ap",
      innerAliases: ["ip"],
      aroundAliases: ["ap"],
      titleNoun: "a paragraph",
      innerLabel: "the paragraph",
      aroundLabel: "the paragraph and the blank line beside it",
      words: ["paragraph", "paragraphs"],
      phrases: ["a paragraph", "the paragraph"],
      notes: ["A paragraph is a block of text separated by blank lines. Put the cursor inside it."]
    }
  ];

  const featured = {
    daw: {
      rank: 10,
      title: "Delete a word",
      why: "Deletes the word under the cursor and the space beside it.",
      find: ["delete word", "remove word", "cut word", "erase word"]
    },
    ciw: {
      rank: 20,
      title: "Change a word",
      why: "Deletes the whole word and leaves you typing, wherever the cursor sits in the word.",
      find: ["change word", "replace word", "edit word", "rename word", "retype word"]
    },
    "ci\"": {
      rank: 30,
      title: "Change inside quotes",
      why: "Deletes the text between the double quotes and leaves you typing. The quotes stay.",
      find: ["change inside quotes", "replace inside quotes", "edit string", "change string"]
    },
    "di(": {
      rank: 40,
      title: "Delete inside parentheses",
      why: "Deletes the text inside the parentheses and leaves the parentheses.",
      find: ["delete inside parentheses", "delete inside parens", "clear parentheses", "empty parens"]
    },
    vip: {
      rank: 50,
      title: "Select a paragraph",
      why: "Selects the paragraph under the cursor.",
      find: ["select paragraph", "highlight paragraph", "visual paragraph"]
    }
  };

  verbs.forEach((verb) => {
    forms.forEach((form) => {
      objects.forEach((object) => {
        const objectKey = form.pick(object);
        const keys = verb.keys + objectKey;
        const aliasList = form.aliases(object).map((alias) => verb.keys + alias);
        const phrases = [];
        verb.find.forEach((verbWord) => {
          form.words.forEach((formWord) => {
            object.phrases.forEach((phrase) => {
              phrases.push(verbWord + " " + formWord + " " + phrase);
            });
          });
          if (form.id === "inner") {
            object.phrases.forEach((phrase) => {
              if (phrase.indexOf("big") === -1 && phrase.indexOf("WORD") === -1) {
                phrases.push(verbWord + " " + phrase);
              }
            });
          }
        });
        object.phrases.forEach((phrase) => {
          phrases.push(form.name + " " + phrase);
        });
        const notes = (object.notes || []).slice();
        if (form.id === "around" && object.aroundNotes) {
          object.aroundNotes.forEach((note) => notes.push(note));
        }
        const extras = aliasList.filter((alias) => alias !== keys);
        if (extras.length) {
          notes.push("Same command: " + extras.join(", ") + ".");
        }
        const entry = {
          id: verb.id + "-" + form.id + "-" + object.id,
          cat: "Text objects",
          keys: keys,
          title: verb.name + " " + form.name + " " + object.titleNoun,
          why: verb.why(form.label(object)),
          mode: verb.mode,
          notes: notes,
          find: verb.find.concat(form.words, object.words, object.phrases, phrases),
          aliases: aliasList,
          card: false,
          badge: "",
          related: [],
          indexDisplayKey: true,
          rank: 80
        };
        const extra = featured[keys];
        if (extra) {
          entry.card = true;
          entry.rank = extra.rank;
          entry.title = extra.title;
          entry.why = extra.why;
          entry.find = entry.find.concat(extra.find || []);
        }
        add(entry);
      });
    });
  });

  const links = {
    undo: ["redo", "undo-line", "repeat-change", "earlier"],
    redo: ["undo", "undo-tree"],
    "delete-line": ["delete-to-end", "delete-char", "black-hole", "paste"],
    "copy-line": ["paste", "clipboard-copy", "duplicate-line", "paste-last-yank"],
    paste: ["paste-before", "clipboard-paste", "copy-line"],
    save: ["save-quit", "save-all", "quit"],
    quit: ["quit-force", "save-quit", "quit-all"],
    "save-quit": ["save", "save-quit-zz", "quit-force"],
    "quit-force": ["quit", "quit-zq", "quit-all-force"],
    "search-forward": ["next-match", "clear-highlight", "replace-file", "search-word"],
    "split-horizontal": ["split-vertical", "window-only", "window-move"],
    "split-vertical": ["split-horizontal", "window-only", "window-move"],
    "record-macro": ["play-macro", "stop-macro", "repeat-macro"],
    "play-macro": ["record-macro", "repeat-macro", "replay-line"],
    "line-numbers": ["relative-numbers", "hybrid-numbers"],
    "file-top": ["file-end"],
    "jump-back": ["jump-forward", "last-change-pos"],
    "clipboard-copy": ["clipboard-paste", "black-hole", "paste-last-yank"]
  };

  Object.keys(links).forEach((id) => {
    const entry = commands.find((item) => item.id === id);
    if (!entry) {
      throw new Error("Missing link source " + id);
    }
    links[id].forEach((target) => {
      if (!ids.has(target)) {
        throw new Error(id + " missing related " + target);
      }
    });
    entry.related = links[id];
  });

  const seenKeys = new Set();
  commands.forEach((entry) => {
    if (!entry.keys) {
      return;
    }
    const token = entry.mode + "\n" + entry.keys;
    if (seenKeys.has(token)) {
      throw new Error("Duplicate keys " + token);
    }
    seenKeys.add(token);
  });

  Object.keys(featured).forEach((key) => {
    if (!commands.some((entry) => entry.keys === key)) {
      throw new Error("Missing featured " + key);
    }
  });

  root.VIM_COMMANDS = commands;
})(typeof window !== "undefined" ? window : globalThis);
