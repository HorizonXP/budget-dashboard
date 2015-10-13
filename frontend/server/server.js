/* eslint-disable no-console, no-use-before-define */
import Express from 'express';
import Helmet from 'react-helmet';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../webpack.config';

import configureStore from '../common/store/configureStore';
import initializeRoutes from '../common/routes';

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { createMemoryHistory } from 'history';
import { match } from 'react-router';
import { Provider } from 'react-redux';
import { ReduxRouter } from 'redux-router';
import bodyParser from 'body-parser';

const app = new Express();
const port = 3000;
const address = '0.0.0.0';

// Use this middleware to set up hot module reloading via webpack.
const compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

//expose public folder as static assets
app.use('/static', Express.static(__dirname + '/../static'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function(req, res, next) {
  const location = createMemoryHistory().createLocation(req.url);
  const initialState = undefined;
  const store = configureStore(initialState, createMemoryHistory);
  const routes = initializeRoutes(store);
  match( { routes, location }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      return res.redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (error) {
      return res.status(500).send("Server Error: " + '<br/>' + error.stack);
    } else if (renderProps === null) {
      // 404
      return res.status(404).send("Page not found.");
    } else {
      const componentInstance = (
        <Provider store={store}>
          <ReduxRouter>
            { routes }
          </ReduxRouter>
        </Provider>
      );
      var html = "<!DOCTYPE html>";
      html += ReactDOMServer.renderToString(componentInstance);
      const clientInitialState = store.getState();
      let head = Helmet.rewind();
      let newHead = `
          ${head.meta}
          <title>${head.title}</title>
          ${head.link}
          <script>
            window.__INITIAL_STATE__ = ${JSON.stringify(clientInitialState)};
          </script>
        </head>
      `;
      html = html.replace('</head>', newHead);
      res.send(html);
    }
  });
});

const server = app.listen(port, address, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`);
  }
});
