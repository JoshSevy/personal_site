import {
  Component,
  computed,
  ElementRef,
  HostListener,
  OnDestroy,
  signal,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';

const STORAGE_KEY = 'blogcoin-bonanza-high';
const CANVAS_W = 360;
const CANVAS_H = 520;
const PADDLE_W = 88;
const PADDLE_H = 14;
const PADDLE_Y = CANVAS_H - 36;
const GRAVITY_BASE = 0.12;

type DropKind = 'coin' | 'dump';

interface Drop {
  kind: DropKind;
  x: number;
  y: number;
  vy: number;
  r: number;
  w: number;
  h: number;
}

@Component({
  selector: 'app-blogcoin-bonanza',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './blogcoin-bonanza.component.html',
  styleUrl: './blogcoin-bonanza.component.scss',
})
export class BlogcoinBonanzaComponent implements OnDestroy {
  @ViewChild('gameCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  readonly canvasW = CANVAS_W;
  readonly canvasH = CANVAS_H;

  readonly score = signal(0);
  readonly combo = signal(0);
  readonly highScore = signal(0);
  readonly playing = signal(false);

  readonly comboDisplay = computed(() => Math.max(1, this.combo()));

  private ctx: CanvasRenderingContext2D | null = null;
  private rafId: number | null = null;
  private drops: Drop[] = [];
  private frame = 0;
  private spawnEvery = 52;
  private difficulty = 1;
  private paddleX = CANVAS_W / 2;
  private keysLeft = false;
  private keysRight = false;
  private pointerActive = false;
  private pointerTargetX: number | null = null;

  constructor() {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY);
      const n = raw ? parseInt(raw, 10) : 0;
      this.highScore.set(Number.isFinite(n) ? n : 0);
    }
  }

  ngOnDestroy(): void {
    this.stopLoop();
  }

  startGame(): void {
    this.score.set(0);
    this.combo.set(0);
    this.drops = [];
    this.frame = 0;
    this.spawnEvery = 52;
    this.difficulty = 1;
    this.paddleX = CANVAS_W / 2;
    this.playing.set(true);

    queueMicrotask(() => {
      const c = this.canvasRef?.nativeElement;
      this.ctx = c?.getContext('2d') ?? null;
      this.tick();
    });
  }

  endGame(): void {
    this.playing.set(false);
    this.stopLoop();
    const s = this.score();
    if (s > this.highScore()) {
      this.highScore.set(s);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, String(s));
      }
    }
  }

  private stopLoop(): void {
    if (this.rafId != null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private tick = (): void => {
    if (!this.playing() || !this.ctx) return;

    this.frame++;
    this.updateSpawns();
    this.updatePhysics();
    this.draw();

    this.rafId = requestAnimationFrame(this.tick);
  };

  private updateSpawns(): void {
    if (this.frame % Math.max(18, this.spawnEvery) !== 0) return;

    const roll = Math.random();
    const kind: DropKind = roll < 0.72 ? 'coin' : 'dump';
    const x = 24 + Math.random() * (CANVAS_W - 48);

    if (kind === 'coin') {
      this.drops.push({
        kind,
        x,
        y: -16,
        vy: 1.2 + this.difficulty * 0.35 + Math.random() * 0.6,
        r: 10 + Math.random() * 3,
        w: 0,
        h: 0,
      });
    } else {
      const w = 36 + Math.floor(Math.random() * 24);
      this.drops.push({
        kind,
        x: Math.min(CANVAS_W - w - 8, Math.max(8, x - w / 2)),
        y: -28,
        vy: 1.4 + this.difficulty * 0.45 + Math.random() * 0.5,
        r: 0,
        w,
        h: 22,
      });
    }

    if (this.frame % 420 === 0) {
      this.difficulty = Math.min(5, this.difficulty + 0.35);
      this.spawnEvery = Math.max(22, this.spawnEvery - 3);
    }
  }

  private updatePhysics(): void {
    this.movePaddle();

    const paddleLeft = this.paddleX - PADDLE_W / 2;
    const paddleRight = this.paddleX + PADDLE_W / 2;
    const paddleTop = PADDLE_Y;
    const paddleBottom = PADDLE_Y + PADDLE_H;

    const next: Drop[] = [];

    for (const d of this.drops) {
      d.vy += GRAVITY_BASE * (d.kind === 'dump' ? 0.85 : 1);
      d.y += d.vy;

      if (d.kind === 'coin') {
        const cy = d.y + d.r;
        if (
          cy >= paddleTop &&
          d.y - d.r <= paddleBottom &&
          d.x >= paddleLeft - d.r &&
          d.x <= paddleRight + d.r
        ) {
          this.combo.update((c) => c + 1);
          const mult = Math.max(1, this.combo());
          const gained = Math.round(10 * mult * (0.9 + this.difficulty * 0.05));
          this.score.update((s) => s + gained);
          continue;
        }
        if (d.y - d.r > CANVAS_H + 20) {
          this.combo.set(0);
          continue;
        }
        next.push(d);
      } else {
        const boxTop = d.y;
        const boxBottom = d.y + d.h;
        const boxLeft = d.x;
        const boxRight = d.x + d.w;
        if (boxBottom >= paddleTop && boxTop <= paddleBottom && boxRight >= paddleLeft && boxLeft <= paddleRight) {
          this.combo.set(0);
          this.score.update((s) => Math.max(0, s - 25));
          continue;
        }
        if (boxTop > CANVAS_H + 40) continue;
        next.push(d);
      }
    }

    this.drops = next;
  }

  private movePaddle(): void {
    const speed = 6.5;
    if (this.pointerActive && this.pointerTargetX != null) {
      this.paddleX += (this.pointerTargetX - this.paddleX) * 0.22;
    } else {
      if (this.keysLeft) this.paddleX -= speed;
      if (this.keysRight) this.paddleX += speed;
    }
    const half = PADDLE_W / 2 + 4;
    this.paddleX = Math.max(half, Math.min(CANVAS_W - half, this.paddleX));
  }

  onPointer(ev: PointerEvent): void {
    if (!this.playing()) return;
    const c = this.canvasRef?.nativeElement;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const x = (ev.clientX - rect.left) * scaleX;
    this.pointerActive = true;
    this.pointerTargetX = x;
    try {
      c.setPointerCapture(ev.pointerId);
    } catch {
      /* ignore */
    }
  }

  onPointerUp(): void {
    this.pointerActive = false;
    this.pointerTargetX = null;
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.keysLeft = true;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') this.keysRight = true;
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(e: KeyboardEvent): void {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.keysLeft = false;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') this.keysRight = false;
  }

  private draw(): void {
    const ctx = this.ctx;
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    ctx.strokeStyle = 'rgba(251, 191, 36, 0.12)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      const gx = (i * 47 + (this.frame * 0.4) % 47) % (CANVAS_W + 40) - 20;
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx + 24, CANVAS_H);
      ctx.stroke();
    }

    for (const d of this.drops) {
      if (d.kind === 'coin') {
        const g = ctx.createRadialGradient(d.x - 3, d.y - 3, 2, d.x, d.y, d.r + 4);
        g.addColorStop(0, '#fde68a');
        g.addColorStop(0.5, '#f59e0b');
        g.addColorStop(1, '#b45309');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
        ctx.font = `bold ${Math.max(10, d.r)}px system-ui`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('₿', d.x, d.y + 1);
      } else {
        ctx.fillStyle = '#7f1d1d';
        ctx.strokeStyle = '#f87171';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(d.x, d.y, d.w, d.h, 4);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#fecaca';
        ctx.font = 'bold 12px system-ui';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('DUMP', d.x + d.w / 2, d.y + d.h / 2);
      }
    }

    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(this.paddleX - PADDLE_W / 2, PADDLE_Y, PADDLE_W, PADDLE_H, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('wallet', this.paddleX, PADDLE_Y + PADDLE_H / 2 + 3);
  }
}
