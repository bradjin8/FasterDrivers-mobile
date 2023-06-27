import { useState, useEffect, useCallback } from 'react'

const isObject = (value) => value !== null && typeof value === 'object'

const isRegExp = (value) => value instanceof RegExp

const useForm = (stateSchema = {}, validationSchema = {}, callback) => {
  const [state, setState] = useState(stateSchema)
  const [disable, setDisable] = useState(true)
  const [isDirty, setIsDirty] = useState(false)
  // Used to disable submit button if there's an error in state
  // or the required field in state has no value.
  // Wrapped in useCallback to cached the function to avoid intensive memory leaked
  // in every re-render in component
  const validateState = useCallback(() => {
    const hasErrorInState = Object.keys(validationSchema).some((key) => {
      const isInputFieldRequired = validationSchema[key].required
      const stateValue = state[key].value // state value
      const stateError = state[key].error // state error
      return (isInputFieldRequired && !stateValue) || stateError
    })
    return hasErrorInState
  }, [state, validationSchema])
  // Disable button in inital render;
  useEffect(() => {
    setDisable(validateState())
  }, [])
  // For every changed in our state this will be fired
  // To be able to disable the button
  useEffect(() => {
    if (isDirty) {
      setDisable(validateState())
    }
  }, [state, isDirty])
  // Event handler for handling changes in input.
  // eslint-disable-next-line
  const handleOnChange = (name, value) => {
    setIsDirty(true)
    let error = ''
    if (validationSchema[name].required) {
      if (!value) {
        error = 'This field is required.'
      }
    }
    if (isObject(validationSchema[name].validator)) {
      if (validationSchema[name].validator.regEx) {
        if (!isRegExp(validationSchema[name].validator.regEx)) {
          throw new Error("Your RegExp value isn't a valid RegExp Object")
        }
        // Test your defined RegExp...
        if (value && !validationSchema[name].validator.regEx.test(value)) {
          const { validator } = validationSchema[name]
          // eslint-disable-next-line prefer-destructuring
          error = validator.error
        }
      } else if (validationSchema[name].validator.compare) {
        if (value && validationSchema[name].validator.compare(value)) {
          const { validator } = validationSchema[name]
          // eslint-disable-next-line prefer-destructuring
          error = validator.error
        }
      }
    }
    setState((prevState) => ({
      ...prevState,
      [name]: { value, error },
    }))
  }
  const handlePhoneNumberChange = (
    name,
    value,
    countryCode,
    countryDialCode,
  ) => {
    setIsDirty(true)
    let error = ''
    // if (validationSchema[name].required) {
    //   if (!value) {
    //     error = 'v8'
    //   }
    // }
    if (isObject(validationSchema[name].validator)) {
      if (validationSchema[name].validator.regEx) {
        if (!isRegExp(validationSchema[name].validator.regEx)) {
          throw new Error("Your RegExp value isn't a valid RegExp Object")
        }
        // Test your defined RegExp...
        if (value && !validationSchema[name].validator.regEx.test(value)) {
          const { validator } = validationSchema[name]
          // eslint-disable-next-line prefer-destructuring
          error = validator.error
        }
      } else if (validationSchema[name].validator.compare) {
        if (value && validationSchema[name].validator.compare(value)) {
          const { validator } = validationSchema[name]
          // eslint-disable-next-line prefer-destructuring
          error = validator.error
        }
      }
    }
    setState((prevState) => ({
      ...prevState,
      [name]: { value, error, countryCode, countryDialCode },
    }))
  }
  const handleOnSubmit = (name, value) => {
    setIsDirty(true)
    setState((prevState) => ({
      ...prevState,
      [name]: { value, error: '' },
    }))
  }
  const validateOnBlur = (name, value) => {
    let error = ''
    if (validationSchema[name].required) {
      if (!value) {
        error = 'This field is required.'
      }
    }
    if (isObject(validationSchema[name].validator)) {
      if (validationSchema[name].validator.regEx) {
        if (!isRegExp(validationSchema[name].validator.regEx)) {
          throw new Error("Your RegExp value isn't a valid RegExp Object")
        }
        // Test your defined RegExp...
        if (value && !validationSchema[name].validator.regEx.test(value)) {
          const { validator } = validationSchema[name]
          // eslint-disable-next-line prefer-destructuring
          error = validator.error
        }
      } else if (validationSchema[name].validator.compare) {
        if (value && validationSchema[name].validator.compare(value)) {
          const { validator } = validationSchema[name]
          // eslint-disable-next-line prefer-destructuring
          error = validator.error
        }
      }
    }
    setState((prevState) => ({
      ...prevState,
      [name]: { value, error },
    }))
  }
  return {
    handleOnChange,
    handlePhoneNumberChange,
    handleOnSubmit,
    validateOnBlur,
    state,
    setIsDirty,
    setState,
    disable,
  }
}
export default useForm

export const toFormData = (data) => {
  const formData = new FormData()
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key])
  })
  return formData
}
