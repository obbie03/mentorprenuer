import React, {useState, useEffect} from 'react'
import { FaCogs, FaPlus, FaTrash } from 'react-icons/fa'
import ModalDefault from '../../../components/ModalDefault'
import FormGenerator from '../../../components/formGenerator';
import { toast } from 'react-toastify';
import { rootUrl } from '../../../helpers';
import axios from 'axios';
import { useAuth } from '../../../context/auth-context';
import { Chip } from '@material-tailwind/react';


export default function Settings() {

    const auth = useAuth();
    const [modal, setModal] = useState({title:'', open:false, body:'', size:'sm'})
    
    let type = ''

    
  const [languages, setLanguages] = useState([])
  const [locations, setLocations] = useState([])
  const [sectors, setSectors] = useState([])

    const handleClose = () => {
        setModal({...modal, open: false })   
    }

    const fields = [
        {type:'text', name:'name', label:'Name'},
    ]

    const fetchData = async () => {
        try{
            const data = await axios.get(rootUrl('/settings'))
            setLocations(data.data.data.filter(a=>a.type == 'location'))
            setLanguages(data.data.data.filter(a=>a.type == 'language'))
            setSectors(data.data.data.filter(a=>a.type == 'sector'))

        }catch(e){
            toast.error(e?.message)
        }
    }

    useEffect(()=>{
        fetchData()
    },[])

    const submitSetting = async (data) => {
        data['addedBy'] = auth.user.id;
        data['cid'] = auth.user.cid;
        data['type'] = type;
        try{
            const response = await axios.post(rootUrl(`/settings`), data)
            if(response.data.status == 200){
                toast.success('Submitted successfully')
                fetchData()
                setModal({...modal, open: false })  
            }else{
                toast.error(response.data.message)
            }
        }catch(e){
            toast.error(e?.message)
        }
    }

    const addSett = (name) => {
        type = name

        console.log(type)
        setModal({
            title:'Add '+name,
            open:true,
            size:'sm',
            body:<FormGenerator fields={fields} onSubmit={submitSetting} />
              })
    }

  return (
    <div className='bg-white p-4 rounded-lg shadow-lg'>

<div className='flex justify-between '>
    <div className='flex items-center font-semi-bold text-lg'>
            <FaCogs className='mr-2' /> Setup
        </div>
        
    </div>
        <hr className='my-3' />
        <div className="flex flex-wrap -mx-4">
        <div className="w-full lg:w-1/3 xl:w-1/3 px-4 mb-4">
            <div className='shadow-md border rounded-lg p-2 m-2'>
                <div className='flex justify-between'>
                    <span className='font-bold text-lg'>Languages</span>
                    <button onClick={()=>addSett("language")} className='flex items-center border bg-red-500 text-white rounded px-2'> <FaPlus/> Add</button>
                </div>
                <hr className='my-3' />
                {languages &&
                     <ul>
                     {languages.map((entry, idx) => (
                         <li key={idx} className="flex items-center justify-between m-2">
                             <div className="flex items-center gap-4">
                             <Chip
                                 value={idx + 1}
                                 variant="ghost"
                                 size="sm"
                                 className="rounded-full"
                             />
                             {entry.name}
                             </div>    
                             <FaTrash color='red'/>                        
                         </li>
                     ))}
                     </ul>
                }
            </div>
        </div>

        <div className="w-full lg:w-1/3 xl:w-1/3 px-4 mb-4">
            <div className='shadow-md border rounded-lg p-2 m-2'>
                <div className='flex justify-between'>
                    <span className='font-bold text-lg'>Locations</span>
                    <button onClick={()=>addSett("location")} className='flex items-center border bg-red-500 text-white rounded px-2'> <FaPlus/> Add</button>
                </div>
                <hr className='my-3' />
                
                {locations &&
                     <ul>
                     {locations.map((entry, idx) => (
                         <li key={idx} className="flex items-center justify-between m-2">
                             <div className="flex items-center gap-4">
                             <Chip
                                 value={idx + 1}
                                 variant="ghost"
                                 size="sm"
                                 className="rounded-full"
                             />
                             {entry.name}
                             </div>   
                             <FaTrash color='red'/>                               
                         </li>
                     ))}
                     </ul>
                }
            </div>
        </div>


        <div className="w-full lg:w-1/3 xl:w-1/3 px-4 mb-4">
            <div className='shadow-md border rounded-lg p-2 m-2'>
                <div className='flex justify-between'>
                    <span className='font-bold text-lg'>Sectors</span>
                    <button onClick={()=>addSett("sector")} className='flex items-center border bg-red-500 text-white rounded px-2'> <FaPlus/> Add</button>
                </div>
                <hr className='my-3' />
                
                {sectors &&
                     <ul>
                     {sectors.map((entry, idx) => (
                         <li key={idx} className="flex items-center justify-between m-2">
                             <div className="flex items-center gap-4">
                             <Chip
                                 value={idx + 1}
                                 variant="ghost"
                                 size="sm"
                                 className="rounded-full"
                             />
                             {entry.name}
                             </div>   
                             <FaTrash color='red'/>                               
                         </li>
                     ))}
                     </ul>
                }
            </div>
        </div>       

        </div>
        <ModalDefault title={modal.title} size={modal.size} open={modal.open} onClose={handleClose} body={modal.body}  />
    </div>
  )
}
