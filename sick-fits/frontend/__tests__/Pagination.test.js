import { mount } from 'enzyme'
import wait from 'waait'
import { MockedProvider } from 'react-apollo/test-utils'
import Router from 'next/router'
import toJSON from 'enzyme-to-json'
import Pagination, { PAGINATION_QUERY } from '../components/Pagination'

Router.router = {
  push() {},
  prefetch() {},
}

function makeMocksFor(length) {
  return [
    {
      request: { query: PAGINATION_QUERY },
      result: {
        data: {
          itemsConnection: {
            __typename: 'aggregate',
            aggregate: {
              count: length,
              __typename: 'count',
            },
          },
        },
      },
    },
  ]
}

describe('<Pagination />', () => {
  it('displays a loading message', () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(1)}>
        <Pagination page={1} />
      </MockedProvider>,
    )
    const pagination = wrapper.find('[data-test="pagination"]')
    expect(wrapper.text()).toContain('Loading...')
  })

  it('renders pagination for 18 items', async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(18)}>
        <Pagination page={1} />
      </MockedProvider>,
    )
    await wait()
    wrapper.update()
    expect(wrapper.find('totalPages').text()).toEqual('5')
    console.log(wrapper.debug())
  })
})
