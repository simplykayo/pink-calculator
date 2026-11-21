/* Calculator input, expression parsing and scientific functions. */

(() => {
  const $ = id => document.getElementById(id);
  let expression = "", answer = 0, memory = 0, degrees = true;
  const exprEl = $("expression"), resultEl = $("result"), statusEl = $("calcStatus");
  const pretty = value => {
    if (!Number.isFinite(value)) throw new Error("Math error");
    if (Math.abs(value) < 1e-12) value = 0;
    return Number(value.toPrecision(12)).toLocaleString("en-US", {maximumFractionDigits: 10, useGrouping: false});
  };
  function tokenize(input) {
    const s = input.replace(/×/g,"*").replace(/÷/g,"/").replace(/−/g,"-").replace(/π/g,"pi").replace(/\s/g,"");
    const tokens = []; let i = 0;
    while (i < s.length) {
      const rest = s.slice(i), number = rest.match(/^(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/i), word = rest.match(/^[a-z]+/i);
      if (number) { tokens.push({type:"num", value:Number(number[0])}); i += number[0].length; }
      else if (word) { tokens.push({type:"word", value:word[0].toLowerCase()}); i += word[0].length; }
      else if ("+-*/^()%!".includes(s[i])) { tokens.push({type:s[i], value:s[i]}); i++; }
      else throw new Error("Check your expression");
    }
    return tokens;
  }
  function evaluate(input) {
    const t = tokenize(input); let p = 0;
    const peek = () => t[p], take = () => t[p++];
    const factorial = n => { if (n < 0 || n > 170 || !Number.isInteger(n)) throw new Error("Factorial needs a whole number from 0 to 170"); let v=1; for(let j=2;j<=n;j++)v*=j; return v; };
    const angle = n => degrees ? n * Math.PI / 180 : n;
    const unangle = n => degrees ? n * 180 / Math.PI : n;
    function primary() {
      const token = take(); if (!token) throw new Error("Incomplete expression");
      if (token.type === "num") return token.value;
      if (token.type === "(") { const v=add(); if (!peek() || take().type!==")") throw new Error("Missing )"); return v; }
      if (token.type === "+" || token.type === "-") { const v=primary(); return token.type==="-" ? -v : v; }
      if (token.type === "word") {
        if (token.value === "pi") return Math.PI;
        if (token.value === "e") return Math.E;
        if (token.value === "ans") return answer;
        if (token.value === "sqrt" || token.value === "sin" || token.value === "cos" || token.value === "tan" || token.value === "asin" || token.value === "acos" || token.value === "atan" || token.value === "log" || token.value === "ln" || token.value === "abs") {
          let v; if (peek()?.type === "(") { take(); v=add(); if (!peek() || take().type!==")") throw new Error("Missing )"); } else v=primary();
          if (token.value==="sqrt") return Math.sqrt(v);
          if (token.value==="sin") return Math.sin(angle(v));
          if (token.value==="cos") return Math.cos(angle(v));
          if (token.value==="tan") { if (Math.abs(Math.cos(angle(v)))<1e-12) throw new Error("Undefined tangent"); return Math.tan(angle(v)); }
          if (token.value==="asin") return unangle(Math.asin(v));
          if (token.value==="acos") return unangle(Math.acos(v));
          if (token.value==="atan") return unangle(Math.atan(v));
          if (token.value==="log") return Math.log10(v);
          if (token.value==="ln") return Math.log(v);
          return Math.abs(v);
        }
      }
      throw new Error("Unexpected input");
    }
    function postfix() { let v=primary(); while(peek()?.type==="!") {take();v=factorial(v);} return v; }
    function power() { let v=postfix(); if(peek()?.type==="^"){take();v=Math.pow(v,power());} return v; }
    function multiply() { let v=power(); while(peek() && ["*","/","%"].includes(peek().type)){const op=take().type,b=power();v=op==="*" ? v*b : op==="/" ? v/b : v%b;} return v; }
    function add() { let v=multiply(); while(peek() && ["+","-"].includes(peek().type)){const op=take().type,b=multiply();v=op==="+"?v+b:v-b;} return v; }
    if (!t.length) return 0;
    const value=add(); if(p<t.length) throw new Error("Check your expression"); if(!Number.isFinite(value)) throw new Error("Math error"); return value;
  }
  function update() { exprEl.textContent=expression || " "; }
  function insert(value) {
    if (value==="ans") value="ans";
    expression += value; update();
    try { if(expression && !/[+−×÷^(]$/.test(expression)) resultEl.textContent=pretty(evaluate(expression)); } catch {}
  }
  function solve() {
    if (!expression.trim()) return;
    try { const value=evaluate(expression); answer=value; const shown=pretty(value); resultEl.textContent=shown; statusEl.textContent="SOLVED ✦"; window.PinkHistory?.add(expression,shown,value); expression=shown; update(); }
    catch(e) { statusEl.textContent=e.message.toUpperCase(); resultEl.textContent="—"; }
  }
  function clear() { expression=""; update(); resultEl.textContent="0"; statusEl.textContent="LET'S DO THIS ✦"; }
  function remove() { expression=expression.slice(0,-1); update(); if(!expression)resultEl.textContent="0"; }
  function useAnswer(v) { answer=v; expression=pretty(v); update(); resultEl.textContent=expression; }
  $("keypad").addEventListener("click", e => { const key=e.target.closest("button"); if(!key)return; if(key.dataset.action==="clear")clear(); else if(key.dataset.action==="delete")remove(); else if(key.dataset.action==="equals")solve(); else if(key.dataset.value)insert(key.dataset.value); });
  document.addEventListener("keydown", e => {
    if (["INPUT","SELECT","TEXTAREA"].includes(document.activeElement?.tagName)) return;
    if (/^[0-9.]$/.test(e.key)) insert(e.key);
    else if (["+", "-", "*", "/", "^", "(", ")", "%", "!"].includes(e.key)) insert(({ "*":"×", "/":"÷", "-":"−" })[e.key] || e.key);
    else if (e.key==="Enter" || e.key==="=") {e.preventDefault();solve();}
    else if (e.key==="Backspace") remove();
    else if (e.key==="Escape") clear();
  });
  $("angleMode").addEventListener("click", () => { degrees=!degrees; $("angleMode").textContent=degrees?"DEG":"RAD"; });
  document.querySelectorAll("[data-memory]").forEach(btn => btn.addEventListener("click", () => {
    const action=btn.dataset.memory; let current=0; try{current=evaluate(expression || String(answer));}catch{}
    if(action==="mc")memory=0; if(action==="mr")insert(String(memory)); if(action==="mplus")memory+=current; if(action==="mminus")memory-=current; if(action==="ms")memory=current;
    statusEl.textContent=action==="mc"?"MEMORY CLEARED":"MEMORY "+pretty(memory);
  }));
  $("copyResult").addEventListener("click", async () => { try { await navigator.clipboard.writeText(resultEl.textContent); window.PinkApp?.toast("Result copied ✦"); } catch { window.PinkApp?.toast("Copy isn't available here"); } });
  window.PinkCalc={useAnswer, getAnswer:()=>answer};
})();