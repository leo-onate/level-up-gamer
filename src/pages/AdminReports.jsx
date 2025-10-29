import React, { useRef, useEffect } from "react";
import starmie from "../assets/img/Starmie2.gif";
import reportSong from "../assets/music/DragonDance.mp3";

export default function AdminReports() {
  const audioRef = useRef(null);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    a.muted = true;
    a.loop = true;
    a.volume = 0.90; // 90% del volumen máximo (ajusta aquí)
    a.play().catch(() => {});

    
    const onFirstInteraction = () => {
      try {
        a.muted = false;
        a.play().catch(() => {});
      } catch {}
      window.removeEventListener("click", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
      window.removeEventListener("touchstart", onFirstInteraction);
    };

    window.addEventListener("click", onFirstInteraction);
    window.addEventListener("keydown", onFirstInteraction);
    window.addEventListener("touchstart", onFirstInteraction);

    return () => {
      window.removeEventListener("click", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
      window.removeEventListener("touchstart", onFirstInteraction);
      try { a.pause(); } catch {}
    };
  }, []);

  return (
    <div className="container mt-4">
      <h2>Reportes</h2>
      <p>Reportes próximamente.</p>

      <img src={starmie} alt="Cargando reportes" style={{ maxWidth: 500 }} />

      
      <audio ref={audioRef} src={reportSong} preload="auto" />
    </div>
  );
}