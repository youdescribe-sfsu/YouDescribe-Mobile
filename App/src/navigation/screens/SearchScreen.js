import RecentSearches from '../../components/RecentSearches';
import SearchResults from '../../components/SearchResults';

import { useSearch } from '../../contexts/SearchContext';

export default function SearchScreen() {
  const searchTerm = useSearch();

  if(!searchTerm){
    console.log("RecentSearches");
    return ( <RecentSearches></RecentSearches> );
  }
  console.log("Search Results");
  return (
    <SearchResults></SearchResults>
  );
}