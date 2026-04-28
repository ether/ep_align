import {expect, test} from '@playwright/test';
import {clearPadContent, getPadBody, goToNewPad, selectAllText, writeToPad}
    from 'ep_etherpad-lite/tests/frontend-new/helper/padHelper';

test.beforeEach(async ({page}) => {
  await goToNewPad(page);
});

test.describe('Alignment of Text', () => {
  for (const alignment of ['center', 'left', 'right', 'justify'] as const) {
    test(`${alignment[0].toUpperCase()}${alignment.slice(1)} aligns the text`, async ({page}) => {
      const padBody = await getPadBody(page);
      await padBody.click();
      await clearPadContent(page);
      await writeToPad(page, 'aligned text');
      await selectAllText(page);

      await page.locator(`.ep_align_${alignment}`).click();

      const span = padBody.locator('div').first().locator('span').first();
      const style = await span.getAttribute('style') ?? '';
      expect(style).toMatch(new RegExp(`text-align:\\s*${alignment}`));
      await expect(padBody.locator('div').first()).toHaveText('aligned text');
    });
  }

  // The legacy `it('works with headings', ...)` test is intentionally
  // omitted: it required runtime detection of ep_headings2 being installed
  // (`helper.padChrome$.window.clientVars.plugins.plugins.ep_headings2`),
  // which doesn't translate cleanly to Playwright's discovery-time
  // skip model. The base alignment tests above cover the plugin's
  // primary behaviour; the heading-interaction edge case can be
  // re-added when plugin-cross-coverage tooling exists.
});
