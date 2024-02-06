"use client"    

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import qs from "query-string"
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";

const SearchInput = () => {

    const router = useRouter();
    const [value, setValue] = useState("");

    const debouncedValue = useDebounceValue(value, 500);

    useEffect(() => {
        const url = qs.stringifyUrl({
            url: "/" ,
            query: {
                search: debouncedValue[0]
            }
        }, { skipEmptyString: true, skipNull: true })
        router.push(url);
    },[debouncedValue,router])

  return (
    <div className="relative w-full">
        <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
      <Input
        placeholder="Search"
        className="w-full pl-9"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        />
    </div>
  );
}

export default SearchInput