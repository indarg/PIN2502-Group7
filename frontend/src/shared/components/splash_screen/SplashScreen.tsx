// SplashScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import './SplashScreen.css';

interface SplashScreenProps {
  isLoading: boolean;
  onLoadingComplete?: () => void;
  videoDurationMs?: number;
}

const SplashScreen: React.FC<SplashScreenProps> = ({
  isLoading,
  onLoadingComplete,
  videoDurationMs = 4000,
}) => {
  const [shouldRender, setShouldRender] = useState(isLoading);
  const [fadeOut, setFadeOut] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string>('/splash-loading-video.mp4');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const FADE_OUT_DURATION_MS = 500;

  // Mobile detection
  useEffect(() => {
    const detectMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      
      // Check for mobile user agents
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      const isMobileUserAgent = mobileRegex.test(userAgent.toLowerCase());
      
      // Check for touch capability
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Check screen size (optional additional check)
      const isSmallScreen = window.innerWidth <= 768;
      
      // Combine checks - prefer user agent but fallback to touch + screen size
      const isMobileDevice = isMobileUserAgent || (hasTouchScreen && isSmallScreen);
      
      setIsMobile(isMobileDevice);
      
      // Set video source based on mobile detection
      const newVideoSrc = isMobileDevice ? '/splash-loading-video-mobile.mp4' : '/splash-loading-video.mp4';
      setVideoSrc(newVideoSrc);
      
    };

    // Initial detection
    detectMobile();

    // Optional: Re-detect on window resize (for responsive behavior)
    const handleResize = () => {
      const isSmallScreen = window.innerWidth <= 768;
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      const isMobileUserAgent = mobileRegex.test(userAgent.toLowerCase());
      
      const isMobileDevice = isMobileUserAgent || (hasTouchScreen && isSmallScreen);
      setIsMobile(isMobileDevice);
      
      // Update video source on resize if needed
      const newVideoSrc = isMobileDevice ? '/splash-loading-video-mobile.mp4' : '/splash-loading-video.mp4';
      setVideoSrc(newVideoSrc);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Force video reload when videoSrc changes
  useEffect(() => {
    if (videoRef.current) {
      const videoElement = videoRef.current;
      
      // Load the new video source
      videoElement.load();
      
      // Restart playback
      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Video autoplay failed:', error);
        });
      }
      
      console.log('Video source changed to:', videoSrc);
    }
  }, [videoSrc]);

  // Block scroll when splash screen is visible
  useEffect(() => {
    if (shouldRender) {
      // Block scroll
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      
      // Enhanced mobile scroll prevention
      if (isMobile) {
        document.body.style.position = 'fixed';
        document.body.style.top = '0';
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.bottom = '0';
        document.body.style.touchAction = 'none'; // Prevent touch scrolling
      }
    } else {
      // Restore scroll
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.bottom = '';
      document.body.style.touchAction = '';
    }

    // Cleanup function to restore scroll on unmount
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.bottom = '';
      document.body.style.touchAction = '';
    };
  }, [shouldRender, isMobile]);

  // Track when loading completes
  useEffect(() => {
    if (!isLoading) {
      setLoadingComplete(true);
    } else if (isLoading && !shouldRender) {
      setShouldRender(true);
      setLoadingComplete(false);
    }
  }, [isLoading, shouldRender]);

  // Handle the synchronized fade-out
  useEffect(() => {
    if (loadingComplete && shouldRender && videoRef.current) {
      const videoElement = videoRef.current;
      const currentTimeMs = videoElement.currentTime * 1000;
      
      const timeRemainingInCycleMs = videoDurationMs - (currentTimeMs % videoDurationMs);
      
      console.log(`Loading complete. Video current time: ${videoElement.currentTime.toFixed(2)}s`);
      console.log(`Time remaining in cycle: ${timeRemainingInCycleMs.toFixed(0)}ms`);
      
      const waitTimer = setTimeout(() => {
        console.log('Starting fade-out synchronized with video end');
        setFadeOut(true);
        
        const fadeTimer = setTimeout(() => {
          setShouldRender(false);
          setFadeOut(false);
          onLoadingComplete?.();
        }, FADE_OUT_DURATION_MS);
        
        return () => clearTimeout(fadeTimer);
      }, timeRemainingInCycleMs);
      
      return () => clearTimeout(waitTimer);
    }
    return;
  }, [loadingComplete, shouldRender, onLoadingComplete, videoDurationMs]);

  if (!shouldRender) return null;

  return (
    <div className={`splash-loading-overlay ${fadeOut ? 'fade-out' : ''} ${isMobile ? 'splash-mobile' : 'splash-desktop'}`}>
      <video
        ref={videoRef}
        className="splash-loading-video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        key={videoSrc} 
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default SplashScreen;