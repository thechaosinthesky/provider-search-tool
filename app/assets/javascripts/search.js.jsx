class AdvancedSearchView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  render() {
    return (
      <div>
        TBD
      </div>
    )
  }
}

class ResultTableRow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const address = this.props.attrs.addresses[0];
    const taxonomy = this.props.attrs.taxonomies[0];
    let name = this.props.attrs.basic.first_name + " " + this.props.attrs.basic.last_name;
    if (this.props.attrs.basic.credential && this.props.attrs.basic.credential.length > 0) name += ", " + this.props.attrs.basic.credential;

    return(
      <tr>
        <td>
          <div className="row">
            <div className="col-md-12">
              {this.props.attrs.number}
            </div>
          </div>
        </td>
        <td>
          <div className="row">
            <div className="col-md-12">
              <strong>{name}</strong>
            </div>
          </div>
        </td>
        <td>
          <div className="row">
            <div className="col-md-12">
              <address>
                {address.address_1},<br />
                {address.city}, {address.state} {address.postal_code}<br />
                <abbr title="Phone"><strong>P:</strong></abbr> {address.telephone_number}
              </address>
            </div>
          </div>
        </td>
        <td>
          <div className="row">
            <div className="col-md-12">
              {taxonomy.desc}
            </div>
          </div>
        </td>
        <td>
          <div className="row">
            <div className="col-md-12">
              {taxonomy.code}
            </div>
          </div>
        </td>
        <td>
          <div className="row">
            <div style={{paddingLeft: "20px"}} className="col-md-12">
              <button onClick={(e) => this.props.onRemoveClicked(e, this.props.index)} className="btn btn-outline-danger btn-circle btn-sm mt-4"><i className="fa fa-close"></i></button>
            </div>
          </div>
        </td>
      </tr>
    )
  }
}

class ResultsTableFooter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const colCount = 5;

    if(this.props.results && this.props.results.length > 0){
      const providerText = this.props.results.length > 1 ? "providers" : "provider";

      return(
        <tfoot>
          <tr>
            <td colSpan={this.props.colCount}>
              Showing <strong>{this.props.results.length}</strong> {providerText}.
              <a onClick={(e) => this.props.onClearClicked(e)} className="link-danger pull-right"><i style={{marginRight: "10px"}} className="fa fa-trash"></i>Clear Results</a>
            </td>
          </tr>
        </tfoot>
      )
    }
    else{
      return(
        <tfoot>
          <tr>
            <td colSpan={this.props.colCount}>There are no results to show.</td>
          </tr>
        </tfoot>
      )
    }
  }
}

class ResultsView extends React.Component {
  constructor(props) {
    super(props);
  }

  // onRemoveClicked() {
  //   console.log("CLICKED");
  //
  //   // this.props.onRemoveClicked();
  // }

  render() {
    if(this.props.loading){
      return (
        <Loader />
      )
    }
    else{
      const tableClassName = "table table-striped";
      let tableBody;
      const resultList = this.props.results.map((result, index) =>
        <ResultTableRow onRemoveClicked={this.props.onRemoveClicked} key={result.number} index={index} attrs={result} />
      );
      tableBody = <tbody>{resultList}</tbody>;

      return (
        <div className="mt-3 mb-3">
          <h3>Providers</h3>

          <table className={ tableClassName }>

            <thead>
              <tr>
                <th>NPI</th>
                <th>Name</th>
                <th>Address</th>
                <th>Type</th>
                <th>Taxonomy</th>
                <th></th>
              </tr>
            </thead>

            {tableBody}

            <ResultsTableFooter onClearClicked={this.props.onClearClicked} colCount={6} results={this.props.results} />

          </table>
        </div>
      );
    }
  }
}

class SearchView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      number: "",
      valid: true,
      results: props.results,
      searchUrl: NPDASH.rootUrl + "/providers/search"
    };

    this.formRef = React.createRef();
  }

  handleSubmit(event) {
    event.preventDefault();

    const isValid = this.validate();
    this.formRef.current.checkValidity();
    if(isValid){
      this.setState({loading: true});

      const obj = {
        number: this.state.number
      };

      // const url = this.state.url ?
      const that = this;
      $.ajax({
        url: this.state.searchUrl,
        method: "GET",
        contentType: "application/json",
        dataType: "json",
        data: obj,
        success: function(res){
          that.setState({loading: false});
          if(res.results){
            if(res.results.length > 0){
              that.addResult(res.results[0]);
            }
            else{
              NPDASH.showAlert("No provider found for this NPI number.", "warning");
            }
          }
        },
        error: function(){
          that.setState({loading: false});
          NPDASH.showAlert("Something went wrong, please try again", "danger");
        }
      });
    }
  }

  validate() {
    let isValid = true;
    let checkNumber = "";

    if(this.state.number) checkNumber = $.trim(this.state.number);
    isValid = (isValid && (checkNumber.length > 0));
    isValid = (isValid && (checkNumber.length == 10));

    this.setState({valid: isValid});
    return isValid;
  }

  handleNumberChange(event) {
    this.setState({number: event.target.value});
  }

  addResult(result) {
    // First sanity check for a valid result with number
    if(result.number){
      var results = this.state.results;
      var dupFound = false;
      var dupIndex = 0;

      // Find the index of any duplicate
      for(var i = 0; i < results.length; i++){
        var checkResult = results[i];
        if(!dupFound){
          dupFound = (checkResult.number == result.number);
          if (dupFound) dupIndex = i;
        }
      }

      // Remove duplicate before adding to the front of the array
      if(dupFound){
        results.splice(dupIndex, 1);
      }

      results.unshift(result);
      this.setState({results: results});
      NPDASH.bin.set(results);
    }
  }

  removeResult(e, i) {
    e.preventDefault();

    var results = this.state.results;
    results.splice(i, 1);
    this.setState({results: results});
    NPDASH.bin.set(results);
  }

  clearResults(e) {
    e.preventDefault();

    if(confirm("Are you sure you would like to clear all search results?")){
      const results = [];
      this.setState({results: results});
      NPDASH.bin.set(results);
    }
  }

  render() {
    const requiredInputClassName = this.state.valid ? "form-control form-control-lg" : "form-control form-control-lg is-invalid";

    return (
      <div className="row mt-3 mb-5">
        <div className="col">

          <div className="row">
            <div className="col-10 offset-1">
              <form ref={this.formRef}>
                <div className="row g-3">
                  <div className="col-8">
                    <input required type="text" name="number" id="number" className={requiredInputClassName} value={this.state.number} onChange={(e) => {this.handleNumberChange(e)}} placeholder="National Provider Identifier (NPI)" />
                    <div className="invalid-feedback">
                      Please enter a 10 digit NPI
                    </div>
                  </div>
                  <div className="col">
                    <button onClick={(e) => this.handleSubmit(e)} className="btn btn-primary btn-lg">SEARCH</button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="row">
            <div className="col-10 offset-1">
              <ResultsView onRemoveClicked={this.removeResult.bind(this)} onClearClicked={this.clearResults.bind(this)} loading={this.state.loading} results={this.state.results} />
            </div>
          </div>
        </div>

        <br/><br/>
      </div>
    )
  }
}

NPDASH.VIEWS.search = {
  init: function(){
    var results = NPDASH.bin.get();
    results = results || [];

//  NPDASH.bin.set([]);

    ReactDOM.render(
     <SearchView results={results} />,
     document.getElementById("search-component")
    );
  }
};

NPDASH.VIEWS.advancedSearch = {
  init: function(){
     ReactDOM.render(
       <AdvancedSearchView />,
       document.getElementById("advanced-component")
     );
  }
};
