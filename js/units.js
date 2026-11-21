/* Unit conversion factors and temperature formulas. */

(() => {
  const data = {
    length:{m:"Meter",km:"Kilometer",cm:"Centimeter",mm:"Millimeter",mi:"Mile",yd:"Yard",ft:"Foot",in:"Inch",nmi:"Nautical mile"},
    weight:{kg:"Kilogram",g:"Gram",mg:"Milligram",lb:"Pound",oz:"Ounce",tonne:"Metric tonne"},
    area:{m2:"Square meter",km2:"Square kilometer",cm2:"Square centimeter",ha:"Hectare",acre:"Acre",ft2:"Square foot"},
    volume:{l:"Liter",ml:"Milliliter",m3:"Cubic meter",gal:"US gallon",qt:"US quart",cup:"US cup",floz:"US fluid ounce"},
    speed:{ms:"Meter/second",kmh:"Kilometer/hour",mph:"Mile/hour",knot:"Knot"},
    time:{s:"Second",min:"Minute",h:"Hour",day:"Day",week:"Week"},
    data:{B:"Byte",KB:"Kilobyte",MB:"Megabyte",GB:"Gigabyte",TB:"Terabyte",bit:"Bit"},
    pressure:{Pa:"Pascal",kPa:"Kilopascal",bar:"Bar",atm:"Atmosphere",psi:"PSI"},
    energy:{J:"Joule",kJ:"Kilojoule",cal:"Calorie",kcal:"Kilocalorie",Wh:"Watt-hour",kWh:"Kilowatt-hour"},
    power:{W:"Watt",kW:"Kilowatt",MW:"Megawatt",hp:"Horsepower"}
  };
  const factors = {
    length:{m:1,km:1000,cm:.01,mm:.001,mi:1609.344,yd:.9144,ft:.3048,in:.0254,nmi:1852},
    weight:{kg:1,g:.001,mg:.000001,lb:.45359237,oz:.028349523125,tonne:1000},
    area:{m2:1,km2:1e6,cm2:.0001,ha:10000,acre:4046.8564224,ft2:.09290304},
    volume:{l:1,ml:.001,m3:1000,gal:3.785411784,qt:.946352946,cup:.2365882365,floz:.0295735295625},
    speed:{ms:1,kmh:1/3.6,mph:.44704,knot:.514444},
    time:{s:1,min:60,h:3600,day:86400,week:604800},
    data:{B:1,KB:1000,MB:1e6,GB:1e9,TB:1e12,bit:.125},
    pressure:{Pa:1,kPa:1000,bar:100000,atm:101325,psi:6894.757293},
    energy:{J:1,kJ:1000,cal:4.184,kcal:4184,Wh:3600,kWh:3600000},
    power:{W:1,kW:1000,MW:1e6,hp:745.6998716}
  };
  const $=id=>document.getElementById(id), category=$("unitCategory"),from=$("unitFrom"),to=$("unitTo"),input=$("unitInput");
  function populate(){const c=category.value,keys=Object.keys(data[c]||data.length);const opts=keys.map(k=>'<option value="'+k+'">'+data[c][k]+'</option>').join("");from.innerHTML=opts;to.innerHTML=opts;from.value=keys[0];to.value=keys[1]||keys[0];convert();}
  function convert(){
    const c=category.value,n=Number(input.value),a=from.value,b=to.value;
    if(!Number.isFinite(n)){ $("unitOutput").value="";return;}
    let result;
    if(c==="temperature"){
      const toC={C:v=>v,F:v=>(v-32)*5/9,K:v=>v-273.15};
      const fromC={C:v=>v,F:v=>v*9/5+32,K:v=>v+273.15};
      result=fromC[b](toC[a](n));
    } else result=n*factors[c][a]/factors[c][b];
    $("unitOutput").value=Number(result.toPrecision(11)).toLocaleString("en-US",{maximumFractionDigits:9});
    $("unitFormula").textContent=n+" "+a+" = "+$("unitOutput").value+" "+b;
  }
  function temperature(){const opts='<option value="C">Celsius</option><option value="F">Fahrenheit</option><option value="K">Kelvin</option>';from.innerHTML=opts;to.innerHTML=opts;from.value="C";to.value="F";convert();}
  category.addEventListener("change",()=>category.value==="temperature"?temperature():populate());
  [from,to,input].forEach(el=>el.addEventListener("input",convert));
  $("swapUnits").addEventListener("click",()=>{const v=from.value;from.value=to.value;to.value=v;convert();});
  populate();
})();