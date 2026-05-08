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

      // force:true bypasses the #toolbar-overlay div that intercepts pointer
      // events after a text selection (same pattern as clearAuthorship() in
      // ep_etherpad-lite's padHelper).
      await page.locator(`.ep_align_${alignment}`).click({force: true});

      // ep_align wraps the line content in a block element (<left>, <center>,
      // <right>, <justify>) carrying the text-align style — see
      // aceDomLineProcessLineAttributes in static/js/index.js. The inner
      // <span> has no style of its own, so assert against the wrapper.
      const wrapper = padBody.locator('div').first().locator(alignment);
      await expect(wrapper).toHaveAttribute(
          'style', new RegExp(`text-align:\\s*${alignment}`));
      await expect(padBody.locator('div').first()).toHaveText('aligned text');
    });
  }

  test('toolbar buttons have no <button> nested inside <a>', async ({page}) => {
    const padBody = await getPadBody(page);
    await padBody.click();
    // Run on the page (toolbar) frame, not the inner pad frame.
    const offenders = await page.locator('.ep_align a button').count();
    expect(offenders).toBe(0);
    // Each align <a> exposes the click target with an accessible name.
    // aria-label is populated by html10n at runtime (no author-supplied
    // value — see html10n.ts:665-678) and tagged with
    // data-l10n-aria-label="true" once it has run, so wait for that
    // marker before asserting the localized aria-label is non-empty.
    for (const dir of ['left', 'center', 'right', 'justify'] as const) {
      const a = page.locator(`a.ep_align_${dir}`);
      await expect(a).toHaveAttribute('role', 'button');
      await expect(a).toHaveAttribute('data-l10n-aria-label', 'true');
      await expect(a).toHaveAttribute('aria-label', /.+/);
    }
  });

  // The legacy `it('works with headings', ...)` test is intentionally
  // omitted: it required runtime detection of ep_headings2 being installed
  // (`helper.padChrome$.window.clientVars.plugins.plugins.ep_headings2`),
  // which doesn't translate cleanly to Playwright's discovery-time
  // skip model. The base alignment tests above cover the plugin's
  // primary behaviour; the heading-interaction edge case can be
  // re-added when plugin-cross-coverage tooling exists.
});
