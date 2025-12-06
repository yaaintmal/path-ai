import { useCallback, useEffect, useState } from 'react';
import type { RefObject } from 'react';

type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
  mozRequestFullScreen?: () => Promise<void> | void;
  msRequestFullscreen?: () => Promise<void> | void;
};

type FullscreenDocument = Document & {
  webkitExitFullscreen?: () => Promise<void> | void;
  mozCancelFullScreen?: () => Promise<void> | void;
  msExitFullscreen?: () => Promise<void> | void;
};

export function useFullscreen(targetRef: RefObject<HTMLElement | null>) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const enter = useCallback(() => {
    const el = targetRef.current as FullscreenElement | null;
    if (!el) return;

    const request =
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.mozRequestFullScreen ||
      el.msRequestFullscreen;

    request?.call(el);
  }, [targetRef]);

  const exit = useCallback(() => {
    const doc = document as FullscreenDocument;
    const exitFullscreen =
      document.exitFullscreen ||
      doc.webkitExitFullscreen ||
      doc.mozCancelFullScreen ||
      doc.msExitFullscreen;

    exitFullscreen?.call(document);
  }, []);

  const toggle = useCallback(() => {
    if (isFullscreen) {
      exit();
    } else {
      enter();
    }
  }, [enter, exit, isFullscreen]);

  useEffect(() => {
    const handleChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  return {
    isFullscreen,
    enterFullscreen: enter,
    exitFullscreen: exit,
    toggleFullscreen: toggle,
  };
}
