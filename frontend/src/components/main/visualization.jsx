import './visualization.css';

import React from 'react';
import * as d3 from 'd3';
import { linksSelector, nodesSelector } from './../../reducers/selectors';

window.d3 = d3;

class Visualization extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      links: [],
      nodes: []
    };

    this.nodeModeOn = false;

    this.update = this.update.bind(this);
    this.zoomed = this.zoomed.bind(this);
    this.ticked = this.ticked.bind(this);
    this.updateLinks = this.updateLinks.bind(this);
    this.updateNodes = this.updateNodes.bind(this);
    this.dragstarted = this.dragstarted.bind(this);
    this.dragged = this.dragged.bind(this);
    this.dragended = this.dragended.bind(this);
    this.color = this.color.bind(this);
    this.nodesToggleHandle = this.nodesToggleHandle.bind(this);
  }

  componentDidMount() {
    this.props.fetchVisualizations().then((res) => {
      const datasets = res.visualizations.data;
      let allLinksSets = [];
      let allNodesSets = [];

      datasets.forEach((dataset, idx) => {
        if (idx % 2 === 0) {
          allLinksSets.push(linksSelector(dataset));
        } else {
          allNodesSets.push(nodesSelector(dataset));
        }
      });

      this.setState({
        links: allLinksSets,
        nodes: allNodesSets
      });

      this.mainCharacters = ['ARYA', 'DAENERYS', 'SANSA', 'JON', 'CERSEI', 'TYRION', 'JAIME', 'SAM'];

      this.width = 1600;
      this.height = 800;

      this.setNumber = 5; //0-6
      this.nodes = this.state.nodes[this.setNumber];
      this.links = this.state.links[this.setNumber];

      this.svg = d3.select(this.refs.visualization).append('svg')
        .attr('width', this.width)
        .attr('height', this.height)
        .call(d3.zoom()
          .scaleExtent([1 / 4, 4])
          .on("zoom", this.zoomed));
        
      this.svgContainer = this.svg.append('g');

      this.svgContainer.append('g')
        .attr('class', 'links');
      this.svgContainer.append('g')
        .attr('class', 'nodes');

      this.simulation = d3.forceSimulation(this.nodes)
        .force('charge', d3.forceManyBody().strength(-100))
        .force('center', d3.forceCenter(this.width / 2, this.height / 2))
        .force('link', d3.forceLink().links(this.links)
          .id(d => d.id)
          .distance( () => 20 ))
        .force('collision', d3.forceCollide( () => 4 ))
        .on('tick', this.ticked);
    });
  }

  update(setNumber, e) {
    e.preventDefault();
    this.setNumber = setNumber;
    this.nodes = this.state.nodes[this.setNumber];
    this.links = this.state.links[this.setNumber];

    d3.select('.links')
      .remove();

    d3.select('.nodes')
      .remove();

    this.svgContainer.append('g')
      .attr('class', 'links');
    this.svgContainer.append('g')
      .attr('class', 'nodes');

    this.simulation = d3.forceSimulation(this.nodes)
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force('link', d3.forceLink().links(this.links)
        .id(d => d.id)
        .distance(() => 20))
      .force('collision', d3.forceCollide(() => 4))
      .on('tick', this.ticked);

  }

  zoomed() {
    this.svgContainer.attr("transform", d3.event.transform);
  }

  ticked() {
    this.updateNodes();
    this.updateLinks();
  }

  dragstarted(d) {
    if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  dragended(d) {
    if (!d3.event.active) this.simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  color(d) {
    return this.mainCharacters.includes(d.id) ? "#fd8d3c" : '#92979c';
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
        .attr('cx',d => d.x)
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

  nodesToggleHandle(e) {
    e.preventDefault();
    this.nodeModeOn = !this.nodeModeOn;
    this.update(this.setNumber, e);
  }

  render() {
    return (
      <div id="visualization" ref="visualization">

        <div className="visualization-buttons-div">
          <button className="visualization-btn" onClick={this.nodesToggleHandle.bind(this)}>Mode Switch</button>
          <button className="visualization-btn" onClick={this.update.bind(this, 0)}>Season 1</button>
          <button className="visualization-btn" onClick={this.update.bind(this, 1)}>Season 2</button>
          <button className="visualization-btn" onClick={this.update.bind(this, 2)}>Season 3</button>
          <button className="visualization-btn" onClick={this.update.bind(this, 3)}>Season 4</button>
          <button className="visualization-btn" onClick={this.update.bind(this, 4)}>Season 5</button>
          <button className="visualization-btn" onClick={this.update.bind(this, 5)}>Season 6</button>
          <button className="visualization-btn" onClick={this.update.bind(this, 6)}>Season 7</button>
        </div>
      </div>
    );
  }

}

export default Visualization;