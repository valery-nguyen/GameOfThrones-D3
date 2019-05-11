import axios from 'axios';

export const fetchVisualizations = () => {
  return axios.get('/api/visualizations/');
};