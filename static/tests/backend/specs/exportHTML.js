'use strict';

const utils = require('../utils.js');

const apiKey = utils.apiKey;
const api = utils.api;
const apiVersion = utils.apiVersion;
const randomString = require('ep_etherpad-lite/static/js/pad_utils').randomString;

// Creates a pad and returns the pad id. Calls the callback when finished.
const createPad = function (padID, callback) {
  api.get(`/api/${apiVersion}/createPad?apikey=${apiKey}&padID=${padID}`)
      .end((err, res) => {
        if (err || (res.body.code !== 0)) callback(new Error('Unable to create new Pad'));

        callback(padID);
      });
};

const setHTML = function (padID, html, callback) {
  api.get(`/api/${apiVersion}/setHTML?apikey=${apiKey}&padID=${padID}&html=${html}`)
      .end((err, res) => {
        if (err || (res.body.code !== 0)) callback(new Error('Unable to set pad HTML'));

        callback(null, padID);
      });
};

const getHTMLEndPointFor = function (padID, callback) {
  return `/api/${apiVersion}/getHTML?apikey=${apiKey}&padID=${padID}`;
};


const buildHTML = function (body) {
  return `<html><body>${body}</body></html>`;
};


describe('export alignment to HTML', function () {
  let padID;
  let html;

  // create a new pad before each test run
  beforeEach(function (done) {
    padID = randomString(5);

    createPad(padID, () => {
      setHTML(padID, html(), done);
    });
  });

  context('when pad text is center aligned', function () {
    before(async function () {
      html = () => buildHTML('<center>Hello world</center>');
    });

    it('returns ok', function (done) {
      api.get(getHTMLEndPointFor(padID))
          .expect('Content-Type', /json/)
          .expect(200, done);
    });

    it('returns HTML with Subscript HTML tags', function (done) {
      api.get(getHTMLEndPointFor(padID))
          .expect((res) => {
            const html = res.body.data.html;
            const expectedHTML =
              '<p style=\'text-align:center\'>Hello world</p><br><br></body></html>';
            if (html.indexOf(expectedHTML) === -1) throw new Error('No center tag detected');
          })
          .end(done);
    });
  });

  context('when pad text is justified aligned', function () {
    before(async function () {
      html = () => buildHTML('<justify>Hello world</justify>');
    });

    it('returns ok', function (done) {
      api.get(getHTMLEndPointFor(padID))
          .expect('Content-Type', /json/)
          .expect(200, done);
    });

    it('returns HTML with Subscript HTML tags', function (done) {
      api.get(getHTMLEndPointFor(padID))
          .expect((res) => {
            const html = res.body.data.html;
            const expectedHTML =
              '<p style=\'text-align:justify\'>Hello world</p><br><br></body></html>';
            if (html.indexOf(expectedHTML) === -1) throw new Error('No center tag detected');
          })
          .end(done);
    });
  });

  context('when pad text is right aligned', function () {
    before(async function () {
      html = () => buildHTML('<right>Hello world</right>');
    });

    it('returns ok', function (done) {
      api.get(getHTMLEndPointFor(padID))
          .expect('Content-Type', /json/)
          .expect(200, done);
    });

    it('returns HTML with Subscript HTML tags', function (done) {
      api.get(getHTMLEndPointFor(padID))
          .expect((res) => {
            const html = res.body.data.html;
            const expectedHTML =
              '<p style=\'text-align:right\'>Hello world</p><br><br></body></html>';
            if (html.indexOf(expectedHTML) === -1) throw new Error('No right tag detected');
          })
          .end(done);
    });
  });

  context('when pad text is left aligned', function () {
    before(async function () {
      html = () => buildHTML('<left>Hello world</left>');
    });

    it('returns ok', function (done) {
      api.get(getHTMLEndPointFor(padID))
          .expect('Content-Type', /json/)
          .expect(200, done);
    });

    it('returns HTML with Subscript HTML tags', function (done) {
      api.get(getHTMLEndPointFor(padID))
          .expect((res) => {
            const html = res.body.data.html;
            const expectedHTML =
              '<p style=\'text-align:left\'>Hello world</p><br><br></body></html>';
            if (html.indexOf(expectedHTML) === -1) throw new Error('No left tag detected');
          })
          .end(done);
    });
  });

  context('when pad text is heading', function () {
    before(async function () {
      html = () => buildHTML('<h1><left>Hello world</left></h1>');
    });

    it('returns ok', function (done) {
      api.get(getHTMLEndPointFor(padID))
          .expect('Content-Type', /json/)
          .expect(200, done);
    });

    it('returns HTML with Subscript HTML tags', function (done) {
      try {
        require.resolve('ep_headings2'); // eslint-disable-line
        api.get(getHTMLEndPointFor(padID))
            .expect((res) => {
              const html = res.body.data.html;
              const expectedHTML =
                '<h1 style=\'text-align:left\'>Hello world</h1><br><br></body></html>';
              if (html.indexOf(expectedHTML) === -1) throw new Error('No left tag detected');
            })
            .end(done);
      } catch (e) {
        if (e.message.indexOf('Cannot find module') === -1) {
          throw new Error(e.message);
        }
        done();
      }
    });
  });
});
