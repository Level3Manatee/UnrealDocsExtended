// ==UserScript==
// @name        Unreal Engine Docs: C++ API: Fix Version Switching
// @namespace   Level3Manatee
// @match       https://dev.epicgames.com/documentation/en-us/unreal-engine/API/*
// @run-at      document-body
// @grant       none
// @version     1.0
// @author      Jan Ortgies
// @license     MIT
// @description Fixes switching the Unreal Engine version in the C++ API docs
// @supportURL  https://github.com/Level3Manatee/UnrealDocsExtended
// @updateURL   https://github.com/Level3Manatee/UnrealDocsExtended/raw/main/UEDocsFixVersionSwitching.user.js
// @downloadURL https://github.com/Level3Manatee/UnrealDocsExtended/raw/main/UEDocsFixVersionSwitching.user.js
// ==/UserScript==

function Process(tocEl) {
  const versionLinkEls = tocEl.querySelectorAll('li.nav-item');
  versionLinkEls.forEach(li => {
    li.addEventListener('click', evt => {
      evt.preventDefault();
      const a = evt.target.querySelector('a');
      const versionURL = new URL(a.href);
      const version = versionURL.searchParams.get('application_version');
      if (version !== null) {
        let location = new URL(document.location.href);
        location.searchParams.set('application_version', version);
        document.location.href = location;
      }
    }, true);
  });
}

const documentObserver = new MutationObserver((mutationList, observer) => {
  for (const mutation of mutationList) {
    if (mutation.type !== "childList") continue;

    for (const node of mutation.addedNodes) {
      if (node.nodeName === 'DOCUMENT') {
        let toc = node.parentElement.querySelector("table-of-contents");
        tocObserver.observe(toc, config);
        observer.disconnect();
      }
    }
  }
});

const tocObserver = new MutationObserver((mutationList, observer) => {
  for (const mutation of mutationList) {
    if (mutation.type !== "childList") continue;

    for (const node of mutation.addedNodes) {
      if (node.nodeName === 'DIV' && node.classList.contains("contents-versions")) {
        Process(node);
        tocObserver.disconnect();
      }
    }
  }
});



const config = { attributes: false, childList: true, subtree: true };

documentObserver.observe(document.body, config);

function AddStyle () {
  const styleEl = document.createElement("style");
  const style = `
table-of-contents .contents-versions li.nav-item {
  cursor: pointer;
}
table-of-contents .contents-versions li.nav-item a {
  pointer-events: none;
}`;
  styleEl.textContent = style;
  document.head.appendChild(styleEl);
}
AddStyle();
