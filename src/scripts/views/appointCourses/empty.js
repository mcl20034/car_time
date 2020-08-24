import React from "react";

class Empty extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // this.props.history.push("/companySuccess");
    this.props.history.push("/company");
  }

  render() {
    return <div className="app" />;
  }
}

export default Empty;
