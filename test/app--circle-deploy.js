'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-generator').test;

describe('generator-armadillo:app (Circle CI, Deploy)', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({
        project: 'foo',
        ghPages: true,
        cid: 'Travis CI',
        email: 'foo@bar.baz',
        ghRepo: 'https://github.com/Snugug/gulp-armadillo.git'
      })
      .on('end', done);
  });

  it('creates config files', function () {
    assert.file([
      '.editorconfig',
      '.gitignore',
      '.nvmrc'
    ]);
  });

  it('creates package manager files', function () {
    assert.file([
      'bower.json',
      'package.json'
    ]);
  });

  it('creates gitkeep files', function () {
    assert.file([
      'pages/.gitkeep',
      'templates/.gitkeep',
      'sass/.gitkeep',
      'js/.gitkeep',
      'images/.gitkeep',
      'videos/.gitkeep',
      'audio/.gitkeep',
      'fonts/.gitkeep',
      'documents/.gitkeep'
    ]);
  });

  it('creates Gullpfile', function () {
    assert.file(['Gulpfile.js']);
  });

  it('creates Travis file', function () {
    assert.file(['.travis.yml']);
  });

  it('creates deploy file', function () {
    assert.file(['.deploy.sh']);
  });

  it('creates pages files', function () {
    assert.file([
      'pages/index.html',
      'pages/markdown.md'
    ]);
  });

  it('creates template file', function () {
    assert.file(['templates/_layout.html']);
  });

  it('creates JavaScript files', function () {
    assert.file(['js/app.js']);
  });

  it('creates Sass files', function () {
    assert.file(['sass/style.scss']);
  });
});
