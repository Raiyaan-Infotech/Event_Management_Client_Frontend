import { useState } from "react";
import { useDebounce } from "./use-debounce";

export function useListState(defaultLimit = 10) {
  const [search, setSearch] = useState("");
  const [page,   setPage]   = useState(1);
  const [limit,  setLimit]  = useState(defaultLimit);
  const debouncedSearch     = useDebounce(search, 300);

  const onSearch = (value: string) => { setSearch(value); setPage(1); };
  const onLimitChange = (newLimit: number) => { setLimit(newLimit); setPage(1); };

  return { search, setSearch: onSearch, page, setPage, limit, setLimit: onLimitChange, debouncedSearch };
}
