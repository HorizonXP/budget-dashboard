import React from 'react';
import Helmet from 'react-helmet';
import { Grid, Col, Row, Input, Button } from 'react-bootstrap';

class Login extends React.Component {
  state = {
    username: '',
    password: ''
  };
  handleChange = () => {
    this.setState({
      username: this.refs.username.getValue(),
      password: this.refs.password.getValue()
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
  }
  render() {
    return (
      <Grid>
        <Helmet
          title="Login"
        />
        <form method="POST" className="form-login">
          <h2 className="form-login-heading">
            Login
          </h2>
          <Input type="text" placeholder="User Name" value={this.state.username} label="User Name" ref="username" name="username" labelClassName="sr-only" required autofocus onChange={this.handleChange} /> 
          <Input type="password" placeholder="Password" value={this.state.password} label="Password" ref="password" name="password" labelClassName="sr-only" required onChange={this.handleChange} /> 
          <Button type="submit" bsStyle="primary" bsSize="large" block >Login</Button>
        </form>
      </Grid>
    );
  }
}

export default Login;
