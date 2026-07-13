import { useState } from "react";
import { Filter } from "lucide-react";
import FilterSheet from "./FilterSheet";

const FilterButton = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="border border-gray-200 rounded-xl px-3 py-2.5 flex items-center gap-1 bg-white text-sm text-gray-600"
            >
                <Filter size={14} />
                <span className="font-medium">Filter</span>
            </button>

            <FilterSheet
                open={open}
                onClose={() => setOpen(false)}
            />
        </>
    );
};

export default FilterButton;