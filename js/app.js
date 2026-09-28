(function () {
  const engine = window.VIM_SEARCH;
  const prepared = engine.prepare(window.VIM_COMMANDS || []);

  function cardChannel() {
    return window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.card;
  }

  function render(text) {
    const result = engine.search(prepared, text);
    const count = document.getElementById("count");
    const list = document.getElementById("list");
    const clear = document.getElementById("clear");
    const query = String(text || "").trim();
    if (clear) {
      clear.hidden = !query;
    }
    if (count) {
      if (!prepared.length) {
        count.textContent = "No command list";
      } else if (result.kind === "card") {
        count.textContent = prepared.length + " commands";
      } else if (result.kind === "none") {
        count.textContent = "No matches";
      } else if (result.kind === "fuzzy") {
        count.textContent = result.items.length + " close matches";
      } else {
        count.textContent = result.items.length + (result.items.length === 1 ? " match" : " matches");
      }
    }
    if (!list) {
      return;
    }
    const fragment = document.createDocumentFragment();
    if (result.kind === "fuzzy") {
      fragment.appendChild(banner("No exact match. These are close."));
    }
    if (result.kind === "none") {
      fragment.appendChild(banner("Nothing matches. Try a shorter phrase, such as delete word, save, or quotes."));
    }
    let lastCategory = "";
    result.items.forEach((entry) => {
      if (result.kind === "card" && entry.cat !== lastCategory) {
        lastCategory = entry.cat;
        const heading = document.createElement("h2");
        heading.textContent = entry.cat;
        fragment.appendChild(heading);
      }
      fragment.appendChild(row(entry, result.kind));
    });
    list.replaceChildren(fragment);
    const card = document.querySelector(".card");
    if (card && query) {
      card.scrollTop = 0;
    }
  }

  function banner(text) {
    const note = document.createElement("p");
    note.className = "banner";
    note.textContent = text;
    return note;
  }

  function row(entry, kind) {
    const li = document.createElement("li");
    li.dataset.id = entry.id;
    const title = document.createElement("div");
    title.className = "job";
    title.textContent = entry.title;
    const model = document.createElement("div");
    model.className = "model";
    const keys = document.createElement("div");
    keys.className = "keys";
    if (entry.keys) {
      keys.textContent = entry.keys;
    } else {
      keys.textContent = "No built-in key";
    }
    model.appendChild(keys);
    const meta = metaText(entry, kind);
    if (meta) {
      const side = document.createElement("div");
      side.className = "meta";
      side.textContent = meta;
      model.appendChild(side);
    }
    const why = document.createElement("div");
    why.className = "why";
    why.textContent = entry.why;
    li.append(title, model, why);
    return li;
  }

  function metaText(entry, kind) {
    if (kind === "card") {
      const parts = [];
      if (entry.mode !== "Normal") {
        parts.push(entry.mode);
      }
      if (entry.badge) {
        parts.push(entry.badge);
      }
      return parts.join(" · ");
    }
    return [entry.mode, entry.cat, entry.badge].filter(Boolean).join(" · ");
  }

  function fitWindowToContent() {
    const channel = cardChannel();
    if (!channel) {
      return;
    }
    channel.postMessage({ fit: 564 });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("search");
    const clear = document.getElementById("clear");
    const form = document.getElementById("search-form");
    render("");
    if (form) {
      form.addEventListener("submit", (event) => event.preventDefault());
    }
    if (input) {
      input.addEventListener("input", () => render(input.value));
      input.focus();
    }
    if (clear && input) {
      clear.addEventListener("click", () => {
        input.value = "";
        render("");
        input.focus();
      });
    }
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        if (input && input.value) {
          input.value = "";
          render("");
        }
        if (input) {
          input.blur();
        }
        return;
      }
      if (event.key === "/" && input && document.activeElement !== input) {
        event.preventDefault();
        input.focus();
      }
    });
    requestAnimationFrame(() => requestAnimationFrame(fitWindowToContent));
  });
})();
