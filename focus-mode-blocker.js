// Focus Mode Website Blocker
// This script should be included on all pages to enforce website blocking

(function() {
    'use strict';
    
    // Check if we should block the current page
    function checkAndBlockSite() {
        // Don't block the focus mode page itself
        if (window.location.href.includes('focus-mode.html')) {
            return;
        }
        
        // Check if timer is running
        const timerState = localStorage.getItem('focusTimerState');
        if (!timerState) {
            return; // No active focus session
        }
        
        const state = JSON.parse(timerState);
        if (!state.isRunning) {
            return; // Timer is paused
        }
        
        // Get blocked sites list
        const blockedSites = JSON.parse(localStorage.getItem('blockedSites') || '[]');
        if (blockedSites.length === 0) {
            return; // No sites blocked
        }
        
        // Check if current URL matches any blocked site
        const currentUrl = window.location.href.toLowerCase();
        const currentHostname = window.location.hostname.toLowerCase();
        
        const isBlocked = blockedSites.some(site => {
            const siteLower = site.toLowerCase();
            return currentUrl.includes(siteLower) || currentHostname.includes(siteLower);
        });
        
        if (isBlocked) {
            // Show blocking overlay
            showBlockedOverlay();
        }
    }
    
    // Show blocked website overlay
    function showBlockedOverlay() {
        // Create overlay if it doesn't exist
        let overlay = document.getElementById('focusModeBlockOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'focusModeBlockOverlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.98);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Jost', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            `;
            
            overlay.innerHTML = `
                <div style="text-align: center; color: white; padding: 3rem;">
                    <div style="font-size: 6rem; margin-bottom: 1rem;">🚫</div>
                    <h1 style="font-size: 3rem; margin-bottom: 1rem; font-weight: 700;">Website Blocked</h1>
                    <p style="font-size: 1.5rem; color: rgba(255,255,255,0.8); margin-bottom: 2rem;">
                        This site is blocked during your focus session.
                    </p>
                    <p style="font-size: 1.2rem; color: rgba(255,255,255,0.6); margin-bottom: 3rem;">
                        Stay focused on your studies! 📚
                    </p>
                    <div style="display: flex; gap: 1rem; justify-content: center;">
                        <button onclick="window.location.href='focus-mode.html'" style="
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            border: none;
                            padding: 1rem 2rem;
                            border-radius: 12px;
                            font-size: 1.1rem;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.3s;
                        ">
                            Return to Focus Mode
                        </button>
                        <button onclick="document.getElementById('focusModeBlockOverlay').remove()" style="
                            background: rgba(255,255,255,0.1);
                            color: white;
                            border: 2px solid rgba(255,255,255,0.3);
                            padding: 1rem 2rem;
                            border-radius: 12px;
                            font-size: 1.1rem;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.3s;
                        ">
                            Close (Not Recommended)
                        </button>
                    </div>
                    <p style="font-size: 0.9rem; color: rgba(255,255,255,0.4); margin-top: 2rem;">
                        Time remaining: <span id="focusTimeRemaining">Loading...</span>
                    </p>
                </div>
            `;
            
            document.body.appendChild(overlay);
            document.body.style.overflow = 'hidden';
            
            // Update time remaining
            updateTimeRemaining();
            setInterval(updateTimeRemaining, 1000);
        }
    }
    
    // Update time remaining display
    function updateTimeRemaining() {
        const timerState = localStorage.getItem('focusTimerState');
        if (!timerState) {
            return;
        }
        
        const state = JSON.parse(timerState);
        if (!state.isRunning || !state.sessionStartTime) {
            return;
        }
        
        const elapsed = Math.floor((Date.now() - state.sessionStartTime) / 1000);
        const remaining = Math.max(0, state.totalTime - elapsed);
        
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        
        const timeDisplay = document.getElementById('focusTimeRemaining');
        if (timeDisplay) {
            timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    // Run check on page load
    checkAndBlockSite();
    
    // Check periodically (every 2 seconds)
    setInterval(checkAndBlockSite, 2000);
    
    // Prevent navigation to blocked sites
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && link.href) {
            const timerState = localStorage.getItem('focusTimerState');
            if (timerState) {
                const state = JSON.parse(timerState);
                if (state.isRunning) {
                    const blockedSites = JSON.parse(localStorage.getItem('blockedSites') || '[]');
                    const linkUrl = link.href.toLowerCase();
                    
                    const isBlocked = blockedSites.some(site => linkUrl.includes(site.toLowerCase()));
                    
                    if (isBlocked) {
                        e.preventDefault();
                        alert('🚫 This website is blocked during your focus session!');
                        return false;
                    }
                }
            }
        }
    }, true);
    
})();
