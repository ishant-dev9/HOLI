/**
 * script.js
 * Holi Special Interactive Website Logic
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // --- ELEMENTS ---
    const sections = {
        hero: document.getElementById('hero-section'),
        unlock: document.getElementById('unlock-section'),
        message: document.getElementById('message-section'),
        game: document.getElementById('game-section')
    };

    const startBtn = document.getElementById('start-btn');
    const toGameBtn = document.getElementById('to-game-btn');
    const restartBtn = document.getElementById('restart-btn');

    const splashArea = document.getElementById('splash-area');
    const splashCountDisplay = document.getElementById('splash-count');
    const colorCircles = document.querySelectorAll('.color-circle');

    // --- STATE ---
    let currentSplashCount = 0;
    let selectedColor = '#FFB7B2';
    let gameState = {
        score: 0,
        missed: 0,
        goal: 12,
        active: false,
        drops: []
    };

    // --- INITIALIZATION ---
    initConfetti();
    setupNavigation();
    setupSplashInteraction();
    setupGame();

    // --- NAVIGATION ---
    function setupNavigation() {
        if (startBtn) {
            startBtn.addEventListener('click', function() {
                console.log("Start button clicked");
                transitionTo('unlock');
            });
        }

        if (toGameBtn) {
            toGameBtn.addEventListener('click', function() {
                transitionTo('game');
                startGame();
            });
        }

        if (restartBtn) {
            restartBtn.addEventListener('click', function() {
                resetGame();
                startGame();
            });
        }
    }

    function transitionTo(sectionKey) {
        // Fade out current
        Object.values(sections).forEach(s => {
            if (s && s.classList.contains('active')) {
                s.style.opacity = '0';
                s.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    s.classList.remove('active');
                    s.style.display = 'none';
                    
                    // Show new
                    const next = sections[sectionKey];
                    if (next) {
                        next.style.display = 'block';
                        setTimeout(() => {
                            next.classList.add('active');
                            next.style.opacity = '1';
                            next.style.transform = 'translateY(0)';
                        }, 50);
                    }
                }, 800);
            }
        });
    }

    // --- CONFETTI BACKGROUND ---
    function initConfetti() {
        const container = document.getElementById('confetti-container');
        if (!container) return;
        const colors = ['#FFB7B2', '#B2E2F2', '#B2F2BB', '#F2E2B2', '#FFD700', '#FF8A8A'];
        
        for (let i = 0; i < 50; i++) {
            createConfettiPiece(container, colors);
        }
    }

    function createConfettiPiece(container, colors) {
        const piece = document.createElement('div');
        piece.className = 'confetti';
        
        const size = Math.random() * 10 + 5;
        const left = Math.random() * 100;
        const delay = Math.random() * 10;
        const duration = Math.random() * 5 + 5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        piece.style.width = `${size}px`;
        piece.style.height = `${size}px`;
        piece.style.left = `${left}%`;
        piece.style.backgroundColor = color;
        piece.style.animationDelay = `${delay}s`;
        piece.style.animationDuration = `${duration}s`;
        
        container.appendChild(piece);
        
        // Loop confetti
        piece.addEventListener('animationiteration', () => {
            piece.style.left = `${Math.random() * 100}%`;
        });
    }

    // --- SPLASH INTERACTION ---
    function setupSplashInteraction() {
        if (!splashArea) return;
        
        colorCircles.forEach(circle => {
            circle.addEventListener('click', () => {
                colorCircles.forEach(c => c.classList.remove('selected'));
                circle.classList.add('selected');
                selectedColor = circle.dataset.color;
            });
        });

        splashArea.addEventListener('click', (e) => {
            const rect = splashArea.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            createSplash(x, y);
            
            currentSplashCount++;
            if (splashCountDisplay) splashCountDisplay.textContent = currentSplashCount;
            
            if (currentSplashCount === 4) {
                setTimeout(() => {
                    transitionTo('message');
                }, 1000);
            }
        });
    }

    function createSplash(x, y) {
        const splash = document.createElement('div');
        splash.className = 'color-splash';
        
        const splashImages = [
            'https://cdn-icons-png.flaticon.com/512/5900/5900543.png',
            'https://cdn-icons-png.flaticon.com/512/5900/5900547.png',
            'https://cdn-icons-png.flaticon.com/512/5900/5900551.png'
        ];
        
        const randomImg = splashImages[Math.floor(Math.random() * splashImages.length)];
        
        splash.style.left = `${x - 50}px`;
        splash.style.top = `${y - 50}px`;
        splash.style.backgroundColor = selectedColor;
        splash.style.maskImage = `url(${randomImg})`;
        splash.style.webkitMaskImage = `url(${randomImg})`;
        splash.style.maskSize = 'contain';
        splash.style.webkitMaskSize = 'contain';
        splash.style.maskRepeat = 'no-repeat';
        splash.style.webkitMaskRepeat = 'no-repeat';
        
        splashArea.appendChild(splash);
    }

    // --- GAME LOGIC: CATCH THE COLORS ---
    function setupGame() {
        const container = document.getElementById('game-canvas-container');
        const basket = document.getElementById('basket');
        if (!container || !basket) return;
        
        // Mouse movement for basket
        container.addEventListener('mousemove', (e) => {
            if (!gameState.active) return;
            const rect = container.getBoundingClientRect();
            let x = e.clientX - rect.left;
            
            const basketWidth = basket.offsetWidth;
            if (x < basketWidth / 2) x = basketWidth / 2;
            if (x > rect.width - basketWidth / 2) x = rect.width - basketWidth / 2;
            
            basket.style.left = `${x}px`;
        });

        // Touch support
        container.addEventListener('touchmove', (e) => {
            if (!gameState.active) return;
            e.preventDefault();
            const rect = container.getBoundingClientRect();
            const touch = e.touches[0];
            let x = touch.clientX - rect.left;
            
            const basketWidth = basket.offsetWidth;
            if (x < basketWidth / 2) x = basketWidth / 2;
            if (x > rect.width - basketWidth / 2) x = rect.width - basketWidth / 2;
            
            basket.style.left = `${x}px`;
        }, { passive: false });
    }

    function startGame() {
        gameState.active = true;
        gameState.score = 0;
        gameState.missed = 0;
        gameState.drops = [];
        updateGameStats();
        
        const overlay = document.getElementById('game-over-overlay');
        if (overlay) overlay.classList.add('hidden');
        
        gameLoop();
    }

    function gameLoop() {
        if (!gameState.active) return;

        // Spawn drops
        if (Math.random() < 0.03) {
            spawnDrop();
        }

        // Update drops
        const container = document.getElementById('game-canvas-container');
        const basket = document.getElementById('basket');
        if (!container || !basket) return;
        
        const basketRect = basket.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        gameState.drops.forEach((drop, index) => {
            drop.y += drop.speed;
            drop.element.style.top = `${drop.y}px`;

            const dropRect = drop.element.getBoundingClientRect();

            // Collision detection
            if (
                dropRect.bottom >= basketRect.top &&
                dropRect.right >= basketRect.left &&
                dropRect.left <= basketRect.right &&
                dropRect.top <= basketRect.bottom
            ) {
                // Caught!
                gameState.score++;
                drop.element.remove();
                gameState.drops.splice(index, 1);
                updateGameStats();
                
                if (gameState.score >= gameState.goal) {
                    endGame(true);
                }
            } 
            // Missed
            else if (drop.y > containerRect.height) {
                gameState.missed++;
                drop.element.remove();
                gameState.drops.splice(index, 1);
                updateGameStats();
                
                if (gameState.missed >= 3) {
                    endGame(false);
                }
            }
        });

        requestAnimationFrame(gameLoop);
    }

    function spawnDrop() {
        const container = document.getElementById('game-canvas-container');
        if (!container) return;
        const colors = ['#FFB7B2', '#B2E2F2', '#B2F2BB', '#F2E2B2', '#FF8A8A'];
        
        const drop = document.createElement('div');
        drop.className = 'color-drop';
        
        const x = Math.random() * (container.offsetWidth - 30);
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        drop.style.left = `${x}px`;
        drop.style.top = `-30px`;
        drop.style.backgroundColor = color;
        
        container.appendChild(drop);
        
        gameState.drops.push({
            element: drop,
            y: -30,
            speed: Math.random() * 2 + 2
        });
    }

    function updateGameStats() {
        const scoreEl = document.getElementById('score');
        const missedEl = document.getElementById('missed');
        if (scoreEl) scoreEl.textContent = gameState.score;
        if (missedEl) missedEl.textContent = gameState.missed;
    }

    function endGame(win) {
        gameState.active = false;
        const overlay = document.getElementById('game-over-overlay');
        const title = document.getElementById('game-result-title');
        const text = document.getElementById('game-result-text');
        
        if (overlay) overlay.classList.remove('hidden');
        
        if (win) {
            if (title) title.textContent = "You Won! 🎉";
            if (text) text.textContent = `Amazing! You caught all ${gameState.score} colors for Manika.`;
        } else {
            if (title) title.textContent = "Game Over";
            if (text) text.textContent = `You caught ${gameState.score} colors. Try again to reach 12!`;
        }
        
        // Clean up remaining drops
        gameState.drops.forEach(d => d.element.remove());
        gameState.drops = [];
    }

    function resetGame() {
        gameState.score = 0;
        gameState.missed = 0;
        updateGameStats();
    }
});
