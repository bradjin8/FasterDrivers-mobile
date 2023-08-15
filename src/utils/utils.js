export const getDisplayNameFromFieldName = (name) => {
  switch (name) {
    case 'password':
      return 'password';
    case 'old_password':
      return 'Old password';
    case 'confirm_password':
      return 'Confirm password';
    case 'last_name':
      return 'last name';
    default:
      return name;
  }
};

export const getServerError = (errorObject, errorMessage) => {
  if (errorObject) {
    try {
      if (typeof errorObject === 'string') {
        return errorObject;
      }

      const fields = Object.keys(errorObject);
      const messages = [];

      fields.forEach((fieldName) => {
        const message = errorObject[fieldName];
        if (fieldName === 'non_field_errors') {
          if (typeof message === 'string') {
            messages.push(`${message}`);
          } else if (typeof message === 'object') {
            const messageContentData = Object.values(message);
            const messageContent = messageContentData && messageContentData[0];

            messages.push(`${messageContent}`);
          }
        } else {
          const displayName = getDisplayNameFromFieldName(fieldName);
          if (typeof message === 'string') {
            messages.push(
              !Number.isNaN(Number(displayName))
                ? message
                : `${message} ${displayName}`,
            );
          } else if (typeof message === 'object') {
            const messageContentData = Object.values(message);
            const messageContent = messageContentData && messageContentData[0];

            messages.push(
              !Number.isNaN(Number(displayName))
                ? messageContent
                : `${messageContent} (${displayName})`,
            );
          }
        }
      });

      return messages.join(' ~ ');
    } catch (e) {
      console.log('e :>> ', e);
      return errorMessage;
    }
  }

  return null;
};

export const truncateString = (str, length) => {
  if (str && str.length > length) {
    return `${str.substring(0, length)}...`;
  }

  return str;
};
