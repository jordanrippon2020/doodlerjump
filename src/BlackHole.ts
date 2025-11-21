import { DrawUtils } from './DrawUtils';

export class BlackHole {
    x: number;
    y: number;
    width: number = 60;
    height: number = 60;
    angle: number = 0;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    update(_canvasWidth: number) {
        this.angle += 0.1;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle);

        // Draw swirling black hole
        DrawUtils.roughCircle(ctx, 0, 0, 30, 'black', '#2a0a3b');

        // Accretion disk / swirl lines
        for (let i = 0; i < 4; i++) {
            ctx.rotate(Math.PI / 2);
            DrawUtils.roughLine(ctx, 10, 0, 30, 0, '#4b0082');
        }

        ctx.restore();
    }
}
