import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type React from 'react';
import { formatTime } from './timeUtils';
import { usePlayerMeta } from './usePlayerMeta';
import type { Subtitle } from './types';
import styles from './VideoPlayer.module.css';

type PlayerControlsProps = {
  progressPercent: number;
  currentTime: number;
  currentSubtitle: Subtitle | null;
  isPlaying: boolean;
  isMuted: boolean;
  isFullscreen: boolean;
  captionsEnabled: boolean;
  subtitleSize: 'small' | 'medium' | 'large';
  duration: number;
  volume: number;
  playbackRate: number;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onReplay: () => void;
  onToggleFullscreen: () => void;
  onToggleCaptions: () => void;
  onSeek: (time: number) => void;
  onSkip: (delta: number) => void;
  onVolumeChange: (value: number) => void;
  onPlaybackRateChange: (value: number) => void;
  onMutedStateChange: (value: boolean) => void;
  onSubtitleSizeChange: (value: 'small' | 'medium' | 'large') => void;
};

type ScrubData = {
  x: number;
  percent: number;
  scrubTime: number;
};

export function PlayerControls({
  progressPercent,
  currentTime,
  currentSubtitle,
  isPlaying,
  isMuted,
  isFullscreen,
  captionsEnabled,
  subtitleSize,
  duration,
  volume,
  playbackRate,
  onTogglePlay,
  onToggleMute,
  onReplay,
  onToggleFullscreen,
  onToggleCaptions,
  onSeek,
  onSkip,
  onVolumeChange,
  onPlaybackRateChange,
  onMutedStateChange,
  onSubtitleSizeChange,
}: PlayerControlsProps) {
  const progressRef = useRef<HTMLDivElement | null>(null);
  const [pointerDown, setPointerDown] = useState(false);
  const [isSubtitleSizeOpen, setIsSubtitleSizeOpen] = useState(false);
  const subtitleSizeRef = useRef<HTMLDivElement | null>(null);

  const volumePercentLabel = useMemo(() => `${Math.round(volume * 100)}%`, [volume]);
  const playbackRateLabel = useMemo(() => playbackRate.toFixed(1), [playbackRate]);
  const subtitleFontSizeLabel = useMemo(() => {
    switch (subtitleSize) {
      case 'small':
        return 'Small';
      case 'large':
        return 'Large';
      default:
        return 'Medium';
    }
  }, [subtitleSize]);

  const timeDisplay = useMemo(
    () => `${formatTime(currentTime)} / ${formatTime(duration)}`,
    [currentTime, duration]
  );

  const {
    playButtonState,
    muteButtonState,
    fullscreenButtonState,
    replayButtonMeta,
    playbackRateMeta,
    volumeMeta,
    closedCaptionsMeta,
    skipButtonMeta,
  } = usePlayerMeta({
    isPlaying,
    isMuted,
    isFullscreen,
    volume,
    playbackRate,
    volumePercentLabel,
    playbackRateLabel,
  });

  const getScrubData = useCallback(
    (e: PointerEvent): ScrubData | null => {
      if (!progressRef.current || !duration) return null;

      const rect = progressRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = Math.min(Math.max(x / rect.width, 0), 1);
      const scrubTime = percent * duration;

      return { x, percent, scrubTime };
    },
    [duration]
  );

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      const data = getScrubData(e);
      if (!data) return;

      if (pointerDown) {
        onSeek(data.scrubTime);
      }
    },
    [duration, getScrubData, onSeek, pointerDown]
  );

  const seekToPointer = useCallback(
    (e: PointerEvent) => {
      const data = getScrubData(e);
      if (data) {
        onSeek(data.scrubTime);
      }
    },
    [getScrubData, onSeek]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      setPointerDown(true);
      seekToPointer(e.nativeEvent);
    },
    [seekToPointer]
  );

  const handlePointerCancel = useCallback(() => setPointerDown(false), []);
  const handlePointerUp = useCallback(() => setPointerDown(false), []);

  useEffect(() => {
    const onWindowPointerUp = () => setPointerDown(false);
    const onWindowPointerCancel = () => setPointerDown(false);
    const handleClickOutside = (event: MouseEvent) => {
      if (subtitleSizeRef.current && !subtitleSizeRef.current.contains(event.target as Node)) {
        setIsSubtitleSizeOpen(false);
      }
    };

    window.addEventListener('pointerup', onWindowPointerUp);
    window.addEventListener('pointercancel', onWindowPointerCancel);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('pointerup', onWindowPointerUp);
      window.removeEventListener('pointercancel', onWindowPointerCancel);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`${styles['player-controls']} ${
        isFullscreen ? styles['player-controls--fullscreen'] : ''
      }`}
      role="region"
      aria-label="Video player controls"
    >
      <div
        className={styles['player-controls__progress']}
        ref={progressRef}
        onPointerDown={handlePointerDown}
        onPointerMove={(e) => onPointerMove(e.nativeEvent)}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <div
          className={styles['player-controls__progress-bar']}
          style={{ width: `${Number.isFinite(progressPercent) ? progressPercent : 0}%` }}
        />
      </div>

      <div className={styles['player-controls__group']}>
        <button
          className={styles['player-controls__button']}
          title={playButtonState.title}
          aria-label={playButtonState.title}
          onClick={onTogglePlay}
        >
          <playButtonState.icon size={playButtonState.size} aria-hidden="true" />
        </button>
        <button
          className={styles['player-controls__button']}
          title={replayButtonMeta.title}
          aria-label={replayButtonMeta.title}
          onClick={onReplay}
        >
          <replayButtonMeta.icon size={replayButtonMeta.size} aria-hidden="true" />
        </button>
        <div className={styles['player-controls__time']}>{timeDisplay}</div>
      </div>

      <button
        className={`${styles['player-controls__button']} ${styles['player-controls__button--mute']}`}
        onClick={onToggleMute}
        aria-pressed={isMuted}
        title={muteButtonState.title}
        aria-label={muteButtonState.title}
      >
        <muteButtonState.icon size={muteButtonState.size} aria-hidden="true" />
      </button>

      <div className={styles['player-controls__slider-wrapper']}>
        <input
          type="range"
          name="volume"
          className={styles['player-controls__slider']}
          min="0"
          max="1"
          step="0.05"
          role="slider"
          aria-label="Volume"
          aria-valuemin={0}
          aria-valuemax={1}
          aria-valuenow={volume}
          value={volume}
          title={volumeMeta.title}
          onChange={(event) => {
            const value = parseFloat(event.target.value);
            onVolumeChange(value);
            onMutedStateChange(value === 0);
          }}
        />
        <div className={styles['player-controls__tooltip']} aria-hidden="true">
          <volumeMeta.icon size={volumeMeta.size} aria-hidden="true" />
          {volumeMeta.label}
        </div>
      </div>

      <div
        className={`${styles['player-controls__slider-wrapper']} ${styles['player-controls__slider-wrapper--play-back-rate']}`}
      >
        <input
          type="range"
          name="playbackRate"
          className={styles['player-controls__slider']}
          min="0.5"
          max="2"
          step="0.1"
          role="slider"
          aria-label="Playback rate"
          aria-valuemin={0.5}
          aria-valuemax={2}
          aria-valuenow={playbackRate}
          value={playbackRate}
          title={playbackRateMeta.title}
          onChange={(event) => onPlaybackRateChange(parseFloat(event.target.value))}
        />
        <div className={styles['player-controls__tooltip']} aria-hidden="true">
          <playbackRateMeta.icon size={playbackRateMeta.size} aria-hidden="true" />
          {playbackRateMeta.label}
        </div>
      </div>

      <button
        className={`${styles['player-controls__button']} ${styles['player-controls__button--skip']}`}
        title={skipButtonMeta.rewind.title}
        aria-label={skipButtonMeta.rewind.title}
        onClick={() => onSkip(-10)}
      >
        <skipButtonMeta.rewind.icon size={skipButtonMeta.rewind.size} aria-hidden="true" />
        {skipButtonMeta.rewind.label}
      </button>
      <button
        className={`${styles['player-controls__button']} ${styles['player-controls__button--skip']}`}
        title={skipButtonMeta.forward.title}
        aria-label={skipButtonMeta.forward.title}
        onClick={() => onSkip(25)}
      >
        {skipButtonMeta.forward.label}
        <skipButtonMeta.forward.icon size={skipButtonMeta.forward.size} aria-hidden="true" />
      </button>
      <button
        className={styles['player-controls__button']}
        title={fullscreenButtonState.title}
        aria-label={fullscreenButtonState.title}
        aria-pressed={isFullscreen}
        onClick={onToggleFullscreen}
      >
        <fullscreenButtonState.icon size={fullscreenButtonState.size} aria-hidden="true" />
      </button>
      <div className={styles['player-controls__dropdown-wrapper']} ref={subtitleSizeRef}>
        <button
          className={`${styles['player-controls__button']} ${styles['player-controls__button--cc']} ${
            captionsEnabled ? styles['is-active'] : ''
          }`}
          title={closedCaptionsMeta.title}
          aria-label={closedCaptionsMeta.title}
          aria-pressed={captionsEnabled}
          onClick={() => {
            onToggleCaptions();
            setIsSubtitleSizeOpen(false);
          }}
        >
          <closedCaptionsMeta.icon size={closedCaptionsMeta.size} aria-hidden="true" />
        </button>
        <button
          className={styles['player-controls__button']}
          aria-haspopup="listbox"
          aria-expanded={isSubtitleSizeOpen}
          title={`Subtitle size: ${subtitleFontSizeLabel}`}
          onClick={() => setIsSubtitleSizeOpen((prev) => !prev)}
        >
          Aa
        </button>
        {isSubtitleSizeOpen && (
          <div className={styles['player-controls__dropdown']} role="listbox">
            {[
              { value: 'small', label: 'Small' },
              { value: 'medium', label: 'Medium' },
              { value: 'large', label: 'Large' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={subtitleSize === option.value}
                className={subtitleSize === option.value ? 'is-active' : ''}
                onClick={() => {
                  onSubtitleSizeChange(option.value as 'small' | 'medium' | 'large');
                  setIsSubtitleSizeOpen(false);
                }}
              >
                <span>{option.label}</span>
                <span
                  aria-hidden="true"
                  style={{
                    fontSize:
                      option.value === 'small'
                        ? '0.9rem'
                        : option.value === 'large'
                          ? '1.1rem'
                          : '1rem',
                  }}
                >
                  Aa
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
      {captionsEnabled && currentSubtitle && (
        <div
          className={styles['player-controls__subtitle']}
          style={{
            fontSize:
              subtitleSize === 'small' ? '0.9rem' : subtitleSize === 'large' ? '1.2rem' : '1rem',
          }}
          aria-hidden="true"
        >
          <span>{currentSubtitle.text}</span>
        </div>
      )}
    </div>
  );
}
