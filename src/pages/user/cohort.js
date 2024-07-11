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
            setState(user[0].state);
            setLoader(false);
        } catch (e) {
            toast.error(e?.message);
        }
    };

    const processOptions = (res, options) => {
        let neededInfo = [];
        if (res.options.length != 0) {
            if (options.find(opt => opt.type === res.addition)) {
                if (res.addition == 'slots') {
                    res.question = res.question.replace('{date}', options.find(opt => opt.type == 'slots').valuez);
                } else {
                    
                    res.question += options.find(opt => opt.type == res.addition).valuez.replace(/\|/g, '\n');
                }
            }
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

    const getQuest = () => {
        const info = data.Information.filter(a => questions.map(res => parseInt(res.id)).includes(a.id));
        const exp = data.Experience.filter(a => questions.map(res => parseInt(res.id)).includes(a.id));

        const infoField = info.map(res => ({
            name: res.id,
            label: res.question,
            type: res.type,
            options: processOptions(res, options),
            required:true
        }));

        const expField = exp.map(res => ({
            name: res.id,
            label: res.question,
            type: res.type,
            options: processOptions(res, options),
            required:true
        }));

        setSections([
            { title: "1. Information", fields: infoField },
            { title: "2. Experience", fields: expField },
            { title: "Terms and Conditions", fields: [
                {
                    type: 'checkbox',
                    name: 'terms&conditions',
                    label: 'Terms and Conditions',
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
    }, [questions]);

    const handleSubmit = async (data) => {
        const payload = {
            data:data,
            uid:auth.user.id,
            cid:id
        }
        try{
            const response = await axios.post(rootUrl(`/answers`), payload)

            console.log(response.data)
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

    return (
        <div className='bg-white rounded m-5 p-2 shadow'>
            {loader ? (
                
                <Spinner className="h-20 w-20 text-gray-300" />
            ) : (
                <div className='w-[80%] ml-[10%] pb-20 mt-2'>
                    <div className='mb-5'>
                        <span className='font-bold text-lg'>{cohort[0].name}</span>
                        <p>{cohort[0].description}</p>
                    </div>
                    {status == 0?<div className='border border-top flex items-center justify-between p-3'> Pending approval <FaCircle className='text-orange-500 ml-3'/> </div>
                    :status == 1?<div className='border border-top flex items-center justify-between p-3'>  Approved <FaCircle className='text-green-500 ml-3'/> </div>:
                    status == 2?<div className='border border-top flex items-center justify-between p-3'>  Rejected <FaCircle className='text-red-500 ml-3'/> </div>:
                    <div>
                        <FormGenerator sections={sections} onSubmit={handleSubmit} />
                    </div>}
                    
                </div>
            )}
        </div>
    );
}
