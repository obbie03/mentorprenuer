import React, { useEffect, useState } from 'react'
import { FaEye, FaThumbsDown, FaThumbsUp, FaUsers } from 'react-icons/fa6';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/auth-context';
import axios from 'axios';
import { rootUrl } from '../../../helpers';
import { toast } from 'react-toastify';
import { Spinner } from '@material-tailwind/react'
import DataTable from "react-data-table-component";
import ModalDefault from '../../../components/ModalDefault';
import data from '../../../data/questions.json';
import ConfirmationDialog from '../../../components/ConfirmationDialog';

export default function CohortUsers() {

    const { id } = useParams();
    const { name } = useParams();

    const [users, setUsers] = useState([])
    const [loader, setLoader] = useState(true)

    const [modal, setModal] = useState({title:'', open:false, body:'', size:'sm'})

    const auth = useAuth();

    const fetchData = async () =>{

        try{
            const data = await axios.get(rootUrl(`/getCohortUsers/${id}`))
            if(data.data.status == 200){
                setUsers(data.data.data)
                setLoader(false)
            }
        }catch(e){
            toast.error(e?.message)
        }
    }

    useEffect(()=>{
        fetchData()
    }, [])

   

     const column =[
      {
        name: 'Names',
        cell: row => <div>{row.firstName + " "+ row.lastName}</div>,
      },
      {
        name: 'Phone Number',
        cell: row => (row.phoneNumber)
      },
      {
        name: 'Field',
        cell: row => (row.field)
      },
      {
        name: 'Status',
        cell: row => <div className=''>{row.state == 0?'Pending':row.state == 1?'Approved':'Rejected'}</div>
      },
      {
        name: 'Actions',
        cell: row => <div className='text-lg'> <FaEye onClick={()=>openModal(row.userId)} className='mr-2 text-blue-500' /> </div>
      }
    ]


    const handleClose = () => {
        setModal({...modal, open: false })   
    }

    const updateUserStatus = (userId, status) => {
      setUsers(users.map(user => (user.userId === userId ? { ...user, state: status } : user)));
    };

    const openModal = (uid) => {
        setModal({
            title:'View User',
            open:true,
            size:'sm',
            body:<ShowUser user={users.filter(a=>a.userId == uid)[0]} cohortId={id}  updateUser={updateUserStatus} handleClose={handleClose} />
              })
    }

  return (
    <div className='bg-white p-4 rounded-lg shadow-lg'>
        <div className='flex justify-between '>
        <div className='flex items-center font-semi-bold text-lg'>
          <FaUsers className='mr-2' /> {name}
        </div>
      </div>
      <hr className='my-3' />

      {
        loader?
        <Spinner className="h-20 w-20 text-gray-300" />
        :(
            <>
               <DataTable 
                    columns={column} 
                    data={users && users} 
                    responsive
                    pagination 
                        />
                        <ModalDefault title={modal.title} size={modal.size} open={modal.open} onClose={handleClose} body={modal.body}  />
                        </>
        )
      }

    </div>
  )
}



function ShowUser({ user, cohortId, updateUser, handleClose }) {
  const [answers, setAnswers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calculatedScore , setScore] = useState(0);
  
  useEffect(() => {
      const fetchUserData = async () => {
          try {
              const response = await axios.get(rootUrl(`/getAnswers/${cohortId}/${user.userId}`));
              setAnswers(response.data.data);
              var answers = response.data.data.filter(a=>[3, 4, 13, 8, 7, 15].includes(parseInt(a.qid)))
              const datas = [...data.Information, ...data.Experience]
              let score = 0
              answers.map((res)=>{
                const opt = datas.filter(a=>a.id == res.qid)[0].options
                var mark = parseInt(opt.filter(a=>a.includes(res.response))[0].split('~')[1])
                score += mark
              })
              var exp = parseInt(response.data.data.filter(a=>a.qid == 9)[0]?.response)
              var mark = exp<5?0:exp<10?2:exp<15?4:5
              score += mark
              var lev = user.level
              var mark = lev==1?1:lev == 2?2:lev == 3?2:lev == 4?3:lev == 4?3:4
              score += mark

              setScore(score)
              setLoading(false);
          } catch (e) {
              toast.error(e?.message);
          }
      };

      fetchUserData();
  }, [user.userId, cohortId]);


  const approve = async (uid, action) =>{

    setMod({
      open: true,
      title: 'Warning',
      message: `Are you sure you want ${action==1?'Approve':'Reject'}?`,
      onConfirm: async () => {

        const payload = {
          user:uid,
          cohortId:cohortId,
          action:action
        }
     
        try{

          const response = await axios.post(rootUrl('/approveUser'), payload)
          if(response.data.status  == 200){
            toast.success("Successful")
            updateUser(user.userId, action);
            setMod({ ...mod, open: false });
            handleClose();
          }else{
            toast.error("Something went wrong")
          }

        }catch(e){
          toast.error(e?.message)
        }
          
      }
  });

  }

  const handleModClose = () =>{
    setMod({ ...mod, open: false });
  }

  const [mod, setMod] = useState({ open: false, title: '', message: '', onConfirm: null })

  if (loading) {
      return <Spinner className="h-20 w-20 text-gray-300" />;
  }

  return (
      <div className='text-center'>
         <span className='text-2xl font-bold'>{user.firstName + " " +user.lastName}</span><br/>
         <span className='text-lg font-semibold'>{user.phoneNumber}</span><br/>
         <span className='text-lg font-semibold'>{user.gender}</span><br/>
         <span className='text-lg font-semibold'>{user.state == 0?'Pending':user.state == 1?'Approved':'Rejected'}</span><br/>
         <span className='text-lg font-semibold'>Score: {calculatedScore}</span><br/>
         <hr className='my-2' />
         <p className='flex justify-center text-2xl'>{user.state == 0?<><FaThumbsUp onClick={()=>approve(user.userId, 1)} className='m-2 text-green-500' /> <FaThumbsDown onClick={()=>approve(user.userId, 2)} className='m-2 text-red-500' /></>:user.state == 1?'':''}  </p>

         <ConfirmationDialog
                open={mod.open}
                title={mod.title}
                message={mod.message}
                onConfirm={mod.onConfirm}
                onCancel={handleModClose}
            />
      </div>
  );
}


