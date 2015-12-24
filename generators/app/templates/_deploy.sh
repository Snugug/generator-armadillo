#!/bin/bash

#########################
## Adapted from https://gist.github.com/domenic/ec8b0fc8ab45f39403dd
#########################
set -e # exit with nonzero exit code if anything fails

# Move to build folder and init it
cd .dist
git init

# Configure Git
git config user.name "<%= ci %>"
git config user.email "<%= email %>"

# Commit all the things into the repo
git add .
git commit -m ":shipit: Deploy to GitHub Pages"

# Force push to gh-pages
git push --force "https://${GH_TOKEN}@<%= repo %>.git" master:gh-pages > /dev/null 2>&1
