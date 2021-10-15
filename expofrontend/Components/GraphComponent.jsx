import React, { Component } from "react";
import { StyleSheet, Dimensions } from "react-native";

//https://www.npmjs.com/package/react-native-chart-kit
import { LineChart } from "react-native-chart-kit";

export class WeatherGraph extends Component {
  render() {
    return (
      <>
        <LineChart
          data={{
            labels: this.props.labels,
            datasets: [
              {
                data: this.props.primaryData,
                strokeWidth: 2,
                color: (opacity = 1) => `rgba(0, 65, 244, ${opacity})`, // optional
              },
              {
                data: this.props.secondaryData,
                strokeWidth: 2,
                color: (opacity = 1) => `rgba(128, 0, 0, ${opacity})`, // optional
              },
            ],
            legend: this.props.legend,
          }}
          width={widthCalculator()}
          height={220}
          yAxisLabel={this.props.yLabel}
          yAxisInterval={1}
          chartConfig={{
            backgroundColor: "#1cc910",
            backgroundGradientFrom: "#eff3ff",
            backgroundGradientTo: "#efefef",
            decimalPlaces: 1, // optional, defaults to 2dp
            color: (opacity = 255) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </>
    );
  }
}

export default WeatherGraph;

const widthCalculator = () => {
  if (Dimensions.get("window").width - 16 < 500) {
    return Dimensions.get("window").width - 16;
  } else {
    return 500;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "top",
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