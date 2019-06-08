# webpack-bootstrap-ui-kit
Webpack Bootstrap 4 UI Demo

This UI Kit allows you to build Bootstrap 4 webapp with some extra UI features.
It's easy to extend and easy to convert HTML templates to CMS templates.

# Demo
https://rawcdn.githack.com/a2nt/cropper-image-mask/master/dist/index.html

## Usage
Install required modules using:
npm install

Start development server:
yarn start

Access development server at:
http://127.0.0.1:8001

Build your cropper script:
yarn build

## Directory structure
src/ - your sources

-- src/scss/_variables.scss - specific app variables

-- src/scss/_layout.scss - specific app style


-- src/html - HTML templates

-- src/js/_events.js - app events definitions

-- src/js/_layout.js - app events definitions

-- src/js/_components - ui components


-- src/img - some example images


dist/ - compiled scipts after "yarn build"

You can open dist/index.html to see demo
