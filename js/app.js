/* Navigation, theme preference and small interface helpers. */

(() => {
  const $=id=>document.getElementById(id);
  let toastTimer;
  function toast(message){
  const el=$("toast");
  el.textContent=message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>el.classList.remove("show"),2200);
}
  window.PinkApp={
  toast
};
  document.querySelectorAll(".tab").forEach(tab=>tab.addEventListener("click",()=>{
  document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x===tab));
  document.querySelectorAll(".tool-panel").forEach(panel=>panel.classList.toggle("active",panel.id===tab.dataset.tab+"Panel"));
  if(tab.dataset.tab==="currency")window.PinkCurrency?.load();
}));
  const applyTheme=dark=>{
  document.body.classList.toggle("dark",dark);
  $("themeToggle").textContent=dark?"☀":"☾";
  window.PinkStorage?.set("dark",dark);
};
  applyTheme(window.PinkStorage?.get("dark",false)===true);
  $("themeToggle").addEventListener("click",()=>applyTheme(!document.body.classList.contains("dark")));
  $("clearHistory").addEventListener("click",()=>{
  window.PinkHistory?.clear();
  toast("History cleared ✧");
});
  $("year").textContent=new Date().getFullYear();
})();
