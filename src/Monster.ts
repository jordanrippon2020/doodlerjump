import { DrawUtils } from './DrawUtils';

export class Monster {
    x: number;
    y: number;
    width: number = 40;
    height: number = 40;
    vx: number = 1;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.vx = Math.random() > 0.5 ? 1 : -1;
    }

    update(canvasWidth: number) {
        this.x += this.vx;
        if (this.x <= 0 || this.x + this.width >= canvasWidth) {
            this.vx *= -1;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        const color = '#a335ee'; // Purple

        // Body
        DrawUtils.roughRect(ctx, this.x, this.y, this.width, this.height, 'black', color);

        // Eye
        DrawUtils.roughCircle(ctx, this.x + this.width / 2, this.y + 15, 8, 'black', 'white');
        DrawUtils.roughCircle(ctx, this.x + this.width / 2, this.y + 15, 3, 'black', 'black');

        // Mouth
        DrawUtils.roughLine(ctx, this.x + 10, this.y + 30, this.x + 30, this.y + 30);

        // Wings/Horns
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + 8);
        ctx.lineTo(this.x - 8, this.y - 4);
        ctx.lineTo(this.x, this.y + 16);
        ctx.fill();
        DrawUtils.roughLine(ctx, this.x, this.y + 8, this.x - 8, this.y - 4);
        DrawUtils.roughLine(ctx, this.x - 8, this.y - 4, this.x, this.y + 16);

        ctx.beginPath();
        ctx.moveTo(this.x + this.width, this.y + 8);
        ctx.lineTo(this.x + this.width + 8, this.y - 4);
        ctx.lineTo(this.x + this.width, this.y + 16);
        ctx.fill();
        DrawUtils.roughLine(ctx, this.x + this.width, this.y + 8, this.x + this.width + 8, this.y - 4);
        DrawUtils.roughLine(ctx, this.x + this.width + 8, this.y - 4, this.x + this.width, this.y + 16);
    }
}
