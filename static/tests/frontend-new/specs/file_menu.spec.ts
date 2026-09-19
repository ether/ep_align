import {expect, test} from '@playwright/test';
import {clearPadContent, getPadBody, goToNewPad, selectAllText, writeToPad}
    from 'ep_etherpad-lite/tests/frontend-new/helper/padHelper';

test.beforeEach(async ({page}) => {
  await goToNewPad(page);
});

// https://github.com/ether/ether-plugins/issues/51
test.describe('ep_align file menu', () => {
  for (const [alignment, value] of [
    ['left', '0'],
    ['center', '1'],
    ['justify', '2'],
    ['right', '3'],
  ] as const) {
    test(`Aligns ${alignment} from the Format menu`, async ({page}) => {
      test.skip(await page.locator('.dropdown-menu').count() === 0,
          'ep_file_menu_toolbar is not installed');

      const padBody = await getPadBody(page);
      await padBody.click();
      await clearPadContent(page);
      await writeToPad(page, 'aligned text');
      await selectAllText(page);

      // The entry lives in the collapsed "Format" submenu, which the
      // jquery-css dropdown plugin only expands on hover. dispatchEvent
      // fires the click straight at the element regardless of visibility.
      await page.locator(`.dropdown-menu a.ep_align[data-align="${value}"]`)
          .dispatchEvent('click');

      const wrapper = padBody.locator('div').first().locator(alignment);
      await expect(wrapper).toHaveAttribute(
          'style', new RegExp(`text-align:\\s*${alignment}`));
      await expect(padBody.locator('div').first()).toHaveText('aligned text');
    });
  }
});
