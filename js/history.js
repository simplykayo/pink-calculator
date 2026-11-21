/* Keeps a short list of calculations on this device. */

(() => {
  const KEY = "history";
  const read = () => window.PinkStorage.get(KEY, []);
  const write = (items) => window.PinkStorage.set(KEY, items.slice(0, 30));
  function render() {
    const host = document.getElementById("historyList");
    if (!host) return;
    const items = read();
    if (!items.length) { host.innerHTML = '<p class="empty-state">Your calculations will show up here ✧</p>'; return; }
    host.replaceChildren(...items.map(item => {
      const row = document.createElement("button"); row.type = "button"; row.className = "history-item"; row.title = "Use this result";
      const expr = document.createElement("span"); expr.className = "history-expression"; expr.textContent = item.expression;
      const result = document.createElement("span"); result.className = "history-result"; result.textContent = "= " + item.result;
      row.append(expr, result); row.addEventListener("click", () => window.PinkCalc?.useAnswer(Number(item.raw)));
      return row;
    }));
  }
  window.PinkHistory = {
    add(expression, result, raw) { const items = read(); items.unshift({expression, result, raw, at: Date.now()}); write(items); render(); },
    clear() { write([]); render(); },
    render
  };
  document.addEventListener("DOMContentLoaded", render);
})();