/* eslint-disable no-console, no-use-before-define */
import Express from 'express';
import Helmet from 'react-helmet';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../webpack.config';

import createStore from '../common/redux/store/createStore';
import getRoutes from '../common/routes';

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { ReduxRouter } from 'redux-router';
import { reduxReactRouter, match } from 'redux-router/server';
import bodyParser from 'body-parser';
import qs from 'query-string';
import getStatusFromRoutes from '../common/helpers/getStatusFromRoutes';
import ApiClient from '../common/helpers/ApiClient.js';
import fetch from 'node-fetch';
import { toJSON } from 'transit-immutable-js';
import cookieParser from 'cookie-parser';
import cookie from 'redux-effects-cookie';
import {Map} from 'immutable';

global.__CLIENT__ = false;
global.__SERVER__ = true;

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

app.use(cookieParser())

app.use(function(req, res, next) {
  const cookieMiddleware = cookie(req.cookies);
  req.store = createStore(reduxReactRouter, getRoutes, createMemoryHistory, cookieMiddleware);
  req.store.dispatch(match(req.originalUrl, (error, redirectLocation, routerState) => {
    if (redirectLocation) {
      return res.redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (error) {
      return res.status(500).send("Server Error: " + '<br/>' + error.stack);
    } else if (!routerState) {
      // 404
      return res.status(404).send("Page not found.");
    } else {
      if (routerState.location.search && !routerState.location.query) {
        routerState.location.query = qs.parse(routerState.location.search);
      }

      req.store.getState().router.then(() => {
        const componentInstance = (
          <Provider store={req.store} key="provider">
            <ReduxRouter/>
          </Provider>
        );
        const status = getStatusFromRoutes(routerState.routes);
        if (status) {
          res.status(status);
        }

        let html = "<!DOCTYPE html>";
        html += ReactDOMServer.renderToString(componentInstance);
        const clientInitialState = req.store.getState();
        let head = Helmet.rewind();
        let newHead = `
            ${head.meta}
            <title>${head.title}</title>
            ${head.link}
            <script>
              window.__INITIAL_STATE__ = '${toJSON(clientInitialState)}';
            </script>
          </head>
        `;
        html = html.replace('</head>', newHead);
        res.send(html);
      }).catch((err) => console.log(err));
    }
  }));
});

const server = app.listen(port, address, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`);
  }
});
