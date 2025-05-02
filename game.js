import { Player, Projectile, Enemy } from './entities.js';

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

// Game elements
const startGameBtn = document.querySelector("#start-game-button");
const popup = document.querySelector("#popup");
const scoreEl = document.querySelector("#score");
const popupScore = document.querySelector("#popup-score");

// Game setup
canvas.width = innerWidth;
canvas.height = innerHeight;

// Game state
let player;
let projectiles = [];
let enemies = [];
let score = 0;
let animationId;
let spawnInterval;
let isGameRunning = false;

// Initialize game
function initGame() {
    player = new Player(canvas.width / 2, canvas.height / 2, 10, "white");
    projectiles = [];
    enemies = [];
    score = 0;
    scoreEl.textContent = score;
}

// Game loop
function animate() {
    animationId = requestAnimationFrame(animate);
    
    // Clear canvas with semi-transparent black for trail effect
    context.fillStyle = "rgba(0, 0, 0, 0.1)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    player.draw(context);

    // Update and check projectiles
    projectiles.forEach((projectile, pIndex) => {
        projectile.update();
        
        if (projectile.isOutOfBounds(canvas)) {
            projectiles.splice(pIndex, 1);
            return;
        }

        // Check collision with enemies
        enemies.forEach((enemy, eIndex) => {
            const dist = Math.hypot(
                projectile.x - enemy.x,
                projectile.y - enemy.y
            );
            
            if (dist < enemy.radius + projectile.radius) {
                // Reduce enemy size or remove
                if (enemy.radius > 20) {
                    score += 100;
                    enemy.radius -= 10;
                } else {
                    score += 250;
                    enemies.splice(eIndex, 1);
                }
                projectiles.splice(pIndex, 1);
                scoreEl.textContent = score;
            }
        });
    });

    // Update and check enemies
    enemies.forEach((enemy) => {
        enemy.update();
        
        // Check collision with player
        const dist = Math.hypot(enemy.x - player.x, enemy.y - player.y);
        if (dist < enemy.radius + player.radius) {
            endGame();
        }
    });
}

function spawnEnemy() {
    const radius = Math.random() * 15 + 10;
    let x, y;

    if (Math.random() < 0.5) {
        x = Math.random() < 0.5 ? -radius : canvas.width + radius;
        y = Math.random() * canvas.height;
    } else {
        x = Math.random() * canvas.width;
        y = Math.random() < 0.5 ? -radius : canvas.height + radius;
    }

    const color = `hsl(${Math.random() * 360}, 70%, 60%)`;
    const angle = Math.atan2(player.y - y, player.x - x);
    const speed = 1 + Math.random() * 2;
    const velocity = {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed
    };

    enemies.push(new Enemy(x, y, radius, color, velocity));
}

function startGame() {
    if (isGameRunning) return;
    isGameRunning = true;
    
    popup.style.display = "none";
    initGame();
    
    // Start game loop
    animate();
    
    // Start enemy spawning
    spawnInterval = setInterval(spawnEnemy, 1000);
    
    // Add shooting controls
    canvas.addEventListener("click", shoot);
}

function endGame() {
    isGameRunning = false;
    cancelAnimationFrame(animationId);
    clearInterval(spawnInterval);
    canvas.removeEventListener("click", shoot);
    
    popupScore.textContent = score;
    popup.style.display = "flex";
}

function shoot(event) {
    const angle = Math.atan2(
        event.clientY - player.y,
        event.clientX - player.x
    );
    const velocity = {
        x: Math.cos(angle) * 7,
        y: Math.sin(angle) * 7
    };
    
    projectiles.push(
        new Projectile(
            player.x,
            player.y,
            5,
            "white",
            velocity
        )
    );
}

// Handle window resize
window.addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    if (player) {
        player.x = canvas.width / 2;
        player.y = canvas.height / 2;
    }
});

// Start game button
startGameBtn.addEventListener("click", startGame);
