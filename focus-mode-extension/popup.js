// Popup script for Focus Mode extension

function updateStatus() {
    chrome.storage.local.get(['focusTimerState', 'blockedSites'], (data) => {
        const statusText = document.getElementById('statusText');
        const timerDisplay = document.getElementById('timerDisplay');
        const blockedCount = document.getElementById('blockedCount');
        
        // Update blocked sites count
        const sites = data.blockedSites || [];
        blockedCount.textContent = `${sites.length} site${sites.length !== 1 ? 's' : ''} blocked`;
        
        if (!data.focusTimerState) {
            statusText.textContent = '⏸️ No active session';
            timerDisplay.textContent = '--:--';
            return;
        }
        
        try {
            const state = JSON.parse(data.focusTimerState);
            
            if (!state.isRunning) {
                statusText.textContent = '⏸️ Session paused';
                const minutes = Math.floor(state.timeRemaining / 60);
                const seconds = state.timeRemaining % 60;
                timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                return;
            }
            
            if (state.sessionStartTime) {
                statusText.textContent = '✅ Focus mode active';
                
                const elapsed = Math.floor((Date.now() - state.sessionStartTime) / 1000);
                const remaining = Math.max(0, state.totalTime - elapsed);
                
                const minutes = Math.floor(remaining / 60);
                const seconds = remaining % 60;
                timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        } catch (e) {
            statusText.textContent = '❌ Error loading status';
            timerDisplay.textContent = '--:--';
        }
    });
}

function openFocusMode() {
    chrome.tabs.create({ url: 'http://localhost:3000/focus-mode.html' });
}

function quickStart() {
    // Set blocked sites
    const blockedSites = ['instagram.com', 'facebook.com', 'twitter.com', 'tiktok.com'];
    
    // Set timer for 5 minutes
    const timerState = {
        mode: 'custom',
        timeRemaining: 300,
        totalTime: 300,
        isRunning: true,
        sessionStartTime: Date.now()
    };
    
    chrome.storage.local.set({
        blockedSites: blockedSites,
        focusTimerState: JSON.stringify(timerState)
    }, () => {
        console.log('Quick start activated!');
        updateStatus();
        
        // Show confirmation
        const statusText = document.getElementById('statusText');
        statusText.textContent = '🚀 Session started!';
        
        setTimeout(() => {
            updateStatus();
        }, 1000);
    });
}

function stopSession() {
    chrome.storage.local.remove('focusTimerState', () => {
        console.log('Session stopped');
        updateStatus();
        
        const statusText = document.getElementById('statusText');
        statusText.textContent = '⏹️ Session stopped';
    });
}

// Update status every second
updateStatus();
setInterval(updateStatus, 1000);
