import { connect } from 'react-redux';
import Matrix from './matrix';
import { fetchData } from './../../actions/data_actions';

const mapDispatchToProps = dispatch => ({
  fetchData: () => dispatch(fetchData()),
});

export default connect(null, mapDispatchToProps)(Matrix);