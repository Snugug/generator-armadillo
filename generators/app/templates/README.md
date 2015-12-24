# <%= name %>

```
               ,.-----__
            ,:::://///,:::-.
          /:''/////// ``:::`;/|/     .-----.
         /'   ||||||     :://'`\     | Hi! |
        .' ,   ||||||     `/(  e \   /-----'
  -===~__-'\__X_`````\_____/~`-._ `.
              ~~        ~~       `~-'
```

Welcome to your new awesome [Armadillo](https://github.com/Snugug/gulp-armadillo) powered website! For more in-depth documentation, check out its website.

All of the Armadillo's [Basic Commands](https://github.com/Snugug/gulp-armadillo#basic-armadillo-commands) can be run by prepending `npm run` to them if you don't have Gulp globally installed, so if you wanted to run your Armadillo's development command, you can run `npm run gulp`.
<% if (deploy) { %>
## Deploying to GitHub Pages

Almost everything is set up for your Armadillo to deploy your site to [GitHub Pages](https://pages.github.com/). You need to create an [personal access token](https://help.github.com/articles/creating-an-access-token-for-command-line-use/) with the [`repo`](https://developer.github.com/v3/oauth/#scopes) scope. Keep this a secret! It's what lets Armadillo write to your `gh-pages` branch and deploy for you! Once you've got your token, in your <% if (ci === 'Travis CI') { %>[Travis CI environment variables](https://docs.travis-ci.com/user/environment-variables/#Defining-Variables-in-Repository-Settings)<%}%><% if (ci === 'CircleCI') { %>[CircleCI environment variables](https://circleci.com/docs/environment-variables#setting-environment-variables-for-all-commands-without-adding-them-to-git)<%}%><% if (ci === 'I\'ll Use A Different One') { %>CI's environment variables<%}%>, add a `GH_TOKEN` variable and set it to your token. Be sure to enable your GitHub repo from <% if (ci === 'I\'ll Use A Different One') { %>your CI system<% } else { %><%= ci %><% } %>!
<% } %>
