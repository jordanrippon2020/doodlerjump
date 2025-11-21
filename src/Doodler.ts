import { DrawUtils } from './DrawUtils';

export class Doodler {
    x: number;
    y: number;
    width: number = 40;
    height: number = 40;
    vx: number = 0;
    vy: number = 0;
    gravity: number = 0.4;
    jumpStrength: number = -10;
    speed: number = 5;
    facingLeft: boolean = false;

    hasJetpack: boolean = false;
    jetpackTimer: number = 0;
    hasPropellerHat: boolean = false;
    propellerTimer: number = 0;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    update(canvasWidth: number) {
        if (this.hasJetpack) {
            this.vy = -15; // Fast ascent
            this.jetpackTimer--;
            if (this.jetpackTimer <= 0) {
                this.hasJetpack = false;
            }
        } else if (this.hasPropellerHat) {
            this.vy = -8; // Slower ascent
            this.propellerTimer--;
            if (this.propellerTimer <= 0) {
                this.hasPropellerHat = false;
            }
        } else {
            this.vy += this.gravity;
        }

        this.x += this.vx;
        this.y += this.vy;

        // Screen wrapping
        if (this.x + this.width < 0) {
            this.x = canvasWidth;
        } else if (this.x > canvasWidth) {
            this.x = -this.width;
        }
    }

    activateJetpack() {
        this.hasJetpack = true;
        this.jetpackTimer = 150; // 2.5 seconds
        this.hasPropellerHat = false; // Override
    }

    activatePropellerHat() {
        this.hasPropellerHat = true;
        this.propellerTimer = 300; // 5 seconds
        this.hasJetpack = false; // Override
    }

    stop() {
        this.vx = 0;
    }

    moveLeft() {
        this.vx = -this.speed;
        this.facingLeft = true;
    }

    moveRight() {
        this.vx = this.speed;
        this.facingLeft = false;
    }

    jump() {
        this.vy = this.jumpStrength;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        if (this.facingLeft) {
            ctx.scale(-1, 1);
        }

        // --- Artistic Doodler Design ---

        // 1. Legs (Scribbly)
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        // Left Leg
        DrawUtils.roughLine(ctx, -10, 15, -12, 25);
        DrawUtils.roughLine(ctx, -12, 25, -18, 25); // Foot
        // Right Leg
        DrawUtils.roughLine(ctx, 10, 15, 12, 25);
        DrawUtils.roughLine(ctx, 12, 25, 18, 25); // Foot
        // Middle Leg (optional, for that alien look)
        DrawUtils.roughLine(ctx, 0, 15, 0, 23);
        DrawUtils.roughLine(ctx, 0, 23, 5, 23);

        // 2. Body (Organic Shape)
        const bodyColor = '#a5c944'; // Classic Green
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        // Draw a rounded shape manually for organic feel
        ctx.moveTo(-15, 15); // Bottom left
        ctx.lineTo(15, 15); // Bottom right
        ctx.bezierCurveTo(20, 15, 20, -15, 15, -20); // Right side curve
        ctx.bezierCurveTo(0, -25, -20, -15, -15, 15); // Top/Left curve
        ctx.fill();

        // Outline Body
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 3. Snout (Tubular)
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.moveTo(15, -10); // Start at body
        ctx.lineTo(25, -10); // Top line
        ctx.arc(25, -4, 6, -Math.PI / 2, Math.PI / 2); // Rounded tip
        ctx.lineTo(15, 2); // Bottom line
        ctx.fill();

        // Outline Snout
        ctx.beginPath();
        ctx.moveTo(15, -10);
        ctx.lineTo(25, -10);
        ctx.arc(25, -4, 6, -Math.PI / 2, Math.PI / 2);
        ctx.lineTo(15, 2);
        ctx.stroke();

        // 4. Eye (White with pupil)
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(5, -5, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(7, -5, 2, 0, Math.PI * 2); // Pupil looking forward
        ctx.fill();

        // --- Powerups ---

        // Jetpack
        if (this.hasJetpack) {
            DrawUtils.roughRect(ctx, -22, -10, 10, 25, 'black', 'gray');
            // Flames
            ctx.fillStyle = 'orange';
            ctx.beginPath();
            ctx.moveTo(-20, 15);
            ctx.lineTo(-17, 35 + Math.random() * 10);
            ctx.lineTo(-14, 15);
            ctx.fill();
        }

        // Propeller Hat
        if (this.hasPropellerHat) {
            // Beanie (Multi-colored)
            DrawUtils.roughArc(ctx, 0, -20, 16, Math.PI, 0, 'blue');
            DrawUtils.roughLine(ctx, -16, -20, 16, -20, 'yellow');
            DrawUtils.roughCircle(ctx, 0, -36, 2, 'red', 'red');

            // Propeller
            const time = Date.now() / 50; // Fast spin
            const bladeWidth = 25;
            ctx.save();
            ctx.translate(0, -35);
            ctx.rotate(time);
            DrawUtils.roughLine(ctx, -bladeWidth, 0, bladeWidth, 0, 'red', 3);
            DrawUtils.roughLine(ctx, 0, -bladeWidth / 2, 0, bladeWidth / 2, 'red', 3);
            ctx.restore();
        }

        ctx.restore();
    }
}
