import React from 'react';
import Helmet from 'react-helmet';

class Home extends React.Component {
  render() {
    return (
      <div>
        <Helmet
          title="Home"
        />
        <p className="lead">Home</p>
      </div>
    );
  }
}

export default Home;
