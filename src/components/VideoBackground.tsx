import React, { forwardRef, useEffect, useRef, MutableRefObject } from "react";

interface VideoBackgroundProps {
  /** Array of video paths to cycle through */
  videoUrls: string[];
  /** Array of poster image paths corresponding to each video (optional) */
  posterUrls?: string[];
  /** Additional Tailwind / CSS classes applied to the wrapper */
  className?: string;
  /** Render a coloured overlay above the video */
  overlay?: boolean;
  /** Overlay opacity 0-1 (only used when overlay === true) */
  overlayOpacity?: number;
  /** Overlay colour (any valid CSS colour) */
  overlayColor?: string;
  /** Mute the video element */
  muted?: boolean;
  /** Autoplay the first (and subsequent) videos */
  autoPlay?: boolean;
  /** Controls whether the <video> is allowed to play inline on mobile Safari */
  playsInline?: boolean;
  /** object-fit style for <video> element */
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  /** z-index of the wrapper */
  zIndex?: number;
  /** Apply a CSS scale transform to the wrapper */
  scale?: number;
}

/**
 * A full-screen background video component that can cycle through multiple
 * videos in sequence. When the current video ends the next video in
 * `videoUrls` is loaded and played. Once the last video finishes the first one
 * is played again, creating an infinite loop.
 */
const VideoBackground = forwardRef<HTMLVideoElement, VideoBackgroundProps>(
  (
    {
      videoUrls,
      posterUrls,
      className = "",
      overlay = false,
      overlayOpacity = 0.3,
      overlayColor = "#000000",
      muted = true,
      autoPlay = true,
      playsInline = true,
      objectFit = "cover",
      zIndex = -1,
      scale = 1,
    }: VideoBackgroundProps,
    ref
  ) => {
    // Index of the video currently being shown
    const [currentVideoIndex, setCurrentVideoIndex] = React.useState(0);

    // Track whether video playback has been initiated (either by autoPlay or user action)
    const [hasStartedPlaying, setHasStartedPlaying] = React.useState(false);

    // Keep internal ref and forward it outwards so callers can still access the
    // underlying <video> element.
    const internalVideoRef = useRef<HTMLVideoElement | null>(null);

    // Helper that ensures external ref stays in sync with internal ref
    const setRefs = (node: HTMLVideoElement | null) => {
      internalVideoRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as MutableRefObject<HTMLVideoElement | null>).current = node;
      }
    };

    // Whenever the current video index changes, we need to load & optionally
    // autoplay the new video.
    useEffect(() => {
      const video = internalVideoRef.current;
      if (!video) return;

      // Reload the element so the new <source> is picked up
      video.load();

      // Play the video if autoPlay is true OR if playback has already been initiated
      if (autoPlay || hasStartedPlaying) {
        // Some browsers (especially mobile Safari) return a promise
        // from play() which may reject – swallow those errors.
        video.play().catch(() => {
          /* ignore */
        });
      }
    }, [currentVideoIndex, autoPlay, hasStartedPlaying]);

    // When a video finishes, advance to the next one (wrapping to 0).
    const handleEnded = () => {
      setCurrentVideoIndex((prev) => (prev + 1) % videoUrls.length);
    };

    const wrapperStyle: React.CSSProperties = {
      zIndex,
      transform: `scale(${scale})`,
    };

    const videoStyle: React.CSSProperties = {
      objectFit,
      filter: overlay && overlayOpacity > 0 ? "blur(8px)" : "none",
      transition: "filter 2000ms",
    };

    return (
      <div
        className={`fixed top-0 left-0 w-screen h-screen ${className}`}
        style={wrapperStyle}
      >
        <video
          ref={setRefs}
          className="absolute top-0 left-0 w-full h-full object-cover"
          style={videoStyle}
          autoPlay={autoPlay}
          muted={muted}
          playsInline={playsInline}
          // We purposely do NOT set the `loop` attribute because we want to be
          // notified when the video ends so that we can advance to the next
          // video.
          onEnded={handleEnded}
          onPlay={() => setHasStartedPlaying(true)}
          preload="auto"
          poster={
            posterUrls && posterUrls[currentVideoIndex]
              ? posterUrls[currentVideoIndex]
              : undefined
          }
        >
          <source src={videoUrls[currentVideoIndex]} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {overlay && (
          <div
            className="w-full h-full absolute inset-0 transition-opacity duration-[2000ms]"
            style={{
              backgroundColor: overlayColor,
              opacity: overlayOpacity,
              zIndex: 1,
            }}
          />
        )}
      </div>
    );
  }
);

VideoBackground.displayName = "VideoBackground";

export default VideoBackground;
