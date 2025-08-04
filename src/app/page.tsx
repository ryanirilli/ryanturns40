"use client";
import VideoBackground from "../components/VideoBackground";
import { FaPlayCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import BounceButton from "../components/BounceButton";
import { useState, useEffect, useMemo, useRef } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../components/ui/dialog";

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
                Celebrate Mid Life With Me!
              </h1>
              <p className="text-xl">
                Join me for an evening of maturity, intellectualism, and
                pedantic banter followed by a night of denial and debauchery.
              </p>
              <div>
                <p className="mb-0 text-4xl leading-relaxed font-(family-name:--font-kavoon) mt-4">
                  <a
                    className="text-pink-500 text-shadow-lg"
                    href="https://www.salylimonseattle.com/"
                    target="_blank"
                  >
                    Sal Y Limón
                  </a>{" "}
                  +{" "}
                  <a
                    className="text-pink-500 text-shadow-lg"
                    href="https://www.ozziesinseattle.com/"
                    target="_blank"
                  >
                    Ozzies
                  </a>
                </p>
                <p className="text-xl leading-relaxed">
                  <strong>Friday, Aug 29th, 7pm</strong>
                </p>
              </div>

              <p className="text-lg leading-relaxed">Can you make it?</p>
              <div className="flex justify-center gap-4">
                {/* Yes Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <BounceButton className="text-white bg-black">
                      Yes
                    </BounceButton>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-white text-black dark:bg-white">
                    <DialogHeader>
                      <DialogTitle>Hell yeah</DialogTitle>
                      <DialogDescription>
                        Very excited to see you!
                      </DialogDescription>
                    </DialogHeader>
                    <form className="grid gap-4">
                      <div className="grid gap-2 text-left">
                        <label htmlFor="name1">Your Name</label>
                        <input
                          id="name1"
                          name="name1"
                          type="text"
                          className="border rounded px-2 py-1"
                        />
                      </div>
                      <div className="grid gap-2 text-left">
                        <label htmlFor="name2">(Optional) Guest Name</label>
                        <input
                          id="name2"
                          name="name2"
                          type="text"
                          className="border rounded px-2 py-1"
                        />
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <BounceButton className="bg-white text-black">
                            Cancel
                          </BounceButton>
                        </DialogClose>
                        <BounceButton
                          type="submit"
                          className="text-white bg-black"
                        >
                          Submit
                        </BounceButton>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* No Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <BounceButton className="text-white bg-black">
                      No
                    </BounceButton>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-white text-black dark:bg-white">
                    <DialogHeader>
                      <DialogTitle>Oh for real?!</DialogTitle>
                      <DialogDescription>
                        Fine. whatever. you&apos;re dead to me.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <BounceButton className="bg-white-200 text-black">
                          Close
                        </BounceButton>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
