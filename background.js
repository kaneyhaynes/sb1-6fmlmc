let syncing = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleSync') {
    syncing = request.syncing;
    chrome.storage.local.set({ syncing });
    broadcastToTabs({ type: 'syncState', syncing });
  } else if (request.action === 'syncEvent' && syncing) {
    broadcastToTabs(request.event, sender.tab.id);
  }
});

async function broadcastToTabs(message, excludeTabId) {
  const tabs = await chrome.tabs.query({});
  tabs.forEach(tab => {
    if (!excludeTabId || tab.id !== excludeTabId) {
      chrome.tabs.sendMessage(tab.id, message).catch(() => {});
    }
  });
}