import React, { Component } from "react";
import "../Styles.css";
import axios from "axios";

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      results: {},
      loading: false,
      message: "",
    };
    this.cancel = "";
  }

  fetchSearchResults = (updatedPageNo = "", query) => {
    const pageNumber = updatedPageNo ? `&page=${updatedPageNo}` : "";
    const searchUrl = `https://pixabay.com/api/?key=24362114-e0ad0e6a01f5890a070298a0c&q=${query}${pageNumber}`; // url which we want to hit while searching

    if (this.cancel) {
      // Cancel the previous request before making a new request
      this.cancel.cancel();
    }

    // Create a new CancelToken
    this.cancel = axios.CancelToken.source();

    axios
      .get(searchUrl, {
        cancelToken: this.cancel.token,
      })
      .then((res) => {
        const resultNotFoundMsg = !res.data.hits.length
          ? "There is not more search results, try new search"
          : "";
        console.log("searchresutlts", res.data);
        this.setState({
          results: res.data.hits,
          message: resultNotFoundMsg,
          loading: false,
        });
      })
      .catch((error) => {
        if (axios.isCancel(error) || error) {
          this.setState({
            loading: false,
            message: "failed to fetch the data",
          });
        }
      });
  };

  handleOnInputChange = (event) => {
    const query = event.target.value;
    this.setState({ query: query, loading: true, message: "" }, () => {
      this.fetchSearchResults(1, query);
    });
  };

  renderSearchResults = () => {
    const { results } = this.state;

    if (Object.keys(results).length && results.length) {
      return (
        <div>
          {results.map((result) => {
            return <h1>{result.user}</h1>;
          })}
        </div>
      );
    }
  };

  render() {
    const { query } = this.state;
    return (
      <div className="container">
        {/* Heading */}
        <h2 className="heading">Live Search React Application</h2>

        {/* Search-Input */}
        <label className="search-label" htmlFor="search-input">
          <input
            type="text"
            name="query"
            value={query}
            id="search-input"
            placeholder="Search..."
            onChange={this.handleOnInputChange}
          />
          <i class="fa fa-search search-icon" aria-hidden="true"></i>
        </label>

        {this.renderSearchResults()}
      </div>
    );
  }
}
