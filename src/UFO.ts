import { DrawUtils } from './DrawUtils';

export class UFO {
    x: number;
    y: number;
    width: number = 60;
    height: number = 40;
    vx: number = 2;
    lightsTimer: number = 0;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    update(canvasWidth: number) {
        this.x += this.vx;
        if (this.x <= 0 || this.x + this.width >= canvasWidth) {
            this.vx *= -1;
        }
        this.lightsTimer += 0.1;
    }

    draw(ctx: CanvasRenderingContext2D) {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;

        // Dome
        ctx.fillStyle = '#87CEEB'; // Sky blue glass
        ctx.beginPath();
        ctx.arc(centerX, centerY - 5, 15, Math.PI, 0);
        ctx.fill();
        DrawUtils.roughCircle(ctx, centerX, centerY - 5, 15);

        // Alien inside (simple blob)
        DrawUtils.roughCircle(ctx, centerX, centerY - 10, 5, 'black', '#39ff14');

        // Saucer body
        ctx.fillStyle = '#555'; // Grey metal
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + 5, 30, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke(); // Ellipse stroke not in DrawUtils yet, keep simple

        // Lights
        const lightColors = ['red', 'yellow', 'blue'];
        const activeLight = Math.floor(this.lightsTimer) % 3;

        for (let i = 0; i < 3; i++) {
            const color = i === activeLight ? lightColors[i] : '#222';
            DrawUtils.roughCircle(ctx, centerX - 20 + i * 20, centerY + 5, 3, 'black', color);
        }
    }
}
