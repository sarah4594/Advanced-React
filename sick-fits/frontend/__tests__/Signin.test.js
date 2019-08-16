import { mount } from 'enzyme'
import wait from 'waait'
import toJSON from 'enzyme-to-json'
import { ApolloConsumer } from 'react-apollo'
import { MockedProvider } from 'react-apollo/test-utils'
import Router from 'next/router'
import Signin, { SIGNIN_MUTATION } from '../components/Signin'
import { CURRENT_USER_QUERY } from '../components/User'
import { fakeUser } from '../lib/testUtils'

const me = fakeUser()

Router.router = {
  push() {},
}

function type(wrapper, name, value) {
  wrapper.find(`input[name="${name}"]`).simulate('change', {
    target: { name, value },
  })
}

const mocks = [
  // Current user query mock
  {
    request: {
      query: CURRENT_USER_QUERY,
    },
    result: { data: { me } },
  },
]

describe('<Signin />', () => {
  it('renders and matches snapshot', () => {
    const wrapper = mount(
      <MockedProvider>
        <Signin />
      </MockedProvider>,
    )
    expect(toJSON(wrapper.find('form'))).toMatchSnapshot()
  })
})
