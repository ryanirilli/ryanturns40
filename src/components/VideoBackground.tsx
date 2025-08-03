import React from "react";

interface VideoBackgroundProps {
  videoUrl: string;
  className?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  overlayColor?: string;
  muted?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  zIndex?: number;
  scale?: number;
}

const VideoBackground = React.forwardRef<
  HTMLVideoElement,
  VideoBackgroundProps
>(
  (
    {
      videoUrl,
      className = "",
      overlay = false,
      overlayOpacity = 0.3,
      overlayColor = "#000000",
      muted = true,
      autoPlay = true,
      loop = true,
      playsInline = true,
      objectFit = "cover",
      zIndex = -1,
      scale = 1,
    }: VideoBackgroundProps,
    ref
  ) => {
    // Internal ref to keep a reference and forward it outward
    const videoRef = React.useRef<HTMLVideoElement | null>(null);

    const videoStyle = {
      transform: `scale(${scale})`,
    };

    return (
      <div
        className={`fixed top-0 left-0 w-screen h-screen ${className}`}
        style={{ zIndex, ...videoStyle }}
      >
        <video
          ref={(node) => {
            // Keep internal ref for potential future use and forward external ref
            if (node) {
              videoRef.current = node;
            }
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              (ref as React.MutableRefObject<HTMLVideoElement | null>).current =
                node;
            }
          }}
          className="absolute top-0 left-0 w-full h-full object-cover"
          style={{
            objectFit,
            filter: overlay && overlayOpacity > 0 ? "blur(2px)" : "none",
            transition: "filter 2000ms",
          }}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline={playsInline}
          preload="auto"
        >
          <source src={videoUrl} type="video/mp4" />
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

export default VideoBackground;
