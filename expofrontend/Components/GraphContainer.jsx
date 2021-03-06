import React, { Component } from "react";
import { StyleSheet, View, ScrollView } from "react-native";

import Loading from "../Functions/Spinner";

import settings from "../Settings/config";
import { apiContent } from "../Functions/WeatherRequests";
import { WeatherGraph } from "../Components/WeatherGraph";

export class ChartContainer extends Component {
  state = {
    weatherList: [],
    error: false,
    loading: true,
  };

  // trigger every 900.000 miliseconds (15 minutes)
  componentDidMount() {
    this.fetchWeather();
  }

  render() {
    // fetch data, generate datasets for graphs
    // instantiate cards with graphs
    if (this.state.loading) {
      //loading indicator spinner
      return <Loading />;
    } else {
      const labels = generateLabels("dateutc", this.state.weatherList);

      //full json time string is too much text for lables. extract hour,min.
      // CONVERT TO CURRENT TIME FROM UTC, HANDLE TZ+DST
      const reducedLables = generateLabels(
        "dateutc",
        this.state.weatherList
      ).map((label) => this.LabelCreate(label));

      // define workload for graph generation
      // all the graphs are determined here and autogenerated.
      // this is based on the api request json key names as are localization.
      let unitOfWork = [
        "tempf,windchillf",
        "dewptf,",
        "dailyrainin",
        "humidity,",
        "baromin,",
        "windspeedmph,windgustmph",
        "winddir,",
        "solarradiation,",
      ];

      let graphs = []; // init array of generated graphs to display
      //generate legend labels
      for (let i = 0; i < unitOfWork.length; i++) {
        let listOfGraph = unitOfWork[i].split(",");
        let legend = [];
        for (let i = 0; i < listOfGraph.length; i++) {
          if (listOfGraph[i].length > 0) {
            legend.push(this.props.strings.weather[listOfGraph[i]]);
          }
        }

        //push graph to array
        graphs.push(
          <WeatherGraph
            legend={legend}
            labels={reducedLables}
            primaryData={generateDatasets(
              listOfGraph[0],
              this.state.weatherList
            )}
            secondaryData={generateDatasets(
              listOfGraph[1],
              this.state.weatherList
            )}
            yLabel={""}
            key={i}
          />
        );
      }

      // print graphs
      return <View style={graphstyles.container}>{graphs}</View>;
    }
  }
  //return every even hour in which an observation was made.
  LabelCreate = (label) => {
    var date = new Date(label + "Z");

    if (date.getHours() % 2 === 0) {
      return date.getHours();
    } else {
      return "";
    }
  };

  //query api for status
  fetchWeather = () => {
    var configuration = {
      method: "get",
      // day_delta is number of days to pull. result interval returns every Nth record. 12 = 1 record pr hour as records are 5 minute intervals
      // daydelta 1 and interval 12 returns 24 hours of records, with one record pr hour
      url: settings.apiHost + "/weatherstation/gethourly?day_delta=1",
      headers: {
        //token: this.props.token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    //console.log(configuration);
    apiContent(configuration, this.fetchSuccess, this.fetchError);
  };

  fetchSuccess = (props) => {
    // console.log(props);
    // reverse list to get earliest point first - for graphs.
    this.setState({
      weatherList: props.reverse(),
      error: false,
      loading: false,
    });
  };
  fetchError = (props) => {
    //console.log(props);
    this.setState({ error: true });
  };
}

const generateLabels = (key, dataset) => {
  // generate list of lables (24 hours) depending on latest timestamp
  return dataset.map((observations) => observations[key]);
};

const generateDatasets = (key, dataset) => {
  if (dataset[0].hasOwnProperty(key)) {
    return dataset.map((observations) => observations[key]);
  } else {
    return [];
  }
  //generate a structure that can extrapolate single values ranges from the weatherobservation dataset.
  //perhaps returning arrays of all datapoints of a specific key. That can be used for graph generation
};

const graphstyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "flex-start",
    alignItems: "center",
    textAlign: "center",
    padding: 10,
  },
  header: {
    textAlign: "center",
    fontSize: 18,
    padding: 16,
    marginTop: 16,
  },
});

export default ChartContainer;
