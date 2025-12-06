import {
  Play,
  Pause,
  RotateCcw,
  VolumeX,
  Volume1,
  Volume2,
  VolumeOff,
  FastForward,
  ChevronsLeft,
  ChevronsRight,
  Maximize,
  Minimize,
  Captions,
} from 'lucide-react';
import { useMemo } from 'react';

type PlayerMetaProps = {
  isPlaying: boolean;
  isMuted: boolean;
  isFullscreen: boolean;
  volume: number;
  playbackRate: number;
  volumePercentLabel: string;
  playbackRateLabel: string;
};

export function usePlayerMeta(props: PlayerMetaProps) {
  const playButtonState = useMemo(
    () =>
      props.isPlaying
        ? { title: 'Pause', icon: Pause, size: 20 }
        : { title: 'Play', icon: Play, size: 20 },
    [props.isPlaying]
  );

  const muteButtonState = useMemo(
    () =>
      props.isMuted
        ? { title: 'Unmute', icon: VolumeOff, size: 16 }
        : { title: 'Mute', icon: Volume2, size: 16 },
    [props.isMuted]
  );

  const fullscreenButtonState = useMemo(
    () =>
      props.isFullscreen
        ? { title: 'Exit Fullscreen', icon: Minimize, size: 16 }
        : { title: 'Enter Fullscreen', icon: Maximize, size: 16 },
    [props.isFullscreen]
  );

  const replayButtonMeta = useMemo(
    () => ({
      title: 'Replay',
      icon: RotateCcw,
      size: 16,
    }),
    []
  );

  const playbackRateMeta = useMemo(
    () => ({
      title: 'Playback Rate',
      label: props.playbackRateLabel,
      icon: FastForward,
      size: 12,
    }),
    [props.playbackRateLabel]
  );

  const volumeMeta = useMemo(() => {
    const isMuted = props.isMuted || props.volume === 0;
    if (isMuted) {
      return {
        title: 'Muted',
        label: 'Muted',
        icon: VolumeX,
        size: 12,
      };
    }
    if (props.volume < 0.5) {
      return {
        title: 'Low volume',
        label: props.volumePercentLabel,
        icon: Volume1,
        size: 12,
      };
    }
    return {
      title: 'High volume',
      label: props.volumePercentLabel,
      icon: Volume2,
      size: 12,
    };
  }, [props.isMuted, props.volume, props.volumePercentLabel]);

  const closedCaptionsMeta = useMemo(
    () => ({
      title: 'Subtitles/closed captions (c)',
      icon: Captions,
      size: 16,
    }),
    []
  );

  const skipButtonMeta = useMemo(
    () => ({
      forward: {
        title: 'Forward',
        label: '25s',
        icon: ChevronsRight,
        size: 16,
      },
      rewind: {
        title: 'Rewind',
        label: '10s',
        icon: ChevronsLeft,
        size: 16,
      },
    }),
    []
  );

  return {
    playButtonState,
    muteButtonState,
    fullscreenButtonState,
    replayButtonMeta,
    playbackRateMeta,
    volumeMeta,
    closedCaptionsMeta,
    skipButtonMeta,
  };
}
