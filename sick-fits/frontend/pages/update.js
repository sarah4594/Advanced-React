import PropTypes from 'prop-types'
import UpdateItem from '../components/UpdateItem'

const Sell = ({ query }) => (
  <div>
    <UpdateItem id={query.id} />
  </div>
)
Sell.propTypes = {
  query: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
}
export default Sell
