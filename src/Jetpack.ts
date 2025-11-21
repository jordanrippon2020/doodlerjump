import { DrawUtils } from './DrawUtils';

export class Jetpack {
    x: number;
    y: number;
    width: number = 20;
    height: number = 30;
    taken: boolean = false;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    update(canvasWidth: number) {
        // Static until picked up
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.taken) return;

        // Tanks
        DrawUtils.roughRect(ctx, this.x, this.y, 8, 25, 'black', 'gray');
        DrawUtils.roughRect(ctx, this.x + 12, this.y, 8, 25, 'black', 'gray');

        // Straps
        DrawUtils.roughLine(ctx, this.x + 4, this.y + 5, this.x + 16, this.y + 5, 'black', 2);
        DrawUtils.roughLine(ctx, this.x + 4, this.y + 20, this.x + 16, this.y + 20, 'black', 2);

        // Thrusters
        ctx.fillStyle = 'orange';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + 25);
        ctx.lineTo(this.x + 4, this.y + 35);
        ctx.lineTo(this.x + 8, this.y + 25);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.x + 12, this.y + 25);
        ctx.lineTo(this.x + 16, this.y + 35);
        ctx.lineTo(this.x + 20, this.y + 25);
        ctx.fill();
    }
}
