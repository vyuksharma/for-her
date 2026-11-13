import React from 'react';
import { ArrowLeft, Sparkles, BookOpen } from 'lucide-react';
import { FINAL_SURPRISE_CONFIG, formatPageCounter } from '../data/scrapbookData';
import { PressedFlowerSprig } from './ScrapbookIllustrations';

interface FutureChapterLeafProps {
  totalPages: number;
  onPrevious: () => void;
  onReturnToFirstPage: () => void;
  onOpenKeepsakeStudio: (tab: 'chat' | 'image') => void;
}

export const FutureChapterLeaf: React.FC<FutureChapterLeafProps> = ({
  totalPages,
  onPrevious,
  onReturnToFirstPage,
  onOpenKeepsakeStudio,
}) => {
  const counterText = formatPageCounter(totalPages, totalPages);

  return (
    <section
      aria-labelledby="future-chapters-heading"
      className="w-full max-w-2xl mx-auto px-4 py-8 sm:py-12"
    >
      <div className="relative rounded-2xl paper-card-calm p-6 sm:p-10 text-center">
        <div
          aria-hidden="true"
          className="washi-tape-sage w-28 h-6 -top-3 left-1/2 -translate-x-1/2 absolute rounded-xs"
        />

        <div className="flex justify-center mb-4">
          <PressedFlowerSprig className="w-20 h-20" />
        </div>

        <p className="font-ui text-xs uppercase tracking-widest text-[#8C7771] mb-2">
          Bookmark · After Page {counterText}
        </p>

        <h1
          id="future-chapters-heading"
          className="font-handwritten text-4xl sm:text-5xl font-bold text-[#59484A] mb-4"
        >
          {FINAL_SURPRISE_CONFIG.placeholderHeading}
        </h1>

        <p className="text-base sm:text-lg leading-relaxed text-[#59484A] max-w-md mx-auto mb-8">
          {FINAL_SURPRISE_CONFIG.placeholderNote}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <button
            type="button"
            onClick={onPrevious}
            className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-[#C98D9D] hover:bg-[#b87b8b] text-[#FFFDF9] font-ui text-sm font-medium inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Previous (Back to Page 02)</span>
          </button>

          <button
            type="button"
            onClick={onReturnToFirstPage}
            className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-xl bg-[#FFF7EB] hover:bg-[#F8E9E8] border border-[#8C7771]/35 text-[#59484A] font-ui text-sm font-medium inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>Read from Page 01</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenKeepsakeStudio('chat')}
            className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-xl bg-[#FFF7EB] hover:bg-[#B9C9B0]/35 border border-[#8C7771]/35 text-[#59484A] font-ui text-sm font-medium inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Sparkles className="w-4 h-4 text-[#C98D9D]" />
            <span>Open Keepsake Studio</span>
          </button>
        </div>

        <div className="pt-5 border-t border-[#8C7771]/20 flex items-center justify-between text-xs font-ui text-[#8C7771]">
          <span>Ready for Page 03, Page 04 &amp; Final Surprise</span>
          <span className="tabular-nums">{counterText}</span>
        </div>
      </div>
    </section>
  );
};
