// Content script that runs on every page to check if it should be blocked

(function() {
    'use strict';
    
    console.log('Focus Mode Content Script: Running on', window.location.hostname);
    
    // Check if current page should be blocked
    function checkIfBlocked() {
        const hostname = window.location.hostname.toLowerCase();
        
        // Don't block localhost
        if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
            return;
        }
        
        // Get data from extension storage
        chrome.storage.local.get(['blockedSites', 'focusTimerState'], (data) => {
            console.log('Content script - Storage data:', data);
            
            if (!data.focusTimerState) {
                console.log('Content script - No timer state');
                return;
            }
            
            try {
                const state = JSON.parse(data.focusTimerState);
                
                if (!state.isRunning) {
                    console.log('Content script - Timer not running');
                    return;
                }
                
                // Check if time expired
                if (state.sessionStartTime) {
                    const elapsed = Math.floor((Date.now() - state.sessionStartTime) / 1000);
                    const remaining = state.totalTime - elapsed;
                    
                    if (remaining <= 0) {
                        console.log('Content script - Timer expired');
                        return;
                    }
                }
                
                const blockedSites = data.blockedSites || [];
                console.log('Content script - Blocked sites:', blockedSites);
                
                // Check if current hostname matches any blocked site
                const isBlocked = blockedSites.some(site => {
                    const siteLower = site.toLowerCase();
                    return hostname === siteLower || 
                           hostname.endsWith('.' + siteLower) ||
                           hostname.includes(siteLower);
                });
                
                if (isBlocked) {
                    console.log('Content script - BLOCKING:', hostname);
                    // Redirect to blocked page
                    const blockedUrl = chrome.runtime.getURL('blocked.html') + '?site=' + encodeURIComponent(hostname);
                    window.location.href = blockedUrl;
                }
            } catch (e) {
                console.error('Content script - Error:', e);
            }
        });
    }
    
    // Check immediately on page load
    checkIfBlocked();
    
    // Check periodically in case timer starts while page is open
    setInterval(checkIfBlocked, 2000);
    
})();
