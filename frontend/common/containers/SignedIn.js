import React from 'react';

class SignedIn extends React.Component {
  render() {
    return (
      <div>
        <h2>Signed In</h2>
        {this.props.children}
      </div>
    );
  }
}

export default SignedIn;
