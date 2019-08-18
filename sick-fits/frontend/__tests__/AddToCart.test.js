import { mount } from 'enzyme'
import wait from 'waait'
import toJSON from 'enzyme-to-json'
import { MockedProvider } from 'react-apollo/test-utils'
import { ApolloConsumer } from 'react-apollo'
import AddToCart, { ADD_TO_CART_MUTATION } from '../components/AddToCart'
import { CURRENT_USER_QUERY } from '../components/User'
import { fakeUser, fakeCartItem } from '../lib/testUtils'

const mockForOne = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [],
        },
      },
    },
  },
  {
    request: { query: ADD_TO_CART_MUTATION, variables: { id: '123abc' } },
    result: {
      data: {
        addToCart: {
          ...fakeCartItem(),
          quantity: 1,
        },
      },
    },
  },
]

const mocksForTwo = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [fakeCartItem()],
        },
      },
    },
  },
  {
    request: { query: ADD_TO_CART_MUTATION, variables: { id: '123abc' } },
    result: {
      data: {
        addToCart: {
          ...fakeCartItem(),
          quantity: 1,
        },
      },
    },
  },
]

describe('<AddToCart />', () => {
  it('renders and matches snappy', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mockForOne}>
        <AddToCart id="abc123" />
      </MockedProvider>,
    )
    await wait()
    wrapper.update()
    expect(toJSON(wrapper.find('button'))).toMatchSnapshot()
  })

  it('adds an item to cart when clicked', async () => {
    let apolloClient
    const wrapper = mount(
      <MockedProvider mocks={mockForOne}>
        <ApolloConsumer>
          {client => {
            apolloClient = client
            return <AddToCart id="123abc" />
          }}
        </ApolloConsumer>
      </MockedProvider>,
    )
    await wait()
    wrapper.update()
    //console.log(me)
    const {
      data: { me },
    } = await apolloClient.query({ query: CURRENT_USER_QUERY })
    expect(me.cart).toHaveLength(0)
  })

  it('adds an item to the cart', async () => {
    let apolloClient
    const wrapper = mount(
      <MockedProvider mocks={mocksForTwo}>
        <ApolloConsumer>
          {client => {
            apolloClient = client
            return <AddToCart id="123abc" />
          }}
        </ApolloConsumer>
      </MockedProvider>,
    )
    wrapper.find('button').simulate('click')
    await wait()
    // check if item is in cart
    const {
      data: { me: me2 },
    } = await apolloClient.query({ query: CURRENT_USER_QUERY })
    expect(me2.cart).toHaveLength(1)
    expect(me2.cart[0].id).toBe('omg123')
    expect(me2.cart[0].quantity).toBe(3)
  })

  it('changes from add to adding chen clicked', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mockForOne}>
        <AddToCart id="123abc" />
      </MockedProvider>,
    )
    await wait()
    wrapper.update()
    expect(wrapper.text()).toContain('Add To Cart')
    wrapper.find('button').simulate('click')
    expect(wrapper.text()).toContain('Adding To Cart')
  })
})
