import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import Router from 'next/router'
import Form from './styles/Form'
import Error from './ErrorMessage'
import { CURRENT_USER_QUERY } from './User'
import { useFormInput } from './hooks'

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      email
      name
    }
  }
`

function Reset(props) {
  // state = {
  //   password: '',
  //   confirmPassword: '',
  // }
  // saveToState = e => {
  //   this.setState({ [e.target.name]: e.target.value })
  // }

  const password = useFormInput('')
  const confirmPassword = useFormInput('')

  async function handleSubmit(e, reset) {
    e.preventDefault()
    const user = await reset()
    if (user) {
      Router.push({
        pathname: '/items',
      })
    }
  }

  return (
    <Mutation
      mutation={RESET_MUTATION}
      variables={{
        resetToken: props.resetToken,
        password: password.value,
        confirmPassword: confirmPassword.value,
      }}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
      {/* called = boolean that says whether or not mutation
        has been called yet */}
      {(reset, { error, loading }) => {
        return (
          <Form method="post" onSubmit={async e => handleSubmit(e, reset)}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Reset Your Password</h2>
              <Error error={error} />
              <label htmlFor="password">
                New Password
                <input
                  type="password"
                  name="password"
                  placeholder="password"
                  {...password}
                />
              </label>
              <label htmlFor="confirmPassword">
                Confirm Password
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="confirmPassword"
                  {...confirmPassword}
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

Reset.propTypes = {
  resetToken: PropTypes.string.isRequired,
}

export default Reset
