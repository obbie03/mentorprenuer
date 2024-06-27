import React from 'react';
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from '@material-tailwind/react';

const ConfirmationDialog = ({ open, title, message, onConfirm, onCancel }) => {
  return (
    <Dialog open={open} handler={onCancel}>
      <DialogHeader>{title}</DialogHeader>
      <DialogBody>
        <p>{message}</p>
      </DialogBody>
      <DialogFooter>
        <Button 
          color="gray" 
          onClick={onCancel} 
          className="mr-2"
        >
          Cancel
        </Button>
        <Button 
          color="teal" 
          onClick={onConfirm}
        >
          Confirm
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ConfirmationDialog;
