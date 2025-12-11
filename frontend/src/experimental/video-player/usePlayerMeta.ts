import { useMemo } from 'react';
import { Captions, Volume } from 'lucide-react';

export function usePlayerMeta() {
  // Placeholder meta object similar to original, used for experimental backup
  const closedCaptionsMeta = useMemo(
    () => ({ title: 'Subtitles/closed captions (c)', icon: Captions, size: 16 }),
    []
  );
  const volumeMeta = useMemo(() => ({ title: 'Volume', icon: Volume, size: 12 }), []);
  return { closedCaptionsMeta, volumeMeta };
}

export default usePlayerMeta;
