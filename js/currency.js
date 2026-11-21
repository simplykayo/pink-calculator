/* Currency conversion using published reference rates. */

(() => {
  const currencies = {
  INR:"Indian Rupee",USD:"US Dollar",EUR:"Euro",GBP:"British Pound",JPY:"Japanese Yen",AUD:"Australian Dollar",CAD:"Canadian Dollar",CHF:"Swiss Franc",CNY:"Chinese Yuan",SGD:"Singapore Dollar",AED:"UAE Dirham",NZD:"New Zealand Dollar",KRW:"South Korean Won",THB:"Thai Baht",SAR:"Saudi Riyal",HKD:"Hong Kong Dollar",BRL:"Brazilian Real",ZAR:"South African Rand",MXN:"Mexican Peso",SEK:"Swedish Krona",NOK:"Norwegian Krone",DKK:"Danish Krone",TRY:"Turkish Lira",IDR:"Indonesian Rupiah",MYR:"Malaysian Ringgit",PHP:"Philippine Peso",PLN:"Polish Zloty",CZK:"Czech Koruna",HUF:"Hungarian Forint",ILS:"Israeli New Shekel"
};
  const $=id=>document.getElementById(id);
  let rates={
},base="",updated="",loading=false;
  const from=$("fromCurrency"),to=$("toCurrency"),amount=$("fromAmount");
  function options(select,preferred){
  select.innerHTML=Object.entries(currencies).map(([code,name])=>'<option value="'+code+'">'+code+' — '+name+'</option>').join("");
  select.value=preferred;
}
  function showStatus(text){
  $("rateStatus").textContent=text;
}
  async function loadRates() {
  const b=from.value;
  if(loading)return;
  loading=true;
  showStatus("Fetching latest published rates…");
  try {
  const res=await fetch("https://api.frankfurter.dev/v1/latest?base="+encodeURIComponent(b),{
  cache:"no-store"
});
  if(!res.ok)throw new Error("Rate service unavailable");
  const data=await res.json();
  if(!data.rates)throw new Error("No rates returned");
  rates=data.rates;
  rates[b]=1;
  base=b;
  updated=data.date || "";
  window.PinkStorage?.set("currencyCache",{
  base,rates,updated
});
  showStatus("Reference rates updated · "+updated);
  convert();
} catch(err) {
  const cached=window.PinkStorage?.get("currencyCache",null);
  if(cached && cached.base===b){
  rates=cached.rates;
  base=b;
  updated=cached.updated;
  showStatus("Offline fallback · last saved "+updated);
}
      else showStatus("Could not load rates. Check your connection and try again.");
  convert();
} finally {
  loading=false;
}
}
  function convert() {
  const n=Number(amount.value), a=from.value,b=to.value;
  if(!Number.isFinite(n)){
  $("toAmount").value="";
  return;
}
    if(base!==a || !rates[a] || !rates[b]) {
  $("toAmount").value="—";
  $("rateLine").textContent="Loading a reference rate for "+a+"…";
  return;
}
    const value=n/rates[a]*rates[b];
  $("toAmount").value=value.toLocaleString("en-US",{
  maximumFractionDigits:5
});
  $("rateLine").textContent="1 "+a+" = "+(rates[b]/rates[a]).toLocaleString("en-US",{
  maximumFractionDigits:6
})+" "+b+"  ·  "+(updated||"latest available");
}
  options(from,"INR");
  options(to,"USD");
  amount.addEventListener("input",convert);
  from.addEventListener("change",()=>{
  loadRates();
});
  to.addEventListener("change",convert);
  $("swapCurrencies").addEventListener("click",()=>{
  const v=from.value;
  from.value=to.value;
  to.value=v;
  loadRates();
});
  $("refreshRates").addEventListener("click",loadRates);
  document.querySelectorAll("[data-amount]").forEach(btn=>btn.addEventListener("click",()=>{
  amount.value=btn.dataset.amount;
  convert();
}));
  window.PinkCurrency={
  load:loadRates
};
})();
