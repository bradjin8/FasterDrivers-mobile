export const getSimplifiedError = (error, field) => {
  if (error.response?.status === 500) return 'Please contact support team.';
  const errorResponse = error.response && error.response.data;
  if (!errorResponse) {
    return 'Something went wrong, please try again later';
  }
  const errorKeys = Object.keys(errorResponse);
  if (errorKeys.includes('non_field_errors')) {
    return errorResponse.non_field_errors && errorResponse.non_field_errors[0];
  }
  return errorResponse[errorKeys] || getErrors(errorResponse);
};

const getError = (error) => {
  if (!Object.keys(error).length || typeof error === 'string') return error;
  let errors = [];
  if (Array.isArray(error) && error.length) {
    errors = [error[0].message, ...error];
  } else {
    Object.keys(error).forEach((e) => {
      return (errors = [...errors, error[e]]);
    });
  }

  return errors.filter((e) => e);
};

const getErrors = (errorResponse) => {
  let errors = [];
  Object.keys(errorResponse).forEach((error) => {
    return (errors = [...errors, ...getError(errorResponse[error])]);
  });
  return errors;
};
