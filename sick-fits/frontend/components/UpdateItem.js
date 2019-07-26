import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Mutation, Query } from 'react-apollo'
import gql from 'graphql-tag'
import { adopt } from 'react-adopt'
import Router from 'next/router'
import Form from './styles/Form'
import Error from './ErrorMessage'

// will make the items stuff visiable
// so user knows what they are updating
const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`
/* eslint-disable */
const Composed = adopt({
  singleItem: ({ render, id }) => (
    <Query
      query={SINGLE_ITEM_QUERY}
      variables={{
        id,
      }}
    >
      {render}
    </Query>
  ),
  updateItem: ({ render }) => (
    <Mutation mutation={UPDATE_ITEM_MUTATION}>{render}</Mutation>
  ),
})

/* esling-enable */
class UpdateItem extends Component {
  state = {}

  handleChange = e => {
    const { name, type, value } = e.target
    const val = type === 'number' ? parseFloat(value) : value
    this.setState({ [name]: val })
  }

  handleUpdateItem = async (e, updateItemMutation) => {
    e.preventDefault()
    console.log('updating')
    console.log(this.state)
    const res = await updateItemMutation({
      variables: {
        id: this.props.id,
        ...this.state,
      },
    })
    console.log('updated')
    Router.push({
      pathname: '/item',
      query: { id: res.data.updateItem.id },
    })
  }

  render() {
    return (
      <Composed id={this.props.id}>
        {({ singleItem, updateItem }) => {
          const { data, loading } = singleItem
          const { mutationLoading, mutationError } = updateItem

          if (loading) return <p>Loading...</p>
          if (!data.item) return <p>No Item Found for ID {this.props.id}</p>
          return (
            <Form onSubmit={e => this.handleUpdateItem(e, updateItem)}>
              <Error error={mutationError} />
              <fieldset disabled={mutationLoading} aria-busy={mutationLoading}>
                <label htmlFor="title">
                  Title
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Title"
                    required
                    defaultValue={data.item.title}
                    onChange={this.handleChange}
                  />
                </label>

                <label htmlFor="price">
                  Price
                  <input
                    type="number"
                    id="price"
                    name="price"
                    placeholder="Price"
                    required
                    defaultValue={data.item.price}
                    onChange={this.handleChange}
                  />
                </label>

                <label htmlFor="price">
                  Description
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Description"
                    required
                    defaultValue={data.item.description}
                    onChange={this.handleChange}
                  />
                </label>

                <button type="submit">
                  Sav{mutationLoading ? 'ing' : 'e'} Changes
                </button>
              </fieldset>
            </Form>
          )
        }}
      </Composed>
    )
  }
}

UpdateItem.propTypes = {
  id: PropTypes.string.isRequired,
}

export default UpdateItem
export { UPDATE_ITEM_MUTATION }
