import React from 'react'
import {AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button} from "@chakra-ui/react";

export default function ConfirmDialog(props) {
  const {isOpen, onOk, title, message, onClose} = props
  const captionCancel = props.captionCancel || 'Cancel'
  const captionOk = props.captionOk || 'Delete'

  const cancelRef = React.useRef()

  return (
    <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>
            {title}
          </AlertDialogHeader>

          <AlertDialogBody>
            {message}
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>{captionCancel}</Button>
            <Button colorScheme='red' onClick={onOk} ml={3}>
              {captionOk}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
