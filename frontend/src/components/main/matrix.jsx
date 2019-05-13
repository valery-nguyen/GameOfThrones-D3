import './matrix.css';

import React from 'react';
import { Link } from 'react-router-dom';
import * as d3 from 'd3';
import { merge } from 'lodash';
import { linksSelector, nodesSelector } from './../../reducers/selectors';


window.d3 = d3;

class Matrix extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      links: [],
      nodes: []
    };

    this.ticked = this.ticked.bind(this);
    this.updateLinks = this.updateLinks.bind(this);
    this.updateNodes = this.updateNodes.bind(this);
    this.toggleByName = this.toggleByName.bind(this);
    this.toggleByFrequency = this.toggleByFrequency.bind(this);
    this.order = this.order.bind(this);
    window.mouseout = this.mouseout = this.mouseout.bind(this);
    window.mouseover = this.mouseover = this.mouseover.bind(this);
  }

  componentDidMount() {
    this.props.fetchVisualizations().then((res) => {

      this.n = 40; //number of rows/columns

      // pre-processing data
      const datasets = res.visualizations.data;
      let allLinksSets = [];
      let allNodesSets = {};
      let allKeys = Object.keys(allNodesSets);

      datasets.forEach((dataset, idx) => {
        if (idx % 2 === 0) {
          allLinksSets = allLinksSets.concat(dataset);
        } else {

          dataset.forEach(el => {
            allKeys = Object.keys(allNodesSets);
            if (!allKeys.includes(el.Id)) allNodesSets[el.Id] = el;
          });
        }
      });

      allNodesSets = Object.values(allNodesSets);

      this.margin = { top: 80, right: 0, bottom: 10, left: 80 };

      const receivedNodes = allNodesSets;
      const receivedlinks = allLinksSets;

      let nodesCount = receivedNodes.map(el => 0);
      let reiceivedNodeKeys = [];

      receivedNodes.forEach((node, idx) => {
        reiceivedNodeKeys.push(node.Id);
      });

      receivedlinks.forEach(link => {
        nodesCount[reiceivedNodeKeys.indexOf(link.Source)] += 1;
        nodesCount[reiceivedNodeKeys.indexOf(link.Target)] += 1;
      });

      this.nodes = window.nodes = [];
      const unsortedNodesCount = [].concat(nodesCount);
      const countCutOff = nodesCount.sort((a, b) => (b - a))[this.n - 1];
      unsortedNodesCount.forEach((n, i) => {
        if (n >= countCutOff) {
          this.nodes.push(receivedNodes[i]);
        }
      });

      this.nodeKeys = [];

      this.nodes.forEach((node, idx) => {
        this.nodeKeys.push(node.Id);
      });

      window.links = this.links = [];
      receivedlinks.forEach(link => {
        if (this.nodeKeys.indexOf(link.Source) >= 0 && this.nodeKeys.indexOf(link.Target) >= 0) {
          this.links.push(link);
        }
      });

      this.setState({
        links: allLinksSets,
        nodes: allNodesSets
      });

      // D3 display
      this.width = 720;
      this.height = 720;

      window.x = this.x = d3.scaleBand().rangeRound([0, this.width]);
      window.y = this.y = d3.scaleLinear().domain([0, this.height]);

      this.zoom = d3.zoom().scaleExtent([1 / 4, 4]).on("zoom", this.zoomed);

      this.svg = d3.select(this.refs.matrix).append('svg')
        .attr('width', this.width + this.margin.left + this.margin.right)
        .attr('height', this.height + this.margin.top + this.margin.bottom)
        .call(this.zoom);

      window.matrix = this.matrix = [];
      const n = window.n = this.nodes.length;
      
      this.nodes.forEach((node, idx) => {
        node.count = 0;
        node.index = idx;
        this.matrix[idx] = d3.range(n).map(idx2 => { return { x: idx2, y: idx, z: 0}; });
      });

      this.links.forEach(link => {
        this.matrix[this.nodeKeys.indexOf(link.Source)][this.nodeKeys.indexOf(link.Target)].z += parseInt(link.Weight);
        this.matrix[this.nodeKeys.indexOf(link.Target)][this.nodeKeys.indexOf(link.Source)].z += parseInt(link.Weight);
        this.matrix[this.nodeKeys.indexOf(link.Source)][this.nodeKeys.indexOf(link.Source)].z += parseInt(link.Weight);
        this.matrix[this.nodeKeys.indexOf(link.Target)][this.nodeKeys.indexOf(link.Target)].z += parseInt(link.Weight);
        this.nodes[this.nodeKeys.indexOf(link.Source)].count += parseInt(link.Weight);
        this.nodes[this.nodeKeys.indexOf(link.Target)].count += parseInt(link.Weight);
      });

      window.orders = this.orders = {
        label: d3.range(n).sort((a, b) => { return d3.ascending(this.nodes[a].Label, this.nodes[b].Label); }),
        count: d3.range(n).sort((a, b) => { return this.nodes[b].count - this.nodes[a].count; })
      };

      // initial display
      this.x.domain(this.orders.label);
      window.colors = d3.scaleSequential(d3.interpolateBlues).domain([0, 35]);

      this.svgContainer = this.svg.append('g').attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

      this.svgContainer.append('rect')
        .attr("class", "background")
        .attr("width", this.width)
        .attr("height", this.height)
        .style("fill", 'whitesmoke');

      this.row = this.svgContainer.selectAll(".row")
        .data(this.matrix)
        .enter().append("g")
        .attr("class", "row")
        .attr("transform", (d, i) => { return "translate(0," + this.x(this.orders.label[i]) + ")"; })
        .each(this.createRow);

      this.row.append("line")
        .attr("x2", this.width);

      this.row.append("text")
        .attr("x", -6)
        .attr("y", (this.x.range()[1] - this.x.range()[0]) / (2 * n))
        .attr("dy", ".32em")
        .text((d, i) => this.nodes[i].Label);

      this.column = this.svgContainer.selectAll(".column")
        .data(this.matrix)
        .enter().append("g")
        .attr("class", "column")
        .attr("transform", (d, i) => { return "translate(" + this.x(this.orders.label[i]) + ")rotate(-90)"; });

      this.column.append("line")
        .attr("x1", -this.width);

      this.column.append("text")
        .attr("x", 6)
        .attr("y", (this.x.range()[1] - this.x.range()[0]) / (2 * n))
        .attr("dy", ".32em")
        .text((d, i) => { return this.nodes[i].Label; });
    });
  }

  createRow(row) {
    let cell = d3.select(this).selectAll(".cell")
      .data(row.filter(d => d.z))
      .enter().append("rect")
      .attr("class", "cell")
      .attr("x", d => window.x(window.orders.label[d.x]))
      .attr("width", (window.x.range()[1] - window.x.range()[0]) / window.n)
      .attr("height", (window.x.range()[1] - window.x.range()[0]) / window.n)
      .style("fill-opacity", d => 1)
      .style("fill", d => { return (window.matrix[d.x][d.y].z > 0) ? window.colors(window.matrix[d.x][d.y].z) : 'white'; })
      .on("mouseover", window.mouseover)
      .on("mouseout", window.mouseout);
  }

  ticked() {
    this.updateNodes();
    this.updateLinks();
  }

  updateLinks() {
    let u = d3.select('.links')
      .selectAll('line')
      .data(this.links);

    u.enter()
      .append('line')
      .merge(u)
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    u.exit().remove();
  }

  updateNodes() {
    if (this.nodeModeOn) {
      let u = d3.select('.nodes')
        .selectAll('circle')
        .data(this.nodes)
        .call(d3.drag()
          .on("start", this.dragstarted)
          .on("drag", this.dragged)
          .on("end", this.dragended));

      u.enter()
        .append('circle')
        .merge(u)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr("r", 8)
        .style("fill", this.color);

      u.exit().remove();
    } else {
      let u = d3.select('.nodes')
        .selectAll('text')
        .data(this.nodes)
        .call(d3.drag()
          .on("start", this.dragstarted)
          .on("drag", this.dragged)
          .on("end", this.dragended));

      u.enter()
        .append('text')
        .text(d => d.name)
        .merge(u)
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .attr('dy', d => 3)
        .style("fill", this.color);

      u.exit().remove();
    }
  }

  mouseover(p) {
    d3.selectAll(".row text").classed("active", (d, i) => i == p.y);
    d3.selectAll(".column text").classed("active", (d, i) => i == p.x);
  }

  mouseout() {
    d3.selectAll("text").classed("active", false);
  }

  toggleByName(e) {
    e.preventDefault();
    this.order('label');
  }

  toggleByFrequency(e) {
    e.preventDefault();
    this.order('count');
  }

  order(value) {
    window.x.domain(window.orders[value]);

    const t = this.svg.transition().duration(2500);

    t.selectAll(".row")
      .delay((d, i) => window.x(i) * 4)
      .attr("transform", (d, i) => "translate(0," + window.x(i) + ")")
      .selectAll(".cell")
      .delay(d => window.x(d.x) * 4)
      .attr("x", d => window.x(d.x));

    t.selectAll(".column")
      .delay((d, i) => window.x(i) * 4)
      .attr("transform", (d, i) => "translate(" + window.x(i) + ")rotate(-90)");
  }


  render() {
    return (
      <div id="matrix" ref="matrix">
        <h1>Co-occurrence Matrix using D3 V5</h1>
        <div className="matrix-buttons-div">
          <Link to='/'>Collapsible Force Layout Representation</Link>
          <br/>
          <button className="matrix-btn" onClick={this.toggleByName}>By Name</button>
          <button className="matrix-btn" onClick={this.toggleByFrequency}>By Frequency</button>
        </div>
      </div>
    );
  }

}

export default Matrix;