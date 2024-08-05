// ==UserScript==
// @name        Unreal / Epic Dev Community: Stop GIF autoplay (and load all images)
// @namespace   Level3Manatee
// @match       https://dev.epicgames.com/*
// @grant       none
// @run-at      document-start
// @version     1.0
// @author      Jan Ortgies
// @license     MIT
// @description Stops GIF animations and adds a play button. May also fix page jumping in Firefox by loading all images. Uses "Gifffer" by Krasimir Tsonev.
// @supportURL  https://github.com/Level3Manatee/UnrealDocsExtended
// @updateURL   https://github.com/Level3Manatee/UnrealDocsExtended/raw/main/UEDocsStopGIFs.user.js
// @downloadURL https://github.com/Level3Manatee/UnrealDocsExtended/raw/main/UEDocsStopGIFs.user.js
// ==/UserScript==

// https://github.com/krasimir/gifffer/ @ 1.5.4 / b685cf0
(function webpackUniversalModuleDefinition(root,factory){if(typeof exports==="object"&&typeof module==="object")module.exports=factory();else if(typeof define==="function"&&define.amd)define("Gifffer",[],factory);else if(typeof exports==="object")exports["Gifffer"]=factory();else root["Gifffer"]=factory()})(this,function(){if(typeof window==="undefined"||typeof document==="undefined"){return}var d=document;var playSize=60;var Gifffer=function(options){var images,i=0,gifs=[];images=d.querySelectorAll("[data-gifffer]");for(;i<images.length;++i)process(images[i],gifs,options);return gifs};function formatUnit(v){return v+(v.toString().indexOf("%")>0?"":"px")}function parseStyles(styles){var stylesStr="";for(prop in styles)stylesStr+=prop+":"+styles[prop]+";";return stylesStr}function createContainer(w,h,el,altText,opts){var alt;var con=d.createElement("BUTTON");var cls=el.getAttribute("class");var id=el.getAttribute("id");var playButtonStyles=opts&&opts.playButtonStyles?parseStyles(opts.playButtonStyles):["width:"+playSize+"px","height:"+playSize+"px","border-radius:"+playSize/2+"px","background:rgba(0, 0, 0, 0.3)","position:absolute","top:50%","left:50%","margin:-"+playSize/2+"px"].join(";");var playButtonIconStyles=opts&&opts.playButtonIconStyles?parseStyles(opts.playButtonIconStyles):["width: 0","height: 0","border-top: 14px solid transparent","border-bottom: 14px solid transparent","border-left: 14px solid rgba(0, 0, 0, 0.5)","position: absolute","left: 26px","top: 16px"].join(";");cls?con.setAttribute("class",el.getAttribute("class")):null;id?con.setAttribute("id",el.getAttribute("id")):null;con.setAttribute("style","position:relative;cursor:pointer;background:none;border:none;padding:0;");con.setAttribute("aria-hidden","true");var play=d.createElement("DIV");play.setAttribute("class","gifffer-play-button");play.setAttribute("style",playButtonStyles);var trngl=d.createElement("DIV");trngl.setAttribute("style",playButtonIconStyles);play.appendChild(trngl);if(altText){alt=d.createElement("p");alt.setAttribute("class","gifffer-alt");alt.setAttribute("style","border:0;clip:rect(0 0 0 0);height:1px;overflow:hidden;padding:0;position:absolute;width:1px;");alt.innerText=altText+", image"}con.appendChild(play);el.parentNode.replaceChild(con,el);altText?con.parentNode.insertBefore(alt,con.nextSibling):null;return{c:con,p:play}}function calculatePercentageDim(el,w,h,wOrig,hOrig){var parentDimW=el.parentNode.offsetWidth;var parentDimH=el.parentNode.offsetHeight;var ratio=wOrig/hOrig;if(w.toString().indexOf("%")>0){w=parseInt(w.toString().replace("%",""));w=w/100*parentDimW;h=w/ratio}else if(h.toString().indexOf("%")>0){h=parseInt(h.toString().replace("%",""));h=h/100*parentDimW;w=h*ratio}return{w:w,h:h}}function process(el,gifs,options){var url,con,c,w,h,duration,play,gif,playing=false,cc,isC,durationTimeout,dims,altText;url=el.getAttribute("data-gifffer");w=el.getAttribute("data-gifffer-width");h=el.getAttribute("data-gifffer-height");duration=el.getAttribute("data-gifffer-duration");altText=el.getAttribute("data-gifffer-alt");el.style.display="block";c=document.createElement("canvas");isC=!!(c.getContext&&c.getContext("2d"));if(w&&h&&isC)cc=createContainer(w,h,el,altText,options);el.onload=function(){if(!isC)return;w=w||el.width;h=h||el.height;if(!cc)cc=createContainer(w,h,el,altText,options);con=cc.c;play=cc.p;dims=calculatePercentageDim(con,w,h,el.width,el.height);gifs.push(con);con.addEventListener("click",function(){clearTimeout(durationTimeout);if(!playing){playing=true;gif=document.createElement("IMG");gif.setAttribute("style","width:100%;height:100%;");gif.setAttribute("data-uri",Math.floor(Math.random()*1e5)+1);setTimeout(function(){gif.src=url},0);con.removeChild(play);con.removeChild(c);con.appendChild(gif);if(parseInt(duration)>0){durationTimeout=setTimeout(function(){playing=false;con.appendChild(play);con.removeChild(gif);con.appendChild(c);gif=null},duration)}}else{playing=false;con.appendChild(play);con.removeChild(gif);con.appendChild(c);gif=null}});c.width=dims.w;c.height=dims.h;c.getContext("2d").drawImage(el,0,0,dims.w,dims.h);con.appendChild(c);con.setAttribute("style","position:relative;cursor:pointer;width:"+dims.w+"px;height:"+dims.h+"px;background:none;border:none;padding:0;");c.style.width="100%";c.style.height="100%";if(w.toString().indexOf("%")>0&&h.toString().indexOf("%")>0){con.style.width=w;con.style.height=h}else if(w.toString().indexOf("%")>0){con.style.width=w;con.style.height="inherit"}else if(h.toString().indexOf("%")>0){con.style.width="inherit";con.style.height=h}else{con.style.width=dims.w+"px";con.style.height=dims.h+"px"}};el.src=url}return Gifffer});

let loadQueue = [];
let currentlyLoading = -1;
let isProcessing = false;

function Process () {
  if (isProcessing) return;
  isProcessing = true;

  currentlyLoading++;
  if (currentlyLoading === loadQueue.length) {
    isProcessing = false;
    return;
  }

  const node = loadQueue[currentlyLoading];

  node.loading = "eager";

  node.onload = (evt) => {
    if (node.src.match(/\.gif$/)) {

      evt.target.dataset.gifffer = evt.target.src;
      evt.target.src = "";

      Gifffer( gifferStyle );
    }

    isProcessing = false;
    Process();
  };
}


const imgNode = "IMG";

const observer = new MutationObserver((mutationList, observer) => {
  for (const mutation of mutationList) {
    if (mutation.type !== "childList") continue;

    for (const node of mutation.addedNodes) {
      if (node.nodeName !== imgNode || !node.hasAttribute('loading') || node.closest('block-asyncgif') !== null)
        continue;

      loadQueue.push(node);

      Process();
    }
  }
});

observer.observe(
  document.documentElement,
  {
    attributes: false,
    childList: true,
    subtree: true
  }
);


const gifferStyle = {
  playButtonStyles: {
    "width": "60px",
    "height": "60px",
    "border-radius": "30px",
    "background": "var(--bs-primary)",
    "position": "absolute",
    "top": "50%",
    "left": "50%",
    "margin": "-30px",
    "border": "2px solid hsla(0, 0%, 100%, 0.6)",
    "box-shadow": "inset 0 0 8px -2px hsla(0, 0%, 100%, 0.7)"
  },
  playButtonIconStyles: {
    "width": "0",
    "height": "0",
    "border-top": "14px solid transparent",
    "border-bottom": "14px solid transparent",
    "border-left": "24px solid white",
    "position": "absolute",
    "left": "20px",
    "top": "14px",
    "border-radius": "2px"
  }
};
