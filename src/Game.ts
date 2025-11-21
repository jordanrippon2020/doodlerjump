import { Doodler } from './Doodler';
import { Platform } from './Platform';
import { Monster } from './Monster';
import { Projectile } from './Projectile';
import { BlackHole } from './BlackHole';
import { UFO } from './UFO';
import { Trampoline } from './Trampoline';
import { Jetpack } from './Jetpack';
import { PropellerHat } from './PropellerHat';
import { DrawUtils } from './DrawUtils';
import { SoundUtils } from './SoundUtils';
import { Particle } from './Particle';
import { Auth } from './Auth';
import { Leaderboard, type ScoreEntry } from './Leaderboard';

export class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    lastTime: number = 0;
    doodler: Doodler;
    platforms: Platform[] = [];
    monsters: Monster[] = [];
    projectiles: Projectile[] = [];
    blackHoles: BlackHole[] = [];
    ufos: UFO[] = [];
    trampolines: Trampoline[] = [];
    jetpacks: Jetpack[] = [];
    propellerHats: PropellerHat[] = [];
    particles: Particle[] = [];
    score: number = 0;
    highScore: number = 0;
    state: 'MENU' | 'PLAYING' | 'GAMEOVER' = 'MENU';
    highestY: number = 0;
    auth!: Auth;
    leaderboard!: Leaderboard;
    loginOverlay!: HTMLElement;
    gameOverOverlay!: HTMLElement;
    hud!: HTMLElement;
    loginBtn!: HTMLButtonElement;
    restartBtn!: HTMLButtonElement;
    scoreDisplay!: HTMLElement;
    userDisplay!: HTMLElement;
    finalScoreDisplay!: HTMLElement;
    scoreListPreview!: HTMLElement;
    scoreListFull!: HTMLElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;

        this.doodler = new Doodler(this.canvas.width / 2 - 20, this.canvas.height - 200);
        this.highestY = this.canvas.height;

        // Load High Score
        const savedScore = localStorage.getItem('doodle_high_score');
        if (savedScore) {
            this.highScore = parseInt(savedScore);
        }

        // Initial setup
        this.setupUI();
        this.leaderboard = new Leaderboard();
        this.auth = new Auth((user) => {
            this.updateUserDisplay(user);
            if (user) {
                this.loginBtn.textContent = `Signed in as ${user.displayName}`;
                this.loginBtn.disabled = true;
            }
        });

        this.loadLeaderboard();
        this.setupInput();
    }

    setupUI() {
        this.loginOverlay = document.getElementById('login-overlay')!;
        this.gameOverOverlay = document.getElementById('game-over-overlay')!;
        this.hud = document.getElementById('hud')!;
        this.loginBtn = document.getElementById('login-btn') as HTMLButtonElement;
        this.restartBtn = document.getElementById('restart-btn') as HTMLButtonElement;
        this.scoreDisplay = document.getElementById('score-display')!;
        this.userDisplay = document.getElementById('user-display')!;
        this.finalScoreDisplay = document.getElementById('final-score')!;
        this.scoreListPreview = document.getElementById('score-list-preview')!;
        this.scoreListFull = document.getElementById('score-list-full')!;

        this.loginBtn.addEventListener('click', () => this.auth.signIn());
        this.restartBtn.addEventListener('click', () => {
            this.reset();
            this.state = 'PLAYING';
            this.gameOverOverlay.classList.add('hidden');
            this.hud.classList.remove('hidden');
            SoundUtils.playPowerup();
        });
    }

    updateUserDisplay(user: any) {
        if (user) {
            this.userDisplay.textContent = user.displayName;
        } else {
            this.userDisplay.textContent = 'Guest';
        }
    }

    async loadLeaderboard() {
        const scores = await this.leaderboard.getTopScores();
        this.renderLeaderboard(scores, this.scoreListPreview);
        this.renderLeaderboard(scores, this.scoreListFull);
    }

    renderLeaderboard(scores: ScoreEntry[], element: HTMLElement) {
        element.innerHTML = '';
        scores.forEach((entry, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<span>#${index + 1} ${entry.username}</span><span>${entry.score}</span>`;
            element.appendChild(li);
        });
    }

    setupInput() {
        window.addEventListener('keydown', (e) => {
            if (this.state === 'PLAYING') {
                if (e.key === 'ArrowLeft' || e.key === 'a') {
                    this.doodler.moveLeft();
                } else if (e.key === 'ArrowRight' || e.key === 'd') {
                    this.doodler.moveRight();
                } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') {
                    this.shoot();
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            if (this.state === 'PLAYING') {
                if ((e.key === 'ArrowLeft' || e.key === 'a') && this.doodler.vx < 0) {
                    this.doodler.stop();
                } else if ((e.key === 'ArrowRight' || e.key === 'd') && this.doodler.vx > 0) {
                    this.doodler.stop();
                }
            }
        });
    }

    start() {
        requestAnimationFrame(this.loop.bind(this));
    }

    shoot() {
        if (!this.doodler.hasJetpack && !this.doodler.hasPropellerHat) {
            // Shoot from center of doodler
            this.projectiles.push(new Projectile(this.doodler.x + this.doodler.width / 2 - 5, this.doodler.y));
            SoundUtils.playShoot();
        }
    }

    createExplosion(x: number, y: number, color: string, count: number = 10) {
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(x, y, color));
        }
    }

    loop(timestamp: number) {
        const _deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(timestamp);
        this.draw();

        requestAnimationFrame(this.loop.bind(this));
    }

    update(timestamp: number) {
        if (this.state !== 'PLAYING') return;

        this.doodler.update(this.canvas.width);

        // Auto-shoot if Propeller Hat is active
        if (this.doodler.hasPropellerHat) {
            if (timestamp % 15 < 1) { // Fire roughly every 15 frames
                this.projectiles.push(new Projectile(this.doodler.x + this.doodler.width / 2 - 5, this.doodler.y));
                SoundUtils.playShoot();
            }
        }

        // Update entities
        this.platforms.forEach(platform => platform.update(this.canvas.width));
        this.monsters.forEach(monster => monster.update(this.canvas.width));
        this.blackHoles.forEach(bh => bh.update(this.canvas.width));
        this.ufos.forEach(ufo => ufo.update(this.canvas.width));

        // Update particles
        this.particles.forEach((p, index) => {
            p.update();
            if (p.life <= 0) this.particles.splice(index, 1);
        });

        // Update projectiles
        this.projectiles.forEach((projectile, index) => {
            projectile.update();
            if (projectile.markedForDeletion) {
                this.projectiles.splice(index, 1);
            }
        });

        // Projectile-Monster/UFO Collision
        this.projectiles.forEach((projectile, pIndex) => {
            this.monsters.forEach((monster, mIndex) => {
                if (
                    projectile.x < monster.x + monster.width &&
                    projectile.x + projectile.width > monster.x &&
                    projectile.y < monster.y + monster.height &&
                    projectile.y + projectile.height > monster.y
                ) {
                    this.createExplosion(monster.x + monster.width / 2, monster.y + monster.height / 2, '#e74c3c');
                    this.monsters.splice(mIndex, 1);
                    this.projectiles.splice(pIndex, 1);
                    this.score += 100;
                    SoundUtils.playExplosion();
                }
            });

            this.ufos.forEach((ufo, uIndex) => {
                if (
                    projectile.x < ufo.x + ufo.width &&
                    projectile.x + projectile.width > ufo.x &&
                    projectile.y < ufo.y + ufo.height &&
                    projectile.y + projectile.height > ufo.y
                ) {
                    this.createExplosion(ufo.x + ufo.width / 2, ufo.y + ufo.height / 2, '#9b59b6');
                    this.ufos.splice(uIndex, 1);
                    this.projectiles.splice(pIndex, 1);
                    this.score += 200;
                    SoundUtils.playExplosion();
                }
            });
        });

        // Doodler Collision detection
        if (this.doodler.vy > 0 && !this.doodler.hasJetpack && !this.doodler.hasPropellerHat) { // Only check when falling and no flight
            this.platforms.forEach((platform, index) => {
                if (
                    !platform.broken &&
                    this.doodler.x < platform.x + platform.width &&
                    this.doodler.x + this.doodler.width > platform.x &&
                    this.doodler.y + this.doodler.height > platform.y &&
                    this.doodler.y + this.doodler.height < platform.y + platform.height + this.doodler.vy
                ) {
                    if (platform.type === 'breaking') {
                        platform.broken = true;
                        platform.vy = 2; // Start falling
                        this.createExplosion(platform.x + platform.width / 2, platform.y, '#7d5538', 5);
                        SoundUtils.playBreak();
                    } else {
                        this.doodler.y = platform.y - this.doodler.height; // Snap to top
                        this.doodler.jump();
                        SoundUtils.playJump();

                        if (platform.type === 'disappearing') {
                            this.createExplosion(platform.x + platform.width / 2, platform.y, 'white', 5);
                            this.platforms.splice(index, 1);
                            SoundUtils.playBreak();
                        }
                    }
                }
            });

            // Trampoline collision
            this.trampolines.forEach(t => {
                if (
                    !t.used &&
                    this.doodler.x < t.x + t.width &&
                    this.doodler.x + this.doodler.width > t.x &&
                    this.doodler.y + this.doodler.height > t.y &&
                    this.doodler.y + this.doodler.height < t.y + t.height + this.doodler.vy
                ) {
                    this.doodler.vy = -25; // Super jump
                    t.used = true;
                    SoundUtils.playPowerup();
                }
            });

            // Jetpack collision
            this.jetpacks.forEach((j) => {
                if (
                    !j.taken &&
                    this.doodler.x < j.x + j.width &&
                    this.doodler.x + this.doodler.width > j.x &&
                    this.doodler.y + this.doodler.height > j.y &&
                    this.doodler.y < j.y + j.height
                ) {
                    j.taken = true;
                    this.doodler.activateJetpack();
                    SoundUtils.playPowerup();
                    this.createExplosion(this.doodler.x, this.doodler.y + this.doodler.height, 'orange', 20);
                }
            });

            // Propeller Hat collision
            this.propellerHats.forEach((p) => {
                if (
                    !p.taken &&
                    this.doodler.x < p.x + p.width &&
                    this.doodler.x + this.doodler.width > p.x &&
                    this.doodler.y + this.doodler.height > p.y &&
                    this.doodler.y < p.y + p.height
                ) {
                    p.taken = true;
                    this.doodler.activatePropellerHat();
                    SoundUtils.playPowerup();
                    this.createExplosion(this.doodler.x, this.doodler.y, 'blue', 10);
                }
            });

            // Monster collision (jump on head)
            this.monsters.forEach((monster, index) => {
                if (
                    this.doodler.x < monster.x + monster.width &&
                    this.doodler.x + this.doodler.width > monster.x &&
                    this.doodler.y + this.doodler.height > monster.y &&
                    this.doodler.y + this.doodler.height < monster.y + monster.height + this.doodler.vy
                ) {
                    this.createExplosion(monster.x + monster.width / 2, monster.y + monster.height / 2, '#e74c3c');
                    this.monsters.splice(index, 1);
                    this.doodler.jump();
                    this.score += 100;
                    SoundUtils.playExplosion();
                    SoundUtils.playJump();
                }
            });
        }

        // Death collisions
        if (!this.doodler.hasJetpack && !this.doodler.hasPropellerHat) {
            this.monsters.forEach(monster => {
                if (
                    this.doodler.x < monster.x + monster.width - 10 &&
                    this.doodler.x + this.doodler.width > monster.x + 10 &&
                    this.doodler.y < monster.y + monster.height &&
                    this.doodler.y + this.doodler.height > monster.y + 10
                ) {
                    if (this.doodler.vy <= 0 || this.doodler.y > monster.y) {
                        this.gameOver();
                    }
                }
            });

            this.blackHoles.forEach(bh => {
                if (
                    this.doodler.x < bh.x + bh.width - 10 &&
                    this.doodler.x + this.doodler.width > bh.x + 10 &&
                    this.doodler.y < bh.y + bh.height &&
                    this.doodler.y + this.doodler.height > bh.y + 10
                ) {
                    this.gameOver();
                }
            });

            this.ufos.forEach(ufo => {
                if (
                    this.doodler.x < ufo.x + ufo.width - 10 &&
                    this.doodler.x + this.doodler.width > ufo.x + 10 &&
                    this.doodler.y < ufo.y + ufo.height &&
                    this.doodler.y + this.doodler.height > ufo.y + 10
                ) {
                    this.gameOver();
                }
            });
        }

        // Camera scrolling and Generation
        if (this.doodler.y < this.canvas.height / 2) {
            const diff = this.canvas.height / 2 - this.doodler.y;
            this.doodler.y += diff;
            this.highestY += diff; // Track relative height
            this.score += Math.floor(diff);

            this.platforms.forEach(p => p.y += diff);
            this.monsters.forEach(m => m.y += diff);
            this.blackHoles.forEach(bh => bh.y += diff);
            this.ufos.forEach(ufo => ufo.y += diff);
            this.trampolines.forEach(t => t.y += diff);
            this.jetpacks.forEach(j => j.y += diff);
            this.propellerHats.forEach(p => p.y += diff);
            this.particles.forEach(p => p.y += diff);

            // Remove entities that fall off screen
            this.platforms = this.platforms.filter(p => p.y < this.canvas.height);
            this.monsters = this.monsters.filter(m => m.y < this.canvas.height);
            this.blackHoles = this.blackHoles.filter(bh => bh.y < this.canvas.height);
            this.ufos = this.ufos.filter(u => u.y < this.canvas.height);
            this.trampolines = this.trampolines.filter(t => t.y < this.canvas.height);
            this.jetpacks = this.jetpacks.filter(j => j.y < this.canvas.height);
            this.propellerHats = this.propellerHats.filter(p => p.y < this.canvas.height);
            this.particles = this.particles.filter(p => p.y < this.canvas.height);

            // Generate new platforms
            while (this.highestY > -100) {
                this.generateSinglePlatformLevel();
            }
        }

        // Game Over check
        if (this.doodler.y > this.canvas.height) {
            this.gameOver();
        }
    }

    async gameOver() {
        this.state = 'GAMEOVER';
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('doodle_high_score', this.highScore.toString());
        }
        SoundUtils.playExplosion(); // Sad sound

        // Show Game Over Overlay
        this.hud.classList.add('hidden');
        this.gameOverOverlay.classList.remove('hidden');
        this.finalScoreDisplay.textContent = this.score.toString();

        // Submit Score
        if (this.auth.currentUser) {
            await this.leaderboard.submitScore(
                this.auth.currentUser.uid,
                this.auth.currentUser.displayName || 'Anonymous',
                this.score,
                this.auth.currentUser.photoURL
            );
            this.loadLeaderboard(); // Refresh list
        }
    }

    generatePlatforms() {
        this.highestY = this.canvas.height;
        // Initial platform
        this.platforms.push(new Platform(this.canvas.width / 2 - 30, this.canvas.height - 50));

        while (this.highestY > 0) {
            this.generateSinglePlatformLevel();
        }
    }

    generateSinglePlatformLevel() {
        const gap = 50 + Math.random() * 50; // 50-100 gap
        this.highestY -= gap;
        const x = Math.random() * (this.canvas.width - 60);

        // Determine type
        let type: 'static' | 'moving' | 'breaking' | 'disappearing' = 'static';
        const scoreFactor = Math.min(this.score / 5000, 1);

        if (Math.random() < 0.2 + scoreFactor * 0.2) type = 'moving';
        if (Math.random() < 0.1 + scoreFactor * 0.1) type = 'breaking';
        if (Math.random() < 0.1 + scoreFactor * 0.1) type = 'disappearing';

        this.platforms.push(new Platform(x, this.highestY, type));

        // Buddy platform (50% chance OR forced if main platform is unsafe)
        if (Math.random() < 0.5 || type === 'breaking' || type === 'disappearing') {
            const buddyX = (x + this.canvas.width / 2) % (this.canvas.width - 60);
            const buddyY = this.highestY + (Math.random() * 40 - 20); // Slight vertical offset
            this.platforms.push(new Platform(buddyX, buddyY, 'static'));
        }

        // Hazards and Powerups
        if (Math.random() < 0.05 + scoreFactor * 0.05) {
            // Monsters
            this.monsters.push(new Monster(Math.random() * (this.canvas.width - 50), this.highestY - 50));
        } else if (Math.random() < 0.02 + scoreFactor * 0.02) {
            // Black Holes
            this.blackHoles.push(new BlackHole(Math.random() * (this.canvas.width - 50), this.highestY - 100));
        } else if (Math.random() < 0.02 + scoreFactor * 0.02) {
            // UFOs
            this.ufos.push(new UFO(Math.random() * (this.canvas.width - 50), this.highestY - 150));
        } else if (Math.random() < 0.03) {
            // Trampoline
            this.trampolines.push(new Trampoline(x + 10, this.highestY - 15));
        } else if (Math.random() < 0.01) {
            // Jetpack
            this.jetpacks.push(new Jetpack(x + 10, this.highestY - 30));
        } else if (Math.random() < 0.01) {
            // Propeller Hat
            this.propellerHats.push(new PropellerHat(x + 10, this.highestY - 20));
        }
    }

    reset() {
        this.score = 0;
        this.platforms = [];
        this.monsters = [];
        this.projectiles = [];
        this.blackHoles = [];
        this.ufos = [];
        this.trampolines = [];
        this.jetpacks = [];
        this.propellerHats = [];
        this.particles = [];
        this.doodler = new Doodler(this.canvas.width / 2 - 20, this.canvas.height - 200);
        this.generatePlatforms();

        // Reset UI
        this.loginOverlay.classList.add('hidden');
        this.gameOverOverlay.classList.add('hidden');
        this.hud.classList.remove('hidden');
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background (Graph Paper)
        this.ctx.fillStyle = '#fcf8e3'; // Rustic yellowish paper color
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Rustic grid
        const gridSize = 20;
        for (let x = 0; x <= this.canvas.width; x += gridSize) {
            DrawUtils.roughLine(this.ctx, x, 0, x, this.canvas.height, 'rgba(173, 216, 230, 0.3)', 1);
        }
        for (let y = 0; y <= this.canvas.height; y += gridSize) {
            DrawUtils.roughLine(this.ctx, 0, y, this.canvas.width, y, 'rgba(173, 216, 230, 0.3)', 1);
        }

        this.platforms.forEach(platform => platform.draw(this.ctx));
        this.trampolines.forEach(t => t.draw(this.ctx));
        this.jetpacks.forEach(j => j.draw(this.ctx));
        this.propellerHats.forEach(p => p.draw(this.ctx));
        this.monsters.forEach(monster => monster.draw(this.ctx));
        this.blackHoles.forEach(bh => bh.draw(this.ctx));
        this.ufos.forEach(ufo => ufo.draw(this.ctx));
        this.projectiles.forEach(projectile => projectile.draw(this.ctx));
        this.particles.forEach(p => p.draw(this.ctx));
        this.doodler.draw(this.ctx);

        // Update HUD
        this.scoreDisplay.textContent = `Score: ${this.score}`;

        // UI Overlays are now HTML/CSS
    }
}
