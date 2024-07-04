import { rootUrl } from "../helpers";
import axios from "axios";
import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";

import LoginSignupModal from "../components/loginModal";
const AuthContext = createContext({ user: null, login: null, logOut: null });


export function AuthProvider({ children }) {
  const getUser = () => {
    const personId = localStorage.getItem("userId")
    try {
      const userData = JSON.parse(localStorage.getItem(personId))
      return userData
    } catch (error) {
      return null
    }
  };
  const [user, setUser] = useState(getUser);
  let login = async (values, callback) => {
    try {
      const response = await axios.post(rootUrl("/login"), values)
      if(response.data.status == 200){
        const fetchedUser = response.data.data
          localStorage.setItem("userId", fetchedUser.userId)
          localStorage.setItem(fetchedUser.userId, JSON.stringify(fetchedUser))
          setUser(response.data.data)
          toast.success("Login Successful")
          callback()
    }else{
      toast.error(response.data.message)
    }

    } catch (error) {
      toast.error("An error occured while logging in")
      toast.error(error?.message)
    }
  };

  let logOut = (callback) => {
    localStorage.clear()
    callback()
  };

  let value = { user, login, logOut }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function RequireAuth({ children }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpened, setIsModalOpened] = useState(false); 
    const handleOpenModal = () => {
      if (!isModalOpened) { 
        setIsModalOpen(true);
        setIsModalOpened(true); 
      }
    };
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };

    const auth = useAuth();
    if (!auth || !auth.user) {
      handleOpenModal();
    }
    return (
      <>
        {isModalOpen && (
          <LoginSignupModal open={isModalOpen} handleClose={handleCloseModal} />
        )}
        {children}
      </>
    );
  }

  export function useAuth() {
    const auth = useContext(AuthContext);
    if (!auth) {
      throw new Error("Auth context is null");
    }
    return auth;
  }
