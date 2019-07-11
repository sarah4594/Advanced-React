import PropTypes from 'prop-types'
import Reset from '../components/Reset'

const ResetPage = props => (
  <div>
    <p>Reset Your Password</p>
    <Reset resetToken={props.query.resetToken} />
  </div>
)

ResetPage.propTypes = {
  query: PropTypes.shape({
    resetToken: PropTypes.string.isRequired,
  }),
}

export default ResetPage
