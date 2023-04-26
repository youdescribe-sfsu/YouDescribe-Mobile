import { useState, useContext, createContext } from "react";

const DescriptionActivityContext = createContext();
const DescriptionActivityUpdateContext = createContext();

export function getDescriptionActivity() {
    return useContext(DescriptionActivityContext);
}

export function setDescriptionActivity() {
    return useContext(DescriptionActivityUpdateContext);
}

export function DescriptionActivityProvider({children}) {
    const [isDescriptionActive, setIsDescriptionActive] = useState(true);

    const updateIsDescriptionActive = (flag) => {
        setIsDescriptionActive(flag);
    }

    return (
        <DescriptionActivityContext.Provider value={isDescriptionActive}>
            <DescriptionActivityUpdateContext.Provider value={updateIsDescriptionActive}>
                {children}
            </DescriptionActivityUpdateContext.Provider>
        </DescriptionActivityContext.Provider>
    );
}