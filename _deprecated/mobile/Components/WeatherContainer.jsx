import React, { Component } from "react";
import { apiHandler } from "../Functions/WeatherRequests";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// this class should contain logic to render statuscards based on reply from api /status
// and render the lastest modified jobs wrapped in status cards.
export default class WeatherContainer extends Component {
  state = {
    weatherList: [],
    error: false,
    loading: false,
  };

  // trigger every 300.000 miliseconds (5 minutes)
  componentDidMount() {
    this.fetchWeather();
    this.interval = setInterval(() => {
      this.fetchWeather();
    }, 300000);
  }

  //clear timer when component is unmounted.
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  // add loadspinners.
  // add charts: https://github.com/recharts/recharts
  // add modular ui elements via https://react-bootstrap.github.io/components/cards/
  render() {
    if (this.state.weatherList.length > 0) {
      // data has been populated, build content. First set in the weatherlist contain most recent measurement.
      //the rest is used for generating graphs.
      // placeholder, print latest observation as text.
      const weatherArray = Object.keys(this.state.weatherList[0])
        .filter((key) => this.filterKeys(key))
        .map((key) => [key, this.state.weatherList[0][key]]);

      // TODO:
      // function to convert contents such as winddirection from degrees to compass system and imperial to metric
      // unknown if it should be done before or after assigning to weatherArray

      return (
        <Container>
          <br></br>
          <br></br>

          <Row className="justify-content-md-center">
            <Col xs lg="">
              {" "}
            </Col>
            <Col md="auto">
              <h2>Seneste målinger</h2>
            </Col>
            <Col xs lg="">
              {" "}
            </Col>
          </Row>

          <Row className="justify-content-md-center">
            <Col xs lg="">
              {" "}
            </Col>
            <Col md="auto">
              <h5>Placeholder side, data opdateres med 5 min. interval.</h5>
            </Col>
            <Col xs lg="">
              {" "}
            </Col>
          </Row>

          {weatherArray.map((key) => (
            <Row key={key[0]} className="justify-content-md-center">
              <Col xs lg="">
                {" "}
              </Col>
              <Col md="auto">
                <b>{this.keyprinter(key[0])}:</b> {key[1]}{" "}
              </Col>
              <Col xs lg="">
                {" "}
              </Col>
            </Row>
          ))}
        </Container>
      );
    }
    // loadspinner -v
    else return <div></div>;
  }

  filterKeys = (key) => {
    //don't map keys beginning with 'indoor'
    if (!key.startsWith("indoor") && key !== "id") {
      return key;
    }
  };

  keyprinter = (key) => {
    switch (key) {
      case "tempf":
        return "temperatur";
      case "dewptf":
        return "dugpunkt";
      case "windchillf":
        return "windchill";
      case "humidity":
        return "luftfugtighed";
      case "windspeedmph":
        return "vindhastighed";
      case "windgustmph":
        return "vindstød";
      case "winddir":
        return "vindretning";
      case "absbaromin":
        return "abslufttryk";
      case "baromin":
        return "lufttryk";
      case "rainin":
        return "regn";
      case "dailyrainin":
        return "daglig regn";
      case "weeklyrainin":
        return "ugentlig regn";
      case "monthlyrainin":
        return "månedlig regn";
      case "solarradiation":
        return "solstråling";
      default:
        return key;
    }
  };

  //query api for status
  fetchWeather = () => {
    var configuration = {
      method: "get",
      // day_delta is number of days to pull. result interval returns every Nth record. 12 = 1 record pr hour as records are 5 minute intervals
      // daydelta 1 and interval 12 returns 24 hours of records, with one record pr hour
      url:
        this.props.host +
        "/weatherstation/getweather?day_delta=1&result_interval=12",
      headers: {
        //token: this.props.token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    //console.log(configuration);
    apiHandler(configuration, this.fetchSuccess, this.fetchError);
  };

  fetchSuccess = (props) => {
    //console.log(props.data);
    this.setState({ weatherList: props.data, Error: false });
  };
  fetchError = (props) => {
    //console.log(props);
    this.setState({ error: true });
  };
}