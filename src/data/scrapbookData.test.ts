import test from 'node:test';
import assert from 'node:assert/strict';
import {
  WELCOME_CONFIG,
  SCRAPBOOK_PAGES,
  formatPageCounter,
  getPagePlainText,
  canShowPreviousButton,
  canShowNextButton,
  transitionScrapbookState,
  type ScrapbookPageData,
  type ScrapbookNavState,
} from './scrapbookData';

test('Welcome screen copy matches the brief verbatim', () => {
  assert.equal(WELCOME_CONFIG.workingTitle, 'The Month Between Us');
  assert.equal(WELCOME_CONFIG.subtitle, 'A little scrapbook made for Pallavi.');
  assert.equal(WELCOME_CONFIG.heading, 'Heyyyyy, you. ❤️');
  assert.equal(
    WELCOME_CONFIG.body,
    "I made a little something for you. It's not a birthday gift, not an occasion gift. I just had something to tell you."
  );
  assert.equal(WELCOME_CONFIG.buttonText, 'Open this little scrapbook 💌');
});

test('Page 1 and Page 2 contain exact verbatim copy and preserve all lines', () => {
  assert.equal(SCRAPBOOK_PAGES.length, 2);

  const page1 = SCRAPBOOK_PAGES[0];
  assert.equal(page1.label, 'A little message for Pallavi');
  assert.equal(page1.heading, 'Heyyyyy! ❤️');
  assert.equal(page1.isFinalPage, false);

  const page1Text = getPagePlainText(page1);
  assert.ok(page1Text.includes('So, you finally got the chocolate box I prepared for you!'));
  assert.ok(page1Text.includes('Last month was scary as fuck...'));
  assert.ok(page1Text.includes('Wait... fuck is scary? 😭'));
  assert.ok(page1Text.includes('charged him ₹500 for it. So yes, the money was earned by your Capy.'));
  assert.ok(page1Text.includes('Send me a random, playful picture of my gudiya.'));
  assert.ok(page1Text.includes("I NEEEEED TO SEEEE MY GUDIYA'S PICCCCC."));
  assert.ok(page1Text.includes('BYEEEEEEEE!!!!! 🏃‍♂️💗'));

  const page2 = SCRAPBOOK_PAGES[1];
  assert.equal(page2.label, 'A quieter chapter');
  assert.equal(page2.heading, 'Something I needed to say...');
  assert.equal(page2.isFinalPage, false);

  const page2Text = getPagePlainText(page2);
  assert.ok(page2Text.includes("I'm genuinely ashamed of the mistakes I've made."));
  assert.ok(
    page2Text.includes(
      'I love you so much. Itna ki kabhi-kabhi pyaar-pyaar mein tera achha karne jaata hoon aur tujhe hi hurt kar deta hoon.'
    )
  );
  assert.ok(page2Text.includes("I'm genuinely sorry, Pallavi."));
  assert.ok(page2Text.includes("I'm heartily sorry. ❤️"));
});

test('formatPageCounter formats two-digit padded counters accurately', () => {
  assert.equal(formatPageCounter(1, 2), '01 / 02');
  assert.equal(formatPageCounter(2, 2), '02 / 02');
  assert.equal(formatPageCounter(3, 5), '03 / 05');
});

test('navigation transitions from welcome -> page 1 -> page 2 -> future-leaf and back', () => {
  let state: ScrapbookNavState = { mode: 'welcome', pageIndex: 0 };
  assert.equal(canShowPreviousButton(state), false);

  // Open envelope -> Page 1
  state = transitionScrapbookState(state, 'OPEN_SCRAPBOOK');
  assert.deepEqual(state, { mode: 'page', pageIndex: 0 });
  assert.equal(canShowPreviousButton(state), false);
  assert.equal(canShowNextButton(state), true);

  // Next -> Page 2
  state = transitionScrapbookState(state, 'NEXT');
  assert.deepEqual(state, { mode: 'page', pageIndex: 1 });
  assert.equal(canShowPreviousButton(state), true);
  assert.equal(canShowNextButton(state), true);

  // Previous -> Page 1
  const backToPage1 = transitionScrapbookState(state, 'PREVIOUS');
  assert.deepEqual(backToPage1, { mode: 'page', pageIndex: 0 });

  // Next from Page 2 -> Future Leaf (since Page 2 is not marked isFinalPage)
  const futureLeaf = transitionScrapbookState(state, 'NEXT');
  assert.deepEqual(futureLeaf, { mode: 'future-leaf', pageIndex: 1 });
  assert.equal(canShowPreviousButton(futureLeaf), true);

  // Previous from Future Leaf -> Page 2
  const backToPage2 = transitionScrapbookState(futureLeaf, 'PREVIOUS');
  assert.deepEqual(backToPage2, { mode: 'page', pageIndex: 1 });
});

test('configurable final surprise page hides Next button automatically', () => {
  const extendedPages: ScrapbookPageData[] = [
    ...SCRAPBOOK_PAGES,
    {
      id: 'page-3-final',
      pageNumber: 3,
      label: 'Final surprise',
      heading: 'A final note',
      mood: 'playful',
      isFinalPage: true,
      ttsVoiceStyle: 'Warm',
      paragraphs: [{ id: 'p3-1', text: 'Surprise!', style: 'normal' }],
    },
  ];

  const finalPageState = { mode: 'page' as const, pageIndex: 2 };
  assert.equal(canShowNextButton(finalPageState, extendedPages), false);
  assert.equal(canShowPreviousButton(finalPageState), true);
});
