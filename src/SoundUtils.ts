export class SoundUtils {
    static ctx: AudioContext | null = null;

    static init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    }

    static playTone(freq: number, type: OscillatorType, duration: number, vol: number = 0.1) {
        if (!this.ctx) this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    static playJump() {
        this.playTone(400, 'sine', 0.1, 0.1);
        setTimeout(() => this.playTone(600, 'sine', 0.2, 0.1), 50);
    }

    static playShoot() {
        this.playTone(800, 'square', 0.1, 0.05);
        setTimeout(() => this.playTone(600, 'square', 0.1, 0.05), 50);
    }

    static playExplosion() {
        this.playTone(100, 'sawtooth', 0.3, 0.1);
        setTimeout(() => this.playTone(50, 'sawtooth', 0.3, 0.1), 100);
    }

    static playBreak() {
        this.playTone(150, 'square', 0.1, 0.1);
        setTimeout(() => this.playTone(100, 'square', 0.1, 0.1), 50);
    }

    static playPowerup() {
        this.playTone(600, 'sine', 0.1, 0.1);
        setTimeout(() => this.playTone(800, 'sine', 0.1, 0.1), 100);
        setTimeout(() => this.playTone(1200, 'sine', 0.2, 0.1), 200);
    }
}
