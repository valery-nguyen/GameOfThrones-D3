import * as APIUtil from '../util/visualizations_api_util';
export const RECEIVE_VISUALIZATIONS = "RECEIVE_VISUALIZATIONS";

export const receiveVisualizations = visualizations => ({
  type: RECEIVE_VISUALIZATIONS,
  visualizations
});

export const fetchVisualizations = () => dispatch => {
  return APIUtil.fetchVisualizations()
    .then(visualizations => dispatch(receiveVisualizations(visualizations)))
    .catch(err => console.log(err));
};