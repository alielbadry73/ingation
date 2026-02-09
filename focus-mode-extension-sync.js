// Sync script to connect focus-mode.html with the browser extension
// This script syncs localStorage data with the Chrome extension storage

(function() {
    'use strict';
    
    // Check if extension is installed
    function isExtensionInstalled() {
        return typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;
    }
    
    // Sync data with extension
    function syncWithExtension() {
        if (!isExtensionInstalled()) {
            console.log('Focus Mode Extension not detected');
            return;
        }
        
        try {
            const blockedSites = localStorage.getItem('blockedSites');
            const focusTimerState = localStorage.getItem('focusTimerState');
            
            chrome.runtime.sendMessage({
                type: 'syncStorage',
                blockedSites: blockedSites ? JSON.parse(blockedSites) : [],
                focusTimerState: focusTimerState
            }, (response) => {
                if (chrome.runtime.lastError) {
                    console.log('Extension sync failed:', chrome.runtime.lastError.message);
                } else {
                    console.log('✅ Synced with Focus Mode Extension');
                }
            });
        } catch (e) {
            console.error('Error syncing with extension:', e);
        }
    }
    
    // Sync on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', syncWithExtension);
    } else {
        syncWithExtension();
    }
    
    // Sync every 2 seconds while page is active
    setInterval(syncWithExtension, 2000);
    
    // Sync when localStorage changes
    window.addEventListener('storage', syncWithExtension);
    
    // Override localStorage methods to sync immediately
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        originalSetItem.apply(this, arguments);
        if (key === 'blockedSites' || key === 'focusTimerState') {
            syncWithExtension();
        }
    };
    
    const originalRemoveItem = localStorage.removeItem;
    localStorage.removeItem = function(key) {
        originalRemoveItem.apply(this, arguments);
        if (key === 'blockedSites' || key === 'focusTimerState') {
            syncWithExtension();
        }
    };
    
    // Show extension status
    function showExtensionStatus() {
        if (isExtensionInstalled()) {
            console.log('🎯 Focus Mode Extension is active and syncing');
        } else {
            console.warn('⚠️ Focus Mode Extension not installed. Website blocking will be limited.');
            console.log('Install the extension from: focus-mode-extension/');
        }
    }
    
    showExtensionStatus();
    
})();
