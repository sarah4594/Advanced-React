import React, { useState } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Router from 'next/router'
import Form from './styles/Form'
import Error from './ErrorMessage'
import { useFormInput } from './hooks'

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`

function CreateItem() {
  // state = {
  //   title: '',
  //   description: '',
  //   image: '',
  //   largeImage: '',
  //   price: 0,
  // }
  // handleChange = e => {
  //   const { name, type, value } = e.target
  //   const val = type === 'number' ? parseFloat(value) : value
  //   this.setState({ [name]: val })
  // }

  const title = useFormInput('')
  const description = useFormInput('')
  const [image, setImage] = useState('')
  const [largeImage, setLargeImage] = useState('')
  const price = useFormInput(0)

  async function uploadFile(e) {
    //console.log('Uplaoding file')
    // pull files out of selection
    const files = e.target.files
    // form data api (part of Javascript) to prep data
    const data = new FormData()
    data.append('file', files[0])
    // add upload preset
    data.append('upload_preset', 'sickfits')

    //hit cloudinary api
    const res = await fetch(
      'https://api.cloudinary.com/v1_1/snickersarah/image/upload',
      {
        method: 'POST',
        body: data,
      },
    )
    const file = await res.json()
    // parse data that comes back
    //console.log(file)
    // put the data into the spots they go into
    // this.setState({
    //   image: file.secure_url,
    //   largeImage: file.eager[0].secure_url,
    // })
    setImage(file.secure_url)
    setLargeImage(file.eager[0].secure_url)
    debugger
  }

  const handleSubmit = async (e, createItem) => {
    // stop page from submitting
    e.preventDefault()
    // call the mutation
    const res = await createItem()
    // change them to the single item page
    //console.log(res)
    Router.push({
      pathname: '/item',
      query: { id: res.data.createItem.id },
    })
  }
  return (
    <Mutation
      mutation={CREATE_ITEM_MUTATION}
      variables={{
        title: title.value,
        description: description.value,
        price: price.value,
      }}
    >
      {(createItem, { loading, error }) => (
        <Form data-test="form" onSubmit={e => handleSubmit(e, createItem)}>
          <Error error={error} />
          <fieldset disabled={loading} aria-busy={loading}>
            <label htmlFor="file">
              Image
              <input
                type="file"
                id="file"
                name="file"
                placeholder="Upload an image"
                required
                onChange={uploadFile}
              />
              {image && <img width="200" src={image} alt="Upload Preview" />}
            </label>

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

            <button type="submit">Submit</button>
          </fieldset>
        </Form>
      )}
    </Mutation>
  )
}

export default CreateItem
export { CREATE_ITEM_MUTATION }
