import { useAuth } from '../context/auth-context';
import React, { useState } from 'react';
import { Modal, Box, Tab, Tabs, TextField, Button } from '@mui/material';
import FormGenerator from './formGenerator';
import { toast } from "react-toastify";
import axios from 'axios';
import { rootUrl } from '../helpers';
const LoginSignupModal = ({ open, handleClose }) => {
  const [tabIndex, setTabIndex] = useState(0);

  const auth = useAuth()

  const handleTabChange = (newValue) => {
    setTabIndex(newValue);
  };


  const handleLoginSubmit = async (data) => {

    auth.login(data, () => {
      handleClose()
    })
  };

  const handleSignupSubmit = async (data) => {
    
    if(data['password'] != data['confirmPassword']){
      toast.error('Password do not match!')
      return
  }
      
  try{
      const response = await axios.post(rootUrl('/users'), data)
      console.log(response)
      if(response.data.status == 200){
          toast.success('Successful')
          setTabIndex(0)
      }else{
        toast.error(response.data.message)
      }
  }catch(e){
      toast.error(e?.message)
  }
  };
  const loginFields = [
    { type: 'text', name: 'email', label: 'Email', required:true },
    { type: 'password', name: 'password', label: 'Password', required:true },
  ]
  const signUpFields = [
    { type: 'text', name: 'firstName', label: 'First Name', required: true },
    { type: 'text', name: 'otherName', label: 'Other Name' },
    { type: 'text', name: 'lastName', label: 'Last Name', required: true },
    { type: 'text', name: 'email', label: 'Email', required: true },
    { type: 'text', name: 'phoneNumber', label: 'Phone Number', required: true },
    { type: 'date', name: 'dateOfBirth', label: 'Date of Birth', required: true },
    { type: 'text', name: 'educationLevel', label: 'Highest Level of Education', required: true },
    { type: 'text', name: 'fieldOfStudy', label: 'Field of Study', required: true },
    { type: 'password', name: 'password', label: 'Password', required: true },
    { type: 'password', name: 'confirmPassword', label: 'Confirm Password', required: true },

];

  return (
    <Modal
      open={open}
      onClose={handleClose}
      className=''
    >
      <Box className='bg-white mt-20 h-[90vh] fixed w-full bottom-0 rounded-t-3xl overflow-y-auto'>
        <div className='flex justify-center p-5 m-5'>
        {tabIndex === 0 && (
            <div>
            <div className='font-semi-bold text-center border-bottom'>
                <span className='text-3xl'> MENTORpreneur Zambia </span>
                <p className='text-lg'> Welcome, Please login to your account. </p>
            </div>
            <hr className="border-b-gray-200 p-3 m-3"></hr>
                <FormGenerator fields={loginFields} onSubmit={handleLoginSubmit} />
                <div className='text-center m-5'>Don't have an account? <span onClick={()=>handleTabChange(1)} className='text-blue-500'>Signup</span> </div>
            </div>
         
        )}
        {tabIndex === 1 && (
            <div>
                 <div className='font-semi-bold text-center border-bottom'>
                <span className='text-3xl'> MENTORpreneur Zambia </span>
                <p className='text-lg'> Welcome, Please create an account. </p>
            </div>
            <hr className="border-b-gray-200 p-3 m-3"></hr>
             <FormGenerator fields={signUpFields} onSubmit={handleSignupSubmit} />
             <div className='text-center m-5'>Already have an account?  <span onClick={()=>handleTabChange(0)} className='text-blue-500'>login</span> </div>
            </div>
          
        )}
        </div>
      </Box>
    </Modal>

  );
};

export default LoginSignupModal;
