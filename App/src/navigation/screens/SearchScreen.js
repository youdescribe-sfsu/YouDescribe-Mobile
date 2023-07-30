import RecentSearches from '../../components/RecentSearches';
import SearchResults from '../../components/SearchResults';

import { useSearch } from '../../contexts/SearchContext';

export default function SearchScreen({navigation}) {
  const searchTerm = useSearch();

  if(searchTerm === null){
    return ( <RecentSearches></RecentSearches> );
  }
  return (
    <SearchResults stackNavigation={navigation}></SearchResults>
  );
}