import { Language, ManageHistory } from '@mui/icons-material';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import data from '../../../data/questions.json';
import { Collapse, Radio, Input, Checkbox, message } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import { formatDate, rootUrl } from '../../../helpers';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';
import { Chip } from '@material-tailwind/react';
import ConfirmationDialog from '../../../components/ConfirmationDialog'
import { useAuth } from '../../../context/auth-context';

export default function ManageCohort() {
  const { id } = useParams();
  const { name } = useParams();

  const auth = useAuth();

  const [informations, setInformation] = useState([]);
  const [experiences, setExperience] = useState([]);

  const [languages, setLanguages] = useState([])
  const [locations, setLocations] = useState([])
  const [sectors, setSectors] = useState([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [certificates, setCertificates] = useState([])

  const [trainings, setTrainings] = useState([])
  const [act, setAct] = useState([])


  const [inputValue, setInputValue] = useState('');

  const [finalData, setData] = useState({});
  const { Panel } = Collapse;
  const { TextArea } = Input;

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

const delloc = (id) => {
    setLocations(locations.filter(location => location.id != id));
}


const dellan = (id) => {
    setLanguages(languages.filter(language => language.id != id));
}

const changeStartDate = (event) => {
    setStartDate(formatDate(event.target.value))
}

const changeEndDate = (event) => {
    setEndDate(formatDate(event.target.value))
}

const additional = (name) => {

    return (
        name == 'slots'?
        <>
           <span> {startDate} - {endDate}</span> 
            <div className='flex justify-between'>
            <input type='date' onChange={changeStartDate} className='border rounded p-1' />   <input type='date' onChange={changeEndDate} className='border rounded p-1' />
            </div>
        </>
        :name == 'location'?
            <>
            </>
            :name == 'language'?
                <>
                {languages &&
                    <ul>
                    {languages.map((entry, idx) => (
                        <li key={idx} className="flex items-center justify-between m-2">
                            <div className="flex items-center gap-4">
                            {entry.name}
                            </div>    
                            <FaTrash onClick={()=>dellan(entry.id)} color='red'/>                        
                        </li>
                    ))}
                    </ul>
                }
                </>
                :
                <>
                <TextArea onChange={handleChange} name={name} placeholder='seperate each element my comma (,)' />
                {act &&
                    <ul>
                    {act.filter(a=>a.type === name).map((res)=>res.arr.map((entry, idx) => (
                        <li key={idx} className="flex items-center justify-between m-2">
                            <div className="flex items-center gap-4">
                            {entry}
                            </div>                          
                        </li>
                    )))}
                    </ul>
                }
                </>
    )

}


  const renderQuestion = (question, name) => {


    if(name == 'location'){
        return <Checkbox.Group>
        {locations.map((option, index) => (
            <div className='flex items-center'>
                 <Checkbox key={index} value={option}>
                    {option.name} 
                </Checkbox>
                <button onClick={()=>delloc(option.id)}><FaTrash color='red'/></button>
            </div>
          
        ))}
   </Checkbox.Group>;

    }else{
        switch (question.type) {
            case 'select':
              return (
                <Radio.Group>
                  {question.options.map((option, index) => (
                    <Radio key={index} value={option}>
                      {option}
                    </Radio>
                  ))}
                </Radio.Group>
              );
            case 'checkbox':
              return <Checkbox.Group>
                           {question.options.map((option, index) => (
                              <Checkbox key={index} value={option}>
                                  {option}
                              </Checkbox>
                           ))}
                      </Checkbox.Group>;
              case 'text':
              return <Input />;
            case 'textarea':
              return <TextArea rows={4} />;
            default:
              return null;
          }
    }

  };

  const onDragEnd = (result) => {
    const questId = result.draggableId
    const section = result.source.droppableId
    if(section.toLowerCase() == 'information'){
        setInformation([...informations, data[section].filter(a=>a.id ==  questId)[0]])
    }
    if(section.toLowerCase() == 'experience'){
        setExperience([...experiences, data[section].filter(a=>a.id == questId)[0]])
    }   
  };

  const submitData = () => {

    setMod({
        open: true,
        title: 'Warning',
        message: 'Are you sure you want to submit these questions?',
        onConfirm: async () => {

          var questions = [
            ...data.Information.map((res) => res.id),
            ...data.Experience.map((res) => res.id)
          ];
        
          var other = [
            {
              type:"slots",
              arr:[startDate]
            },
            ...act,
            {
              type:'location',
              arr: locations.map((res)=>res.name)
            },
            {
              type:'language',
              arr: languages.map((res)=>res.name)
            },
          ]
        
          var payload = {
            cid:auth.user.cid,
            questions:questions,
            other:other
          }

          try{

            const response = await axios.post(rootUrl('/cohortQuestions'), payload)

            console.log(response)

            if(response.data.status  == 200){

              toast.success("Successful")

            }else{
              toast.error("Something went wrong")
            }

          }catch(e){
            toast.error(e?.message)
          }
            
        }
    });

  }

  useEffect(() => {
    setData({
      Information: informations,
      Experience: experiences
    });
  }, [informations, experiences]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const newValue = value.split(',');
    setAct(prevAct => {
        const existingObjIndex = prevAct.findIndex(item => item.type === name);
        if (existingObjIndex !== -1) {
          const updatedAct = [...prevAct];
          updatedAct[existingObjIndex] = { type: name, arr: newValue };
          return updatedAct;
        } else {
          return [...prevAct, { type: name, arr: newValue }];
        }
      });
  }

  const [mod, setMod] = useState({ open: false, title: '', message: '', onConfirm: null })

  const handleModClose = () =>{
    setMod({ ...mod, open: false });
  }

  return (
    <div className='bg-white p-4 rounded-lg shadow-lg'>
      <div className='flex justify-between '>
        <div className='flex items-center font-semi-bold text-lg'>
          <ManageHistory className='mr-2' /> {name}
        </div>
      </div>
      <hr className='my-3' />
      

      <div className="flex flex-wrap -mx-4">
        <div className="w-full lg:w-1/2 xl:w-1/2 px-4 mb-4">
          <div className='border rounded p-2'>
            <span className='font-bold text-lg'>Our Questions</span>
            <hr className='my-3' />

            <div className="p-4">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="dropHere">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                          {Object.keys(finalData).map((section, idx) => (
                            <Collapse key={idx} className="mb-4">
                            <Panel header={section} key={section}>
                                {finalData[section].map((question) => (
                                <div key={question.id} className="mb-4">
                                    <div className="font-semibold">{question.question}</div>
                                    {question.addition && (
                                    <div className="text-sm text-gray-500">
                                        {additional(question.addition)}
                                    </div>
                                    )}
                                    <div className="mt-2">{renderQuestion(question, question.addition)}</div>
                                </div>
                                ))}
                            </Panel>
                            </Collapse>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
            <hr className='my-3' />
            {informations.length > 0?<button onClick={submitData} className='flex items-center bg-red-500 text-white p-2 px-4 rounded'>Submit</button>:''}
          </div>
        </div>

        <div className="w-full lg:w-1/2 xl:w-1/2 px-4 mb-4">
          <div className='border rounded p-2'>
            <span className='font-bold text-lg'>Pull of Questions</span>
            <hr className='my-3' />

            <div className="p-4">
              <DragDropContext onDragEnd={onDragEnd}>
                {Object.keys(data).filter(section => section !== 'dropHere').map((section, idx) => (
                  <Collapse key={idx} className="mb-4">
                    <Panel header={section} key={section}>
                      <Droppable droppableId={section}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.droppableProps}>
                            {data[section].map((question, index) => (
                              <Draggable key={question.id} draggableId={`${question.id}`} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="mb-4 p-2 border rounded"
                                  >
                                    <div className="font-semibold">{question.question}</div>
                                    {question.addition && (
                                      <div className="text-sm text-gray-500">
                                       {additional(question.addition)}
                                      </div>
                                    )}
                                    <div className="mt-2">{renderQuestion(question, question.addition)}</div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </Panel>
                  </Collapse>
                ))}
              </DragDropContext>
            </div>
          </div>
        </div>
      </div>
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


