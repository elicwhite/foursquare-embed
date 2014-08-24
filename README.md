This enables you to embed Foursquare venue widgets into your website

foursquare-embed
=====
foursquare-embed enables you to embed foursquare venue cards on your website or blog.

## Usage
Add an iframe to your page with a src of `http://thesavior.github.io/foursquare-embed/embed.html?venue=VENUEID`:

    <iframe
    src="http://thesavior.github.io/foursquare-embed/embed.html?venue=412d2800f964a520df0c1fe3"
    height="142"
    scrolling="no"
    frameborder="0"
    allowtransparency="true"
    class="fsq-venue"
    title="Embedded Venue">
    </iframe>

and style the iframe however you'd like to match your page.

Check out `/index.html` for more examples.

## Contribute

### Setup
The project is designed to provide a server that hosts the iframe embed as well as the demo page. During development the scripts, styles, and html are separate and there is a build step to minify and inline the scripts.

To get setup locally, clone the project and run `npm install`. Once that is complete, start the server with `foreman start` (requires foreman) or `node server.js`. Then run `grunt dev` to enable the development build system which will also watch for file changes and trigger livereload.

To create a production build, make sure grunt watch is not running, and then run `grunt`.

### Guidelines
The goal with foursquare-embed is to provide a balance between ease of use and being lightweight and speedy. You won't find jQuery here. Cross browser compatability is still important.
