import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Form from './styles/Form'
import Error from './ErrorMessage'

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`

class RequestReset extends Component {
  state = {
    name: '',
  }

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {
    return (
      <Mutation mutation={REQUEST_RESET_MUTATION} variables={this.state}>
        {/* called = boolean that says whether or not mutation
        has been called yet */}
        {(reset, { error, loading, called }) => {
          return (
            <Form
              method="post"
              onSubmit={async e => {
                e.preventDefault()
                await reset()
                this.setState({ email: '' })
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Forgot Your Password</h2>
                <Error error={error} />
                {!error && !loading && called && (
                  <p>Success! Check you email for a reset link</p>
                )}
                <label htmlFor="email">
                  Email
                  <input
                    type="email"
                    name="email"
                    placeholder="email"
                    value={this.state.email}
                    onChange={this.saveToState}
                  />
                </label>

                <button type="submit">Reset Password</button>
              </fieldset>
            </Form>
          )
        }}
      </Mutation>
    )
  }
}

export default RequestReset
