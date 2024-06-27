import { rootUrl } from "../helpers";
import axios from "axios";
import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";

import LoginSignupModal from "../components/loginModal";
let AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const getUser = () => {
    const personId = localStorage.getItem("personId")
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
      const response = await axios.post(rootUrl("users/login"), values)

      if (response.data.data) {
        const fetchedUser = response.data.data
        
        localStorage.setItem("personId", fetchedUser.personId)
        localStorage.setItem(fetchedUser.personId, JSON.stringify(fetchedUser))

        setUser(response.data.data)

        toast.success("Login Successful")
        callback()
      } else {
        toast.error("Invalid Username or Password")
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
    if (!auth.user) {
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
  return useContext(AuthContext)
}
