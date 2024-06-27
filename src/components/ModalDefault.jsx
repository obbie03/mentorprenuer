
import {

  Dialog,
  DialogHeader,
  DialogBody,
  IconButton,
  Typography,

} from "@material-tailwind/react";

export function ModalDefault(props) {

  const p = props;


  return (
    
      

      <Dialog className="p-4 z-0" size={p.size} open={p.open} >

        <DialogHeader className="justify-between">
          <Typography className="text-lg font-bold">{p.title}</Typography>
          <IconButton
            color="gray"
            size="sm"
            variant="text"
            onClick={p.onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </DialogHeader>
        <hr></hr>
        <DialogBody>
          <div className="overflow-y-auto max-h-[75vh]">
            {p.body}
          </div>
          
        </DialogBody>
      </Dialog>
  
  );
}

export default ModalDefault;