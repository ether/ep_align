'use strict';

const utils = require('../utils.js');

const apiKey = utils.apiKey;
const api = utils.api;
const apiVersion = utils.apiVersion;
const randomString = require('ep_etherpad-lite/static/js/pad_utils').randomString;

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
    before(function () {
      html = function () {
        return buildHTML('<center>Hello world</center>');
      };
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
    before(function () {
      html = function () {
        return buildHTML('<justify>Hello world</justify>');
      };
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
    before(function () {
      html = function () {
        return buildHTML('<right>Hello world</right>');
      };
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
            if (html.indexOf(expectedHTML) === -1) throw new Error('No center tag detected');
          })
          .end(done);
    });
  });

  context('when pad text is left aligned', function () {
    before(function () {
      html = function () {
        return buildHTML('<left>Hello world</left>');
      };
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
            if (html.indexOf(expectedHTML) === -1) throw new Error('No center tag detected');
          })
          .end(done);
    });
  });
});


// Creates a pad and returns the pad id. Calls the callback when finished.
var createPad = function (padID, callback) {
  api.get(`/api/${apiVersion}/createPad?apikey=${apiKey}&padID=${padID}`)
      .end((err, res) => {
        if (err || (res.body.code !== 0)) callback(new Error('Unable to create new Pad'));

        callback(padID);
      });
};

var setHTML = function (padID, html, callback) {
  api.get(`/api/${apiVersion}/setHTML?apikey=${apiKey}&padID=${padID}&html=${html}`)
      .end((err, res) => {
        if (err || (res.body.code !== 0)) callback(new Error('Unable to set pad HTML'));

        callback(null, padID);
      });
};

var getHTMLEndPointFor = function (padID, callback) {
  return `/api/${apiVersion}/getHTML?apikey=${apiKey}&padID=${padID}`;
};


var buildHTML = function (body) {
  return `<html><body>${body}</body></html>`;
};
