
import React, { useEffect, useRef } from 'react';

const Background: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasARef = useRef<HTMLCanvasElement | null>(null);
  const canvasBRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Configuration
    const particleCount = 400; // Adjusted for performance
    const particlePropCount = 9;
    const particlePropsLength = particleCount * particlePropCount;
    const baseTTL = 100;
    const rangeTTL = 500;
    const baseSpeed = 0.1;
    const rangeSpeed = 1.2;
    const baseSize = 2;
    const rangeSize = 8;
    const baseHue = 350; // Red spectrum
    const rangeHue = 30;
    const backgroundColor = 'hsla(0, 0%, 3%, 1)';

    // Math utilities
    const rand = (n: number) => Math.random() * n;
    const angle = (x1: number, y1: number, x2: number, y2: number) => Math.atan2(y2 - y1, x2 - x1);
    const lerp = (n1: number, n2: number, speed: number) => (1 - speed) * n1 + speed * n2;
    const fadeInOut = (t: number, m: number) => {
      const h = 0.5 * m;
      return Math.abs((t + h) % m - h) / h;
    };

    // State
    let canvasA: HTMLCanvasElement;
    let canvasB: HTMLCanvasElement;
    let ctxA: CanvasRenderingContext2D;
    let ctxB: CanvasRenderingContext2D;
    let center: [number, number] = [0, 0];
    let tick = 0;
    let particleProps: Float32Array;
    let animationFrameId: number;

    const initParticles = () => {
      tick = 0;
      particleProps = new Float32Array(particlePropsLength);
      for (let i = 0; i < particlePropsLength; i += particlePropCount) {
        initParticle(i);
      }
    };

    const initParticle = (i: number) => {
      const x = rand(canvasA.width);
      const y = rand(canvasA.height);
      const theta = angle(x, y, center[0], center[1]);
      const vx = Math.cos(theta) * 6;
      const vy = Math.sin(theta) * 6;
      const life = 0;
      const ttl = baseTTL + rand(rangeTTL);
      const speed = baseSpeed + rand(rangeSpeed);
      const size = baseSize + rand(rangeSize);
      const hue = baseHue + rand(rangeHue);

      particleProps.set([x, y, vx, vy, life, ttl, speed, size, hue], i);
    };

    const drawParticle = (x: number, y: number, theta: number, life: number, ttl: number, size: number, hue: number) => {
      const xRel = x - (0.5 * size);
      const yRel = y - (0.5 * size);
      
      ctxA.save();
      ctxA.lineCap = 'round';
      ctxA.lineWidth = 1;
      ctxA.strokeStyle = `hsla(${hue}, 100%, 50%, ${fadeInOut(life, ttl) * 0.5})`;
      ctxA.beginPath();
      ctxA.translate(xRel, yRel);
      ctxA.rotate(theta);
      ctxA.translate(-xRel, -yRel);
      ctxA.strokeRect(xRel, yRel, size, size);
      ctxA.closePath();
      ctxA.restore();
    };

    const updateParticle = (i: number) => {
      const i2=1+i, i3=2+i, i4=3+i, i5=4+i, i6=5+i, i7=6+i, i8=7+i, i9=8+i;
      
      let x = particleProps[i];
      let y = particleProps[i2];
      const theta = angle(x, y, center[0], center[1]) + 0.75 * Math.PI * 0.5;
      const vx = lerp(particleProps[i3], 2 * Math.cos(theta), 0.05);
      const vy = lerp(particleProps[i4], 2 * Math.sin(theta), 0.05);
      let life = particleProps[i5];
      const ttl = particleProps[i6];
      const speed = particleProps[i7];
      const size = particleProps[i8];
      const hue = particleProps[i9];

      const x2 = x + vx * speed;
      const y2 = y + vy * speed;

      drawParticle(x, y, theta, life, ttl, size, hue);

      life++;

      particleProps[i] = x2;
      particleProps[i2] = y2;
      particleProps[i3] = vx;
      particleProps[i4] = vy;
      particleProps[i5] = life;

      if (life > ttl) initParticle(i);
    };

    const drawParticles = () => {
      for (let i = 0; i < particlePropsLength; i += particlePropCount) {
        updateParticle(i);
      }
    };

    const render = () => {
      ctxB.save();
      ctxB.globalCompositeOperation = 'lighter';
      ctxB.drawImage(canvasA, 0, 0);
      ctxB.restore();
    };

    const resize = () => {
      const { innerWidth, innerHeight } = window;
      
      canvasA.width = innerWidth;
      canvasA.height = innerHeight;
      canvasB.width = innerWidth;
      canvasB.height = innerHeight;

      center[0] = 0.5 * canvasA.width;
      center[1] = 0.5 * canvasA.height;
    };

    const draw = () => {
      tick++;
      ctxA.clearRect(0, 0, canvasA.width, canvasA.height);

      ctxB.fillStyle = backgroundColor;
      ctxB.fillRect(0, 0, canvasA.width, canvasA.height);

      drawParticles();
      render();

      animationFrameId = window.requestAnimationFrame(draw);
    };

    // Setup canvases
    canvasA = document.createElement('canvas');
    canvasB = canvasBRef.current!;
    ctxA = canvasA.getContext('2d')!;
    ctxB = canvasB.getContext('2d', { alpha: false })!;
    
    resize();
    initParticles();
    draw();

    const handleResize = () => resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 -z-10 bg-[#050505] content--canvas hidden md:block">
      <canvas
        ref={canvasBRef}
        className="block w-full h-full"
      />
      {/* Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
    </div>
  );
};

export default Background;
