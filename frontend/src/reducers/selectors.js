export const visualizationsSelector = function (visualizations) {
  let dataset = [];
  if (Object.values(visualizations).length > 0) {
    visualizations.forEach(visualization => {
      dataset.push(visualization.map(obj => Object.values(obj)));
    });
  }
  return dataset;
};

export const linksSelector = function (visualizations) {
  if (!visualizations) return [];
  let links = [];
  visualizations.forEach(datapoint => {
    links.push(
      {
        source: datapoint.Source,
        target: datapoint.Target
      }
    );
  });
  return links;
};

export const nodesSelector = function (visualizations) {
  if (!visualizations) return [];
  let nodes = [];
  visualizations.forEach(datapoint => {
    nodes.push(
      {
        id: datapoint.Id,
        name: datapoint.Label
      }
    );
  });
  return nodes;
};

