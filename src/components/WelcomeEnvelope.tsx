import React, { useState } from 'react';
import { Sparkles, Volume2, BookOpen } from 'lucide-react';
import { WELCOME_CONFIG } from '../data/scrapbookData';
import {
  PandaKitKatIllustration,
  CapybaraBouquetBadge,
  PressedFlowerSprig,
  WaxSealIcon,
} from './ScrapbookIllustrations';

interface WelcomeEnvelopeProps {
  onOpenScrapbook: () => void;
  onOpenStudio?: (tab: 'chat' | 'image') => void;
}

export const WelcomeEnvelope: React.FC<WelcomeEnvelopeProps> = ({
  onOpenScrapbook,
  onOpenStudio,
}) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    window.setTimeout(() => {
      onOpenScrapbook();
    }, 180);
  };

  return (
    <section
      aria-labelledby="welcome-heading"
      className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-12 flex flex-col justify-center min-h-[calc(100vh-6rem)]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Main Tactile Envelope Card (7 cols on desktop) */}
        <div className="lg:col-span-7 flex flex-col">
          <div
            className={`relative flex-1 rounded-2xl paper-card-playful border border-[#C98D9D]/35 p-6 sm:p-10 flex flex-col justify-between transition-all duration-200 ${
              isOpening ? 'scale-[0.98] opacity-85' : 'scale-100 opacity-100'
            }`}
          >
            {/* Top Washi Tape Strips */}
            <div
              aria-hidden="true"
              className="washi-tape-rose w-28 h-6 -top-3 left-8 absolute -rotate-3 rounded-xs"
            />
            <div
              aria-hidden="true"
              className="washi-tape-sage w-24 h-6 -top-3 right-8 absolute rotate-3 rounded-xs"
            />

            {/* Envelope Header Metadata */}
            <div className="w-full border-b border-dashed border-[#C98D9D]/45 pb-4 mb-6 flex flex-wrap items-center justify-between gap-2">
              <span className="font-ui text-xs text-[#8C7771]">
                For: Pallavi (Gudiya) · From: Lakshya (Capy)
              </span>
              <span className="font-ui text-xs text-[#8C7771] tabular-nums">
                {WELCOME_CONFIG.workingTitle}
              </span>
            </div>

            {/* Center Panda & Wax Seal */}
            <div className="flex flex-col items-center text-center my-auto py-2">
              <div className="relative mb-4 flex items-center justify-center">
                <PandaKitKatIllustration className="w-28 h-28 sm:w-32 sm:h-32" />
                <div className="-bottom-1 -right-2 absolute">
                  <WaxSealIcon className="w-12 h-12" />
                </div>
              </div>

              <p className="font-editorial italic text-lg sm:text-xl text-[#8C7771] mb-1">
                {WELCOME_CONFIG.subtitle}
              </p>

              <h1
                id="welcome-heading"
                className="font-handwritten text-4xl sm:text-5xl font-bold text-[#59484A] tracking-wide mb-4"
                style={{ textWrap: 'balance' }}
              >
                {WELCOME_CONFIG.heading}
              </h1>

              <p className="text-base sm:text-lg leading-relaxed text-[#59484A] max-w-md mx-auto mb-8 font-normal">
                {WELCOME_CONFIG.body}
              </p>

              {/* Primary Open Button */}
              <button
                type="button"
                onClick={handleOpen}
                className="w-full sm:w-auto min-h-[48px] px-7 py-3.5 rounded-xl bg-[#C98D9D] hover:bg-[#b87b8b] active:scale-[0.99] text-[#FFFDF9] font-ui font-medium text-base shadow-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#59484A]"
              >
                <span>{WELCOME_CONFIG.buttonText}</span>
              </button>
            </div>

            {/* Bottom Subtle Paper Note */}
            <div className="mt-8 pt-4 border-t border-[#8C7771]/15 flex items-center justify-between text-xs font-ui text-[#8C7771]">
              <span>Accompanies your physical chocolate gift box</span>
              <span className="tabular-nums">01 / 02 chapters ready</span>
            </div>
          </div>
        </div>

        {/* Companion Gift Box Side Card (5 cols on desktop) */}
        <aside
          aria-label="About this scrapbook gift"
          className="lg:col-span-5 flex flex-col justify-between rounded-2xl paper-card-calm border border-[#8C7771]/25 p-6 sm:p-8 space-y-6"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#8C7771]/15 pb-4">
              <div>
                <p className="font-ui text-xs uppercase tracking-widest text-[#8C7771]">
                  Gift Box Companion
                </p>
                <h2 className="font-handwritten text-3xl font-bold text-[#59484A]">
                  What&apos;s inside this note
                </h2>
              </div>
              <CapybaraBouquetBadge className="w-16 h-16 shrink-0" />
            </div>

            <p className="text-sm sm:text-base leading-relaxed text-[#59484A]">
              Made to be read alongside your KitKats, cutout prints, and chocolate bouquet after a whole month apart.
            </p>

            <div className="space-y-3 pt-2 font-ui text-xs text-[#59484A]">
              <div className="p-3.5 rounded-xl bg-[#F8E9E8]/60 border border-[#C98D9D]/30 flex items-start gap-3">
                <BookOpen className="w-4 h-4 text-[#C98D9D] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#59484A]">01. A little message for Pallavi</p>
                  <p className="text-[#8C7771] mt-0.5">
                    The chocolate confession, ₹500 Capy story &amp; Gudiya&apos;s Polaroid frame
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FFFDF9] border border-[#8C7771]/20 flex items-start gap-3">
                <PressedFlowerSprig className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#59484A]">02. A quieter chapter</p>
                  <p className="text-[#8C7771] mt-0.5">
                    Something sincere I needed to say, at your own pace
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#8C7771]/15 flex flex-wrap items-center justify-between gap-2">
            <span className="font-ui text-xs text-[#8C7771] inline-flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-[#C98D9D]" />
              <span>Includes Read-Aloud voice on every page</span>
            </span>
            {onOpenStudio && (
              <button
                type="button"
                onClick={() => onOpenStudio('image')}
                className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#FFF7EB] hover:bg-[#F8E9E8] border border-[#C98D9D]/40 font-ui text-xs font-medium text-[#59484A] inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C98D9D]" />
                <span>Polaroid Studio</span>
              </button>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
};
