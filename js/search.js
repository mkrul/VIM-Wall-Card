(function (root) {
  const STOP = new Set([
    "a", "an", "the", "to", "of", "on", "for", "and", "or", "my", "me", "can",
    "please", "want", "how", "do", "you", "it", "is", "this", "that", "with",
    "from", "into", "onto", "i"
  ]);

  const CATEGORIES = [
    "Basics",
    "Move",
    "Edit",
    "Text objects",
    "Insert",
    "Visual",
    "Search",
    "Files",
    "Windows and tabs",
    "Marks and jumps",
    "Macros and registers",
    "Folds",
    "Build and diff",
    "Settings",
    "Command line"
  ];

  function tokensOf(text) {
    return String(text || "").toLowerCase().match(/[a-z0-9+]+/g) || [];
  }

  function loose(text) {
    return String(text || "").toLowerCase().split(/\s+/).map((part) => {
      return part.replace(/[^a-z0-9+-]/g, "");
    }).filter((part) => part && !STOP.has(part)).join(" ");
  }

  function expandAliases(entry) {
    const seeds = [];
    if (entry.indexDisplayKey !== false && entry.keys) {
      seeds.push(entry.keys);
    }
    (entry.aliases || []).forEach((alias) => {
      if (alias) {
        seeds.push(alias);
      }
    });
    const out = [];
    seeds.forEach((seed) => {
      out.push(seed);
      if (seed.toLowerCase().indexOf("ctrl") === -1) {
        return;
      }
      const lower = seed.toLowerCase();
      out.push(lower.replace(/ctrl/g, "control"));
      out.push(lower.replace(/ctrl-/g, "c-"));
      out.push(lower.replace(/ctrl-/g, "<c-").replace(/<c-([^>\s]+)/g, "<c-$1>"));
      out.push(lower.replace(/ctrl-/g, "^"));
    });
    return out;
  }

  function prepare(list) {
    return list.map((entry, index) => {
      const aliases = expandAliases(entry);
      const words = new Set();
      [entry.title, entry.cat, entry.badge].concat(entry.find || [], entry.notes || []).forEach((part) => {
        tokensOf(part).forEach((word) => words.add(word));
      });
      if (entry.mode && entry.mode !== "Normal") {
        tokensOf(entry.mode).forEach((word) => words.add(word));
      }
      const catIndex = CATEGORIES.indexOf(entry.cat);
      return Object.assign({}, entry, {
        _aliases: aliases,
        _words: words,
        _titleLoose: loose(entry.title),
        _findLoose: (entry.find || []).map(loose).filter(Boolean),
        _order: index,
        _rank: typeof entry.rank === "number" ? entry.rank : 40,
        _cat: catIndex === -1 ? 80 : catIndex
      });
    });
  }

  function normalizeToken(part) {
    const typed = part.replace(/^control/i, "ctrl").replace(/^ctl/i, "ctrl").replace(/^ctrl/i, "ctrl");
    return { typed: typed, fold: typed.toLowerCase() };
  }

  function parseQuery(raw) {
    const original = String(raw || "").trim().replace(/\s+/g, " ");
    if (!original) {
      return { raw: "", loose: "", tokens: [], caseCompact: "", ctrlQuery: false };
    }
    let tokens = original.split(/\s+/).filter(Boolean).map(normalizeToken);
    const content = tokens.filter((token) => !STOP.has(token.fold));
    if (content.length) {
      tokens = content;
    }
    let caseCompact = original.replace(/\s+/g, "");
    caseCompact = caseCompact.replace(/^control/i, "ctrl").replace(/^ctl/i, "ctrl").replace(/^ctrl/i, "ctrl");
    const ctrlQuery = /^ctrl/i.test(caseCompact);
    if (ctrlQuery) {
      caseCompact = caseCompact.toLowerCase();
    }
    return {
      raw: original.toLowerCase(),
      loose: loose(original),
      tokens: tokens,
      caseCompact: caseCompact,
      ctrlQuery: ctrlQuery,
      original: original
    };
  }

  function aliasHit(alias, token, queryTokenCount) {
    const sensitive = token.typed !== token.fold && token.fold.indexOf("ctrl") !== 0;
    const hay = sensitive ? alias : alias.toLowerCase();
    const needle = sensitive ? token.typed : token.fold;
    const compactHay = hay.replace(/\s+/g, "");
    const compactNeedle = needle.replace(/\s+/g, "");
    if (!compactNeedle) {
      return false;
    }
    if (compactHay.indexOf(compactNeedle) === 0) {
      return true;
    }
    const parts = hay.split(/[^A-Za-z0-9]+/).filter(Boolean);
    if (compactNeedle.length >= 2 && parts.length === 1 && parts[0].length > compactNeedle.length && parts[0].slice(-compactNeedle.length) === compactNeedle) {
      return true;
    }
    for (let index = 0; index < parts.length; index += 1) {
      const part = parts[index];
      const folded = part.toLowerCase();
      const starts = sensitive ? part.indexOf(needle) === 0 : folded.indexOf(compactNeedle) === 0;
      if (!starts) {
        continue;
      }
      if (compactNeedle.length === 1 && part.length === 1 && parts.length > 1 && queryTokenCount < 2) {
        continue;
      }
      return true;
    }
    return false;
  }

  function wordCovers(entry, fold) {
    for (const word of entry._words) {
      if (word.indexOf(fold) === 0) {
        return true;
      }
      if (fold.length >= 5 && fold.charAt(fold.length - 1) === "s") {
        const stem = fold.slice(0, -1);
        if (stem.length >= 4 && word.indexOf(stem) === 0) {
          return true;
        }
      }
    }
    return false;
  }

  function tokenMatches(entry, token, queryTokenCount) {
    const fold = token.fold;
    if (wordCovers(entry, fold)) {
      return true;
    }
    if (fold.indexOf("-") !== -1) {
      const pieces = fold.split("-").filter(Boolean);
      if (pieces.length > 1 && pieces.every((piece) => wordCovers(entry, piece))) {
        return true;
      }
    }
    return entry._aliases.some((alias) => aliasHit(alias, token, queryTokenCount));
  }

  function matches(entry, parsed) {
    return parsed.tokens.every((token) => tokenMatches(entry, token, parsed.tokens.length));
  }

  function score(entry, parsed) {
    const compactQ = parsed.raw.replace(/\s+/g, "");
    const typed = parsed.caseCompact;
    let best = 0;
    const queryIsLower = !parsed.ctrlQuery && typed === typed.toLowerCase();
    entry._aliases.forEach((alias) => {
      const folded = alias.toLowerCase();
      const compact = folded.replace(/\s+/g, "");
      const sensitive = alias.replace(/\s+/g, "");
      const caseAgrees = !queryIsLower || sensitive === sensitive.toLowerCase() || sensitive.indexOf(typed) === 0;
      if ((compact === compactQ || folded === parsed.raw) && caseAgrees) {
        best = Math.max(best, 1000);
      } else if (compact.indexOf(compactQ) === 0 || folded.indexOf(parsed.raw) === 0) {
        best = Math.max(best, 460);
      }
    });
    const caseSeeds = [entry.keys].concat(entry.aliases || []).filter(Boolean).map((seed) => String(seed).replace(/\s+/g, ""));
    const foldedSeeds = caseSeeds.map((seed) => seed.toLowerCase());
    const caseSensitive = !parsed.ctrlQuery && typed !== typed.toLowerCase();
    if (parsed.ctrlQuery) {
      if (typed && foldedSeeds.some((seed) => seed !== typed && seed.indexOf(typed) === 0)) {
        best += 260;
      }
    } else if (caseSensitive && typed && caseSeeds.some((seed) => seed === typed)) {
      best += 800;
    } else if (caseSensitive && typed && caseSeeds.some((seed) => seed.indexOf(typed) === 0)) {
      best += 220;
    }
    if (/[ia]W/.test(String(entry.keys || "")) && parsed.original.indexOf("W") === -1 && parsed.loose.indexOf("big") === -1 && parsed.loose.indexOf("punctuation") === -1) {
      best -= 140;
    }
    if (entry._titleLoose && entry._titleLoose === parsed.loose) {
      best += 740;
    } else if (entry.title.toLowerCase() === parsed.raw) {
      best += 740;
    } else if (entry.title.toLowerCase().indexOf(parsed.raw) === 0) {
      best += 280;
    }
    if (entry._findLoose.some((phrase) => phrase === parsed.loose)) {
      best += 700;
    }
    const titleWords = tokensOf(entry.title);
    let titleHits = 0;
    parsed.tokens.forEach((token) => {
      if (titleWords.some((word) => word.indexOf(token.fold) === 0)) {
        titleHits += 1;
      }
    });
    best += titleHits * 24;
    if (typed && typed === typed.toLowerCase() && caseSeeds.some((seed) => seed.indexOf(typed) === 0)) {
      best += 320;
    }
    if (typed && String(entry.keys || "").replace(/\s+/g, "") === typed + typed.charAt(typed.length - 1)) {
      best += 180;
    }
    if (entry.card) {
      best += 70;
    }
    return best;
  }

  function subsequenceSpan(field, token) {
    let start = -1;
    let index = 0;
    for (let cursor = 0; cursor < field.length && index < token.length; cursor += 1) {
      if (field.charAt(cursor) === token.charAt(index)) {
        if (start < 0) {
          start = cursor;
        }
        index += 1;
        if (index === token.length) {
          return cursor - start;
        }
      }
    }
    return -1;
  }

  function fuzzyScore(entry, parsed) {
    const title = entry.title.toLowerCase();
    const keys = String(entry.keys || "").toLowerCase();
    let score = 0;
    for (let index = 0; index < parsed.tokens.length; index += 1) {
      const token = parsed.tokens[index].fold;
      const titleSpan = subsequenceSpan(title, token);
      const keySpan = subsequenceSpan(keys, token);
      const span = titleSpan < 0 ? keySpan : (keySpan < 0 ? titleSpan : Math.min(titleSpan, keySpan));
      if (span < 0) {
        return -1;
      }
      score += span + (titleSpan < 0 ? 12 : 0);
    }
    return score;
  }

  function operatorRank(keys) {
    const text = String(keys || "");
    if (!text || text.indexOf("-") !== -1 || text.indexOf(":") === 0 || text.indexOf("Ctrl") === 0 || text.indexOf("\"") === 0) {
      return 9;
    }
    if (text.indexOf("gU") === 0) {
      return 5;
    }
    if (text.indexOf("g~") === 0) {
      return 6;
    }
    if (text.indexOf("gu") === 0) {
      return 4;
    }
    const first = text.charAt(0);
    if (first === "d" || first === "D") {
      return 0;
    }
    if (first === "c" || first === "C") {
      return 1;
    }
    if (first === "y" || first === "Y") {
      return 2;
    }
    if (first === "v" || first === "V") {
      return 3;
    }
    return 9;
  }

  function objectRank(keys) {
    const text = String(keys || "");
    if (/^(?:gU|gu|g~|[dcyv])i/.test(text)) {
      return 0;
    }
    if (/^(?:gU|gu|g~|[dcyv])a/.test(text)) {
      return 1;
    }
    return 2;
  }

  function byTitle(a, b) {
    return operatorRank(a.keys) - operatorRank(b.keys) || objectRank(a.keys) - objectRank(b.keys) || a.title.localeCompare(b.title) || String(a.keys).localeCompare(String(b.keys));
  }

  function search(list, text) {
    const parsed = parseQuery(text);
    if (!parsed.raw) {
      const items = list.filter((entry) => entry.card).sort((a, b) => {
        return a._cat - b._cat || a._rank - b._rank || a._order - b._order;
      });
      return { kind: "card", items: items, tokens: [] };
    }
    const hits = [];
    list.forEach((entry) => {
      if (!matches(entry, parsed)) {
        return;
      }
      hits.push({ entry: entry, score: score(entry, parsed) });
    });
    hits.sort((a, b) => b.score - a.score || byTitle(a.entry, b.entry));
    if (hits.length) {
      return { kind: "match", items: hits.map((hit) => hit.entry), tokens: parsed.tokens };
    }
    if (parsed.tokens.some((token) => token.fold.length < 3)) {
      return { kind: "none", items: [], tokens: parsed.tokens };
    }
    const fuzzyHits = [];
    list.forEach((entry) => {
      const span = fuzzyScore(entry, parsed);
      if (span >= 0) {
        fuzzyHits.push({ entry: entry, span: span });
      }
    });
    fuzzyHits.sort((a, b) => a.span - b.span || Number(b.entry.card) - Number(a.entry.card) || byTitle(a.entry, b.entry));
    const fuzzyItems = fuzzyHits.slice(0, 20).map((hit) => hit.entry);
    if (fuzzyItems.length) {
      return { kind: "fuzzy", items: fuzzyItems, tokens: parsed.tokens };
    }
    return { kind: "none", items: [], tokens: parsed.tokens };
  }

  root.VIM_SEARCH = {
    CATEGORIES: CATEGORIES,
    prepare: prepare,
    search: search
  };
})(typeof window !== "undefined" ? window : globalThis);
