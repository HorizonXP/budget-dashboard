import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

@connect(state => ({ routerState: state.router }))
class App extends React.Component {
  static propTypes = {
    children: PropTypes.node
  }

  static contextTypes = {
    store: PropTypes.object
  }

  render() {
    return (
      <html lang="en">
        <head>
        </head>
        <body>
          <Helmet
            title="Household Budget Dashboard"
            titleTemplate="Household Budget Dashboard - %s"
            meta={[
              {"charset": "utf-8"},
              {"http-equiv": "X-UA-Compatible", "content": "IE=edge"},
              {"name": "viewport", "content": "width=device-width, initial-scale=1"}
            ]}
            link={[
              {"href": "/static/css/bootstrap.min.css", "rel": "stylesheet"},
              {"href": "/static/css/bootstrap-theme.min.css", "rel": "stylesheet"},
              {"href": "/static/css/font-awesome.min.css", "rel:": "stylesheet"},
              {"href": "/static/css/common.css", "rel": "stylesheet"}
            ]}
          />
          {this.props.children}
          <script src="/static/js/jquery-2.1.4.min.js"></script>
          <script src="/static/js/bootstrap.min.js"></script>
          <script src="/static/js/bundle.js"></script>
        </body>
      </html>
    );
  }
}

export default App;
/*
*/
