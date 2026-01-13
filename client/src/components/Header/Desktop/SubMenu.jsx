import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export const SubMenu = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div 
            className="relative group py-2 cursor-pointer"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            {/* Menu Label */}
            <div className="flex items-center justify-between text-[0.9rem] hover:text-gray-400">
                <span className="whitespace-nowrap">{item.label}</span>
                {item.children && <ChevronRight size={14} className="opacity-50" />}
            </div>

            {/* Dropdown Menu */}
            {item.children && isOpen && (
                <div className="absolute top-full left-0 min-w-[200px] bg-white text-black shadow-lg border border-gray-100 z-50">
                    <ul className="py-2">
                        {item.children.map((child, index) => (
                            <li key={index} className="relative group/sub px-4 py-2 hover:bg-gray-50 border-b border-gray-50 last:border-0">
                                {/* Recursive call for deeper levels */}
                                <SubMenuChild child={child} />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

// Sub-component to handle nested arrows and levels
const SubMenuChild = ({ child }) => {
    const [isChildOpen, setIsChildOpen] = useState(false);

    return (
        <div 
            className="flex items-center justify-between text-[13px] text-gray-700 font-normal"
            onMouseEnter={() => setIsChildOpen(true)}
            onMouseLeave={() => setIsChildOpen(false)}
        >
            <span>{child.label}</span>
            {child.children && (
                <>
                    <ChevronRight size={14} />
                    {/* Level 2 Dropdown (Side menu) */}
                    {isChildOpen && (
                        <div className="absolute top-0 left-full min-w-[180px] bg-white shadow-xl border border-gray-100">
                            {child.children.map((subChild, i) => (
                                <div key={i} className="px-4 py-2 hover:bg-gray-100 text-gray-600 border-b border-gray-50">
                                    {subChild.label}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};