export const linksSelector = function (data) {
  if (!data) return [];
  let links = [];
  data.forEach(datapoint => {
    links.push(
      {
        source: datapoint.Source,
        target: datapoint.Target
      }
    );
  });
  return links;
};

export const nodesSelector = function (data) {
  if (!data) return [];
  let nodes = [];
  data.forEach(datapoint => {
    nodes.push(
      {
        id: datapoint.Id,
        name: datapoint.Label
      }
    );
  });
  return nodes;
};

