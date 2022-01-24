// ==UserScript==
// @name     tugboat-prioritzer
// @version  3
// @include  https://tugboat.procoretech-qa.com/*
// @grant    none
// ==/UserScript==

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function relocateProcoreWeb(tbody) {
  console.debug('relocateProcoreWeb')

  list = tbody.querySelectorAll('tr')

  listArr = Array.from(list)

  procoreWebDeplNode = listArr.find(x => x.textContent.includes("pz01-procore-web"))

  procoreWebDeplNode.style.border = '2px solid #f47e42'
  tbody.insertBefore(procoreWebDeplNode, list[0])
}

function watchForTableChanges() {
  console.debug('watchForTableChanges')
  const targetNode = document.querySelector('.layout--content')
  const observerOptions = {
    childList: true,
    subtree: true
  }

  function callback(mutationList, observer) {
    relocateProcoreWeb(mutationList[2].addedNodes[0].querySelector('tbody.core-table__body'))
  }

  const observer = new MutationObserver(callback)
  observer.observe(targetNode, observerOptions)
}

let shouldAttemptToWatchValuesTab = true

async function watchValuesTab() {
  console.debug('watchValuesTab')

  while (true) {
    if (shouldAttemptToWatchValuesTab) {

      const list = Array.from(document.querySelectorAll('div.ace_line_group'))
      const procoreNode = list.find(x => x.innerText.includes('"procore": {'))

      if (procoreNode != null) {
        procoreNode.scrollIntoView({behavior: "smooth"})
        shouldAttemptToWatchValuesTab = false
      }

      await sleep(1000)
    } else {
      await sleep(1000)
    }
    await sleep(1000)
  }
}

async function waitForPageLoad() {
  console.debug('waitForPageLoad')
  await sleep(1000)
  tbody = document.querySelector('tbody.core-table__body')

  while (tbody == null) {
    tbody = document.querySelector('tbody.core-table__body')
    await sleep(300)
  }

  watchForTableChanges(tbody)
  relocateProcoreWeb(tbody)
}

waitForPageLoad()
watchValuesTab()
