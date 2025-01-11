import { useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import backgroundMusic from "../../assets/background-music.ogg";

function isAudioLocked(): Promise<boolean> {
  return new Promise((resolve) => {
    const checkHTML5Audio = () => {
      const audio = new Audio();
      try {
        audio.play();
        resolve(false);
      } catch (err) {
        resolve(true);
      }
    };
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      resolve(context.state === "suspended");
    } catch (e) {
      checkHTML5Audio();
    }
  });
}

const userGestureEvents = ["click", "contextmenu", "auxclick", "dblclick", "mousedown", "mouseup", "pointerup", "touchend", "keydown", "keyup"];

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<Howl | null>(null);
  const [volume, setVolume] = useState(0.8);

  useEffect(() => {
    if (!soundRef.current) {
      soundRef.current = new Howl({
        src: [backgroundMusic],
        loop: false,
        volume: volume,
        mute: true,
        onload: () => console.log("Audio loaded"),
        onloaderror: (id, err) => console.log("Load error:", err),
        onplay: (id) => setIsPlaying(true),
        onplayerror: (id, error) => {
          console.log("onplayerror triggered:", error);
        },
      });
    }

    const unlockAudio = () => {
      console.log("User gesture detected, unlocking audio!");
      soundRef.current?.mute(false);
      soundRef.current?.play();
      setIsPlaying(true);
      userGestureEvents.forEach((eventName) => {
        document.removeEventListener(eventName, unlockAudio);
      });
    };

    isAudioLocked().then((locked) => {
      if (locked) {
        console.log("Audio is locked by browser policy. Waiting for user gesture...");
        setIsPlaying(false);
        // Registriamo gli event listener. Al primo click/tocco/tasto premuto si sblocca l'audio
        userGestureEvents.forEach((eventName) => {
          document.addEventListener(eventName, unlockAudio);
        });
      } else {
        console.log("Audio not locked, starting immediately");
        soundRef.current?.mute(false);
        soundRef.current?.play();
      }
    });
    return () => {
      soundRef.current?.stop();
    };
  }, []);

  const toggleAudio = () => {
    if (!soundRef.current) return;
    if (isPlaying) {
      soundRef.current.pause();
      setIsPlaying(false);
    } else {
      soundRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (soundRef.current) {
      soundRef.current.volume(newVolume);
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        left: "10px",
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        gap: "10px", // spazio tra icona e slider
        filter: "drop-shadow(0 0 5px #0f0)",
      }}
    >
      <div
        className={isPlaying ? "icon-container matrix-glitch" : "icon-container"}
        id="playButton"
        style={{
          cursor: "pointer",
          width: "40px",
          height: "40px",
          position: "relative",
        }}
        onClick={toggleAudio}
      >
        {/* Icona di base (nota musicale) */}
        <div className="default-icon">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" fill="transparent" />
            <circle cx="14" cy="26" r="4" stroke="#0f0" strokeWidth="2" fill="none" />
            <line x1="18" y1="26" x2="18" y2="12" stroke="#0f0" strokeWidth="2" />
            <path d="M18 12 L25 14" stroke="#0f0" strokeWidth="2" fill="none" />
            <line x1="10" y1="10" x2="30" y2="10" stroke="#0f0" strokeDasharray="2 2" opacity="0.3" />
            <line x1="10" y1="20" x2="30" y2="20" stroke="#0f0" strokeDasharray="4 2" opacity="0.3" />
          </svg>
        </div>

        {/* Icona play/pause */}
        <div className="hover-icon">
          {isPlaying ? (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="0" width="40" height="40" fill="transparent" />
              <line x1="14" y1="10" x2="14" y2="30" stroke="#0f0" strokeWidth="3" />
              <line x1="26" y1="10" x2="26" y2="30" stroke="#0f0" strokeWidth="3" />
            </svg>
          ) : (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="0" width="40" height="40" fill="transparent" />
              <path d="M16 12 L28 20 L16 28 Z" fill="none" stroke="#0f0" strokeWidth="2" />
            </svg>
          )}
        </div>
      </div>

      {/* Slider del volume alla destra dell'icona, visibile solo se in play */}
      {isPlaying && (
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          style={{
            cursor: "pointer",
            width: "100px",
            background: "transparent",
          }}
        />
      )}
    </div>
  );
};

export default AudioPlayer;
