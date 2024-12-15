import React, { useEffect, useRef } from "react";

const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    // Inizializzazione dimensioni canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    // Lettere da usare
    const letters = "ABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZ";
    const letterArray: string[] = letters.split("");

    const fontSize = 10;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = Array.from({ length: columns }, () => 1);

    const draw = () => {
      if (!ctx) return;
      // Sfondo semi-trasparente per effetto scia
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#0f0";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = letterArray[Math.floor(Math.random() * letterArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Fa "scendere" la colonna
        drops[i]++;

        // Se il carattere esce dallo schermo, resetta occasionalmente
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
          drops[i] = 0;
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    // Per aggiornare colonna se ridimensioniamo
    const handleResize = () => {
      columns = Math.floor(canvas.width / fontSize);
      drops = Array.from({ length: columns }, () => 1);
    };

    window.addEventListener("resize", handleResize);

    // Avvia animazione
    draw();

    // Pulizia all'unmount
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ display: "block", background: "#000", position: "fixed", top: 0, left: 0, zIndex: -1 }} />;
};

export default MatrixRain;
