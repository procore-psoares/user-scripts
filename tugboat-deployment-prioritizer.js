// ==UserScript==
// @name     tugboat-prioritzer
// @version  2
// @include  https://tugboat.procorecon.com/* https://tugboat.procoretech-qa.com/*
// @grant    none
// ==/UserScript==

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function relocateProcoreWeb(tbody) {
    console.debug('relocateProcoreWeb')

    list = tbody.querySelectorAll('tr')
    console.debug('list', list)

    listArr = Array.from(list)
    console.debug('listArr', listArr)

    procoreWebDeplNode = listArr.find(x => x.textContent.includes("pz01-procore-web"))
    console.debug('procoreWebDeplNode', procoreWebDeplNode)

    procoreWebDeplNode.style.border = '2px solid #f47e42'
    tbody.insertBefore(procoreWebDeplNode, list[0])
    console.debug('end')
}

function watchForTableChanges() {
    console.debug('watchForTableChanges')
    const targetNode = document.querySelector('.layout--content')
    const observerOptions = {
        childList: true,
        subtree: true
    }

    function callback(mutationList, observer) {
        console.debug('mutation callback')
        console.debug('mutation list', mutationList)
        console.debug('mutation list target', mutationList[2].addedNodes[0])
        console.debug('mutation list target', mutationList[2].addedNodes[0].querySelector('tbody.core-table__body'))

        relocateProcoreWeb(mutationList[2].addedNodes[0].querySelector('tbody.core-table__body'))
    }

    const observer = new MutationObserver(callback)
    observer.observe(targetNode, observerOptions)
}

async function waitForPageLoad() {
    console.debug('waitForPageLoad')
    await sleep(1000)
    tbody = document.querySelector('tbody.core-table__body')

    while (tbody == null) {
        console.debug('waiting')
        tbody = document.querySelector('tbody.core-table__body')
        await sleep(300)
    }

    console.debug('execute')
    watchForTableChanges(tbody)
    relocateProcoreWeb(tbody)
}


waitForPageLoad()