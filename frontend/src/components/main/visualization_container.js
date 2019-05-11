import { connect } from 'react-redux';
import Visualization from './visualization';
import { fetchVisualizations } from './../../actions/visualizations_actions';
import { visualizationsSelector } from './../../reducers/selectors';

const mapStateToProps = state => ({
  visualizations: visualizationsSelector(state.entities.visualizations),
});

const mapDispatchToProps = dispatch => ({
  fetchVisualizations: () => dispatch(fetchVisualizations()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Visualization);