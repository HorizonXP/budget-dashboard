import React from 'react';

class SignedOut extends React.Component {
  render() {
    return (
      <div>
        <h2>Signed Out</h2>
        {this.props.children}
      </div>
    );
  }
}

export default SignedOut;
