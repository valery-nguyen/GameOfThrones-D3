import { combineReducers } from 'redux';

import visualizations from './visualizations_reducer';

const EntitiesReducer = combineReducers({
  visualizations,
});

export default EntitiesReducer;