// src/components/NavBar.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, InputBase, Box } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

import { AiOutlineBell, AiOutlineHome, AiOutlineOrderedList, AiOutlineUser } from 'react-icons/ai';

const SearchBox = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));






export default function NavBar() {

  const navigate = useNavigate();

  const handleClick = (link) => {
    navigate(link); 
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#fff' }}>
        <Toolbar className="flex justify-between">
          <Box className="flex items-center space-x-2">
            <img src="/manFav.png" alt="Logo" className="h-10" />
          </Box>
          <Box className="text-gray-500" sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
                <IconButton color="inherit">
                <AiOutlineHome size={30}/>
                </IconButton>
                <IconButton color="inherit">
                <AiOutlineOrderedList size={30} />
                </IconButton>
                <IconButton color="inherit">
                <AiOutlineBell size={30} />
                </IconButton>
          </Box>
          <IconButton onClick={()=>handleClick('/profile')} edge="end">
            <AiOutlineUser size={30} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box className="text-gray-500" sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'space-around', position: 'fixed', bottom: 0, width: '100%', backgroundColor: '#fff',boxShadow: '0 -2px 5px rgba(0,0,0,0.2)' }}>
        <IconButton color="inherit">
          <AiOutlineHome size={30}/>
        </IconButton>
        <IconButton color="inherit">
          <AiOutlineOrderedList size={30} />
        </IconButton>
        <IconButton color="inherit">
          <AiOutlineBell size={30} />
        </IconButton>
      </Box>
    </Box>
  );
}
