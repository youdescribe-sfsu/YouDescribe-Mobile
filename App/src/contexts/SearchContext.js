import { useState, useContext, createContext } from "react";

const SearchContext = createContext();
const SearchUpdateContext = createContext();

export function useSearch() {
    return useContext(SearchContext);
}

export function useSearchUpdate() {
    return useContext(SearchUpdateContext);
}

export function SearchProvider({children}) {
    const [searchTerm, setSearchTerm] = useState(null);

    const updateSearchTerm = (term) => {
        setSearchTerm(term);
    }

    return (
        <SearchContext.Provider value={searchTerm}>
            <SearchUpdateContext.Provider value={updateSearchTerm}>
                {children}
            </SearchUpdateContext.Provider>
        </SearchContext.Provider>
    );
}