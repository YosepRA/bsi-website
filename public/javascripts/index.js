(()=>{"use strict";async function e(){const e=document.querySelector(".navbar__price-data"),t=document.querySelector(".navbar__price-change"),a=document.querySelector(".navbar__price-time"),n=await async function(){return await fetch("/api/v1/price").then((e=>e.json()))}(),c=`$${n.price}`,r=`${n.change24Hr>0?"+":""}${Math.round(100*n.change24Hr)/100}%`,o=new Date(n.lastUpdatedAt).toLocaleString();e.textContent=c,t.textContent=r,a.textContent=o,n.change24Hr>0?(t.classList.add("navbar__price-change--up"),t.classList.remove("navbar__price-change--down")):(t.classList.add("navbar__price-change--down"),t.classList.remove("navbar__price-change--up"))}var t;t=async function(){await e(),setInterval(e,3e4)},"loading"!==document.readyState?t():document.addEventListener("DOMContentLoaded",t)})();