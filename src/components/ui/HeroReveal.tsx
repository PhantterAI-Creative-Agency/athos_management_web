"use client";

import { useEffect, useRef } from "react";

const IMAGE_SRC = "/church-photo.webp";

type TrailPoint = { x: number; y: number; life: number };

function drawCover(
  context: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
) {
  const imgRatio = img.width / img.height;
  const boxRatio = w / h;
  let drawW = w;
  let drawH = h;
  if (imgRatio > boxRatio) {
    drawH = h;
    drawW = h * imgRatio;
  } else {
    drawW = w;
    drawH = w / imgRatio;
  }
  context.drawImage(img, (w - drawW) / 2, (h - drawH) / 2, drawW, drawH);
}

export function HeroReveal({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas: HTMLCanvasElement = canvasRef.current;
    const containerEl = canvas.parentElement;
    const context = canvas.getContext("2d");
    if (!containerEl || !context) return;
    const container: HTMLElement = containerEl;
    const ctx: CanvasRenderingContext2D = context;

    const image = new Image();
    image.src = IMAGE_SRC;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;

    function resize() {
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const trail: TrailPoint[] = [];

    function handlePointerMove(e: PointerEvent) {
      const rect = canvas.getBoundingClientRect();
      trail.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, life: 1 });
      if (trail.length > 40) trail.shift();
    }
    container.addEventListener("pointermove", handlePointerMove);

    const ambientCanvas = document.createElement("canvas");
    const crispCanvas = document.createElement("canvas");
    const start = performance.now();
    let raf = 0;

    function render(time: number) {
      raf = requestAnimationFrame(render);
      if (!image.complete || width === 0 || height === 0) return;

      const t = (time - start) / 1000;

      ambientCanvas.width = width;
      ambientCanvas.height = height;
      const actx = ambientCanvas.getContext("2d");
      if (actx) {
        actx.clearRect(0, 0, width, height);
        actx.filter = "blur(18px) brightness(0.4) saturate(0.1)";
        drawCover(actx, image, width, height);
        actx.filter = "none";
      }

      crispCanvas.width = width;
      crispCanvas.height = height;
      const cctx = crispCanvas.getContext("2d");
      if (cctx) {
        cctx.clearRect(0, 0, width, height);
        cctx.filter = "brightness(0.8) contrast(1.05) saturate(0.15)";
        drawCover(cctx, image, width, height);
        cctx.filter = "none";

        for (let i = trail.length - 1; i >= 0; i--) {
          const point = trail[i];
          point.life -= 0.035;
          if (point.life <= 0) {
            trail.splice(i, 1);
            continue;
          }
          const radius = 90 * point.life + 20;

          const gradient = cctx.createRadialGradient(
            point.x, point.y, 0,
            point.x, point.y, radius,
          );
          gradient.addColorStop(0, `rgba(0,0,0,${0.9 * point.life})`);
          gradient.addColorStop(1, "rgba(0,0,0,0)");
          cctx.globalCompositeOperation = "destination-out";
          cctx.beginPath();
          cctx.fillStyle = gradient;
          cctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
          cctx.fill();

          cctx.globalCompositeOperation = "lighter";
          cctx.lineWidth = 2;
          cctx.strokeStyle = `rgba(255,80,80,${0.25 * point.life})`;
          cctx.beginPath();
          cctx.arc(point.x - 1.5, point.y, radius * 0.92, 0, Math.PI * 2);
          cctx.stroke();
          cctx.strokeStyle = `rgba(80,150,255,${0.25 * point.life})`;
          cctx.beginPath();
          cctx.arc(point.x + 1.5, point.y, radius * 0.92, 0, Math.PI * 2);
          cctx.stroke();
          cctx.globalCompositeOperation = "source-over";
        }
      }

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(ambientCanvas, 0, 0, width, height);
      ctx.drawImage(crispCanvas, 0, 0, width, height);

      const rayOriginX = width * 1.1;
      const rayOriginY = height * 0.1;
      const rayCount = 7;
      ctx.globalCompositeOperation = "screen";
      for (let i = 0; i < rayCount; i++) {
        const baseAngle = Math.PI + (i / (rayCount - 1)) * (Math.PI * 0.55) + Math.PI * 0.15;
        const angle = baseAngle + Math.sin(t * 0.3 + i) * 0.03;
        const length = Math.max(width, height) * 1.6;
        const spread = 0.045;

        const x1 = rayOriginX + Math.cos(angle - spread) * length;
        const y1 = rayOriginY + Math.sin(angle - spread) * length;
        const x2 = rayOriginX + Math.cos(angle + spread) * length;
        const y2 = rayOriginY + Math.sin(angle + spread) * length;

        const gradient = ctx.createLinearGradient(
          rayOriginX, rayOriginY,
          (x1 + x2) / 2, (y1 + y2) / 2,
        );
        gradient.addColorStop(0, "rgba(255,255,255,0.16)");
        gradient.addColorStop(1, "rgba(255,255,255,0)");

        ctx.beginPath();
        ctx.moveTo(rayOriginX, rayOriginY);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    }

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      container.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} />;
}
