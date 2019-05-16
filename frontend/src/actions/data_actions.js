import * as APIUtil from '../util/data_api_util';
export const RECEIVE_DATA = "RECEIVE_DATA";

export const receiveData = data => ({
  type: RECEIVE_DATA,
  data
});

export const fetchData = () => dispatch => {
  return APIUtil.fetchData()
    .then(data => dispatch(receiveData(data)))
    .catch(err => console.log(err));
};