import React, { useState, useRef, useEffect } from 'react';
import {
  Volume2,
  Square,
  Upload,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Check,
  MessageSquareHeart,
} from 'lucide-react';
import {
  type ScrapbookPageData,
  type ScrapbookParagraphBlock,
  formatPageCounter,
  getPagePlainText,
} from '../data/scrapbookData';
import {
  PandaKitKatIllustration,
  CapybaraBouquetBadge,
  PressedFlowerSprig,
} from './ScrapbookIllustrations';

interface ScrapbookPageProps {
  page: ScrapbookPageData;
  pageIndex: number;
  totalPages: number;
  showPrevious: boolean;
  showNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onReturnToCover: () => void;
  polaroidImage: string | null;
  onUpdatePolaroidImage: (dataUrl: string) => void;
  onOpenKeepsakeStudio: (tab: 'chat' | 'image') => void;
}

export const ScrapbookPage: React.FC<ScrapbookPageProps> = ({
  page,
  pageIndex,
  totalPages,
  showPrevious,
  showNext,
  onPrevious,
  onNext,
  onReturnToCover,
  polaroidImage,
  onUpdatePolaroidImage,
  onOpenKeepsakeStudio,
}) => {
  const isPlayful = page.mood === 'playful';
  const counterText = formatPageCounter(pageIndex + 1, totalPages);

  // TTS state
  const [isGeneratingSpeech, setIsGeneratingSpeech] = useState(false);
  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);
  const [ttsStatusNote, setTtsStatusNote] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop any playing audio when changing pages
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingSpeech(false);
    setIsGeneratingSpeech(false);
    setTtsStatusNote(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page.id]);

  const stopSpeech = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingSpeech(false);
    setIsGeneratingSpeech(false);
  };

  const handleListenToPage = async () => {
    if (isPlayingSpeech || isGeneratingSpeech) {
      stopSpeech();
      return;
    }

    setIsGeneratingSpeech(true);
    setTtsStatusNote(null);
    const fullText = getPagePlainText(page);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: fullText,
          voiceName: isPlayful ? 'Puck' : 'Kore',
          style: page.ttsVoiceStyle,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.audioDataUrl) {
        throw new Error(data.error || 'TTS API unavailable');
      }

      const audio = new Audio(data.audioDataUrl);
      audioRef.current = audio;
      audio.onended = () => {
        setIsPlayingSpeech(false);
      };
      audio.onerror = () => {
        setIsPlayingSpeech(false);
      };
      setIsGeneratingSpeech(false);
      setIsPlayingSpeech(true);
      await audio.play();
    } catch {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(fullText);
        utterance.rate = isPlayful ? 1.02 : 0.9;
        utterance.pitch = isPlayful ? 1.05 : 0.96;
        utterance.onend = () => setIsPlayingSpeech(false);
        utterance.onerror = () => setIsPlayingSpeech(false);
        setIsGeneratingSpeech(false);
        setIsPlayingSpeech(true);
        setTtsStatusNote('Reading aloud with local voice');
        window.speechSynthesis.speak(utterance);
      } else {
        setIsGeneratingSpeech(false);
        setTtsStatusNote('Audio playback unavailable on this device');
      }
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUpdatePolaroidImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Avoid rendering duplicate salutation if block[0].text is identical to page.heading
  const visibleParagraphs = page.paragraphs.filter(
    (block, index) => !(index === 0 && block.text.trim() === page.heading.trim())
  );

  const renderParagraph = (block: ScrapbookParagraphBlock, idx: number) => {
    if (!isPlayful) {
      // Page 2 — Noticeably calmer, warm cream paper, gentle fade-in, generous breathing room
      switch (block.style) {
        case 'sincere-lead':
          return (
            <p
              key={block.id}
              className="font-editorial italic text-2xl sm:text-3xl text-[#59484A] pt-1"
            >
              {block.text}
            </p>
          );
        case 'sincere-highlight':
          return (
            <div
              key={block.id}
              className="my-5 py-4 px-5 rounded-xl bg-[#F8E9E8]/55 border border-[#C98D9D]/30"
            >
              <p className="text-base sm:text-lg leading-relaxed text-[#59484A] font-medium">
                {block.text}
              </p>
            </div>
          );
        case 'sincere-hinglish':
          return (
            <div
              key={block.id}
              className="my-5 py-5 px-6 rounded-xl bg-[#FFFDF9] border border-[#C98D9D]/35 shadow-2xs"
            >
              <p className="font-editorial italic text-xl sm:text-2xl leading-relaxed text-[#59484A]">
                {block.text}
              </p>
            </div>
          );
        case 'sincere-apology':
          return (
            <p
              key={block.id}
              className="font-handwritten text-3xl sm:text-4xl text-[#59484A] py-2"
            >
              {block.text}
            </p>
          );
        case 'sincere-closing':
          return (
            <div
              key={block.id}
              className="pt-4 pb-2 border-t border-[#8C7771]/20 flex items-center justify-between"
            >
              <p className="font-handwritten text-3xl sm:text-4xl font-semibold text-[#59484A]">
                {block.text}
              </p>
              <span className="font-editorial italic text-sm text-[#8C7771]">— Lakshya</span>
            </div>
          );
        default:
          return (
            <p
              key={block.id}
              style={{ animationDelay: `${Math.min(idx * 40, 400)}ms` }}
              className="text-base sm:text-[17px] leading-[1.85] text-[#59484A]"
            >
              {block.text}
            </p>
          );
      }
    }

    // Page 1 — Playful, energetic, cute scrapbook note cards & handwritten emphasis
    switch (block.style) {
      case 'greeting':
        return (
          <p
            key={block.id}
            className="font-handwritten text-3xl sm:text-4xl font-bold text-[#59484A]"
          >
            {block.text}
          </p>
        );
      case 'note-card':
        return (
          <div
            key={block.id}
            className="relative my-5 p-4 sm:p-5 rounded-xl bg-[#F8E9E8]/75 border border-[#C98D9D]/40 shadow-2xs"
          >
            <div
              aria-hidden="true"
              className="washi-tape-sage w-16 h-4 -top-2 right-6 absolute rotate-2 rounded-xs"
            />
            <p className="text-base sm:text-lg font-medium leading-relaxed text-[#59484A]">
              {block.text}
            </p>
          </div>
        );
      case 'handwritten-funny':
        return (
          <p
            key={block.id}
            className="font-handwritten text-2xl sm:text-3xl font-semibold text-[#59484A] py-1 leading-snug"
          >
            {block.text}
          </p>
        );
      case 'capy-stamp':
        return (
          <div
            key={block.id}
            className="my-5 p-4 sm:p-5 rounded-2xl bg-[#FFFDF9] border border-dashed border-[#8C7771]/50 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <CapybaraBouquetBadge className="w-16 h-16 shrink-0" />
            <div className="space-y-1">
              <span className="font-ui text-[11px] uppercase tracking-wider text-[#8C7771] block">
                Official Capybara Receipt · ₹500 Earned
              </span>
              <p className="text-base sm:text-[17px] leading-relaxed text-[#59484A]">
                {block.text}
              </p>
            </div>
          </div>
        );
      case 'polaroid-prompt':
        return (
          <div key={block.id} className="my-6 space-y-4">
            <p className="font-handwritten text-3xl sm:text-4xl font-bold text-[#59484A]">
              {block.text}
            </p>
            {/* Polaroid-style frame where a photograph can be supplied or generated */}
            <div className="max-w-xs mx-auto sm:mx-0 p-3.5 pb-5 bg-[#FFFDF9] rounded-xl border border-[#8C7771]/30 shadow-md rotate-[-1deg] relative">
              <div
                aria-hidden="true"
                className="washi-tape-rose w-20 h-5 -top-2.5 left-1/2 -translate-x-1/2 absolute rounded-xs"
              />
              <div className="aspect-square w-full rounded-lg bg-[#F8E9E8]/55 border border-dashed border-[#C98D9D]/50 overflow-hidden flex flex-col items-center justify-center p-4 text-center relative">
                {polaroidImage ? (
                  <img
                    src={polaroidImage}
                    alt="Pallavi's scrapbook Polaroid keepsake"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <div className="space-y-2">
                    <p className="font-handwritten text-2xl text-[#59484A]">
                      Gudiya&apos;s Polaroid Frame 📸
                    </p>
                    <p className="font-ui text-xs text-[#8C7771]">
                      Attach a playful photo here or create a custom scrapbook illustration
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  aria-label="Upload Polaroid photo"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="min-h-[40px] px-3 py-1.5 rounded-lg bg-[#F8E9E8] hover:bg-[#C98D9D]/30 text-[#59484A] font-ui text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap shrink-0"
                >
                  {polaroidImage ? <Check className="w-3.5 h-3.5" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>{polaroidImage ? 'Change Photo' : 'Add Photo'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenKeepsakeStudio('image')}
                  className="min-h-[40px] px-3 py-1.5 rounded-lg bg-[#FFF7EB] hover:bg-[#B9C9B0]/35 border border-[#8C7771]/30 text-[#59484A] font-ui text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C98D9D]" />
                  <span>Illustrate (1K/2K/4K)</span>
                </button>
              </div>
            </div>
          </div>
        );
      case 'excited-outro':
        return (
          <p
            key={block.id}
            className="font-handwritten text-3xl sm:text-4xl font-bold text-[#59484A] tracking-wide"
          >
            {block.text}
          </p>
        );
      default:
        return (
          <p
            key={block.id}
            className="text-base sm:text-[17px] leading-[1.8] text-[#59484A]"
          >
            {block.text}
          </p>
        );
    }
  };

  return (
    <article
      aria-labelledby={`page-heading-${page.id}`}
      className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-10"
    >
      {/* Top Page Metadata & Read-Aloud Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 px-1">
        <div className="flex items-center gap-2 font-ui text-xs text-[#8C7771]">
          <button
            type="button"
            onClick={onReturnToCover}
            className="hover:text-[#59484A] underline underline-offset-4 cursor-pointer min-h-[40px] inline-flex items-center whitespace-nowrap shrink-0"
          >
            Envelope Cover
          </button>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">Page {counterText}</span>
          <span aria-hidden="true">·</span>
          <span className="truncate max-w-[180px] sm:max-w-none">{page.label}</span>
        </div>

        <button
          type="button"
          onClick={handleListenToPage}
          aria-label={isPlayingSpeech ? 'Stop reading letter aloud' : 'Listen to this letter aloud'}
          className="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-[#FFFDF9] hover:bg-[#F8E9E8] border border-[#C98D9D]/45 text-[#59484A] font-ui text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          {isPlayingSpeech || isGeneratingSpeech ? (
            <>
              <Square className="w-3.5 h-3.5 fill-current text-[#C98D9D]" />
              <span>{isGeneratingSpeech ? 'Preparing voice...' : 'Stop Listening'}</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#C98D9D]" />
              <span>Listen to Page</span>
            </>
          )}
        </button>
      </div>

      {ttsStatusNote && (
        <p className="text-right font-ui text-[11px] text-[#8C7771] mb-2 px-1">
          {ttsStatusNote}
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Scrapbook Paper Sheet (8 cols on desktop) */}
        <div
          className={`lg:col-span-8 relative rounded-2xl p-6 sm:p-10 transition-opacity duration-200 ${
            isPlayful ? 'paper-card-playful' : 'paper-card-calm'
          }`}
        >
          {/* Top Washi Tape Accent */}
          <div
            aria-hidden="true"
            className={`w-28 h-6 -top-3 left-1/2 -translate-x-1/2 absolute rounded-xs ${
              isPlayful ? 'washi-tape-rose -rotate-1' : 'washi-tape-sage rotate-1'
            }`}
          />

          {/* Compact Side-by-Side Page Header on both mobile and desktop */}
          <header className="border-b border-[#8C7771]/20 pb-5 mb-6 flex flex-row items-center justify-between gap-4">
            <div>
              <p className="font-ui text-xs uppercase tracking-widest text-[#8C7771] mb-1">
                {page.label}
              </p>
              <h1
                id={`page-heading-${page.id}`}
                className="font-handwritten text-4xl sm:text-5xl font-bold text-[#59484A]"
                style={{ textWrap: 'balance' }}
              >
                {page.heading}
              </h1>
            </div>

            <div className="shrink-0">
              {isPlayful ? (
                <PandaKitKatIllustration className="w-16 h-16 sm:w-24 sm:h-24" />
              ) : (
                <PressedFlowerSprig className="w-16 h-16 sm:w-24 sm:h-24" />
              )}
            </div>
          </header>

          {/* Verbatim Message Content */}
          <div className="space-y-4">
            {visibleParagraphs.map((block, index) => renderParagraph(block, index))}
          </div>

          {/* Bottom Page Navigation Bar */}
          <footer className="mt-10 pt-6 border-t border-[#8C7771]/20 flex items-center justify-between gap-3">
            <div className="min-w-[110px]">
              {showPrevious ? (
                <button
                  type="button"
                  onClick={onPrevious}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#FFF7EB] hover:bg-[#F8E9E8] border border-[#8C7771]/35 text-[#59484A] font-ui text-sm font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← Previous</span>
                </button>
              ) : (
                <span className="font-ui text-xs text-[#8C7771]">Chapter 01</span>
              )}
            </div>

            {/* Page Counter (e.g. 01 / 02) */}
            <div
              aria-label={`Page ${pageIndex + 1} of ${totalPages}`}
              data-testid="page-counter"
              className="font-ui text-sm font-semibold text-[#59484A] tabular-nums tracking-wider px-3 py-1 whitespace-nowrap shrink-0"
            >
              {counterText}
            </div>

            <div className="min-w-[110px] flex justify-end">
              {showNext && (
                <button
                  type="button"
                  onClick={onNext}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#C98D9D] hover:bg-[#b87b8b] text-[#FFFDF9] font-ui text-sm font-medium inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>Next →</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </footer>
        </div>

        {/* Desktop Side Margin Keepsake Panel (4 cols on lg:) */}
        <aside
          aria-label="Scrapbook chapter margin notes"
          className="hidden lg:flex lg:col-span-4 flex-col gap-6 sticky top-20"
        >
          <div className="rounded-2xl paper-card-calm border border-[#8C7771]/25 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#8C7771]/15 pb-3">
              <span className="font-ui text-xs uppercase tracking-wider text-[#8C7771]">
                Scrapbook Bookmark
              </span>
              <span className="font-ui text-xs font-semibold text-[#59484A] tabular-nums">
                {counterText}
              </span>
            </div>

            <p className="font-editorial italic text-lg text-[#59484A]">
              {isPlayful
                ? '“And that’s exactly why I said this box is filled with love.”'
                : '“I just hope things stay healthy, peaceful and happy between us.”'}
            </p>

            <p className="font-ui text-xs text-[#8C7771] leading-relaxed">
              {isPlayful
                ? 'Accompanies the physical gift box of KitKats with tiny message slips, cutout prints, and a chocolate bouquet.'
                : 'A calmer chapter written with honesty and breathing room, with no pressure or rush.'}
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => onOpenKeepsakeStudio('chat')}
                className="w-full min-h-[40px] px-3.5 py-2 rounded-xl bg-[#F8E9E8]/80 hover:bg-[#F8E9E8] border border-[#C98D9D]/35 text-[#59484A] font-ui text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <MessageSquareHeart className="w-3.5 h-3.5 text-[#C98D9D]" />
                <span>Reflect in Companion Chat</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenKeepsakeStudio('image')}
                className="w-full min-h-[40px] px-3.5 py-2 rounded-xl bg-[#FFFDF9] hover:bg-[#B9C9B0]/30 border border-[#8C7771]/25 text-[#59484A] font-ui text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C98D9D]" />
                <span>Polaroid Illustrator (1K/2K/4K)</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
};
