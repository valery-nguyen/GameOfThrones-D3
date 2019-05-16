import { connect } from 'react-redux';
import ForceLayout from './force_layout';
import { fetchData } from './../../actions/data_actions';

const mapDispatchToProps = dispatch => ({
  fetchData: () => dispatch(fetchData()),
});

export default connect(null, mapDispatchToProps)(ForceLayout);