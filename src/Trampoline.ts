import { DrawUtils } from './DrawUtils';

export class Trampoline {
    x: number;
    y: number;
    width: number = 30;
    height: number = 15;
    used: boolean = false;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    update(_canvasWidth: number) {
        // Static relative to platform usually, but here just exists
    }

    draw(ctx: CanvasRenderingContext2D) {
        // Legs
        DrawUtils.roughLine(ctx, this.x + 5, this.y + 15, this.x + 5, this.y + 5, 'black', 2);
        DrawUtils.roughLine(ctx, this.x + 25, this.y + 15, this.x + 25, this.y + 5, 'black', 2);

        // Top
        const color = this.used ? '#888' : 'blue';
        DrawUtils.roughRect(ctx, this.x, this.y + 5, this.width, 5, 'black', color);

        // Inner mesh
        ctx.beginPath();
        ctx.moveTo(this.x + 5, this.y + 5);
        ctx.lineTo(this.x + 25, this.y + 10);
        ctx.moveTo(this.x + 25, this.y + 5);
        ctx.lineTo(this.x + 5, this.y + 10);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}
