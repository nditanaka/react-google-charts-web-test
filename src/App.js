import React from "react";
import { Chart } from "react-google-charts";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { meta_data: "", data: "", loading: false, ordered_data: "" };

    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  create(e) {
    // add entity - POST
    fetch(
      "https://alpha-vantage.p.rapidapi.com/query?function=TIME_SERIES_DAILY&symbol=MSFT&outputsize=compact&datatype=json",
      {
        method: "GET",
        headers: {
          "x-rapidapi-key":
            "6f5b9f441emshcd8afd19c0a6937p149efbjsn1bbf00d56d49",
          "x-rapidapi-host": "alpha-vantage.p.rapidapi.com"
        }
      }
    )
      .then((response) => response.json())
      .then((JSON) =>
        this.setState({
          meta_data: JSON["Meta Data"],
          data: JSON["Time Series (Daily)"],
          loading: false
        })
      )
      // ohlvc => loch
      .then((response) =>
        this.setState({
          ordered_data: this.reshapedata()
        })
      )
      .then((response) => {
        // console.log(this.state.meta_data);
        console.log(this.state.data);
        console.log(this.state.ordered_data);
        // console.log(Object.entries(this.state.ordered_data[1][1]));
      })
      .catch((err) => {
        console.error(err);
      });
    e.preventDefault();
  }
  update(e) {
    // update entity - PUT
    e.preventDefault();
  }

  delete(e) {
    // delete entity - DELETE
    e.preventDefault();
  }

  handleChange(changeObject) {
    this.setState(changeObject);
  }

  reshapedata() {
    // console.log(Object.entries(this.state.ordered_data[1][1]));

    let data_list = this.state.data;
    let data_rearranged_h = [];
    for (let key in data_list) {
      let item_list = [];
      item_list.push(key); // date
      item_list.push(data_list[key]["1. open"]);
      item_list.push(data_list[key]["2. high"]);
      item_list.push(data_list[key]["3. low"]);
      item_list.push(data_list[key]["4. close"]);
      item_list.push(data_list[key]["5. volume"]);
      data_rearranged_h.push(item_list);
    }

    return data_rearranged_h;
  }
  render() {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <h1 className="display-4 text-center">API Call to Alpha Vantage</h1>
            <form className="d-flex flex-column">
              <Chart
                width={"100%"}
                height={350}
                chartType="CandlestickChart"
                loader={<div>Loading Chart</div>}
                data={[
                  ["day", "a", "b", "c", "d"],
                  ["Mon", 20, 28, 38, 45],
                  ["Tue", 31, 38, 55, 66],
                  ["Wed", 50, 55, 77, 80],
                  ["Thu", 77, 77, 66, 50],
                  ["Fri", 68, 66, 22, 15]
                ]}
                options={{
                  legend: "none"
                }}
                rootProps={{ "data-testid": "1" }}
              />
              <legend className="text-center">
                Update with the latest charts
              </legend>

              <button
                className="btn btn-info"
                type="button"
                onClick={(e) => this.create(e)}
              >
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
