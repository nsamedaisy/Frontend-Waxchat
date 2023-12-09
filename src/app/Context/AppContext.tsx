"use client";
import { getAllUsers, getCurrentUser } from "@/utils/service/queries";
import { LOCAL_STORAGE } from "@/utils/service/storage";
import React, {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";

interface DataType {
  currentUser: Room;
  setCurrentUser: Dispatch<SetStateAction<Room>>;
  allUsers: Room[];
  setAllUsers: Dispatch<SetStateAction<Room[]>>;
}

const initialState: DataType = {
  currentUser: {
    id: "",
    name: "",
    email: "",
    phone: "",
    image: "",
    my_id: "",
    user_id: "",
  },
  setCurrentUser: () => {},
  allUsers: [],
  setAllUsers: () => [],
};

const AppContext = createContext<DataType>(initialState);
// export default AppContext;

export const AppContextProvider = ({ children }: any) => {
  const [currentUser, setCurrentUser] = useState<Room>(
    initialState.currentUser
  );
  const [allUsers, setAllUsers] = useState<Room[]>([]);

  const values = {
    currentUser,
    setCurrentUser,
    allUsers,
    setAllUsers,
  };

  useEffect(() => {
    getAllUsers().then((res) => {
      setAllUsers(res);
      console.log(res);
    });

    // getCurrentUser().then((res) => {
    //   // setCurrentUser(res);
    //   console.log(res);
    // });
    setCurrentUser(JSON.parse(localStorage.getItem("sender") || "{}"));
    console.log(JSON.parse(localStorage.getItem("sender") || "{}"));
  }, []);

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
