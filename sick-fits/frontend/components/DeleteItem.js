/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { ALL_ITEMS_QUERY } from './Items'

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`

class DeleteItem extends Component {
  update = (cache, payload) => {
    // manually update cache on client so it matches server
    // 1. Read the cache for the item we want (which query
    // did we use to get items onto the page?)
    // (cannot reach directly into cache to delte
    // one item so we have to query to read items
    // from cache and write back into cache)
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY })
    console.log(data, payload)
    // 2. Filter deleted item out of page
    data.items = data.items.filter(
      item => item.id !== payload.data.deleteItem.id,
    )
    // 3. Put items back
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data })
  }
  render() {
    return (
      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={{ id: this.props.id }}
        update={this.update}
      >
        {(deleteItem, { error }) => (
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this item?')) {
                deleteItem().catch(err => {
                  alert(err.message)
                })
              }
            }}
          >
            {this.props.children}
          </button>
        )}
      </Mutation>
    )
  }
}

DeleteItem.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.string,
}

export default DeleteItem
