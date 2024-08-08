import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { rootUrl } from '../../helpers';
import { Spinner } from '@material-tailwind/react';
import data from '../../data/questions.json';
import FormGenerator from '../../components/formGenerator';
import { useAuth } from '../../context/auth-context';
import { FaCircle } from 'react-icons/fa6';

export default function CohortView() {
    const { id } = useParams();
    const [questions, setQuestions] = useState([]);
    const [options, setOptions] = useState([]);
    const [cohort, setCohort] = useState([]);
    const [loader, setLoader] = useState(true);
    const [sections, setSections] = useState([]);
    const [activeButton, setActiveButton] = useState(null);

    const [type, setType] = useState('');

    const [status, setState] = useState(9);

    const auth = useAuth();

    

    const fetchData = async () => {

        if(!auth.user){
            return
        }
        try {
            const response = await axios.get(rootUrl(`/getQuestions/${id}/${auth.user.id}`));
            const { questions, options, cohort, user} = response.data.data;
            setQuestions(questions);
            setOptions(options);
            setCohort(cohort);
            setState(user[0]?.state);
            setLoader(false);
        } catch (e) {
            toast.error(e?.message);
        }
    };

    const processOptions = (res, options) => {
        let neededInfo = [];
        if (res.options.length != 0) {
            res.options.forEach(ult => {
                neededInfo.push({ value: ult.split('~')[0], name: ult.split('~')[0] });
            });
        } else {
            if (options.find(opt => opt.type == res.addition)) {
                options.find(opt => opt.type == res.addition).valuez.split('|').forEach(ult => {
                    neededInfo.push({ value: ult, name: ult });
                });
            }
        }
        return neededInfo;
    };

    const processQuest = (res)=>{
        if (res.options.length != 0) {
            if (options.find(opt => opt.type == res.addition)) {
                if (res.addition == 'slots') {
                    res.question = res.question.replace('{date}', options.filter(opt => opt.type == 'slots')[0]?.valuez);
                } else {
                    const appendedText = options.filter(opt => opt.type == res.addition)[0]?.valuez.replace(/\|/g, '\n');
                    if(!res.question.includes(appendedText)){
                        res.question += '\n' + options.filter(opt => opt.type == res.addition)[0]?.valuez.replace(/\|/g, '\n');
                    }
                    
                }
            }
        }
        return res.question
    }

    const getQuest = () => {
        const info = data.Information.filter(a => questions.map(res => parseInt(res.qid)).includes(a.id) && (a.category.toLowerCase() == type ||  a.category.toLowerCase() == 'both'));
        const exp = data.Experience.filter(a => questions.map(res => parseInt(res.qid)).includes(a.id) && (a.category.toLowerCase() == type ||  a.category.toLowerCase() == 'both'));

        const infoField = info.map(res => ({
            name: res.id,
            label: processQuest(res),
            type: res.type,
            options: processOptions(res, options),
            required:true
        }));

        const expField = exp.map(res => ({
            name: res.id,
            label: processQuest(res),
            type: res.type,
            options: processOptions(res, options),
            required:true
        }));

        setSections([
            { title: "1. Information", fields: infoField },
            { title: "2. Experience", fields: expField },
            { title: "Terms and Conditions", fields: [
                {
                    type: 'link',
                    name: 'Click here to open terms and conditions',
                    label: 'Terms and Conditions apply',
                    link: type=="mentor"?'https://webapp.mentorpreneur.net/Mentor_Agreement_General_2024.pdf':'https://webapp.mentorpreneur.net/Mentee_Agreement_General_2024.pdf',
                    required:true,
                    options: [
                      { value: 'tsandcs', name: 'Agree to terms and conditions', },
                    ],
                  },
            ] },
        ]);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        getQuest();
    }, [questions, type]);

    const handleSubmit = async (data) => {
        
        data['14'] = type

        const payload = {
            data:data,
            uid:auth.user.id,
            cid:id
        }
        try{
            const response = await axios.post(rootUrl(`/answers`), payload)
            if(response.data.status == 200){
                toast.success("Successful")
                setState(0)
            }else{
                toast.error("Something went wrong")
            }

        }catch(e){
            toast.error(e?.message)
        }
        
    };

    const render = (type)=>{
        setType(type)
        setActiveButton(type);
    }

    return (
        <div className='bg-white rounded m-5 p-2 shadow'>
            {loader ? (
                
                <Spinner className="h-20 w-20 text-gray-300" />
            ) : (
                <div className='w-[80%] ml-[10%] pb-20 mt-2'>
                    <div className='mb-5 bg-red-500 text-white p-1 rounded shadow-lg text-center'>
                        <span className='font-bold text-lg'>{cohort[0].name}</span>
                        <p>{cohort[0].description}</p>
                    </div>
                    {status == 0?<div className='border border-top flex items-center justify-between p-3'> Pending approval <FaCircle className='text-orange-500 ml-3'/> </div>
                    :status == 1?<div className='border border-top flex items-center justify-between p-3'>  Approved <FaCircle className='text-green-500 ml-3'/> </div>:
                    status == 2?<div className='border border-top flex items-center justify-between p-3'>  Rejected <FaCircle className='text-red-500 ml-3'/> </div>:
                    <div>

                    <div className='flex justify-center'>
                        <button onClick={()=>render('mentor')} className={`py-3 px-6 rounded-3xl border border-red-500 m-5 font-bold ${activeButton === 'mentor' ? 'bg-red-500 text-white' : ''}`}>Mentor</button>
                        <button onClick={()=>render('mentee')} className={`py-3 px-6 rounded-3xl border border-red-500 m-5 font-bold ${activeButton === 'mentee' ? 'bg-red-500 text-white' : ''}`}>Mentee</button>
                    </div>
                        {
                            type.length == 0?(
                                <></>
                            ):(
                                <FormGenerator sections={sections} onSubmit={handleSubmit} />
                            )
                        }

                        
                    </div>}
                    
                </div>
            )}
        </div>
    );
}
