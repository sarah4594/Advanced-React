import { mount } from 'enzyme'
import wait from 'waait'
import { MockedProvider } from 'react-apollo/test-utils'
import { CURRENT_USER_QUERY } from '../components/User'
import Nav from '../components/Nav'
import { fakeADMINUser, fakeUser } from '../lib/testUtils'
import SignedInNav from '../components/NavBar/SignedInNav'

const signedOutMocks = [
  {
    request: {
      query: CURRENT_USER_QUERY,
    },
    result: {
      data: {
        me: null,
      },
    },
  },
]

const signedInMocks = [
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

describe('<Nav />', () => {
  it('renders a signed out nav bar', async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedOutMocks}>
        <Nav />
      </MockedProvider>,
    )
    await wait()
    wrapper.update()
    //console.log(wrapper.debug())
    expect(wrapper.find('SignedOutNav').exists()).toBe(true)
  })
})

describe('<Nav />', () => {
  it('renders a signed in nav bar', async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <Nav />
      </MockedProvider>,
    )
    await wait()
    wrapper.update()
    //console.log(wrapper.debug())
    expect(wrapper.find('SignedInNav').exists()).toBe(true)
  })
})

describe('<SignedInNav />', () => {
  it('ADMIN user shows permissions', async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <SignedInNav me={fakeADMINUser()} />
      </MockedProvider>,
    )
    await wait()
    wrapper.update()
    expect(wrapper.text()).toContain('Permissions')
  })
})

describe('<SignedInNav />', () => {
  it('regular user does not show permissions', async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <SignedInNav me={fakeUser()} />
      </MockedProvider>,
    )
    await wait()
    wrapper.update()
    expect(wrapper.text()).not.toContain('Permissions')
  })
  it("shows user's account name", async () => {
    const user = fakeUser()
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <SignedInNav me={user} />
      </MockedProvider>,
    )
    await wait()
    wrapper.update()
    expect(wrapper.text()).toContain(`${user.name}'s Account`)
  })
})
