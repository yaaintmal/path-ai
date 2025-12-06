import { useEffect, useMemo, useRef, useState } from 'react';
import { LastTranslatedVideosWidget } from './LastTranslatedVideosWidget';
import { VideoTranslationStatsWidget } from './VideoTranslationStatsWidget';
import { VideoPlayer } from '../../components/video-player/VideoPlayer';
import { getApiUrl } from '../../config/app.config';
import { useAuth } from '../../contexts/useAuth';

type VideoDTO = {
  id: string;
  videoUrl: string;
  originalLanguage: {
    name: string;
    closedCaptionText?: string;
    closedCaptionVtt?: string;
  };
  translations: Array<{ name: string; closedCaptionVtt?: string }>;
};

interface VideoTranslationSectionProps {
  onStatisticsClick?: () => void;
}

const LAST_VIDEO_STORAGE_KEY = 'video-studio:last-video';
const RECENT_VIDEOS_STORAGE_KEY = 'video-studio:recent-videos';

type RecentVideo = {
  src: string;
  language?: string;
  translationName?: string;
  subtitleText?: string;
  thumbnail?: string | null;
  createdAt: string;
  displayName?: string;
};

export function VideoTranslationSection({ onStatisticsClick }: VideoTranslationSectionProps) {
  const { user } = useAuth();
  const languageOptions = useMemo(
    () => [
      { code: 'en', label: 'English', flag: '🇺🇸' },
      { code: 'ru', label: 'Русский', flag: '🇷🇺' },
      { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
      { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
      { code: 'fr', label: 'Français', flag: '🇫🇷' },
      { code: 'ar', label: 'العربية', flag: '🇸🇦' },
      { code: 'fa', label: 'فارسی', flag: '🇮🇷' },
      { code: 'es', label: 'Español', flag: '🇪🇸' },
      { code: 'it', label: 'Italiano', flag: '🇮🇹' },
      { code: 'pt', label: 'Português', flag: '🇵🇹' },
      { code: 'uk', label: 'Українська', flag: '🇺🇦' },
      { code: 'pl', label: 'Polski', flag: '🇵🇱' },
      { code: 'cs', label: 'Čeština', flag: '🇨🇿' },
      { code: 'sk', label: 'Slovenčina', flag: '🇸🇰' },
      { code: 'sl', label: 'Slovenščina', flag: '🇸🇮' },
      { code: 'hr', label: 'Hrvatski', flag: '🇭🇷' },
      { code: 'sr', label: 'Српски', flag: '🇷🇸' },
      { code: 'bs', label: 'Bosanski', flag: '🇧🇦' },
      { code: 'bg', label: 'Български', flag: '🇧🇬' },
      { code: 'ro', label: 'Română', flag: '🇷🇴' },
      { code: 'hu', label: 'Magyar', flag: '🇭🇺' },
      { code: 'sv', label: 'Svenska', flag: '🇸🇪' },
      { code: 'no', label: 'Norsk', flag: '🇳🇴' },
      { code: 'da', label: 'Dansk', flag: '🇩🇰' },
      { code: 'fi', label: 'Suomi', flag: '🇫🇮' },
      { code: 'el', label: 'Ελληνικά', flag: '🇬🇷' },
      { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
      { code: 'he', label: 'עברית', flag: '🇮🇱' },
      { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
      { code: 'ur', label: 'اردو', flag: '🇵🇰' },
      { code: 'bn', label: 'বাংলা', flag: '🇧🇩' },
      { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
      { code: 'te', label: 'తెలుగు', flag: '🇮🇳' },
      { code: 'ml', label: 'മലയാളം', flag: '🇮🇳' },
      { code: 'kn', label: 'ಕನ್ನಡ', flag: '🇮🇳' },
      { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
      { code: 'gu', label: 'ગુજરાતી', flag: '🇮🇳' },
      { code: 'pa', label: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
      { code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
      { code: 'ms', label: 'Bahasa Melayu', flag: '🇲🇾' },
      { code: 'tl', label: 'Filipino', flag: '🇵🇭' },
      { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
      { code: 'th', label: 'ไทย', flag: '🇹🇭' },
      { code: 'ja', label: '日本語', flag: '🇯🇵' },
      { code: 'ko', label: '한국어', flag: '🇰🇷' },
      { code: 'zh', label: '中文', flag: '🇨🇳' },
      { code: 'yue', label: '粵語', flag: '🇭🇰' },
    ],
    []
  );

  const [targetLanguage, setTargetLanguage] = useState<string>(languageOptions[0].code);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeVideo, setActiveVideo] = useState<{
    src: string;
    subtitleText?: string;
    translationName?: string;
  } | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = window.localStorage.getItem(LAST_VIDEO_STORAGE_KEY);
      if (!stored) return null;
      const parsed = JSON.parse(stored) as {
        src?: string;
        subtitleText?: string;
        translationName?: string;
      };
      if (parsed?.src) {
        return {
          src: parsed.src,
          subtitleText: parsed.subtitleText,
          translationName: parsed.translationName,
        };
      }
    } catch (err) {
      console.warn('Failed to parse last video from storage', err);
    }
    return null;
  });
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const languageDropdownRef = useRef<HTMLDivElement | null>(null);
  const [recentVideos, setRecentVideos] = useState<RecentVideo[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = window.localStorage.getItem(RECENT_VIDEOS_STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed.slice(0, 3) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLanguageOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Persist last video
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (activeVideo?.src) {
      window.localStorage.setItem(LAST_VIDEO_STORAGE_KEY, JSON.stringify(activeVideo));
    } else {
      window.localStorage.removeItem(LAST_VIDEO_STORAGE_KEY);
    }
  }, [activeVideo]);

  // Clear video-related persistence on logout
  useEffect(() => {
    if (!user && typeof window !== 'undefined') {
      window.localStorage.removeItem(LAST_VIDEO_STORAGE_KEY);
      window.localStorage.removeItem(RECENT_VIDEOS_STORAGE_KEY);
      setActiveVideo(null);
      setVideoFile(null);
      setVideoUrl('');
      setRecentVideos([]);
    }
  }, [user]);

  const persistRecentVideos = (items: RecentVideo[]) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(RECENT_VIDEOS_STORAGE_KEY, JSON.stringify(items.slice(0, 3)));
  };

  const addRecentVideo = (entry: RecentVideo) => {
    setRecentVideos((prev) => {
      const key = `${entry.src}|${entry.language || 'orig'}`;
      const filtered = prev.filter((v) => `${v.src}|${v.language || 'orig'}` !== key);
      const next = [entry, ...filtered].slice(0, 3);
      persistRecentVideos(next);
      return next;
    });
  };

  // Best-effort thumbnail capture from video URL (may fail due to CORS)
  const captureThumbnail = async (src: string): Promise<string | null> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.preload = 'auto';
      video.muted = true;
      video.src = src;

      const cleanup = () => {
        video.pause();
        video.removeAttribute('src');
        video.load();
      };

      const fail = () => {
        cleanup();
        resolve(null);
      };

      video.addEventListener('error', fail, { once: true });
      video.addEventListener(
        'loadeddata',
        () => {
          try {
            video.currentTime = Math.min(0.1, video.duration || 0.1);
          } catch {
            fail();
          }
        },
        { once: true }
      );

      video.addEventListener(
        'seeked',
        () => {
          try {
            const width = video.videoWidth || 320;
            const height = video.videoHeight || 180;
            const targetWidth = Math.min(320, width);
            const targetHeight = Math.floor((height / width) * targetWidth);
            const canvas = document.createElement('canvas');
            canvas.width = targetWidth;
            canvas.height = targetHeight || 180;
            const ctx = canvas.getContext('2d');
            if (!ctx) return fail();
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            cleanup();
            resolve(dataUrl);
          } catch {
            fail();
          }
        },
        { once: true }
      );
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    const trimmedUrl = videoUrl.trim();
    const displayName =
      videoFile?.name ||
      (() => {
        if (!trimmedUrl) return undefined;
        try {
          const u = new URL(trimmedUrl);
          const parts = u.pathname.split('/').filter(Boolean);
          return decodeURIComponent(parts[parts.length - 1] || '');
        } catch {
          return undefined;
        }
      })();

    if (!videoFile && !trimmedUrl) {
      setErrorMessage('Bitte gib eine Video-URL an oder lade eine Videodatei hoch.');
      return;
    }

    if (videoFile && trimmedUrl) {
      setErrorMessage('Bitte nutze entweder eine Video-URL oder einen Upload, nicht beides.');
      return;
    }

    const formData = new FormData();
    if (videoFile) {
      formData.append('video', videoFile);
    }
    if (trimmedUrl) {
      formData.append('videoUrl', trimmedUrl);
    }
    formData.append('targetLanguage', targetLanguage);

    setIsSubmitting(true);

    try {
      const response = await fetch(getApiUrl('/api/videos'), {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const message = await response.text().catch(() => 'Unbekannter Fehler beim Upload');
        throw new Error(message || 'Fehler beim Hochladen des Videos');
      }

      const data = (await response.json()) as VideoDTO;
      const normalizedTarget = targetLanguage.toLowerCase();
      const translation = data.translations.find((t) => t.name?.toLowerCase() === normalizedTarget);

      setActiveVideo({
        src: data.videoUrl,
        subtitleText: translation?.closedCaptionVtt || data.originalLanguage.closedCaptionVtt,
        translationName: translation?.name ?? data.originalLanguage.name,
      });

      addRecentVideo({
        src: data.videoUrl,
        subtitleText: translation?.closedCaptionVtt || data.originalLanguage.closedCaptionVtt,
        language: translation?.name ?? data.originalLanguage.name,
        translationName: translation?.name ?? data.originalLanguage.name,
        displayName,
        thumbnail: null,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Video upload failed', err);
      setErrorMessage(
        err instanceof Error ? err.message : 'Fehler beim Hochladen oder Verarbeiten des Videos'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedLanguageLabel = languageOptions.find((l) => l.code === targetLanguage);

  // Attempt to enrich the most recent entry with a thumbnail if missing
  useEffect(() => {
    if (!activeVideo?.src) return;
    const recentEntry = recentVideos.find(
      (v) => v.src === activeVideo.src && v.language === activeVideo.translationName
    );
    if (recentEntry && recentEntry.thumbnail) return;

    (async () => {
      const thumb = await captureThumbnail(activeVideo.src);
      if (thumb) {
        addRecentVideo({
          src: activeVideo.src,
          subtitleText: activeVideo.subtitleText,
          language: activeVideo.translationName,
          translationName: activeVideo.translationName,
          displayName: recentEntry?.displayName,
          thumbnail: thumb,
          createdAt: new Date().toISOString(),
        });
      }
    })();
  }, [activeVideo?.src, activeVideo?.translationName]); // eslint-disable-line react-hooks/exhaustive-deps

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    const ordinal = (n: number) => {
      const mod100 = n % 100;
      if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
      const mod10 = n % 10;
      if (mod10 === 1) return `${n}st`;
      if (mod10 === 2) return `${n}nd`;
      if (mod10 === 3) return `${n}rd`;
      return `${n}th`;
    };
    const formatter = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    const parts = formatter.formatToParts(date);
    const month = parts.find((p) => p.type === 'month')?.value ?? '';
    const dayNum = Number(parts.find((p) => p.type === 'day')?.value ?? '0');
    const year = parts.find((p) => p.type === 'year')?.value ?? '';
    return `${month} ${ordinal(dayNum)}, ${year}`;
  };

  const getVideoLabel = (src: string, language?: string, displayName?: string) => {
    const langPart = (language || 'orig').toUpperCase();
    if (displayName) return `${displayName} · ${langPart}`;
    try {
      const url = new URL(src);
      const parts = url.pathname.split('/').filter(Boolean);
      const file = parts[parts.length - 1] || 'Video';
      const base = file.split('.').slice(0, -1).join('.') || file;
      return `${decodeURIComponent(base)} · ${langPart}`;
    } catch {
      const parts = src.split('/').filter(Boolean);
      const file = parts[parts.length - 1] || 'Video';
      const base = file.split('.').slice(0, -1).join('.') || file;
      return `${decodeURIComponent(base)} · ${langPart}`;
    }
  };

  return (
    <>
      <div className="mb-8">
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-xl border border-slate-800/60">
          <div className="flex items-start justify-between px-6 pt-6 pb-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                Custom Video Player
              </p>
              <h2 className="text-2xl font-semibold text-white mt-1">Interaktive Wiedergabe</h2>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                Alle Funktionen aus dem Vue-Player jetzt in React: Kapitel, Untertitel, Shortcuts
                und anpassbare Geschwindigkeit.
              </p>
            </div>
            {/* <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/30">
              Live
            </span> */}
          </div>
          <div className="px-2 pb-4 sm:px-6">
            <VideoPlayer videoSrc={activeVideo?.src} subtitleText={activeVideo?.subtitleText} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Main Action Area */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Neues Video importieren
            </h2>
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <span className="text-red-600 dark:text-red-400">▶</span>
            </div>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex flex-col gap-2 text-left">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Zielsprache
                </span>
                <div className="relative" ref={languageDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsLanguageOpen((prev) => !prev)}
                    className="flex w-full items-center gap-3 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-gray-900 shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                  >
                    <span className="text-lg">{selectedLanguageLabel?.flag}</span>
                    <span className="flex-1 truncate">
                      {selectedLanguageLabel
                        ? `${selectedLanguageLabel.label} (${selectedLanguageLabel.code})`
                        : 'Sprache wählen'}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">▾</span>
                  </button>
                  {isLanguageOpen && (
                    <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
                      <div className="max-h-56 overflow-y-auto">
                        {languageOptions.map((option) => (
                          <button
                            key={option.code}
                            type="button"
                            onClick={() => {
                              setTargetLanguage(option.code);
                              setIsLanguageOpen(false);
                            }}
                            className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:hover:bg-gray-800 dark:focus:bg-gray-800 ${
                              targetLanguage === option.code ? 'bg-gray-100 dark:bg-gray-800' : ''
                            }`}
                          >
                            <span className="text-lg">{option.flag}</span>
                            <span className="flex-1 truncate text-gray-900 dark:text-gray-100">
                              {option.label}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {option.code}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </label>

              <label className="flex flex-col gap-2 text-left md:col-span-2">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Video-URL
                </span>
                <input
                  type="url"
                  name="videoUrl"
                  placeholder="https://example.com/video.mp4"
                  value={videoUrl}
                  onChange={(e) => {
                    const next = e.target.value;
                    setVideoUrl(next);
                    if (next.trim()) {
                      setVideoFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }
                  }}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:disabled:bg-gray-800 dark:disabled:text-gray-600 dark:disabled:border-gray-700"
                  disabled={Boolean(videoFile)}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  URL oder Upload möglich (mindestens eins erforderlich).
                </p>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex flex-col gap-2 text-left md:col-span-2">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Videodatei hochladen
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="file"
                    accept="video/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      setVideoFile(file);
                      if (file) {
                        setVideoUrl('');
                      }
                    }}
                    disabled={Boolean(videoUrl.trim())}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!videoUrl.trim()) {
                        fileInputRef.current?.click();
                      }
                    }}
                    disabled={Boolean(videoUrl.trim())}
                    className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                  >
                    Datei auswählen
                  </button>
                  <span className="text-sm text-gray-700 dark:text-gray-200">
                    {videoFile ? videoFile.name : 'Keine Datei ausgewählt'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Unterstützte Formate: MP4, WEBM, MOV, MP3, WAV (Größe abhängig von
                  Backend/Cloudinary Limits).
                </p>
              </label>

              <div className="flex flex-col justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Wird verarbeitet…' : 'Video importieren'}
                </button>
                {activeVideo?.translationName && (
                  <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                    Geladene Untertitel: {activeVideo.translationName}
                  </p>
                )}
              </div>
            </div>

            {errorMessage && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800/50 dark:bg-red-900/30 dark:text-red-200">
                {errorMessage}
              </div>
            )}
          </form>
        </div>

        {/* Recent Videos */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Zuletzt transcribiert
          </h2>
          <div className="space-y-3">
            {recentVideos.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Noch keine Videos vorhanden.
              </p>
            )}
            {recentVideos.map((video) => (
              <div
                key={`${video.src}|${video.language || 'orig'}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                onClick={() =>
                  setActiveVideo({
                    src: video.src,
                    subtitleText: video.subtitleText,
                    translationName: video.translationName,
                  })
                }
              >
                <div className="w-14 h-10 rounded bg-gray-200 dark:bg-gray-600 overflow-hidden flex-shrink-0">
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt="Vorschaubild"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-slate-500 to-slate-700" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {getVideoLabel(video.src, video.language, video.displayName)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {formatDate(video.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Last 3 Translated Videos Widget */}
      <LastTranslatedVideosWidget />

      {/* Video Translation Stats Widget */}
      <div className="mb-6">
        <VideoTranslationStatsWidget onStatisticsClick={onStatisticsClick} />
      </div>
    </>
  );
}
