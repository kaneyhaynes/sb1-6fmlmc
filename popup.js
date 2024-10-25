let syncing = false;

document.getElementById('toggleSync').addEventListener('click', async () => {
  syncing = !syncing;
  const button = document.getElementById('toggleSync');
  button.textContent = syncing ? 'Stop Sync' : 'Start Sync';
  
  chrome.runtime.sendMessage({ action: 'toggleSync', syncing });
});

chrome.storage.local.get(['syncing'], (result) => {
  syncing = result.syncing || false;
  const button = document.getElementById('toggleSync');
  button.textContent = syncing ? 'Stop Sync' : 'Start Sync';
});