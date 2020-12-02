'use strict';

describe('Align Localization', function () {
  const changeEtherpadLanguageTo = function (lang, callback) {
    const boldTitles = {
      en: 'Bold (Ctrl+B)',
      fr: 'Gras (Ctrl+B)',
    };
    const chrome$ = helper.padChrome$;

    // click on the settings button to make settings visible
    const $settingsButton = chrome$('.buttonicon-settings');
    $settingsButton.click();

    // select the language
    const $language = chrome$('#languagemenu');
    $language.val(lang);
    $language.change();

    // hide settings again
    $settingsButton.click();

    helper.waitFor(() => chrome$('.buttonicon-bold').parent()[0].title === boldTitles[lang])
        .done(callback);
  };

  // create a new pad with comment before each test run
  beforeEach(function (cb) {
    helper.newPad(() => {
      changeEtherpadLanguageTo('fr', cb);
    });
    this.timeout(60000);
  });

  // ensure we go back to English to avoid breaking other tests:
  after(function (cb) {
    changeEtherpadLanguageTo('en', cb);
  });

  it('localizes toolbar buttons when Etherpad language is changed', function (done) {
    const buttonTranslations = {
      'ep_align.toolbar.left.title': 'Gauche',
      'ep_align.toolbar.center.title': 'Centre',
      'ep_align.toolbar.right.title': 'Droite',
      'ep_align.toolbar.justify.title': 'Justifié',
    };
    const chrome$ = helper.padChrome$;
    const $buttons = chrome$('#editbar').find('.ep_align').parent();
    $buttons.each(function (index) {
      console.log($(this).attr('data-l10n-id'), $(this).attr('title'));
      const $key = $(this).attr('data-l10n-id');
      const $title = $(this).attr('title');
      console.log($title === buttonTranslations[$key]);
      expect($title).to.be(buttonTranslations[$key]);

      if (index === ($buttons.length - 1)) {
        return done();
      }
    });
  });
});
