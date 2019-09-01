import React from 'react'
import PropTypes from 'prop-types'
import { Mutation, Query } from 'react-apollo'
import gql from 'graphql-tag'
import { adopt } from 'react-adopt'
import Router from 'next/router'
import Form from './styles/Form'
import Error from './ErrorMessage'
import { useCurrentInput } from './hooks'

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

/* eslint-enable */
function UpdateItem(props) {
  // state = {}

  const title = useCurrentInput(props.title)
  const price = useCurrentInput(props.price)
  const description = useCurrentInput(props.description)

  async function handleUpdateItem(e, updateItemMutation) {
    e.preventDefault()
    console.log('updating')
    const res = await updateItemMutation({
      variables: {
        id: props.id,
        title: title.value,
        price: price.value,
        description: description.value,
      },
    })
    console.log('updated')
    Router.push({
      pathname: '/item',
      query: { id: res.data.updateItem.id },
    })
  }

  return (
    <Composed id={props.id}>
      {({ singleItem, updateItem }) => {
        const { data, loading } = singleItem
        const { mutationLoading, mutationError } = updateItem

        if (loading) return <p>Loading...</p>
        if (!data.item) return <p>No Item Found for ID {props.id}</p>
        return (
          <Form onSubmit={e => handleUpdateItem(e, updateItem)}>
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
                  {...title}
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
                  {...price}
                />
              </label>

              <label htmlFor="price">
                Description
                <textarea
                  id="description"
                  name="description"
                  placeholder="Description"
                  required
                  {...description}
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

UpdateItem.propTypes = {
  id: PropTypes.string.isRequired,
}

export default UpdateItem
export { UPDATE_ITEM_MUTATION }
