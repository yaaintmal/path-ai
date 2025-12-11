import { useEffect, useMemo, useRef, useState } from 'react';
import { getApiUrl } from '../../config/app.config';
import { useAuth } from '../../contexts/useAuth';

// This is a backup/experimental copy of the previously removed VideoTranslationSection.
// It is intentionally not imported anywhere in the main app.

export function VideoTranslationSection() {
  const { user } = useAuth();
  const [videoUrl, setVideoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // experimental backup: noop
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      // Do a minimal API call to keep parity with original implementation
      if (!videoUrl) throw new Error('No video specified (experimental)');
      const res = await fetch(getApiUrl('/api/videos'), {
        method: 'POST',
        body: JSON.stringify({ videoUrl }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Upload failed (experimental)');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-muted p-6 rounded">
      <h2 className="font-semibold">Experimental VideoTranslationSection</h2>
      <p className="text-sm text-muted-foreground">
        This file was moved to experimental for archive.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <input
          type="url"
          placeholder="https://.../video.mp4"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
        {errorMessage && <div className="text-red-500 text-xs">{errorMessage}</div>}
        <div>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Processing…' : 'Upload (experimental)'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default VideoTranslationSection;
