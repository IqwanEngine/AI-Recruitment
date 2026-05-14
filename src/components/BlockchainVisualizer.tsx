import React, { useEffect, useRef } from 'react';

interface Props {
  isActive: boolean;
}

export const BlockchainVisualizer: React.FC<Props> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;
    let angle = 0;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = 180;
      const speed = isActive ? 0.04 : 0.005;
      angle += speed;

      const nodeCount = 12;
      const nodes: {x: number, y: number}[] = [];

      // Primary Node layer
      for (let i = 0; i < nodeCount; i++) {
        const theta = (i / nodeCount) * Math.PI * 2 + angle;
        const x = centerX + Math.cos(theta) * radius;
        const y = centerY + Math.sin(theta) * radius;
        nodes.push({x, y});

        // Glowing node
        const pulse = Math.sin(Date.now() / 300) * 2 + 4;
        ctx.fillStyle = isActive ? '#00f1fe' : 'rgba(0, 241, 254, 0.5)';
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x, y, pulse, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 241, 254, ${isActive ? 0.3 : 0.1})`;
        ctx.stroke();
      }

      // Secondary Node layer (internal)
      const innerNodes: {x: number, y: number}[] = [];
      for (let i = 0; i < nodeCount / 2; i++) {
        const theta = (i / (nodeCount / 2)) * Math.PI * 2 - angle * 0.5;
        const x = centerX + Math.cos(theta) * (radius * 0.4);
        const y = centerY + Math.sin(theta) * (radius * 0.4);
        innerNodes.push({x, y});

        ctx.fillStyle = 'rgba(0, 241, 254, 0.2)';
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Connection Network
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = `rgba(0, 241, 254, ${isActive ? 0.15 : 0.05})`;
      
      nodes.forEach((node, i) => {
        const nextNode = nodes[(i + 1) % nodes.length];
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(nextNode.x, nextNode.y);
        ctx.stroke();
        
        // Deep cross connections
        const farNode = nodes[(i + 5) % nodes.length];
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(farNode.x, farNode.y);
        ctx.stroke();

        // Connect to inner nodes
        innerNodes.forEach(iNode => {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(iNode.x, iNode.y);
          ctx.stroke();
        });
      });

      // Central Core Resonance
      const corePulse = Math.sin(Date.now() / 150) * 10 + 40;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
      ctx.fillStyle = isActive ? 'rgba(0, 241, 254, 0.05)' : 'rgba(0, 241, 254, 0.02)';
      ctx.fill();
      ctx.strokeStyle = `rgba(0, 241, 254, ${isActive ? 0.4 : 0.2})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, centerY, corePulse, 0, Math.PI * 2);
      ctx.strokeStyle = isActive ? 'rgba(0, 241, 254, 0.1)' : 'rgba(0, 241, 254, 0.05)';
      ctx.stroke();

      frameId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frameId);
  }, [isActive]);

  return (
    <div className="relative w-[500px] h-[500px] flex items-center justify-center">
      <div className={`absolute inset-0 bg-cyber-blue/5 rounded-full blur-[100px] transition-all duration-1000 ${isActive ? 'opacity-40 scale-125' : 'opacity-10 scale-100'}`}></div>
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="relative z-10"
      />
    </div>
  );
};
