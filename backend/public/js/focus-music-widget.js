/**
 * Focus Music Widget
 * Displays a floating music player widget on all pages when music is playing
 */

(function() {
    'use strict';
    
    let widget = null;
    let player = null;
    let isPlaying = false;
    
    // Initialize widget on page load
    function initMusicWidget() {
        // Don't show widget on focus-mode.html itself
        if (window.location.pathname.includes('focus-mode.html')) {
            return;
        }
        
        // Check if music is playing
        checkAndDisplayWidget();
        
        // Check every second for music state updates
        setInterval(checkAndDisplayWidget, 1000);
    }
    
    function checkAndDisplayWidget() {
        const musicState = localStorage.getItem('focusMusicState');
        
        if (musicState) {
            const state = JSON.parse(musicState);
            
            // Show widget if music state exists (playing or paused)
            showWidget(state);
        } else {
            hideWidget();
        }
    }
    
    function showWidget(state) {
        if (!widget) {
            createWidget();
        }
        
        // Update widget display
        const trackTitle = widget.querySelector('.music-track-title');
        const categoryName = widget.querySelector('.music-category');
        
        if (trackTitle) {
            trackTitle.textContent = state.trackTitle || 'Unknown Track';
        }
        
        if (categoryName) {
            categoryName.textContent = state.categoryIcon + ' ' + state.categoryName;
        }
        
        // Load player only if not already loaded or if track changed
        const currentPlayer = document.getElementById('audioPlayer');
        if (!currentPlayer || !currentPlayer.src || !currentPlayer.src.includes(state.streamUrl)) {
            loadTrack(state.trackUrl, state.videoId, state.streamUrl, state.isPlaying);
        } else {
            // Update playing state based on state
            if (state.isPlaying && currentPlayer.paused) {
                currentPlayer.play().catch(err => console.log('Play error:', err));
                isPlaying = true;
            } else if (!state.isPlaying && !currentPlayer.paused) {
                currentPlayer.pause();
                isPlaying = false;
            } else {
                isPlaying = !currentPlayer.paused;
            }
            updatePlayStopButton();
        }
        
        widget.style.display = 'flex';
    }
    
    function hideWidget() {
        if (widget) {
            widget.style.display = 'none';
        }
        if (player) {
            stopMusic();
        }
    }
    
    function loadTrack(url, videoId, streamUrl, shouldPlay = true) {
        const playerContainer = document.getElementById('musicPlayerContainer');
        
        if (streamUrl && playerContainer) {
            // Check if audio already exists and is playing
            const existingAudio = document.getElementById('audioPlayer');
            if (existingAudio && !existingAudio.paused) {
                return; // Don't recreate if already playing
            }
            
            // HTML5 audio player (hidden, controlled by button)
            playerContainer.innerHTML = `
                <audio id="audioPlayer" loop style="display: none;">
                    <source src="${streamUrl}" type="audio/mpeg">
                </audio>
            `;
            
            const audio = document.getElementById('audioPlayer');
            if (audio) {
                audio.volume = 0.5;
                player = audio;
                
                // Auto-play only if shouldPlay is true
                if (shouldPlay) {
                    audio.play().then(() => {
                        isPlaying = true;
                        updatePlayStopButton();
                    }).catch(err => {
                        console.log('Autoplay prevented:', err);
                        isPlaying = false;
                        updatePlayStopButton();
                    });
                } else {
                    isPlaying = false;
                    updatePlayStopButton();
                }
            }
        }
    }
    
    function updatePlayStopButton() {
        const btn = document.getElementById('playStopBtn');
        if (btn) {
            if (isPlaying) {
                btn.innerHTML = '<i class="bi bi-pause-fill"></i>';
                btn.title = 'Pause';
            } else {
                btn.innerHTML = '<i class="bi bi-play-fill"></i>';
                btn.title = 'Play';
            }
        }
    }
    
    // Global function for play/stop toggle
    window.toggleMusicPlayback = function() {
        const audio = document.getElementById('audioPlayer');
        if (audio) {
            if (isPlaying) {
                // Pause music (don't remove widget or clear state)
                audio.pause();
                isPlaying = false;
                
                // Update state to paused
                const musicState = localStorage.getItem('focusMusicState');
                if (musicState) {
                    const state = JSON.parse(musicState);
                    state.isPlaying = false;
                    localStorage.setItem('focusMusicState', JSON.stringify(state));
                }
                
                updatePlayStopButton();
            } else {
                // Resume music
                audio.play().then(() => {
                    isPlaying = true;
                    
                    // Update state to playing
                    const musicState = localStorage.getItem('focusMusicState');
                    if (musicState) {
                        const state = JSON.parse(musicState);
                        state.isPlaying = true;
                        localStorage.setItem('focusMusicState', JSON.stringify(state));
                    }
                    
                    updatePlayStopButton();
                }).catch(err => {
                    console.log('Play error:', err);
                });
            }
        }
    };
    
    function createWidget() {
        // Ensure Bootstrap Icons are loaded
        if (!document.querySelector('link[href*="bootstrap-icons"]')) {
            const iconLink = document.createElement('link');
            iconLink.rel = 'stylesheet';
            iconLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css';
            document.head.appendChild(iconLink);
        }
        
        widget = document.createElement('div');
        widget.className = 'focus-music-widget';
        widget.innerHTML = `
            <div class="music-widget-content">
                <div class="music-widget-header">
                    <div>
                        <div class="music-track-title">Loading...</div>
                        <div class="music-category">🎵 Focus Sounds</div>
                    </div>
                    <button class="music-widget-close" onclick="closeMusicWidget()" title="Close Widget">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
                <div class="music-widget-controls">
                    <button class="music-widget-btn" onclick="toggleMusicPlayback()" title="Play/Pause" id="playStopBtn">
                        <i class="bi bi-play-fill"></i>
                    </button>
                    <button class="music-widget-btn" onclick="openFocusModePage()" title="Open Focus Mode">
                        <i class="bi bi-box-arrow-up-right"></i>
                    </button>
                </div>
                <div id="musicPlayerContainer" style="display: none;"></div>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .focus-music-widget {
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
                border-radius: 16px;
                padding: 1rem 1.5rem;
                box-shadow: 0 8px 32px rgba(34, 197, 94, 0.4);
                z-index: 9998;
                display: none;
                animation: slideInLeft 0.3s ease-out;
                min-width: 320px;
                max-width: 400px;
            }
            
            @keyframes slideInLeft {
                from {
                    transform: translateX(-100px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            .music-widget-content {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                color: white;
            }
            
            .music-widget-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                gap: 1rem;
            }
            
            .music-track-title {
                font-weight: 600;
                font-size: 0.95rem;
                margin-bottom: 0.25rem;
                line-height: 1.3;
            }
            
            .music-category {
                font-size: 0.8rem;
                opacity: 0.9;
            }
            
            .music-widget-close {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 28px;
                height: 28px;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }
            
            .music-widget-close:hover {
                background: rgba(255, 255, 255, 0.3);
            }
            
            .music-widget-controls {
                display: flex;
                gap: 0.5rem;
                justify-content: center;
                padding-top: 0.5rem;
                border-top: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .music-widget-btn {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.1rem;
            }
            
            .music-widget-btn i {
                font-size: 1.1rem;
                line-height: 1;
            }
            
            .music-widget-btn:hover {
                background: rgba(255, 255, 255, 0.35);
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }
            
            .music-widget-btn:active {
                transform: translateY(0);
            }
            
            @media (max-width: 768px) {
                .focus-music-widget {
                    bottom: 80px;
                    left: 10px;
                    right: 10px;
                    min-width: auto;
                    max-width: none;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(widget);
    }
    
    function stopMusic() {
        const playerContainer = document.getElementById('musicPlayerContainer');
        if (playerContainer) {
            playerContainer.innerHTML = '';
        }
        player = null;
        isPlaying = false;
    }
    
    // Global functions for widget buttons
    window.closeMusicWidget = function() {
        // Stop music completely
        const audio = document.getElementById('audioPlayer');
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
        
        stopMusic();
        localStorage.removeItem('focusMusicState');
        hideWidget();
    };
    
    window.stopMusicWidget = function() {
        stopMusic();
        localStorage.removeItem('focusMusicState');
        hideWidget();
    };
    
    window.openFocusModePage = function() {
        window.location.href = 'focus-mode.html';
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMusicWidget);
    } else {
        initMusicWidget();
    }
})();
