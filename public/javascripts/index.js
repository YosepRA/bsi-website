(()=>{"use strict";function t(t){let n="";return function({direction:e}){n!==e&&("down"===e?t.classList.add("scroll"):t.classList.remove("scroll"),n=e)}}function n(t){let n="";return function({direction:e}){n!==e&&("down"===e?t.classList.add("scroll"):t.classList.remove("scroll"),n=e)}}const e=document.querySelector(".navbar__price-data"),c=document.querySelector(".navbar__price-change"),o=document.querySelector(".navbar__price-time");async function i(){return await fetch("/api/v1/price").then((t=>t.json()))}async function s(t){const n=`$${t.price}`,i=`${t.change24Hr>0?"+":""}${Math.round(100*t.change24Hr)/100}%`,s=new Date(t.lastUpdatedAt).toLocaleString();e.textContent=n,c.textContent=i,o.textContent=s,t.change24Hr>0?(c.classList.add("navbar__price-change--up"),c.classList.remove("navbar__price-change--down")):(c.classList.add("navbar__price-change--down"),c.classList.remove("navbar__price-change--up"))}const a=document.querySelector(".navbar"),r=document.querySelector(".fb");var d;d=async function(){new class{constructor(t){this.position=0,this.direction="",this.fns=t||[];const n=function(t,n){let e=Date.now();return function(){const n=Date.now();n-e>300&&(t(),e=n)}}(this.updateScroll.bind(this));window.addEventListener("scroll",n)}updateScroll(){const t=window.scrollY,n=t-this.position>=0?"down":"up";this.position=t,this.direction=n,this.callFunctions()}callFunctions(){const t=this.fns.map((t=>new Promise((n=>n(t({position:this.position,direction:this.direction}))))));return Promise.all(t)}}([t(a),n(r)]);const e=await i();await s(e),setInterval((async()=>{s(await i())}),12e4)},"loading"!==document.readyState?d():document.addEventListener("DOMContentLoaded",d)})();
//# sourceMappingURL=index.js.map