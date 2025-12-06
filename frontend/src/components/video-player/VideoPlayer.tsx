import { useCallback, useEffect, useRef, useState } from 'react';
import type React from 'react';
import { PlayerControls } from './PlayerControls';
import { PlayerOverlay } from './PlayerOverlay';
import { useFullscreen } from './useFullscreen';
import { parseVTT } from './subtitleUtils';
import type { Subtitle } from './types';
import styles from './VideoPlayer.module.css';

type VideoPlayerProps = {
  videoSrc?: string | null;
  subtitleText?: string | null;
};

export function VideoPlayer({ videoSrc, subtitleText }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [progressPercent, setProgressPercent] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [subtitleSize, setSubtitleSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState<Subtitle | null>(null);

  const { isFullscreen, toggleFullscreen } = useFullscreen(wrapperRef);

  const withVideo = useCallback((callback: (video: HTMLVideoElement) => void) => {
    const video = videoRef.current;
    if (video) callback(video);
  }, []);

  const setSubtitleForTime = useCallback(
    (time: number) => {
      if (!subtitles.length) return;
      setCurrentSubtitle(
        subtitles.find((subtitle) => time >= subtitle.start && time <= subtitle.end) ?? null
      );
    },
    [subtitles]
  );

  const handleProgress = useCallback(() => {
    withVideo((video) => {
      if (!video.duration || Number.isNaN(video.duration)) return;
      const time = video.currentTime;
      setCurrentTime(time);
      setProgressPercent((time / video.duration) * 100);
      setSubtitleForTime(time);
    });
  }, [setSubtitleForTime, withVideo]);

  const handleLoadedMetadata = useCallback(() => {
    withVideo((video) => {
      if (Number.isFinite(video.duration)) {
        setDuration(video.duration);
      }
    });
  }, [withVideo]);

  const handleLoadedData = useCallback(() => setIsLoading(false), []);
  const handleCanPlay = useCallback(() => setIsLoading(false), []);
  const handleWaiting = useCallback(() => setIsLoading(true), []);

  const handleVideoError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  const togglePlay = useCallback(() => {
    withVideo((video) => {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });
  }, [withVideo]);

  const replay = useCallback(() => {
    withVideo((video) => {
      video.currentTime = 0;
      video.play();
    });
  }, [withVideo]);

  const toggleMute = useCallback(() => {
    withVideo((video) => {
      video.muted = !video.muted;
      setIsMuted(video.muted);
    });
  }, [withVideo]);

  const toggleCaptions = useCallback(() => {
    setCaptionsEnabled((prev) => !prev);
  }, []);

  const updatePlayState = useCallback(() => {
    withVideo((video) => setIsPlaying(!video.paused));
  }, [withVideo]);

  const seekTo = useCallback(
    (time: number) => {
      withVideo((video) => {
        const target = Math.min(
          Math.max(time, 0),
          Number.isFinite(video.duration) ? video.duration : time
        );
        video.currentTime = target;
        setCurrentTime(target);
        if (Number.isFinite(video.duration) && video.duration > 0) {
          setProgressPercent((target / video.duration) * 100);
        }
        setSubtitleForTime(target);
      });
    },
    [setSubtitleForTime, withVideo]
  );

  const skip = useCallback(
    (delta: number) => {
      withVideo((video) => {
        const durationSafe = Number.isFinite(video.duration) ? video.duration : 0;
        const target = Math.min(
          Math.max(video.currentTime + delta, 0),
          durationSafe || video.currentTime + delta
        );
        video.currentTime = target;
        setCurrentTime(target);
        if (durationSafe > 0) {
          setProgressPercent((target / durationSafe) * 100);
        }
        setSubtitleForTime(target);
      });
    },
    [setSubtitleForTime, withVideo]
  );

  useEffect(() => {
    withVideo((video) => {
      video.volume = volume;
    });
  }, [volume, withVideo]);

  useEffect(() => {
    withVideo((video) => {
      video.playbackRate = playbackRate;
    });
  }, [playbackRate, withVideo]);

  useEffect(() => {
    withVideo((video) => {
      video.muted = isMuted;
    });
  }, [isMuted, withVideo]);

  useEffect(() => {
    const updateSubtitleOnChange = () => setSubtitleForTime(currentTime);
    updateSubtitleOnChange();
  }, [currentTime, setSubtitleForTime]);

  // Load subtitles when provided by parent (backend response)
  useEffect(() => {
    if (!subtitleText) {
      setSubtitles([]);
      setCurrentSubtitle(null);
      return;
    }

    try {
      setSubtitles(parseVTT(subtitleText));
    } catch (error) {
      console.error('[loadSubtitles] Error parsing VTT:', error);
      setSubtitles([]);
    }
  }, [subtitleText]);

  // Reset state when a new video source is provided
  useEffect(() => {
    setIsLoading(Boolean(videoSrc));
    setHasError(false);
    setProgressPercent(0);
    setCurrentTime(0);
    setDuration(0);
    setCurrentSubtitle(null);
  }, [videoSrc]);

  const increaseVolume = useCallback(() => setVolume((value) => Math.min(value + 0.05, 1)), []);
  const decreaseVolume = useCallback(() => setVolume((value) => Math.max(value - 0.05, 0)), []);
  const increaseRate = useCallback(() => setPlaybackRate((value) => Math.min(value + 0.1, 2)), []);
  const decreaseRate = useCallback(
    () => setPlaybackRate((value) => Math.max(value - 0.1, 0.5)),
    []
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLVideoElement>) => {
      const key = event.key.toLowerCase();
      switch (key) {
        case ' ':
        case 'k':
          event.preventDefault();
          togglePlay();
          break;
        case 'arrowright':
          skip(25);
          break;
        case 'arrowleft':
          skip(-10);
          break;
        case 'arrowup':
          event.preventDefault();
          increaseVolume();
          break;
        case 'arrowdown':
          event.preventDefault();
          decreaseVolume();
          break;
        case 'm':
          toggleMute();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'c':
          toggleCaptions();
          break;
        case '[':
          decreaseRate();
          break;
        case ']':
          increaseRate();
          break;
        default:
          break;
      }
    },
    [
      decreaseRate,
      decreaseVolume,
      increaseRate,
      increaseVolume,
      skip,
      toggleCaptions,
      toggleFullscreen,
      toggleMute,
      togglePlay,
    ]
  );

  return (
    <div className={styles['custom-video-player']}>
      <div className={styles['custom-video-player__shell']}>
        <div className={styles.player} ref={wrapperRef}>
          <video
            preload="auto"
            className={styles.player__video}
            ref={videoRef}
            tabIndex={0}
            aria-label="Video player. Use keyboard arrows for playback control"
            src={videoSrc ?? ''}
            onClick={togglePlay}
            onPlay={updatePlayState}
            onPause={updatePlayState}
            onTimeUpdate={handleProgress}
            onLoadedMetadata={handleLoadedMetadata}
            onLoadedData={handleLoadedData}
            onError={handleVideoError}
            onCanPlay={handleCanPlay}
            onWaiting={handleWaiting}
            onKeyDown={handleKeyDown}
          />

          <PlayerOverlay isLoading={isLoading} hasError={hasError} />

          <PlayerControls
            isPlaying={isPlaying}
            isFullscreen={isFullscreen}
            captionsEnabled={captionsEnabled}
            progressPercent={progressPercent}
            duration={duration}
            currentTime={currentTime}
            currentSubtitle={currentSubtitle}
            onTogglePlay={togglePlay}
            onReplay={replay}
            onToggleMute={toggleMute}
            onToggleFullscreen={toggleFullscreen}
            onToggleCaptions={toggleCaptions}
            onSeek={seekTo}
            onSkip={skip}
            volume={volume}
            playbackRate={playbackRate}
            isMuted={isMuted}
            onVolumeChange={setVolume}
            onPlaybackRateChange={setPlaybackRate}
            onMutedStateChange={setIsMuted}
            subtitleSize={subtitleSize}
            onSubtitleSizeChange={setSubtitleSize}
          />
        </div>
      </div>
    </div>
  );
}
