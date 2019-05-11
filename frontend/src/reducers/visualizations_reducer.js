import { RECEIVE_VISUALIZATIONS } from '../actions/visualizations_actions';

const BookingsReducer = (state = {}, action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_VISUALIZATIONS:
      return action.visualizations.data;
    default:
      return state;
  }
};

export default BookingsReducer;