// ==UserScript==
// @name        Unreal Engine Docs: C++ API: Fix code markup
// @namespace   Level3Manatee
// @match       https://dev.epicgames.com/documentation/en-us/unreal-engine/API/*
// @grant       none
// @version     1.0
// @author      Jan Ortgies
// @license     MIT
// @description Fixes display errors in the code samples, by decoding & replacing the HTML entities.
// @supportURL  https://github.com/Level3Manatee/UnrealDocsExtended
// @updateURL   https://github.com/Level3Manatee/UnrealDocsExtended/raw/main/UEDocsFixAPICodeSamples.user.js
// @downloadURL https://github.com/Level3Manatee/UnrealDocsExtended/raw/main/UEDocsFixAPICodeSamples.user.js
// ==/UserScript==

function ProcessCode (codeNode) {
  // Feels hacky, but it works? Holler @ me if you know of a better way
  var txt = document.createElement("textarea");
  function decodeHtml(html) {
    txt.innerHTML = html;
    return txt.value;
  }

  const entityRegex = /&\d{1,4};/g;
  const htmlEntityRegex = /&amp;(?:<span class="hljs-number">)?\d{1,4}(?:<\/span>)?;/;
  const entityNumberRegex = /\d+/;
  const nodes = codeNode.querySelectorAll('.hljs-ln-code, code');

  for (let i = 0; i < nodes.length; i++) {
    let node = nodes[i];
    if (node.textContent.search(entityRegex) === -1) continue;

    let entities = node.textContent.match(entityRegex);
    let nodeHTML = node.innerHTML;
    for (const entity of entities) {
      nodeHTML = nodeHTML.replace(htmlEntityRegex, decodeHtml(`&#${(entity.match(entityNumberRegex))};`));
    }
    nodes[i].innerHTML = nodeHTML;
  }
};

const codeNodes = ["TABLE", "CODE", "PRE"];
const codeClasses = ["hljs-ln", "hljs", "block-code-snippet-plain"];

const observer = new MutationObserver((mutationList, observer) => {
  for (const mutation of mutationList) {
    if (mutation.type !== "childList") continue;

    for (const node of mutation.addedNodes) {
      if (codeNodes.indexOf(node.nodeName) === -1) continue;
      for (const codeClass of codeClasses) {
        if (node.classList.contains(codeClass)) {
          ProcessCode(node);
          break;
        }
      }
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
