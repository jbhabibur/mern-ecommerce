import React from 'react';
import {SubMenu} from "./SubMenu"
import { User, UserPlus, Heart } from 'lucide-react';

const menuNavItems = [
    { id: 1, label: "HOME" },
    { id: 2, label: "DIRTY BOYS" },
    {
        id: 3,
        label: "❄️ WINTER WARDROBE ❄️",
        children: [
            { label: "JACKET" },
            { label: "SWEATER" },
            { label: "SWEATSHIRT" },
        ]
    },
    {
        id: 4,
        label: "MEN TOP",
        children: [
            { 
                label: "Panjabi", 
                children: [{ label: "Semi Fit" }, { label: "Regular Fit" }, { label: "Trendy Fit" }] 
            },
            { label: "Shirt", children: [{ label: "Casual" }, { label: "Formal" }] },
            { label: "Polo" },
            { label: "T-Shirt" },
            { label: "Fatua" },
            { label: "Bapari Shirt" },
        ]
    },
    { id: 5, label: "MEN BOTTOM" },
    { id: 6, label: "OUTERWARE" },
    { id: 7, label: "FRAGRANCE 30% OFF" },
    { id: 8, label: "ACCESSORIES" },
    { id: 9, label: "GIFT CARD" },
    { id: 10, label: "CONTACT US" },
];

export const MegaMenu = () => {
    return (
        <nav className="bg-black text-white px-4">
            <div className="flex flex-wrap items-center justify-center content-start gap-x-6 text-[12px] font-bold tracking-wider">
                {menuNavItems.map((item) => (
                    <SubMenu key={item.id} item={item} />
                ))}
            </div>
        </nav>
    );
};