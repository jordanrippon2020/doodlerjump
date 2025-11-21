import { DrawUtils } from './DrawUtils';

export class Platform {
    x: number;
    y: number;
    width: number = 60;
    height: number = 15;
    type: 'static' | 'moving' | 'breaking' | 'disappearing';
    broken: boolean = false;
    vy: number = 0;
    vx: number = 0;

    constructor(x: number, y: number, type: 'static' | 'moving' | 'breaking' | 'disappearing' = 'static') {
        this.x = x;
        this.y = y;
        this.type = type;

        if (this.type === 'moving') {
            this.vx = 2;
        }
    }

    update(canvasWidth: number) {
        if (this.type === 'moving') {
            this.x += this.vx;
            if (this.x <= 0 || this.x + this.width >= canvasWidth) {
                this.vx *= -1;
            }
        }

        if (this.broken) {
            this.y += this.vy;
            this.vy += 0.5; // Gravity for falling platform
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.broken) {
            // Draw broken pieces falling
            DrawUtils.roughRect(ctx, this.x, this.y, this.width / 2 - 2, this.height, 'black', '#7d5538');
            DrawUtils.roughRect(ctx, this.x + this.width / 2 + 2, this.y + 5, this.width / 2 - 2, this.height, 'black', '#7d5538');
            return;
        }

        let color = '#57e048'; // Default Green

        if (this.type === 'moving') color = '#6b9be3'; // Blue
        if (this.type === 'breaking') color = '#7d5538'; // Brown
        if (this.type === 'disappearing') color = '#ffffff'; // White

        DrawUtils.roughRoundedRect(ctx, this.x, this.y, this.width, this.height, 5, 'black', color);

        if (this.type === 'breaking') {
            // Draw cracks
            DrawUtils.roughLine(ctx, this.x + 10, this.y, this.x + 20, this.y + 10);
            DrawUtils.roughLine(ctx, this.x + 20, this.y + 10, this.x + 30, this.y);
        }
    }
}
