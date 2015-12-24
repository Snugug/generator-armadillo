'use strict';
var yeoman = require('yeoman-generator');
var _s = require('underscore.string');
var path = require('path');
var fs = require('fs-extra');
var _v = require('validator');
var NodeGit = require('nodegit');

var armadillo = require('../../helpers/armadillo');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(armadillo(
      'Hi! Let\'s get started!'
    ));

    var prompts = [
      {
        type: 'string',
        name: 'project',
        message: 'What\'s the name of your project?',
        validate: function (input) {
          if (input === '') {
            return 'Please enter a project name';
          } else {
            return true;
          }
        }
      },
      {
        type: 'confirm',
        name: 'ghPages',
        message: 'Would you like to publish your site to GitHub Pages?',
        default: true
      },
      {
        type: 'confirm',
        name: 'gitInit',
        message: 'Would you like to initialize your project with Git?',
        default: true,
        when: function (answers) {
          return !answers.ghPages;
        }
      },
      {
        type: 'string',
        name: 'email',
        message: 'What\'s your email address (so I can attribute commits properly for you)?',
        when: function (answers) {
          return answers.ghPages || answers.gitInit;
        },
        validate: function (input) {
          if (!_v.isEmail(input)) {
            return 'Please enter a valid email address';
          } else {
            return true;
          }
        }
      },
      {
        type: 'string',
        name: 'ghRepo',
        message: 'What\'s the Git repo you\'d like to use? (e.g. `https://github.com/Snugug/gulp-armadillo.git`)',
        when: function (answers) {
          return answers.ghPages || answers.gitInit;
        },
        validate: function (input) {
          // Validate Regex from https://www.debuggex.com/r/H4kRw1G0YPyBFjfm
          if (_v.matches(input, /((git|ssh|http(s)?)|(git@[\w\.]+))(:(\/\/)?)([\w\.@\:\/\-~]+)(\.git)(\/)?/i)) {
            return true;
          } else {
            return 'Please enter a valid Git remote URL';
          }
        }
      },
      {
        type: 'list',
        name: 'cid',
        message: 'Which Continuous Integration and Deployment system would you like to use?',
        choices: [
          'Travis CI',
          'CircleCI',
          'I\'ll Use A Different One'
        ]
      }
    ];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;
      this.appname = _s.slugify(props.project);
      if (props.ghRepo) {
        this.props.repoSlug = props.ghRepo.match(/((git|ssh|http(s)?)|(git@[\w\.]+))(:(\/\/)?)([\w\.@\:\/\-~]+)(\.git)(\/)?/i)[7];
      }


      done();
    }.bind(this));
  },

  configuring: function () {
    if (path.basename(this.destinationPath()) !== this.appname) {
      this.log(
        armadillo('Making folder `' + this.appname + '` for you')
      );

      fs.ensureDirSync(this.appname);
      this.destinationRoot(this.destinationPath(this.appname));
    }

    this.config.save();

    // Editorconfig
    this.fs.copy(
      this.templatePath('editorconfig'),
      this.destinationPath('.editorconfig')
    );

    // Gitignore
    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore')
    );

    // NVMRC
    this.fs.copy(
      this.templatePath('nvmrc'),
      this.destinationPath('.nvmrc')
    );

    // Bower
    this.fs.copyTpl(
      this.templatePath('_bower.json'),
      this.destinationPath('bower.json'),
      { name: this.appname }
    );

    // Node
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      { name: this.appname }
    );
  },

  writing: function () {
    var _this = this;

    //////////////////////////////
    // Folders
    //////////////////////////////
    var folders = [
      'pages',
      'templates',
      'sass',
      'js',
      'images',
      'videos',
      'audio',
      'fonts',
      'documents'
    ];

    folders.forEach(function (folder) {
      _this.fs.copy(
        _this.templatePath('gitkeep'),
        _this.destinationPath(folder + '/.gitkeep')
      );
    });

    //////////////////////////////
    // Gulpfile
    //////////////////////////////
    this.fs.copy(
      this.templatePath('Gulpfile.js'),
      this.destinationPath('Gulpfile.js')
    );

    //////////////////////////////
    // README
    //////////////////////////////
    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      {
        name: this.props.project,
        deploy: this.props.ghPages,
        ci: this.props.cid !== 'I\'ll Use A Different One' ? this.props.cid : 'Continuous Delivery'
      }
    );

    //////////////////////////////
    // Deployment
    //////////////////////////////
    if (this.props.cid === 'Travis CI') {
      this.fs.copyTpl(
        this.templatePath('_travis.yml'),
        this.destinationPath('.travis.yml'),
        { deploy: this.props.ghPages }
      );
    } else if (this.props.cid === 'CircleCI') {
      this.fs.copyTpl(
        this.templatePath('_circle.yml'),
        this.destinationPath('circle.yml'),
        { deploy: this.props.ghPages }
      );
    }

    if (this.props.ghPages) {
      this.fs.copyTpl(
        this.templatePath('_deploy.sh'),
        this.destinationPath('.deploy.sh'),
        {
          repo: this.props.repoSlug,
          email: this.props.email,
          ci: this.props.cid !== 'I\'ll Use A Different One' ? this.props.cid : 'Continuous Delivery'
        }
      );
    }

    //////////////////////////////
    // Pages and Templates
    //////////////////////////////
    this.fs.copy(
      this.templatePath('pages'),
      this.destinationPath('pages')
    );

    this.fs.copyTpl(
      this.templatePath('_layout.html'),
      this.destinationPath('templates/_layout.html'),
      { name: this.props.project }
    );

    //////////////////////////////
    // JavaScript and Sass
    //////////////////////////////
    this.fs.copy(
      this.templatePath('app.js'),
      this.destinationPath('js/app.js')
    );

    this.fs.copy(
      this.templatePath('sass'),
      this.destinationPath('sass')
    );


  },

  install: function () {
    this.installDependencies();
  },

  end: function () {
    var done = this.async();
    var _this = this;
    // var signature;

    if (this.props.ghPages || this.props.gitInit) {
      // signature = NodeGit.Signature.now('Armadillo Generator', _this.props.email);

      NodeGit.Repository.init(path.resolve('./'), 0).then(function (repo) {
        NodeGit.Remote.create(repo, 'origin', _this.props.ghRepo);

        // return NodeGit.Treebuilder.create(repo).then(function (treebuilder) {

        // });

        // return repo.getCurrentBranch().then(function (branch) {
          // console.log(branch);


        // });

      // return repo.getHeadCommit().then(function (commit) {
      //   console.log('Commit: ' + commit);
      //   return repo.createBranch('master', commit, 0, repo.defaultSignature(), 'Create `master` on HEAD');
      // }).then(function(ref) {
      //   console.log('Ref: ' + ref);
      //   // return repo.createCommitOnHead(['.'], signature, signature, ':one: Initial Commit');
      // })

      // return NodeGit.Index.open(path.resolve('./')).then(function (index) {

      // });


      }).then(function () {
        _this.log(
          armadillo('All done!')
        );
        done();
      }).catch(function (e) {
        _this.log(e);
      });
    }
  }
});
