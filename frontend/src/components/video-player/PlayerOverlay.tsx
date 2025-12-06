import styles from './VideoPlayer.module.css';

type PlayerOverlayProps = {
  isLoading: boolean;
  hasError: boolean;
};

export function PlayerOverlay({ isLoading, hasError }: PlayerOverlayProps) {
  if (!isLoading && !hasError) return null;

  return (
    <div className={styles['player-overlay']} role="status" aria-live="polite">
      {isLoading && !hasError ? (
        <>
          <div className={styles['player-overlay__spinner']} aria-hidden="true" />
          <span className={styles['sr-only']}>Loading video</span>
        </>
      ) : (
        <div className={styles['player-overlay__error']} role="alert">
          ⚠️ Failed to load video
        </div>
      )}
    </div>
  );
}
