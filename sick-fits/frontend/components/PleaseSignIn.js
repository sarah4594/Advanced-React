import { Query } from 'react-apollo'
import PropTypes from 'prop-types'
import { CURRENT_USER_QUERY } from './User'
import SignIn from './Signin'

const PleaseSignIn = props => (
  <Query query={CURRENT_USER_QUERY}>
    {({ data, loading }) => {
      if (loading) return <p>Loading...</p>
      if (!data.me) {
        return (
          <div>
            <p>Please Sign In Before Continuing</p>
            <SignIn />
          </div>
        )
      }
      return props.children
    }}
  </Query>
)

PleaseSignIn.propTypes = {
  children: PropTypes.object,
}

export default PleaseSignIn
