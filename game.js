class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.enemies = [];
        this.projectiles = [];
        this.spawnInterval = null;

        // Set canvas size
        this.canvas.width = 800;
        this.canvas.height = 600;

        this.init();
    }

    init() {
        // Start spawning enemies
        this.spawnEnemies();

        // Add click listener for projectiles
        this.canvas.addEventListener("click", (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const angle = Math.atan2(
                event.clientY - rect.top - this.canvas.height / 2,
                event.clientX - rect.left - this.canvas.width / 2
            );
            const velocity = {
                x: Math.cos(angle) * 5,
                y: Math.sin(angle) * 5,
            };
            this.projectiles.push(
                new Projectile(
                    this.canvas.width / 2,
                    this.canvas.height / 2,
                    5,
                    "white",
                    velocity
                )
            );
        });

        // Start animation
        this.animate();
    }

    spawnEnemies() {
        this.spawnInterval = setInterval(() => {
            const radius = 15 * Math.random() + 10;
            let x, y;

            if (Math.random() < 0.5) {
                x = Math.random() < 0.5 ? -radius : this.canvas.width + radius;
                y = Math.random() * this.canvas.height;
            } else {
                x = Math.random() * this.canvas.width;
                y = Math.random() < 0.5 ? -radius : this.canvas.height + radius;
            }

            const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
            const angle = Math.atan2(
                this.canvas.height / 2 - y,
                this.canvas.width / 2 - x
            );
            const velocity = {
                x: Math.cos(angle),
                y: Math.sin(angle),
            };
            this.enemies.push(new Enemy(x, y, radius, color, velocity));
        }, 1000);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw projectiles
        this.projectiles = this.projectiles.filter((projectile) => {
            projectile.update();
            projectile.draw(this.ctx);
            // Remove projectiles that are off-screen
            return (
                projectile.x >= 0 &&
                projectile.x <= this.canvas.width &&
                projectile.y >= 0 &&
                projectile.y <= this.canvas.height
            );
        });

        // Update and draw enemies
        this.enemies.forEach((enemy) => {
            enemy.update();
            enemy.draw(this.ctx);
        });
    }

    stopSpawning() {
        if (this.spawnInterval) {
            clearInterval(this.spawnInterval);
            this.spawnInterval = null;
        }
    }
}

// Initialize the game
const canvas = document.getElementById("gameCanvas");
const game = new Game(canvas);
