import React, { Component, createRef } from "react";

import * as d3 from "d3";

class Chart extends Component {
  constructor(props) {
    super(props);
    this.myRef = createRef();
    this.dataset = [100, 200, 300, 400, 500];
  }
  componentDidMount() {
    console.log(this.myRef);
    d3.select(this.myRef.current).append("p").text("Hello from D3");

    // set the dimensions and margins of the graph
    var margin = {
        top: 80,
        right: 20,
        bottom: 70,
        left: 70,
      },
      width = 700 - margin.left - margin.right,
      height = 700 - margin.top - margin.bottom;

    let size = 500;
    let svg = d3
      .select(this.myRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let rect_width = 95;

    svg
      .selectAll("rect")
      .data(this.dataset)
      .enter()
      .append("rect")
      .attr("x", (d, i) => 5 + i * (rect_width + 5))
      .attr("y", (d) => size - d)
      .attr("width", rect_width)
      .attr("height", (d) => d)
      .attr("fill", "teal");
  }
  render() {
    return <div ref={this.myRef}></div>;
  }
}
export default Chart;
