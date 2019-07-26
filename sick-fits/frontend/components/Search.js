import React from 'react'
import Downshift, { resetIdCounter } from 'downshift'
import Router from 'next/router'
import { ApolloConsumer } from 'react-apollo'
import gql from 'graphql-tag'
import debounce from 'lodash.debounce'
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown'

const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY($searchTerm: String!) {
    items(
      where: {
        OR: [
          { title_contains: $searchTerm }
          { description_contains: $searchTerm }
        ]
      }
    ) {
      id
      image
      title
    }
  }
`

function routeToItem(item) {
  Router.push({
    pathname: '/item',
    query: {
      id: item.id,
    },
  })
}

class AutoComplete extends React.Component {
  state = {
    items: [],
    loading: false,
  }
  // Debounce will make it so function doesn;t run every time there
  // is a change (like typing many keys at the same time)
  onChange = debounce(async (e, client) => {
    console.log('searching...')
    // Turn loading on
    this.setState({ loading: true })
    // Manually query apollo client
    const res = await client.query({
      query: SEARCH_ITEMS_QUERY,
      variables: { searchTerm: e.target.value },
    })
    this.setState({
      items: res.data.items,
      loading: false,
    })
  }, 350)
  render() {
    resetIdCounter()
    return (
      <SearchStyles>
        {/* Converts item which is an object into a string so it shows
        up in the search bar */}
        <Downshift
          onChange={routeToItem}
          itemToString={item => (item === null ? '' : item.title)}
        >
          {({
            getInputProps,
            getItemProps,
            isOpen,
            inputValue,
            highlightedIndex,
          }) => (
            <div>
              <ApolloConsumer>
                {client => (
                  <input
                    {...getInputProps({
                      type: 'search',
                      placeholder: 'Search For An Item',
                      id: 'search',
                      className: this.state.loading ? 'loading' : '',
                      onChange: e => {
                        e.persist()
                        this.onChange(e, client)
                      },
                    })}
                  />
                )}
              </ApolloConsumer>
              {/* Takes the drop down search away if you click away */}
              {isOpen && (
                <DropDown>
                  {this.state.items.map((item, index) => (
                    <DropDownItem
                      {...getItemProps({ item })}
                      key={item.id}
                      highlighted={index === highlightedIndex}
                    >
                      <img width="50" src={item.image} alt={item.title} />
                      {item.title}
                    </DropDownItem>
                  ))}
                  {!this.state.items.length && !this.state.loading && (
                    <DropDown>Nothing Found For {inputValue} </DropDown>
                  )}
                </DropDown>
              )}
            </div>
          )}
        </Downshift>
      </SearchStyles>
    )
  }
}

export default AutoComplete
