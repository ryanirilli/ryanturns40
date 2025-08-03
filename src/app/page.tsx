"use client";
import VideoBackground from "../components/VideoBackground";
import { FaPlayCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import BounceButton from "../components/BounceButton";
import { useState, useEffect, useMemo, useRef } from "react";

export default function Home() {
  // Prepare audio that will play after the user presses Play
  const videoRef = useRef<HTMLVideoElement>(null);

  const audio = useMemo(() => {
    if (typeof Audio !== "undefined") {
      return new Audio(encodeURI("/10 Don't Reach Across My Plate.m4a"));
    }
    // Fallback (SSR) – return null-like object
    return undefined as unknown as HTMLAudioElement;
  }, []);

  // Track whether the user has pressed the play button
  const [hasStarted, setHasStarted] = useState(false);
  // Control when the content container becomes visible
  const [showContainer, setShowContainer] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handleMainClick = () => {
    if (!hasStarted || !audio) return;
    const newMuted = !audio.muted;
    audio.muted = newMuted;
    setIsMuted(newMuted);
  };

  // Once the play button is pressed, reveal the container after a short delay
  useEffect(() => {
    if (hasStarted) {
      const timer = setTimeout(() => setShowContainer(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [hasStarted]);

  return (
    <>
      <VideoBackground
        ref={videoRef}
        videoUrl="/primary-bg-video.mp4"
        overlay={true}
        overlayOpacity={showContainer ? 0.5 : 0}
        overlayColor="#ffffff"
        scale={1.2}
        autoPlay={false}
        loop
      />
      <main
        onClick={handleMainClick}
        className="flex items-center justify-center min-h-screen relative z-10"
      >
        {/* Play Button */}
        <BounceButton
          aria-label="Play"
          onClick={async () => {
            setHasStarted(true);
            try {
              audio?.play();
            } catch (err) {
              console.error("Failed to play audio", err);
            }
            try {
              if (videoRef.current) {
                await videoRef.current.play();
              }
            } catch (err) {
              console.error("Failed to play video", err);
            }
          }}
          initial={{ opacity: 1, y: 0 }}
          animate={
            hasStarted
              ? { opacity: 0, y: -20, pointerEvents: "none" }
              : { opacity: 1, y: 0 }
          }
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-white bg-transparent px-0 py-0 border-0 outline-none cursor-pointer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <FaPlayCircle size={96} color="black" />
        </BounceButton>

        {/* Content Container */}
        <AnimatePresence>
          {showContainer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="p-8 text-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center max-w-2xl gap-6"
            >
              <h1 className="text-5xl font-extrabold tracking-tight">
                Celebrate Mid Life With Me.
              </h1>
              <p className="text-xl">
                Join me for an evening of maturity, intellectualism, and
                pedantic banter followed by a night of denial and debauchery.
              </p>
              <p className="text-xl leading-relaxed">
                <strong>Friday, Aug 29th, 7pm</strong>
              </p>
              <p className="text-4xl leading-relaxed font-(family-name:--font-erica-one)">
                <a
                  className="text-emerald-400 text-shadow-lg"
                  href="https://www.salylimonseattle.com/"
                >
                  Sal Y Limón
                </a>{" "}
                +{" "}
                <a
                  className="text-pink-500 text-shadow-lg"
                  href="https://www.ozziesinseattle.com/"
                >
                  Ozzies
                </a>
              </p>
              <p className="text-lg leading-relaxed">Can you make it?</p>
              <div className="flex justify-center gap-4">
                <BounceButton>Yes</BounceButton>
                <BounceButton>No</BounceButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
