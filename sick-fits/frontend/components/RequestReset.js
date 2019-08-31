import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Form from './styles/Form'
import Error from './ErrorMessage'
import { useFormInput } from './hooks'

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`

function RequestReset() {
  // state = {
  //   name: '',
  // }
  // saveToState = e => {
  //   this.setState({ [e.target.name]: e.target.value })
  // }

  const name = useFormInput('')
  const email = useFormInput('')

  async function handleSubmit(e, reset) {
    e.preventDefault()
    await reset()
  }

  return (
    <Mutation
      mutation={REQUEST_RESET_MUTATION}
      variables={{ name: name.value, email: email.value }}
    >
      {/* called = boolean that says whether or not mutation
        has been called yet */}
      {(reset, { error, loading, called }) => (
        <Form
          method="post"
          data-test="form"
          onSubmit={e => handleSubmit(e, reset)}
        >
          <fieldset disabled={loading} aria-busy={loading}>
            <h2>Forgot Your Password</h2>
            <Error error={error} />
            {!error && !loading && called && (
              <p>Success! Check you email for a reset link</p>
            )}
            <label htmlFor="email">
              Email
              <input type="email" name="email" placeholder="email" {...email} />
            </label>

            <button type="submit">Reset Password</button>
          </fieldset>
        </Form>
      )}
    </Mutation>
  )
}

export default RequestReset
export { REQUEST_RESET_MUTATION }
