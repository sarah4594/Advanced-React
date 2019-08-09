import { mount, shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'
import wait from 'waait'
import { MockedProvider } from 'react-apollo/test-utils'
import { CURRENT_USER_QUERY } from '../components/User'
import Nav from '../components/Nav'
import SignedInNav from '../components/NavBar/SignedInNav'
import SignedOutNav from '../components/NavBar/SignedOutNav'
import { fakeADMINUser, fakeUser } from '../lib/testUtils'

describe('<AdminNavBar />', () => {
  const mocks = [
    {
      request: {
        query: CURRENT_USER_QUERY,
      },
      result: {
        data: {
          me: fakeUser(),
        },
      },
    },
  ]

  it('renders a signed in nav bar', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Nav />
      </MockedProvider>,
    )
    await wait()
    console.log(wrapper.debug())
  })
})
