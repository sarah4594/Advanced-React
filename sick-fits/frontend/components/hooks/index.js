import { useState } from 'react'

function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue)
  function handleChange(e) {
    setValue(e.target.value)
  }
  return {
    value,
    onChange: handleChange,
  }
}

function useCurrentInput(initialValue) {
  const [value, setValue] = useState(initialValue)
  function handleChange(e) {
    const { name, type, value } = e.target
    const val = type === 'number' ? parseFloat(value) : value
    setValue({ [name]: val })
  }
  return {
    value,
    onChange: handleChange,
  }
}

export { useFormInput }
export { useCurrentInput }
