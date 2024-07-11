import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/auth-context'
import { toast } from 'react-toastify';
import axios from 'axios';
import { formatDate, rootUrl } from '../../helpers';
import { FaRegUserCircle, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

export default function Profile() {

    const auth = useAuth();

    const [bioData, setBioData] = useState([]);

    const fetchData = async () => {

      try{
        const data =  await axios.get(rootUrl(`/user/${auth.user.id}`))
        if(data.data.status == 200){
          setBioData(data.data.data.biodata[0])
        }else{
          toast.error("Something went wrong")
        }

      }catch(e){
        toast.error(e?.message)
      }

    }

    useEffect(()=>{
      fetchData()
    },[])

    const logout = () => {
        auth.logOut(()=>{
          window.location.href='/';
        })
    }
    
  return (
    <div className='pb-20'>
      <div className='bg-white p-4 flex justify-center items-center rounded-bl-3xl rounded-br-3xl pb-5'> 
        <div  className='flex justify-center items-center'>
        <FaRegUserCircle size={150} color='gray' />
        {bioData && 
          <div className='ml-3 font-semibold text-gray-500 text-lg'>
          <span>{bioData.firstName} {bioData.otherName} {bioData.lastName}</span> <br/>
          <span>{bioData.gender}</span> <br/>
          <span>{bioData.dob}</span> <br/>

          <FaSignOutAlt onClick={logout} size={25} className='text-red-500'/>
          </div>
        }
        </div>

        
        
      </div>

      <div className='text-gray-500 text-lg bg-white p-4 text-center rounded-3xl w-[80%] ml-[10%] mt-[2%] shadow-lg'>
          <p className='font-bold'>Other Details</p>
          <hr className='my-2' />
          <p>{bioData.email}</p>
          <p>{bioData.phoneNumber}</p>
          <p>{bioData.level}</p>
          <p>{bioData.field}</p>
      </div>

      <div className='text-gray-500 text-lg bg-white p-4 text-center rounded-3xl w-[80%] ml-[10%] mt-[2%] shadow-lg'>
          <p className='font-bold'>Cohorts</p>
          <hr className='my-2' />
          
      </div>
      
    </div>
  )
}
