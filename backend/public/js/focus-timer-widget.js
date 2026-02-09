/**
 * Focus Timer Widget
 * Displays a floating timer widget on all pages when a focus session is active
 */

(function() {
    'use strict';
    
    let widgetUpdateInterval = null;
    let widget = null;
    
    // Initialize widget on page load
    function initTimerWidget() {
        // Don't show widget on focus-mode.html itself
        if (window.location.pathname.includes('focus-mode.html')) {
            return;
        }
        
        // Check if timer is running
        checkAndDisplayWidget();
        
        // Check every second for timer updates
        setInterval(checkAndDisplayWidget, 1000);
    }
    
    function checkAndDisplayWidget() {
        const timerState = localStorage.getItem('focusTimerState');
        
        if (timerState) {
            const state = JSON.parse(timerState);
            
            if (state.isRunning && state.sessionStartTime) {
                // Calculate remaining time
                const elapsed = Math.floor((Date.now() - state.sessionStartTime) / 1000);
                const timeRemaining = Math.max(0, state.totalTime - elapsed);
                
                if (timeRemaining > 0) {
                    showWidget(timeRemaining, state.mode);
                } else {
                    // Timer completed
                    hideWidget();
                    completeSession();
                }
            } else {
                hideWidget();
            }
        } else {
            hideWidget();
        }
    }
    
    function showWidget(timeRemaining, mode) {
        if (!widget) {
            createWidget();
        }
        
        // Update timer display
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        const timeText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        const timerDisplay = widget.querySelector('.widget-timer');
        const modeDisplay = widget.querySelector('.widget-mode');
        
        if (timerDisplay) {
            timerDisplay.textContent = timeText;
        }
        
        if (modeDisplay) {
            const modeEmojis = {
                'pomodoro': '🍅',
                'short': '☕',
                'long': '🌟',
                'custom': '⚙️'
            };
            modeDisplay.textContent = modeEmojis[mode] || '⏱️';
        }
        
        widget.style.display = 'flex';
    }
    
    function hideWidget() {
        if (widget) {
            widget.style.display = 'none';
        }
    }
    
    function createWidget() {
        // Ensure Bootstrap Icons are loaded
        if (!document.querySelector('link[href*="bootstrap-icons"]')) {
            const iconLink = document.createElement('link');
            iconLink.rel = 'stylesheet';
            iconLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css';
            document.head.appendChild(iconLink);
        }
        
        widget = document.createElement('div');
        widget.className = 'focus-timer-widget';
        widget.innerHTML = `
            <div class="widget-content">
                <div class="widget-header">
                    <span class="widget-mode">🍅</span>
                    <span class="widget-label">Focus Mode</span>
                </div>
                <div class="widget-timer">25:00</div>
                <div class="widget-actions">
                    <button class="widget-btn widget-btn-open" onclick="openFocusMode()" title="Open Focus Mode">
                        <i class="bi bi-box-arrow-up-right"></i>
                    </button>
                    <button class="widget-btn widget-btn-pause" onclick="pauseFocusTimer()" title="Pause Timer">
                        <i class="bi bi-pause-fill"></i>
                    </button>
                    <button class="widget-btn widget-btn-stop" onclick="stopFocusTimer()" title="Stop Timer">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .focus-timer-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 16px;
                padding: 1rem 1.5rem;
                box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
                z-index: 9999;
                display: none;
                animation: slideIn 0.3s ease-out;
                min-width: 200px;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateY(100px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            .widget-content {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                color: white;
            }
            
            .widget-header {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.85rem;
                opacity: 0.9;
            }
            
            .widget-mode {
                font-size: 1.2rem;
            }
            
            .widget-label {
                font-weight: 600;
            }
            
            .widget-timer {
                font-size: 2rem;
                font-weight: bold;
                font-family: 'Courier New', monospace;
                text-align: center;
                letter-spacing: 2px;
            }
            
            .widget-actions {
                display: flex;
                gap: 0.5rem;
                justify-content: center;
            }
            
            .widget-btn {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 36px;
                height: 36px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1rem;
                position: relative;
            }
            
            .widget-btn i {
                font-size: 1rem;
                line-height: 1;
            }
            
            .widget-btn:hover {
                background: rgba(255, 255, 255, 0.35);
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }
            
            .widget-btn:active {
                transform: translateY(0);
            }
            
            .widget-btn-open:hover {
                background: rgba(34, 197, 94, 0.8);
            }
            
            .widget-btn-pause:hover {
                background: rgba(251, 191, 36, 0.8);
            }
            
            .widget-btn-stop:hover {
                background: rgba(239, 68, 68, 0.8);
            }
            
            @media (max-width: 768px) {
                .focus-timer-widget {
                    bottom: 10px;
                    right: 10px;
                    padding: 0.75rem 1rem;
                    min-width: 160px;
                }
                
                .widget-timer {
                    font-size: 1.5rem;
                }
                
                .widget-btn {
                    width: 32px;
                    height: 32px;
                }
                
                .widget-btn i {
                    font-size: 0.9rem;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(widget);
    }
    
    function completeSession() {
        // Get timer state
        const timerState = localStorage.getItem('focusTimerState');
        if (!timerState) return;
        
        const state = JSON.parse(timerState);
        const sessionDuration = state.sessionStartTime ? 
            Math.floor((Date.now() - state.sessionStartTime) / 1000) : 0;
        
        // Save session to history
        const sessions = JSON.parse(localStorage.getItem('focusSessions') || '[]');
        sessions.unshift({
            date: new Date().toISOString(),
            duration: sessionDuration,
            mode: state.mode
        });
        
        // Keep only last 50 sessions
        if (sessions.length > 50) {
            sessions.pop();
        }
        
        localStorage.setItem('focusSessions', JSON.stringify(sessions));
        
        // Clear timer state
        localStorage.removeItem('focusTimerState');
        
        // Play ticking alarm sound
        playTickingAlarm();
        
        // Show completion notification after sound
        setTimeout(() => {
            showNotification('🎉 Focus session complete! Great job!');
        }, 1000);
        
        hideWidget();
    }
    
    function playTickingAlarm() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            function playTick(delay) {
                setTimeout(() => {
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    oscillator.frequency.value = 800;
                    oscillator.type = 'sine';
                    
                    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                    
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.1);
                }, delay);
            }
            
            // Play 3 ticks
            playTick(0);
            playTick(300);
            playTick(600);
        } catch (e) {
            console.log('Could not play ticking sound:', e);
        }
    }
    
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(16, 185, 129, 0.4);
            z-index: 10000;
            animation: slideInTop 0.3s ease-out;
            font-family: 'Jost', sans-serif;
            font-weight: 600;
        `;
        notification.textContent = message;
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInTop {
                from {
                    transform: translateY(-100px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideInTop 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
    
    // Global functions for widget buttons
    window.openFocusMode = function() {
        window.location.href = 'focus-mode.html';
    };
    
    window.pauseFocusTimer = function() {
        const timerState = localStorage.getItem('focusTimerState');
        if (timerState) {
            const state = JSON.parse(timerState);
            
            // Calculate current time remaining
            const elapsed = Math.floor((Date.now() - state.sessionStartTime) / 1000);
            const timeRemaining = Math.max(0, state.totalTime - elapsed);
            
            // Update state to paused
            state.isRunning = false;
            state.timeRemaining = timeRemaining;
            state.sessionStartTime = null;
            
            localStorage.setItem('focusTimerState', JSON.stringify(state));
            
            showNotification('⏸️ Timer paused');
            hideWidget();
        }
    };
    
    window.stopFocusTimer = function() {
        if (confirm('Are you sure you want to stop the focus timer?')) {
            localStorage.removeItem('focusTimerState');
            showNotification('🛑 Timer stopped');
            hideWidget();
        }
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTimerWidget);
    } else {
        initTimerWidget();
    }
})();
