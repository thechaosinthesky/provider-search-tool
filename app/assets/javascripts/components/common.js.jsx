class Loader extends React.Component {
  render() {
    let loaderEl;
    if(this.props.small){
      loaderEl = <span className="loader loader-sm"><span>Loading...</span></span>;
    }
    else{
      loaderEl = <div className="loader"><span>Loading...</span></div>;
    }

    return (
      <span>{loaderEl}</span>
    )
  }
}

class About extends React.Component {
  render() {
    const aboutClassName = "about-container";

    return(
      <div className={aboutClassName}>
        <p>
          Enter a National Provider Identifier (NPI) to search the National Plan and Provider Enumeration System (NPPES).
        </p>
        <p>
          If you do not know the NPI, click on the "Advanced Search" tab to search by name.
        </p>
      </div>
    )
  }
}
