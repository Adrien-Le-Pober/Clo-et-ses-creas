interface FilterChipsProps {
    activeFilters: { label: string; value: string }[];
    onRemoveFilter: (value: string) => void;
}

export default function FilterChips({ activeFilters, onRemoveFilter }: FilterChipsProps) {
    return (
        <div className="flex flex-wrap gap-2 mb-4">
            {activeFilters.map((filter) => (
                <div 
                    key={filter.value} 
                    className="flex items-center bg-primary text-secondary px-3 py-1 rounded-full text-sm shadow-md"
                >
                    <span>{filter.label}</span>
                    <button 
                        className="ml-2 text-lg" 
                        onClick={() => onRemoveFilter(filter.value)}
                        type="button"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
}