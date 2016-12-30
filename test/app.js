'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-armadillo:app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({
        project: 'foo'
      })
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      '.nvmrc',
      '.editorconfig',
      '.gitignore',
      '.travis.yml',
      'Gulpfile.js',
      'config/default.js',
      'pages/index.html',
      'pages/markdown.md',
      'templates/_index.html',
      'sass/style.scss',
      'js/main.js',
      'images/.gitkeep',
      'videos/.gitkeep',
      'audio/.gitkeep',
      'fonts/.gitkeep',
      'documents/.gitkeep'
    ]);
  });
});
