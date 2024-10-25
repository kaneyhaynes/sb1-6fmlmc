let syncing = false;

// Listen for sync state changes
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'syncState') {
    syncing = message.syncing;
  } else if (syncing) {
    replayAction(message);
  }
});

// Event listeners for mouse movements
document.addEventListener('mousemove', (e) => {
  if (!syncing) return;
  sendSyncEvent({
    type: 'mousemove',
    x: e.clientX / window.innerWidth,
    y: e.clientY / window.innerHeight
  });
});

// Event listeners for clicks
document.addEventListener('click', (e) => {
  if (!syncing) return;
  sendSyncEvent({
    type: 'click',
    x: e.clientX / window.innerWidth,
    y: e.clientY / window.innerHeight
  });
});

// Event listeners for keyboard input
document.addEventListener('keydown', (e) => {
  if (!syncing) return;
  sendSyncEvent({
    type: 'keydown',
    key: e.key,
    code: e.code,
    ctrlKey: e.ctrlKey,
    altKey: e.altKey,
    shiftKey: e.shiftKey
  });
});

// Event listeners for scroll
document.addEventListener('scroll', (e) => {
  if (!syncing) return;
  sendSyncEvent({
    type: 'scroll',
    x: window.scrollX / (document.documentElement.scrollWidth - window.innerWidth),
    y: window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
  });
});

function sendSyncEvent(event) {
  chrome.runtime.sendMessage({
    action: 'syncEvent',
    event
  });
}

function replayAction(event) {
  switch (event.type) {
    case 'mousemove':
      simulateMouseMove(event);
      break;
    case 'click':
      simulateClick(event);
      break;
    case 'keydown':
      simulateKeypress(event);
      break;
    case 'scroll':
      simulateScroll(event);
      break;
  }
}

function simulateMouseMove(event) {
  const x = event.x * window.innerWidth;
  const y = event.y * window.innerHeight;
  const mouseEvent = new MouseEvent('mousemove', {
    clientX: x,
    clientY: y,
    bubbles: true
  });
  document.elementFromPoint(x, y)?.dispatchEvent(mouseEvent);
}

function simulateClick(event) {
  const x = event.x * window.innerWidth;
  const y = event.y * window.innerHeight;
  const clickEvent = new MouseEvent('click', {
    clientX: x,
    clientY: y,
    bubbles: true
  });
  document.elementFromPoint(x, y)?.dispatchEvent(clickEvent);
}

function simulateKeypress(event) {
  const keyEvent = new KeyboardEvent('keydown', {
    key: event.key,
    code: event.code,
    ctrlKey: event.ctrlKey,
    altKey: event.altKey,
    shiftKey: event.shiftKey,
    bubbles: true
  });
  document.activeElement?.dispatchEvent(keyEvent);
}

function simulateScroll(event) {
  const x = event.x * (document.documentElement.scrollWidth - window.innerWidth);
  const y = event.y * (document.documentElement.scrollHeight - window.innerHeight);
  window.scrollTo(x, y);
}