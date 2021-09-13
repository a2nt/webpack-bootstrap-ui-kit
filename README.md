# webpack-bootstrap-ui-kit

Webpack Bootstrap 5 UI Kit

This UI Kit allows you to build Bootstrap 5 webapp with some extra UI features.
It's easy to extend and easy to convert HTML templates to CMS templates.

Note: I prefer using vanilla JS with minimal external dependencies to reach higher loading speed.
There's no jQuery and no React, but it can be connected optionally.

# Demo

https://rawcdn.githack.com/a2nt/webpack-bootstrap-ui-kit/master/dist/index.html

# Quick Start

## Requirements:

-   node
-   yarn
-   pnpm package manager

https://pnpm.js.org/en/installation

Note: You can use npm package manager, but this one will save your disc space. Replace pnpm commands with npm if you prefer npm

## Clone and setup quick start repository:

git clone https://github.com/a2nt/webpack-bootstrap-ui-kit-quick-start.git

cd ./webpack-bootstrap-ui-kit-quick-start

pnpm install

## Edit files at ./src

## Start development server at http://127.0.0.1:3001

yarn start

Define your GraphQL mocks at src/mocks/handlers.js

## Build your files to ./dist:

yarn build

## Directory structure

src/ - your sources

-- src/scss/\_variables.scss - specific app variables

-- src/scss/\_layout.scss - specific app style

-- src/html - HTML templates

-- src/js/\_events.js - app events definitions

-- src/js/\_layout.js - app events definitions

-- src/js/\_components - ui components

-- src/img - some example images

dist/ - compiled scipts after "yarn build"

You can open dist/index.html to see demo
