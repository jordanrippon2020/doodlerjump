import { DrawUtils } from './DrawUtils';

export class Projectile {
    x: number;
    y: number;
    width: number = 10;
    height: number = 10;
    vy: number = -10;
    markedForDeletion: boolean = false;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    update() {
        this.y += this.vy;
        if (this.y < -10) {
            this.markedForDeletion = true;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        DrawUtils.roughCircle(ctx, this.x + 5, this.y + 5, 5, 'black', 'red');
    }
}
