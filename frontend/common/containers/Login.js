import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { Grid, Col, Row, Input, Button, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as userActions from '../redux/reducers/user';

@connect(
  state => ({user: state.user}),
  userActions)
export default class Login extends Component {
  static propTypes = {
    user: PropTypes.object,
    auth: PropTypes.object,
    login: PropTypes.func,
    logout: PropTypes.func
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const username = this.refs.username.getValue();
    const password = this.refs.password.getValue();
    this.props.login(username, password);
  }

  render() {
    const { logout } = this.props;
    const loggedIn = this.props.user.has('loggedIn') ? this.props.user.get('loggedIn') : false;
    const user = this.props.user.get('user');
    const loggingIn = this.props.user.has('loggingIn') ? this.props.user.get('loggingIn') : false
    const loggingOut = this.props.user.has('loggingOut') ? this.props.user.get('loggingOut') : false
    const loginBtnText = loggingIn ? " Logging in..." : " Login";
    const logoutBtnText = loggingOut ? " Logging out..." : " Logout";
    const loadError = this.props.user.has('error') ? this.props.user.get('error') : undefined;
    const loginError = this.props.user.has('loginError') ? this.props.user.get('loginError') : undefined;
    const logoutError = this.props.user.has('logoutError') ? this.props.user.get('logoutError') : undefined;

    return (
      <Grid>
        { !loggedIn &&
          <div>
            <Helmet
              title="Login"
            />
            <form method="POST" className="form-login" onSubmit={!loggingIn ? this.handleSubmit : null} >
              <h2 className="form-login-heading">
                Login
              </h2>
              <Input type="text" placeholder="User Name" label="User Name" ref="username" name="username" labelClassName="sr-only" required autofocus /> 
              <Input type="password" placeholder="Password" label="Password" ref="password" name="password" labelClassName="sr-only" required /> 
              <Button type="submit" bsStyle="primary" bsSize="large" disabled={loggingIn ? true : false} block >
                {loggingIn ? <i className="fa fa-spin fa-circle-o-notch" /> : <i className="fa fa-sign-in" />}
                {loginBtnText}
              </Button>
              { loginError !== undefined &&
                <Alert bsStyle="danger">{loginError.non_field_errors[0]}</Alert>
              }
              { loadError !== undefined &&
                <Alert bsStyle="danger">{loadError.detail}</Alert>
              }
            </form>
          </div>
        }
        { loggedIn &&
          <div>
            <Helmet
              title="Logout"
            />
            <h2 className="form-login-heading">
              Logout
            </h2>
            <p> You are currently logged in as {user.username}. </p>
            <Button bsStyle="danger" bsSize="large" onClick={!loggingOut ? logout : null} disabled={loggingOut} >
              {loggingOut ? <i className="fa fa-spin fa-circle-o-notch" /> : <i className="fa fa-sign-out" />}
              {logoutBtnText}
            </Button>
            { logoutError !== undefined &&
              <Alert bsStyle="danger">There was an error while logging you out.</Alert>
            }
          </div>
        }
      </Grid>
    );
  }
}
