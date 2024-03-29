// src/mocks/handlers.js
import { graphql } from 'msw'

export const handlers = [
  // Handles a "Login" mutation
  /* graphql.mutation('Login', (req, res, ctx) => {
    const { username } = req.variables;
    sessionStorage.setItem('is-authenticated', username);
    return res(
      ctx.data({
        login: {
          username,
        },
      }),
    );
  }), */
  // Handles a "Pages" query
  graphql.query('Pages11', (req, res, ctx) => {
    const apiKey = req.headers.map.apikey
    if (
      !req.headers.map.apikey ||
      req.headers.map.apikey !== `${GRAPHQL_API_KEY}`
    ) {
      // When not authenticated, respond with an error
      return res(
        ctx.errors([
          {
            message: 'Not authenticated',
            errorType: 'AuthenticationError',
          },
        ])
      )
    }
    // When authenticated, respond with a query payload
    return res(
      ctx.data({
        readPages: {
          edges: [
            {
              node: {
                ID: '1',
                Title: 'Home-Mocked',
                ClassName: 'Site\\Pages\\HomePage',
                CSSClass: 'Site-Pages-HomePage',
                Summary:
                  "That's my personal website, I'm full-stack developer mostly specializing on SilverStipe backend projects and share some of my hobbies at this website.",
                Link: '/en/',
                URLSegment: 'home',
                Elements: {
                  edges: [
                    {
                      node: {
                        ID: '3',
                        Title: 'Slider',
                        Render:
                          '&lt;div\nid=&quot;e3&quot;\nclass=&quot;element site__elements__sliderelement\n\t\n\t&quot;\n&gt;\n\t&lt;div class=&quot;element-container container&quot;&gt;\n\t\t\n\n\n    &lt;div id=&quot;Carousel3&quot; class=&quot;carousel slide js-carousel&quot;&gt;\n        &lt;div class=&quot;carousel-inner&quot;&gt;\n            \n                &lt;div class=&quot;carousel-item carousel-item-Video carousel-item-nocontrols active&quot;&gt;\n                    &lt;div class=&quot;carousel-slide&quot;&gt;\n                        \n    \n        &lt;div class=&quot;video&quot;&gt;\n            &lt;iframe width=&quot;200&quot; height=&quot;113&quot; src=&quot;https://www.youtube.com/embed/IF1F_es1SaU?feature=oembed&amp;wmode=transparent&amp;enablejsapi=1&amp;disablekb=1&amp;iv_load_policy=3&amp;modestbranding=1&amp;rel=0&amp;showinfo=0&amp;autoplay=1&amp;mute=1&amp;loop=1&amp;playlist=IF1F_es1SaU&quot; allow=&quot;autoplay&quot; allow=&quot;autoplay&quot; frameborder=&quot;0&quot; allow=&quot;accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture&quot; allowfullscreen&gt;&lt;/iframe&gt;\n        &lt;/div&gt;\n    \n\n\n\n\n                    &lt;/div&gt;\n                &lt;/div&gt;\n            \n        &lt;/div&gt;\n    &lt;/div&gt;\n\n\n\t&lt;/div&gt;\n&lt;/div&gt;\n',
                      },
                    },
                    {
                      node: {
                        ID: '7',
                        Title: 'Categories List',
                        Render:
                          '&lt;div\nid=&quot;e7&quot;\nclass=&quot;element dnadesign__elementallist__model__elementlist\n\t\n\t&quot;\n&gt;\n\t&lt;div class=&quot;element-container container&quot;&gt;\n\t\t\n&lt;div class=&quot;list-element__container row&quot; data-listelement-count=&quot;3&quot;&gt;\n    \n    \n\t   &lt;div\nid=&quot;e9&quot;\nclass=&quot;element dynamic__elements__image__elements__elementimage\n\t\n\t  col-block col-md&quot;\n&gt;\n\t&lt;div class=&quot;element-container&quot;&gt;\n\t\t\n    &lt;div class=&quot;image-element__image height400 width400&quot;&gt;\n        &lt;img\n            src=&quot;data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7&quot;\n            data-lazy-src=&quot;/assets/Uploads/ElementImage/1609765749853__FillWzQwMCw0MDBd.jpg&quot; class=&quot;img-responsive&quot; alt=&quot;Aquascaping&quot;\n        /&gt;\n    &lt;/div&gt;\n\n\n\n&lt;div class=&quot;image-element__caption img-content&quot;&gt;\n    &lt;h3 class=&quot;image-element__title title&quot;&gt;Aquascaping&lt;/h3&gt;\n\n    \n&lt;/div&gt;\n\n\n\n    &lt;a href=&quot;/en/aquascaping/&quot; class=&quot;stretched-link&quot;&gt;\n        &lt;b class=&quot;sr-only&quot;&gt;Aquascaping&lt;/b&gt;\n    &lt;/a&gt;\n\n\n\t&lt;/div&gt;\n&lt;/div&gt;\n\n    \n\t   &lt;div\nid=&quot;e10&quot;\nclass=&quot;element dynamic__elements__image__elements__elementimage\n\t\n\t  col-block col-md&quot;\n&gt;\n\t&lt;div class=&quot;element-container&quot;&gt;\n\t\t\n    &lt;div class=&quot;image-element__image height400 width400&quot;&gt;\n        &lt;img\n            src=&quot;data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7&quot;\n            data-lazy-src=&quot;/assets/Uploads/ElementImage/1609766816754__FillWzQwMCw0MDBd.jpg&quot; class=&quot;img-responsive&quot; alt=&quot;Car Projects&quot;\n        /&gt;\n    &lt;/div&gt;\n\n\n\n&lt;div class=&quot;image-element__caption img-content&quot;&gt;\n    &lt;h3 class=&quot;image-element__title title&quot;&gt;Car Projects&lt;/h3&gt;\n\n    \n&lt;/div&gt;\n\n\n\n    &lt;a href=&quot;/en/car/&quot; class=&quot;stretched-link&quot;&gt;\n        &lt;b class=&quot;sr-only&quot;&gt;Car Projects&lt;/b&gt;\n    &lt;/a&gt;\n\n\n\t&lt;/div&gt;\n&lt;/div&gt;\n\n    \n\t   &lt;div\nid=&quot;e12&quot;\nclass=&quot;element dynamic__elements__image__elements__elementimage\n\t\n\t  col-block col-md&quot;\n&gt;\n\t&lt;div class=&quot;element-container&quot;&gt;\n\t\t\n    &lt;div class=&quot;image-element__image height400 width400&quot;&gt;\n        &lt;img\n            src=&quot;data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7&quot;\n            data-lazy-src=&quot;/assets/Uploads/ElementImage/Screenshot-from-2021-01-04-20-30-19__FillWzQwMCw0MDBd.png&quot; class=&quot;img-responsive&quot; alt=&quot;Programming&quot;\n        /&gt;\n    &lt;/div&gt;\n\n\n\n&lt;div class=&quot;image-element__caption img-content&quot;&gt;\n    &lt;h3 class=&quot;image-element__title title&quot;&gt;Programming&lt;/h3&gt;\n\n    \n&lt;/div&gt;\n\n\n\n    &lt;a href=&quot;/en/development/&quot; class=&quot;stretched-link&quot;&gt;\n        &lt;b class=&quot;sr-only&quot;&gt;Programming&lt;/b&gt;\n    &lt;/a&gt;\n\n\n\t&lt;/div&gt;\n&lt;/div&gt;\n\n    \n\n\n&lt;/div&gt;\n\n\t&lt;/div&gt;\n&lt;/div&gt;\n',
                      },
                    },
                    {
                      node: {
                        ID: '4',
                        Title: "Hello, I'm Tony Air",
                        Render:
                          '&lt;div\nid=&quot;e4&quot;\nclass=&quot;element dnadesign__elemental__models__elementcontent\n\t\n\t&quot;\n&gt;\n\t&lt;div class=&quot;element-container container&quot;&gt;\n\t\t&lt;div\nclass=&quot;content-element__content&quot;\n&gt;\n    \n\t\n        &lt;h2 class=&quot;content-element__title&quot;&gt;Hello, I&amp;#039;m Tony Air&lt;/h2&gt;\n    \n\n    &lt;div class=&quot;typography&quot;&gt;\n        &lt;p&gt;That&#039;s my personal website, I&#039;m full-stack developer mostly specializing on SilverStipe backend projects and share some of my hobbies at this website.&lt;br&gt;&lt;br&gt;As for the things I do for work:&lt;br&gt;&lt;br&gt;Here&#039;s front-end UI kit:&amp;nbsp;&lt;a rel=&quot;noopener&quot; href=&quot;https://github.com/a2nt/webpack-bootstrap-ui-kit&quot; target=&quot;_blank&quot;&gt;https://github.com/a2nt/webpack-bootstrap-ui-kit&lt;/a&gt;&lt;br&gt;Here&#039;s SilverStipe quick start template:&amp;nbsp;&lt;a rel=&quot;noopener&quot; href=&quot;https://github.com/a2nt/silverstripe-webpack&quot; target=&quot;_blank&quot;&gt;https://github.com/a2nt/silverstripe-webpack&lt;/a&gt;&lt;br&gt;&lt;br&gt;More at my github:&amp;nbsp;&lt;a rel=&quot;noopener&quot; href=&quot;https://github.com/a2nt&quot; target=&quot;_blank&quot;&gt;https://github.com/a2nt&lt;/a&gt;&lt;/p&gt;\n    &lt;/div&gt;\n\n    \n&lt;/div&gt;\n\n\t&lt;/div&gt;\n&lt;/div&gt;\n',
                      },
                    },
                  ],
                  pageInfo: {
                    hasNextPage: false,
                    hasPreviousPage: false,
                    totalCount: 3,
                  },
                },
              },
            },
          ],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            totalCount: 1,
          },
        },
      })
    )
  }),
]
