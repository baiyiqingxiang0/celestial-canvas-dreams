import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  hue: number;
  opacity: number;
  trail: { x: number; y: number }[];
}

interface NebulaLayer {
  radius: number;
  rotation: number;
  speed: number;
  hue: number;
}

const StarryCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const nebulaLayersRef = useRef<NebulaLayer[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number>(0);

  const initParticles = () => {
    const particles: Particle[] = [];
    for (let i = 0; i < 600; i++) {
      particles.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: Math.random() * 4 + 1,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: (Math.random() - 0.5) * 0.8,
        hue: Math.random() * 360,
        opacity: Math.random() * 0.8 + 0.2,
        trail: [],
      });
    }
    particlesRef.current = particles;
  };

  const initNebulaLayers = () => {
    const layers: NebulaLayer[] = [];
    for (let i = 0; i < 3; i++) {
      layers.push({
        radius: Math.random() * 100 + 50,
        rotation: Math.random() * Math.PI * 2,
        speed: (Math.random() - 0.5) * 0.001,
        hue: Math.random() * 360,
      });
    }
    nebulaLayersRef.current = layers;
  };

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.beginPath();
    const gradient = ctx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.size
    );
    gradient.addColorStop(0, `hsla(${particle.hue}, 100%, 90%, ${particle.opacity})`);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();

    // Draw trail
    if (particle.trail.length > 2) {
      ctx.beginPath();
      ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
      for (let i = 1; i < particle.trail.length; i++) {
        ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
      }
      ctx.strokeStyle = `hsla(${particle.hue}, 100%, 90%, 0.1)`;
      ctx.stroke();
    }
  };

  const drawNebula = (ctx: CanvasRenderingContext2D) => {
    nebulaLayersRef.current.forEach(layer => {
      ctx.beginPath();
      const gradient = ctx.createRadialGradient(
        dimensions.width / 2,
        dimensions.height / 2,
        0,
        dimensions.width / 2,
        dimensions.height / 2,
        layer.radius
      );
      gradient.addColorStop(0, `hsla(${layer.hue}, 70%, 60%, 0.1)`);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.arc(
        dimensions.width / 2,
        dimensions.height / 2,
        layer.radius,
        layer.rotation,
        layer.rotation + Math.PI * 1.5
      );
      ctx.fill();
      layer.rotation += layer.speed;
    });
  };

  const updateParticles = () => {
    particlesRef.current.forEach(particle => {
      // Update trail
      particle.trail.push({ x: particle.x, y: particle.y });
      if (particle.trail.length > 20) {
        particle.trail.shift();
      }

      // Mouse interaction
      const dx = mouseRef.current.x - particle.x;
      const dy = mouseRef.current.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 100) {
        const angle = Math.atan2(dy, dx);
        particle.speedX += Math.cos(angle) * 0.2;
        particle.speedY += Math.sin(angle) * 0.2;
      }

      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Boundary check
      if (particle.x < 0) particle.x = dimensions.width;
      if (particle.x > dimensions.width) particle.x = 0;
      if (particle.y < 0) particle.y = dimensions.height;
      if (particle.y > dimensions.height) particle.y = 0;

      // Speed decay
      particle.speedX *= 0.99;
      particle.speedY *= 0.99;

      // Update hue
      particle.hue = (particle.hue + 0.1) % 360;
    });
  };

  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.fillStyle = 'rgba(0, 4, 40, 0.1)';
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    drawNebula(ctx);
    updateParticles();
    particlesRef.current.forEach(particle => drawParticle(ctx, particle));

    frameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const { clientWidth, clientHeight } = document.documentElement;
        canvasRef.current.width = clientWidth;
        canvasRef.current.height = clientHeight;
        setDimensions({ width: clientWidth, height: clientHeight });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'rgb(0, 4, 40)';
        ctx.fillRect(0, 0, dimensions.width, dimensions.height);
        initParticles();
        initNebulaLayers();
        animate();
      }
    }
  }, [dimensions]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full bg-gradient-to-b from-[#000428] to-[#004e92]"
    />
  );
};

export default StarryCanvas;
