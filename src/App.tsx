/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import {
  WELCOME_CONFIG,
  SCRAPBOOK_PAGES,
  canShowPreviousButton,
  canShowNextButton,
  transitionScrapbookState,
  formatPageCounter,
  type ScrapbookNavState,
} from './data/scrapbookData';
import { WelcomeEnvelope } from './components/WelcomeEnvelope';
import { ScrapbookPage } from './components/ScrapbookPage';
import { FutureChapterLeaf } from './components/FutureChapterLeaf';
import { KeepsakeStudioDrawer } from './components/KeepsakeStudioDrawer';

function getInitialNavState(): ScrapbookNavState {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      return { mode: 'page', pageIndex: 0 };
    }
    const pageParam = params.get('page');
    if (pageParam === '1') return { mode: 'page', pageIndex: 0 };
    if (pageParam === '2') return { mode: 'page', pageIndex: 1 };
  }
  return { mode: 'welcome', pageIndex: 0 };
}

export default function App() {
  const [navState, setNavState] = useState<ScrapbookNavState>(getInitialNavState);
  const [polaroidImage, setPolaroidImage] = useState<string | null>(null);
  const [studioOpen, setStudioOpen] = useState(false);
  const [studioTab, setStudioTab] = useState<'chat' | 'image'>('chat');

  // Sync browser back/forward history
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && typeof event.state.mode === 'string') {
        setNavState(event.state as ScrapbookNavState);
      } else {
        setNavState({ mode: 'welcome', pageIndex: 0 });
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const updateNavWithHistory = (nextState: ScrapbookNavState) => {
    setNavState(nextState);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (nextState.mode === 'welcome') {
        url.searchParams.delete('page');
      } else if (nextState.mode === 'page') {
        url.searchParams.set('page', String(nextState.pageIndex + 1));
      } else {
        url.searchParams.set('page', 'more');
      }
      window.history.pushState(nextState, '', url.toString());
    }
  };

  const handleOpenScrapbook = () => {
    updateNavWithHistory(transitionScrapbookState(navState, 'OPEN_SCRAPBOOK', SCRAPBOOK_PAGES));
  };

  const handleNext = () => {
    updateNavWithHistory(transitionScrapbookState(navState, 'NEXT', SCRAPBOOK_PAGES));
  };

  const handlePrevious = () => {
    updateNavWithHistory(transitionScrapbookState(navState, 'PREVIOUS', SCRAPBOOK_PAGES));
  };

  const handleGoToWelcome = () => {
    updateNavWithHistory(transitionScrapbookState(navState, 'GO_TO_WELCOME', SCRAPBOOK_PAGES));
  };

  const handleGoToPage = (index: number) => {
    updateNavWithHistory(
      transitionScrapbookState(navState, { type: 'GO_TO_PAGE', index }, SCRAPBOOK_PAGES)
    );
  };

  const handleOpenStudio = (tab: 'chat' | 'image') => {
    setStudioTab(tab);
    setStudioOpen(true);
  };

  const currentPage = SCRAPBOOK_PAGES[navState.pageIndex] ?? SCRAPBOOK_PAGES[0];
  const totalPages = SCRAPBOOK_PAGES.length;

  return (
    <div className="min-h-screen paper-grain text-[#59484A] flex flex-col">
      {/* Top Bar following 3-zone contract */}
      <header className="sticky top-0 z-30 bg-[#FFF7EB]/90 backdrop-blur-md border-b border-[#C98D9D]/30 px-4 sm:px-8 py-3 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Title (single text element) */}
        <button
          type="button"
          onClick={handleGoToWelcome}
          className="font-handwritten text-2xl sm:text-3xl font-bold text-[#59484A] whitespace-nowrap shrink-0 cursor-pointer"
        >
          {WELCOME_CONFIG.workingTitle}
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav aria-label="Scrapbook chapters" className="hidden md:flex items-center gap-6 font-ui text-xs font-medium text-[#8C7771]">
          <button
            type="button"
            onClick={handleGoToWelcome}
            className={`hover:text-[#59484A] transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 ${
              navState.mode === 'welcome' ? 'text-[#59484A] underline underline-offset-4' : ''
            }`}
          >
            Envelope Cover
          </button>
          {SCRAPBOOK_PAGES.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleGoToPage(idx)}
              className={`hover:text-[#59484A] transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 ${
                navState.mode === 'page' && navState.pageIndex === idx
                  ? 'text-[#59484A] underline underline-offset-4'
                  : ''
              }`}
            >
              {String(idx + 1).padStart(2, '0')}. {p.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleOpenStudio('chat')}
            className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-[#F8E9E8] hover:bg-[#C98D9D]/30 border border-[#C98D9D]/45 text-[#59484A] font-ui text-xs font-medium inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C98D9D]" />
            <span>Keepsake Studio</span>
          </button>
        </div>
      </header>

      {/* Main Content View — Shows only one screen/page at a time */}
      <main className="flex-1">
        {navState.mode === 'welcome' && (
          <WelcomeEnvelope
            onOpenScrapbook={handleOpenScrapbook}
            onOpenStudio={handleOpenStudio}
          />
        )}

        {navState.mode === 'page' && (
          <ScrapbookPage
            page={currentPage}
            pageIndex={navState.pageIndex}
            totalPages={totalPages}
            showPrevious={canShowPreviousButton(navState)}
            showNext={canShowNextButton(navState, SCRAPBOOK_PAGES)}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onReturnToCover={handleGoToWelcome}
            polaroidImage={polaroidImage}
            onUpdatePolaroidImage={(url) => setPolaroidImage(url)}
            onOpenKeepsakeStudio={handleOpenStudio}
          />
        )}

        {navState.mode === 'future-leaf' && (
          <FutureChapterLeaf
            totalPages={totalPages}
            onPrevious={handlePrevious}
            onReturnToFirstPage={() => handleGoToPage(0)}
            onOpenKeepsakeStudio={handleOpenStudio}
          />
        )}
      </main>

      {/* Subtle Quiet Footer */}
      <footer className="py-5 px-4 text-center border-t border-[#8C7771]/15 font-ui text-xs text-[#8C7771]">
        <span>{WELCOME_CONFIG.subtitle}</span>
        {navState.mode === 'page' && (
          <>
            <span aria-hidden="true"> · </span>
            <span className="tabular-nums">
              Page {formatPageCounter(navState.pageIndex + 1, totalPages)}
            </span>
          </>
        )}
      </footer>

      {/* Keepsake Studio Modal / Drawer */}
      <KeepsakeStudioDrawer
        isOpen={studioOpen}
        initialTab={studioTab}
        onClose={() => setStudioOpen(false)}
        onPinToPolaroid={(imageUrl) => {
          setPolaroidImage(imageUrl);
        }}
      />
    </div>
  );
}
