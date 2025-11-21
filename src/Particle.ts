import { DrawUtils } from './DrawUtils';

export class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    life: number;
    maxLife: number;
    size: number;

    constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.maxLife = 30 + Math.random() * 20;
        this.life = this.maxLife;
        this.size = Math.random() * 4 + 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1; // Gravity
        this.life--;
        this.size *= 0.95; // Shrink
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.globalAlpha = this.life / this.maxLife;
        DrawUtils.roughRect(ctx, this.x, this.y, this.size, this.size, this.color, this.color);
        ctx.globalAlpha = 1.0;
    }
}
