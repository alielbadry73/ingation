// Background service worker for Focus Mode Blocker

console.log('Focus Mode Extension: Background worker started');

// Listen for navigation requests using webNavigation API
chrome.webNavigation.onBeforeNavigate.addListener(
  function(details) {
    // Only handle main frame navigations (not iframes)
    if (details.frameId !== 0) return;
    
    console.log('Navigation detected:', details.url);
    
    // Check if we should block this URL
    checkAndBlock(details.url, details.tabId);
  }
);

function checkAndBlock(url, tabId) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    // Don't block localhost
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      return;
    }
    
    // Get blocked sites and timer state from storage
    chrome.storage.local.get(['blockedSites', 'focusTimerState'], (data) => {
      console.log('Storage data:', data);
      
      if (!data.focusTimerState) {
        console.log('No active timer');
        return;
      }
      
      try {
        const state = JSON.parse(data.focusTimerState);
        
        if (!state.isRunning) {
          console.log('Timer not running');
          return;
        }
        
        // Check if time has expired
        if (state.sessionStartTime) {
          const elapsed = Math.floor((Date.now() - state.sessionStartTime) / 1000);
          const remaining = state.totalTime - elapsed;
          
          if (remaining <= 0) {
            console.log('Timer expired');
            chrome.storage.local.remove('focusTimerState');
            return;
          }
        }
        
        const blockedSites = data.blockedSites || [];
        console.log('Blocked sites:', blockedSites);
        
        // Check if hostname matches any blocked site
        const isBlocked = blockedSites.some(site => {
          const siteLower = site.toLowerCase();
          return hostname === siteLower || 
                 hostname.endsWith('.' + siteLower) ||
                 hostname.includes(siteLower);
        });
        
        if (isBlocked) {
          console.log('BLOCKING:', hostname);
          // Redirect to blocked page
          const blockedUrl = chrome.runtime.getURL('blocked.html') + '?site=' + encodeURIComponent(hostname);
          chrome.tabs.update(tabId, { url: blockedUrl });
        }
      } catch (e) {
        console.error('Error parsing timer state:', e);
      }
    });
  } catch (e) {
    console.error('Error checking URL:', e);
  }
}

// Listen for messages from the web page
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message);
  
  if (message.type === 'syncStorage') {
    chrome.storage.local.set({
      blockedSites: message.blockedSites,
      focusTimerState: message.focusTimerState
    }, () => {
      console.log('Storage synced:', message);
      sendResponse({ success: true });
    });
    return true; // Keep channel open for async response
  }
  
  if (message.type === 'getStorage') {
    chrome.storage.local.get(['blockedSites', 'focusTimerState'], (data) => {
      sendResponse(data);
    });
    return true;
  }
});

// Check timer state periodically
setInterval(() => {
  chrome.storage.local.get(['focusTimerState'], (data) => {
    if (data.focusTimerState) {
      try {
        const state = JSON.parse(data.focusTimerState);
        if (state.isRunning && state.sessionStartTime) {
          const elapsed = Math.floor((Date.now() - state.sessionStartTime) / 1000);
          const remaining = Math.max(0, state.totalTime - elapsed);
          
          if (remaining === 0) {
            console.log('Session complete, clearing state');
            chrome.storage.local.remove('focusTimerState');
          }
        }
      } catch (e) {
        console.error('Error checking timer state:', e);
      }
    }
  });
}, 1000);

console.log('Focus Mode Extension: Setup complete');
