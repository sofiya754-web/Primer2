import { useEffect, useRef } from 'react';

interface BackgroundVideoProps {
  src: string;
}

export function BackgroundVideo({ src }: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isReducedMotion = mediaQuery.matches;

    const handleMotionPreferenceChange = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
      if (isReducedMotion && video) {
        try {
          video.currentTime = 0;
        } catch {
          // ignore
        }
      }
    };

    mediaQuery.addEventListener('change', handleMotionPreferenceChange);

    // Ensure video is strictly paused, muted and primed for scroll-scrubbing
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('playsinline', 'true');
    try {
      video.pause();
    } catch {
      // ignore
    }

    let current = 0;
    let target = 0;
    let lastTime = performance.now();
    let animationFrameId: number;
    let isSeeking = false;
    let seekQueued = false;
    let seekStartTime = 0;

    // Calculate target video timestamp from current window scroll
    const calculateTarget = () => {
      if (!video || !video.duration || isNaN(video.duration) || !isFinite(video.duration)) {
        return 0;
      }
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
      const maxDuration = Math.max(0, video.duration - 0.05);
      return progress * maxDuration;
    };

    // Fast and safe seek dispatcher
    const executeSeek = () => {
      if (!video || isReducedMotion || video.readyState < 2) return;
      if (!video.duration || isNaN(video.duration) || !isFinite(video.duration)) return;

      const maxDuration = Math.max(0, video.duration - 0.05);
      const safeTime = Math.min(Math.max(current, 0), maxDuration);

      if (!Number.isFinite(safeTime)) return;

      // Small threshold to avoid redundant seek instructions
      if (Math.abs(video.currentTime - safeTime) < 0.008) {
        return;
      }

      // If already seeking, record that a fresh frame is requested and wait for seeked or watchdog
      const now = performance.now();
      if (isSeeking) {
        // Watchdog: If seek takes longer than 80ms, unlock to prevent browser decoder stalls
        if (now - seekStartTime > 80) {
          isSeeking = false;
        } else {
          seekQueued = true;
          return;
        }
      }

      isSeeking = true;
      seekQueued = false;
      seekStartTime = now;

      try {
        if (typeof (video as { fastSeek?: (t: number) => void }).fastSeek === 'function') {
          (video as { fastSeek: (t: number) => void }).fastSeek(safeTime);
        } else {
          video.currentTime = safeTime;
        }
      } catch {
        isSeeking = false;
      }
    };

    const handleSeeked = () => {
      isSeeking = false;
      if (seekQueued) {
        seekQueued = false;
        executeSeek();
      }
    };

    const handleMetadataReady = () => {
      try {
        video.pause();
      } catch {
        // ignore
      }

      if (isReducedMotion) {
        try {
          video.currentTime = 0;
        } catch {
          // ignore
        }
      } else {
        target = calculateTarget();
        current = target;
        executeSeek();
      }
    };

    const onScroll = () => {
      target = calculateTarget();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    video.addEventListener('loadedmetadata', handleMetadataReady);
    video.addEventListener('canplay', handleMetadataReady);
    video.addEventListener('canplaythrough', handleMetadataReady);
    video.addEventListener('seeked', handleSeeked);

    // Initial check if video is already ready
    if (video.readyState >= 1) {
      handleMetadataReady();
    }

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (!isReducedMotion && video && video.duration && isFinite(video.duration)) {
        target = calculateTarget();

        const diff = target - current;
        if (Math.abs(diff) > 0.0001) {
          // Responsive, jitter-free exponential playhead tracking
          current += diff * (1 - Math.exp(-dt * 18));
          executeSeek();
        } else if (current !== target) {
          current = target;
          executeSeek();
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', onScroll);
      mediaQuery.removeEventListener('change', handleMotionPreferenceChange);
      video.removeEventListener('loadedmetadata', handleMetadataReady);
      video.removeEventListener('canplay', handleMetadataReady);
      video.removeEventListener('canplaythrough', handleMetadataReady);
      video.removeEventListener('seeked', handleSeeked);
    };
  }, [src]);

  return (
    <div
      id="video-background-container"
      className="fixed inset-0 w-full h-full -z-20 overflow-hidden bg-black select-none pointer-events-none"
      style={{ transform: 'translate3d(0, 0, 0)', backfaceVisibility: 'hidden' }}
    >
      <video
        id="scrub-video"
        ref={videoRef}
        src={src}
        autoPlay={false}
        loop={false}
        muted
        playsInline
        crossOrigin="anonymous"
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        className="w-full h-full object-cover pointer-events-none select-none will-change-transform"
        style={{ transform: 'translate3d(0, 0, 0)' }}
      />
    </div>
  );
}

