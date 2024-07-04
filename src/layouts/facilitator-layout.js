import { Dashboard } from '@mui/icons-material';
import React, { useState } from 'react';
import { AiOutlineBell, AiOutlineUser } from 'react-icons/ai';
import { FaBars, FaChartBar, FaCogs, FaHandshake, FaUser, FaBell, FaList, FaCog } from 'react-icons/fa';
import { FaListCheck } from 'react-icons/fa6';
import { MdDashboard } from 'react-icons/md';
import { Outlet, useLocation, NavLink  } from 'react-router-dom';
import { useAuth } from '../context/auth-context';

export default function FacilitatorLayout() {

  const auth = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const currentUrl = location.pathname + location.search;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const routes = [
    { path: '/facilitator', name: 'Dashboard', icon: <MdDashboard className="mr-2" /> },
    { path: '/facilitator/matching', name: 'Matching', icon: <FaHandshake className="mr-2" /> },
    { path: '/facilitator/cohorts', name: 'Cohorts', icon: <FaListCheck className="mr-2" /> },
    { path: '/facilitator/settings', name: 'Setting', icon: <FaCog className="mr-2" /> },
    { path: '/facilitator/reports', name: 'Reports', icon: <FaChartBar className="mr-2" /> }
  ];
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`w-1/5 text-lg bg-white text-black p-4 m-4 rounded-lg shadow-lg fixedh-[90vh] transform  lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="mb-4 text-center font-bold">
          <img src="/manFav.png" alt="Logo" className="mx-auto w-1/3" />
          MENTORpreneur
        </div>

        <hr className='mb-5' />
        <ul className="space-y-2">
          {routes.map((route) => (
            <li
              key={route.path}
              className={`border-red-500 rounded-lg cursor-pointer py-2 px-4 flex items-center ${currentUrl === route.path ? 'border' : ''}`}
            >
              <NavLink to={route.path} className="flex items-center w-full">
                {route.icon} {route.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className={`p-6 ml-auto w-full lg:w-4/5`} id="main-content">
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <header className="flex justify-between items-center">
            <h1 className="text-xl font-semibold flex items-center">
              {/* <button className="mr-2 text-gray-800 cursor-pointer lg:hidden" onClick={toggleSidebar}>
                <FaBars/>
              </button> */}
              <span>Facilitator</span>
            </h1>
           
            <div className="flex items-center space-x-4">
              <a href="#" className="relative text-gray-800 flex items-center">
                <AiOutlineBell size={30} className='m-2'/>
                <AiOutlineUser size={30} className='m-2'/>
              </a>
              <a className="text-gray-800 flex items-center">
                <i className="fa fa-user fa-2x mr-1"></i>
              </a>
            </div>
          </header>
        </div>

        <Outlet />

        <div className="bg-white rounded-lg shadow p-2 mt-4">
          <footer className="text-center">
            &copy; 2023. All rights reserved.
          </footer>
        </div>
      </div>
    </div>
  );
}
