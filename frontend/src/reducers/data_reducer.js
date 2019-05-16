import { RECEIVE_DATA } from '../actions/data_actions';

const dataReducer = (state = {}, action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_DATA:
      return action.data.data;
    default:
      return state;
  }
};

export default dataReducer;