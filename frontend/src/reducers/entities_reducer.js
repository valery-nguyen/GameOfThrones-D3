import { combineReducers } from 'redux';

import data from './data_reducer';

const EntitiesReducer = combineReducers({
  data,
});

export default EntitiesReducer;