export class DrawUtils {
    static roughLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string = 'black', width: number = 2) {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(x1, y1);

        // Add some randomness to the line
        const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const segments = Math.max(1, Math.floor(length / 10));

        let cx = x1;
        let cy = y1;

        for (let i = 0; i < segments; i++) {
            const progress = (i + 1) / segments;
            const targetX = x1 + (x2 - x1) * progress;
            const targetY = y1 + (y2 - y1) * progress;

            // Random offset, less at ends
            const offset = (Math.random() - 0.5) * 2;

            cx = targetX + offset;
            cy = targetY + offset;

            ctx.lineTo(cx, cy);
        }

        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Second pass for sketch look
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
    }

    static roughRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string = 'black', fill: string | null = null) {
        if (fill) {
            ctx.fillStyle = fill;
            // Imperfect fill
            ctx.beginPath();
            ctx.moveTo(x + (Math.random() - 0.5) * 2, y + (Math.random() - 0.5) * 2);
            ctx.lineTo(x + w + (Math.random() - 0.5) * 2, y + (Math.random() - 0.5) * 2);
            ctx.lineTo(x + w + (Math.random() - 0.5) * 2, y + h + (Math.random() - 0.5) * 2);
            ctx.lineTo(x + (Math.random() - 0.5) * 2, y + h + (Math.random() - 0.5) * 2);
            ctx.fill();
        }

        this.roughLine(ctx, x, y, x + w, y, color);
        this.roughLine(ctx, x + w, y, x + w, y + h, color);
        this.roughLine(ctx, x + w, y + h, x, y + h, color);
        this.roughLine(ctx, x, y + h, x, y, color);
    }

    static roughCircle(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string = 'black', fill: string | null = null) {
        if (fill) {
            ctx.fillStyle = fill;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();

        const segments = 16;
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const r = radius + (Math.random() - 0.5) * 2;
            const px = x + Math.cos(angle) * r;
            const py = y + Math.sin(angle) * r;

            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
    }
    static roughArc(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, startAngle: number, endAngle: number, color: string = 'black') {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();

        const segments = 8;
        const totalAngle = endAngle - startAngle;

        for (let i = 0; i <= segments; i++) {
            const angle = startAngle + (totalAngle * i) / segments;
            const r = radius + (Math.random() - 0.5) * 2;
            const px = x + Math.cos(angle) * r;
            const py = y + Math.sin(angle) * r;

            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Second pass for sketchiness
        ctx.beginPath();
        ctx.globalAlpha = 0.5;
        for (let i = 0; i <= segments; i++) {
            const angle = startAngle + (totalAngle * i) / segments;
            const r = radius + (Math.random() - 0.5) * 2;
            const px = x + Math.cos(angle) * r;
            const py = y + Math.sin(angle) * r;

            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.globalAlpha = 1.0;
    }

    static roughRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, radius: number, color: string = 'black', fill: string | null = null) {
        if (fill) {
            ctx.fillStyle = fill;
            // Imperfect fill
            ctx.beginPath();
            ctx.moveTo(x + radius, y + (Math.random() - 0.5) * 2);
            ctx.lineTo(x + w - radius, y + (Math.random() - 0.5) * 2);
            ctx.quadraticCurveTo(x + w, y, x + w + (Math.random() - 0.5) * 2, y + radius);
            ctx.lineTo(x + w + (Math.random() - 0.5) * 2, y + h - radius);
            ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h + (Math.random() - 0.5) * 2);
            ctx.lineTo(x + radius, y + h + (Math.random() - 0.5) * 2);
            ctx.quadraticCurveTo(x, y + h, x + (Math.random() - 0.5) * 2, y + h - radius);
            ctx.lineTo(x + (Math.random() - 0.5) * 2, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y + (Math.random() - 0.5) * 2);
            ctx.fill();
        }

        // Top
        this.roughLine(ctx, x + radius, y, x + w - radius, y, color);
        // Right
        this.roughLine(ctx, x + w, y + radius, x + w, y + h - radius, color);
        // Bottom
        this.roughLine(ctx, x + w - radius, y + h, x + radius, y + h, color);
        // Left
        this.roughLine(ctx, x, y + h - radius, x, y + radius, color);

        // Corners
        this.roughArc(ctx, x + w - radius, y + radius, radius, -Math.PI / 2, 0, color); // TR
        this.roughArc(ctx, x + w - radius, y + h - radius, radius, 0, Math.PI / 2, color); // BR
        this.roughArc(ctx, x + radius, y + h - radius, radius, Math.PI / 2, Math.PI, color); // BL
        this.roughArc(ctx, x + radius, y + radius, radius, Math.PI, 3 * Math.PI / 2, color); // TL
    }
}
