import { useState, useContext, createContext } from "react";

const UserContext = createContext();
const UserUpdateContext = createContext();

export function getUser() {
    return useContext(UserContext);
}

export function useUserUpdate() {
    return useContext(UserUpdateContext);
}

export function UserProvider({children}) {
    const [user, setUser] = useState(null);

    const updateUser = (userInfo) => {
        if(!userInfo){
            setUser(null);
        }else{
            userInfo = JSON.parse(userInfo);
            setUser(userInfo);
        }
    }

    return (
        <UserContext.Provider value={user}>
            <UserUpdateContext.Provider value={updateUser}>
                {children}
            </UserUpdateContext.Provider>
        </UserContext.Provider>
    );
}