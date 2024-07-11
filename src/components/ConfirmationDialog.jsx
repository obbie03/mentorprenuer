import React from 'react';
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from '@material-tailwind/react';

const ConfirmationDialog = ({ open, title, message, onConfirm, onCancel }) => {
  return (
    <Dialog className="fixed top-[10%] left-[25%] px-4 py-8 md:max-w-lg lg:max-w-xl xl:max-w-2xl z-0" open={open} handler={onCancel}>
      <DialogHeader className="justify-between">{title}</DialogHeader>
      <DialogBody>
      <div className="overflow-y-auto max-h-[60vh]">
        <p>{message}</p>
        </div>
      </DialogBody>
      <DialogFooter>
        <button 
          onClick={onCancel} 
          className='flex items-center bg-gray-500 text-white p-2 px-4 rounded mr-2'
        >
          Cancel
        </button>
        <button 
          className='flex items-center bg-green-500 text-white p-2 px-4 rounded'
          onClick={onConfirm}
        >
          Confirm
        </button>
      </DialogFooter>
    </Dialog>
  );
};

export default ConfirmationDialog;
