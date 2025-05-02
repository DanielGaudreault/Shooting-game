class Entity {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    isOutOfBounds(canvas) {
        return (
            this.x + this.radius < 0 ||
            this.y + this.radius < 0 ||
            this.x - this.radius > canvas.width ||
            this.y - this.radius > canvas.height
        );
    }
}

export class Player extends Entity {
    constructor(x, y, radius, color) {
        super(x, y, radius, color, { x: 0, y: 0 });
    }
}

export class Projectile extends Entity {
    constructor(x, y, radius, color, velocity) {
        super(x, y, radius, color, velocity);
    }
}

export class Enemy extends Entity {
    constructor(x, y, radius, color, velocity) {
        super(x, y, radius, color, velocity);
    }
}
