import React, { useEffect, useState } from 'react'
import { FaListCheck, FaPlus } from 'react-icons/fa6'
import FormGenerator from '../../../components/formGenerator'
import ModalDefault from '../../../components/ModalDefault'
import { useAuth } from '../../../context/auth-context'
import { toast } from 'react-toastify'
import axios from 'axios'
import { rootUrl } from '../../../helpers'
import { Spinner } from '@material-tailwind/react'
import { Link } from 'react-router-dom'


export default function Cohorts() {

    const auth = useAuth();
    const [cohorts, setCohorts] = useState([])
    const [loader, setLoader] = useState(true)
    const [modal, setModal] = useState({title:'', open:false, body:'', size:'sm'})

    const fields = [
        {type:'text', name:'name', label:'Name'},
        {type:'textarea', name:'description', label:'Description'},
    ]

    const fetchData = async () => {

        try{
            const data = await axios.get(rootUrl(`/cohorts/${auth.user.cid}`))
            if(data.data.status == 200){
                setCohorts(data.data.data)
                setLoader(false)
            }else{
                toast.error(data.data.message)
            }
        }catch(e){
            toast.error(e?.message)
        }
    }

    useEffect(()=>{
        fetchData()
    },[])

    const submitCohort = async (data) => {
        data['addedBy'] = auth.user.id
        data['cid'] = auth.user.cid
        try{
            const response = await axios.post(rootUrl(`/addCohort`), data)
            if(response.data.status == 200){
                toast.success('Submitted successfully')
                setModal({...modal, open: false })  
            }else{
                toast.error(response.data.message)
            }
        }catch(e){
            toast.error(e?.message)
        }
    }

    const openModal = () => {
        setModal({
            title:'Add Cohort',
            open:true,
            size:'sm',
            body:<FormGenerator fields={fields} onSubmit={submitCohort} />
              })
    }

    const viewCohort = (id, name) =>{

        setModal({
            title:name,
            open:true,
            size:'lg',
            body:'hello'
              })

    }

    const handleClose = () => {
        setModal({...modal, open: false })   
    }

  return (
    <div className='bg-white p-4 rounded-lg shadow-lg'>
<div className='flex justify-between '>
    <div className='flex items-center font-semi-bold text-lg'>
            <FaListCheck className='mr-2' /> Cohorts
        </div>
        <button onClick={openModal} className='flex items-center bg-red-500 text-white p-2 px-4 rounded'> <FaPlus/> Add</button>
    </div>
        <hr className='my-3' />

        {
            loader?
            <Spinner className="h-20 w-20 text-gray-300" />
            :(
                cohorts.length > 0?(
                    <div className='mt-5 pt-5'>
                    <ul className="grid grid-cols-3 gap-4">
                    {cohorts.map((res) => (
                        <Link key={res.id} to={`/facilitator/cohorts/manage/${res.id}/${res.name}`}>
                      <li key={res.id} className="bg-gray-200 p-4 rounded shadow-md">
                          <h2 className="text-xl font-semibold">{res.name}</h2>
                          <p className="text-gray-600">{res.description}</p>
                      </li>
                      </Link>
                    ))}
                  </ul>
                  </div>
                ):'No cohorts to display'
            )
        }
    <ModalDefault title={modal.title} size={modal.size} open={modal.open} onClose={handleClose} body={modal.body}  />
    </div>
  )
}
