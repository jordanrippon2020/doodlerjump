import { DrawUtils } from './DrawUtils';

export class PropellerHat {
    x: number;
    y: number;
    width: number = 30;
    height: number = 20;
    taken: boolean = false;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.taken) return;

        // Draw Beanie (Multi-colored)
        // Blue base
        DrawUtils.roughArc(ctx, this.x + 15, this.y + 15, 15, Math.PI, 0, 'blue');
        // Yellow band
        DrawUtils.roughLine(ctx, this.x, this.y + 15, this.x + 30, this.y + 15, 'yellow');
        // Red top spot
        DrawUtils.roughCircle(ctx, this.x + 15, this.y, 2, 'red', 'red');

        // Propeller Stem
        DrawUtils.roughLine(ctx, this.x + 15, this.y, this.x + 15, this.y - 8, 'black');

        // Propeller Blades
        const time = Date.now() / 100;
        const bladeWidth = Math.abs(Math.sin(time)) * 22;
        DrawUtils.roughLine(ctx, this.x + 15 - bladeWidth, this.y - 8, this.x + 15 + bladeWidth, this.y - 8, 'red');
        DrawUtils.roughLine(ctx, this.x + 15, this.y - 8 - bladeWidth / 4, this.x + 15, this.y - 8 + bladeWidth / 4, 'red');
    }
}
