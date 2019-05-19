import './force_layout.css';
import React from 'react';
import * as d3 from 'd3';
import { linksSelector, nodesSelector } from './../../reducers/selectors';

window.d3 = d3;

class ForceLayout extends React.Component {
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
    this.recenter = this.recenter.bind(this);
  }

  componentDidMount() {
    const matrixPage = document.getElementById("matrix-page");
    const forcePage = document.getElementById("force-page");
    forcePage.classList.add("selected");
    if (matrixPage.className.includes("selected")) {
      matrixPage.classList.remove("selected");
    }

    this.props.fetchData().then((res) => {
      const datasets = res.data.data;
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

      this.mainCharacters = ['ARYA', 'DAENERYS', 'SANSA', 'JON', 'CERSEI', 'TYRION', 'JAIME', 'SAM', 'THEON', 'NIGHT_KING'];

      this.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      this.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

      this.setNumber = 0; //0-6
      this.nodes = this.state.nodes[this.setNumber];
      this.links = this.state.links[this.setNumber];

      this.zoom = d3.zoom().scaleExtent([1 / 4, 4]).on("zoom", this.zoomed);

      this.svg = d3.select(this.refs.visualization).append('svg')
        .call(this.zoom);
        
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

      document.getElementById(`btn-0`).classList.add("selected");
    });
  }

  update(setNumber, e) {
    [0,1,2,3,4,5,6].forEach(n => {
      let button = document.getElementById(`btn-${n}`);
      if (n === setNumber && !button.className.includes("selected")) {
        button.classList.add("selected");
      } else if (n !== setNumber && button.className.includes("selected") && setNumber >= 0) {
        button.classList.remove("selected");
      }
    });

    e.preventDefault();
    if(setNumber !== -1) this.setNumber = setNumber;
    this.nodes = this.state.nodes[this.setNumber];
    this.links = this.state.links[this.setNumber];

    d3.select('.links')
      .remove();

    d3.select('.nodes')
      .remove();

    if (setNumber !== -1) {
      this.svg.transition()
        .duration(750)
        .call(this.zoom.transform, d3.zoomIdentity);
    }

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
    return this.mainCharacters.includes(d.id) ? 'red' : '#7d7d7d';
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
    this.update(-1, e);
  }

  recenter(e) {
    e.preventDefault();
    this.svg.transition()
      .duration(750)
      .call(this.zoom.transform, d3.zoomIdentity);
  }

  render() {
    return (
      <div className="visualization-container">
        <div className="visualization-header-container">
          <div className="visualization-header">
            <div className="visualization-buttons-div">
              <button className="visualization-btn" onClick={this.nodesToggleHandle}>Mode Switch</button>
              <button className="visualization-btn" onClick={this.recenter}>Re-center</button>
              <button id="btn-0" className="visualization-btn" onClick={this.update.bind(this, 0)}>Season 1</button>
              <button id="btn-1"className="visualization-btn" onClick={this.update.bind(this, 1)}>Season 2</button>
              <button id="btn-2"className="visualization-btn" onClick={this.update.bind(this, 2)}>Season 3</button>
              <button id="btn-3"className="visualization-btn" onClick={this.update.bind(this, 3)}>Season 4</button>
              <button id="btn-4"className="visualization-btn" onClick={this.update.bind(this, 4)}>Season 5</button>
              <button id="btn-5"className="visualization-btn" onClick={this.update.bind(this, 5)}>Season 6</button>
              <button id="btn-6"className="visualization-btn" onClick={this.update.bind(this, 6)}>Season 7</button>
            </div>
          </div>
        </div>
        <div className="navigation-tips">
          <p>Navigation Tips</p>
          <p>Click &amp; Drag: click and drag any node to see the nodes all nodes it has connected with during the season.</p>
          <p>Pan: left-clic anywhere outside of the force layout and drag</p>
          <p>Zoom: use the mouse wheel to zoom-in and zoom-out</p>
        </div>
        <div id="visualization" ref="visualization"></div>
      </div>
    );
  }

}

export default ForceLayout;