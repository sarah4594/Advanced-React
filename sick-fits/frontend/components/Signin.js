import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Router from 'next/router'
import Form from './styles/Form'
import Error from './ErrorMessage'
import { CURRENT_USER_QUERY } from './User'
import { useFormInput } from './hooks'

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`

function Signin() {
  // state = {
  //   name: '',
  //   password: '',
  //   email: '',
  // }
  // saveToState = e => {
  //   this.setState({ [e.target.name]: e.target.value })
  // }

  const name = useFormInput('')
  const password = useFormInput('')
  const email = useFormInput('')

  async function handleSubmit(e, signin) {
    e.preventDefault()
    const user = await signin()
    if (user) {
      Router.push({
        pathname: '/items',
      })
    }
  }

  return (
    <Mutation
      mutation={SIGNIN_MUTATION}
      variables={{
        name: name.value,
        password: password.value,
        email: email.value,
      }}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
      {(signin, { error, loading }) => {
        return (
          <Form method="post" onSubmit={e => handleSubmit(e, signin)}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign Into Your Account</h2>
              <Error error={error} />
              <label htmlFor="email">
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="email"
                  {...email}
                />
              </label>
              <label htmlFor="password">
                Password
                <input
                  type="password"
                  name="password"
                  placeholder="password"
                  {...password}
                />
              </label>

              <button type="submit">Sign In!</button>
            </fieldset>
          </Form>
        )
      }}
    </Mutation>
  )
}

export default Signin
export { SIGNIN_MUTATION }
