export type PageMood = 'playful' | 'calm';

export type ParagraphStyle =
  | 'greeting'
  | 'normal'
  | 'handwritten-funny'
  | 'note-card'
  | 'capy-stamp'
  | 'polaroid-prompt'
  | 'excited-outro'
  | 'sincere-lead'
  | 'sincere-highlight'
  | 'sincere-hinglish'
  | 'sincere-apology'
  | 'sincere-closing';

export interface ScrapbookParagraphBlock {
  id: string;
  text: string;
  style: ParagraphStyle;
}

export interface ScrapbookPageData {
  id: string;
  pageNumber: number;
  label: string;
  heading: string;
  mood: PageMood;
  /**
   * Per Requirement 3.11 & 7:
   * "The final page will eventually have a special surprise and should not show a Next button.
   * Do not decide which current page is the final page because more messages are coming."
   */
  isFinalPage: boolean;
  ttsVoiceStyle: string;
  paragraphs: ScrapbookParagraphBlock[];
}

export interface WelcomeScreenConfig {
  workingTitle: string;
  subtitle: string;
  heading: string;
  body: string;
  buttonText: string;
}

export interface FinalSurpriseConfig {
  isConfigured: boolean;
  placeholderHeading: string;
  placeholderNote: string;
}

export const WELCOME_CONFIG: WelcomeScreenConfig = {
  workingTitle: 'The Month Between Us',
  subtitle: 'A little scrapbook made for Pallavi.',
  heading: 'Heyyyyy, you. ❤️',
  body: "I made a little something for you. It's not a birthday gift, not an occasion gift. I just had something to tell you.",
  buttonText: 'Open this little scrapbook 💌',
};

export const FINAL_SURPRISE_CONFIG: FinalSurpriseConfig = {
  isConfigured: false,
  placeholderHeading: 'More chapters are on the way...',
  placeholderNote:
    'This space is saved for the next message pages and the final surprise once their exact words are added.',
};

/**
 * Separated message data structure.
 * More pages (Page 3, Page 4, and the final surprise page) can be appended here
 * without changing navigation or layout components.
 */
export const SCRAPBOOK_PAGES: ScrapbookPageData[] = [
  {
    id: 'page-1',
    pageNumber: 1,
    label: 'A little message for Pallavi',
    heading: 'Heyyyyy! ❤️',
    mood: 'playful',
    isFinalPage: false,
    ttsVoiceStyle: 'Playful, warm, affectionate, energetic young man speaking to his girlfriend',
    paragraphs: [
      {
        id: 'p1-1',
        text: 'Heyyyyy! ❤️',
        style: 'greeting',
      },
      {
        id: 'p1-2',
        text: 'So, you finally got the chocolate box I prepared for you!',
        style: 'note-card',
      },
      {
        id: 'p1-3',
        text: "Honestly, I can't tell you how happy I am after seeing you. It genuinely feels like a dream. We used to see each other daily, hug and kiss each other, and suddenly there was this whole month without meeting.",
        style: 'normal',
      },
      {
        id: 'p1-4',
        text: 'Last month was scary as fuck...',
        style: 'handwritten-funny',
      },
      {
        id: 'p1-5',
        text: 'Wait... fuck is scary? 😭',
        style: 'handwritten-funny',
      },
      {
        id: 'p1-6',
        text: 'Whatever.',
        style: 'normal',
      },
      {
        id: 'p1-7',
        text: 'Before you start regretting that I spent money on you, let me tell you one thing.',
        style: 'normal',
      },
      {
        id: 'p1-8',
        text: 'I WANT to give you something using my own money.',
        style: 'note-card',
      },
      {
        id: 'p1-9',
        text: "There's a friend of mine for whom I prepared a proposal website, and I charged him ₹500 for it. So yes, the money was earned by your Capy.",
        style: 'capy-stamp',
      },
      {
        id: 'p1-10',
        text: 'And all these cutout prints, KitKats and the bouquet? I bought them with my own money too.',
        style: 'normal',
      },
      {
        id: 'p1-11',
        text: "Yeahhhh, it's from your Capy's money. 😂",
        style: 'handwritten-funny',
      },
      {
        id: 'p1-12',
        text: "So don't be pressurized. Think of it as your future sugar daddy buying things for you. 😭❤️",
        style: 'handwritten-funny',
      },
      {
        id: 'p1-13',
        text: "And that's exactly why I said this box is filled with love.",
        style: 'note-card',
      },
      {
        id: 'p1-14',
        text: "Now, if you feel burdened and want to thank me, there's just one tiny thing you can do...",
        style: 'normal',
      },
      {
        id: 'p1-15',
        text: 'Send me a random, playful picture of my gudiya.',
        style: 'polaroid-prompt',
      },
      {
        id: 'p1-16',
        text: 'Because she looks SO CUTE. LIKE OH MY GOD, ITNI CUTEEEEEE. 😭❤️',
        style: 'handwritten-funny',
      },
      {
        id: 'p1-17',
        text: 'WAITTTT...',
        style: 'excited-outro',
      },
      {
        id: 'p1-18',
        text: "I NEEEEED TO SEEEE MY GUDIYA'S PICCCCC.",
        style: 'excited-outro',
      },
      {
        id: 'p1-19',
        text: 'BYEEEEEEEE!!!!! 🏃‍♂️💗',
        style: 'excited-outro',
      },
    ],
  },
  {
    id: 'page-2',
    pageNumber: 2,
    label: 'A quieter chapter',
    heading: 'Something I needed to say...',
    mood: 'calm',
    isFinalPage: false,
    ttsVoiceStyle: 'Calm, soft, sincere, deeply apologetic and gentle voice',
    paragraphs: [
      {
        id: 'p2-1',
        text: 'Hey...',
        style: 'sincere-lead',
      },
      {
        id: 'p2-2',
        text: "There's something else I want to tell you.",
        style: 'normal',
      },
      {
        id: 'p2-3',
        text: "I'm not shameless enough to hurt you and then act like nothing happened, being all lovey-dovey as if I did nothing wrong.",
        style: 'normal',
      },
      {
        id: 'p2-4',
        text: "I'm genuinely ashamed of the mistakes I've made.",
        style: 'sincere-highlight',
      },
      {
        id: 'p2-5',
        text: "Sometimes, I think I'm doing something good for you, but in reality, I end up hurting you. And maybe that's why it hurts me so much too.",
        style: 'normal',
      },
      {
        id: 'p2-6',
        text: 'I remember once saying to God that if I ever hurt you, let me feel 10 times the pain you felt.',
        style: 'normal',
      },
      {
        id: 'p2-7',
        text: "I don't know how to explain everything, but I really wish I had understood certain things earlier.",
        style: 'normal',
      },
      {
        id: 'p2-8',
        text: "I know I've made mistakes. I won't deny them or make excuses for them. But making mistakes doesn't mean I don't love you.",
        style: 'sincere-highlight',
      },
      {
        id: 'p2-9',
        text: 'I love you so much. Itna ki kabhi-kabhi pyaar-pyaar mein tera achha karne jaata hoon aur tujhe hi hurt kar deta hoon.',
        style: 'sincere-hinglish',
      },
      {
        id: 'p2-10',
        text: 'And I hate that.',
        style: 'normal',
      },
      {
        id: 'p2-11',
        text: "I know you probably want to forget what happened. Maybe accepting my apology isn't easy, and I understand that. You don't have to pretend everything is okay just because I'm sorry.",
        style: 'normal',
      },
      {
        id: 'p2-12',
        text: 'But I still wanted to tell you this one more time.',
        style: 'normal',
      },
      {
        id: 'p2-13',
        text: "I'm genuinely sorry, Pallavi.",
        style: 'sincere-apology',
      },
      {
        id: 'p2-14',
        text: "I'll work on understanding you better instead of assuming that whatever I think is good for you will actually be good for you.",
        style: 'normal',
      },
      {
        id: 'p2-15',
        text: "And this is the last time I'll bring this up. I don't want to keep making you revisit something that has already hurt you. I just hope things stay healthy, peaceful and happy between us.",
        style: 'normal',
      },
      {
        id: 'p2-16',
        text: 'Thank you for staying till the end and reading all of this.',
        style: 'normal',
      },
      {
        id: 'p2-17',
        text: 'And once again...',
        style: 'normal',
      },
      {
        id: 'p2-18',
        text: "I'm heartily sorry. ❤️",
        style: 'sincere-closing',
      },
    ],
  },
];

/**
 * Formats a 1-indexed page number and total page count into `01 / 02` format.
 */
export function formatPageCounter(currentPageOneIndexed: number, totalPages: number): string {
  const safeCurrent = Math.max(1, Math.min(currentPageOneIndexed, Math.max(1, totalPages)));
  const safeTotal = Math.max(1, totalPages);
  const currentStr = String(safeCurrent).padStart(2, '0');
  const totalStr = String(safeTotal).padStart(2, '0');
  return `${currentStr} / ${totalStr}`;
}

export type ScrapbookViewMode = 'welcome' | 'page' | 'future-leaf';

export interface ScrapbookNavState {
  mode: ScrapbookViewMode;
  pageIndex: number; // 0-indexed into pages array
}

export function getPagePlainText(page: ScrapbookPageData): string {
  return page.paragraphs.map((p) => p.text).join('\n\n');
}

export function canShowPreviousButton(state: ScrapbookNavState): boolean {
  if (state.mode === 'welcome') return false;
  if (state.mode === 'future-leaf') return true;
  return state.pageIndex > 0;
}

export function canShowNextButton(
  state: ScrapbookNavState,
  pages: ScrapbookPageData[] = SCRAPBOOK_PAGES
): boolean {
  if (state.mode !== 'page') return false;
  const currentPage = pages[state.pageIndex];
  if (!currentPage) return false;
  // Requirement 3.11: The final page will eventually have a special surprise and should not show a Next button.
  return !currentPage.isFinalPage;
}

export function transitionScrapbookState(
  state: ScrapbookNavState,
  action: 'OPEN_SCRAPBOOK' | 'NEXT' | 'PREVIOUS' | 'GO_TO_WELCOME' | { type: 'GO_TO_PAGE'; index: number },
  pages: ScrapbookPageData[] = SCRAPBOOK_PAGES
): ScrapbookNavState {
  if (action === 'OPEN_SCRAPBOOK') {
    return { mode: 'page', pageIndex: 0 };
  }
  if (action === 'GO_TO_WELCOME') {
    return { mode: 'welcome', pageIndex: 0 };
  }
  if (typeof action === 'object' && action.type === 'GO_TO_PAGE') {
    const clamped = Math.max(0, Math.min(action.index, pages.length - 1));
    return { mode: 'page', pageIndex: clamped };
  }
  if (action === 'NEXT') {
    if (state.mode === 'welcome') {
      return { mode: 'page', pageIndex: 0 };
    }
    if (state.mode === 'page') {
      const currentPage = pages[state.pageIndex];
      if (currentPage?.isFinalPage) {
        return state;
      }
      if (state.pageIndex + 1 < pages.length) {
        return { mode: 'page', pageIndex: state.pageIndex + 1 };
      }
      // Reached past the last currently supplied page while isFinalPage is false
      return { mode: 'future-leaf', pageIndex: pages.length - 1 };
    }
    return state;
  }
  if (action === 'PREVIOUS') {
    if (state.mode === 'future-leaf') {
      return { mode: 'page', pageIndex: Math.max(0, pages.length - 1) };
    }
    if (state.mode === 'page') {
      if (state.pageIndex > 0) {
        return { mode: 'page', pageIndex: state.pageIndex - 1 };
      }
      return { mode: 'welcome', pageIndex: 0 };
    }
    return state;
  }
  return state;
}
