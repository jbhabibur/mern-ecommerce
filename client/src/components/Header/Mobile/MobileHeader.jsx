import React, { useState } from 'react';
import { X, User, UserPlus, Heart, ChevronLeft, Menu, Search, ShoppingBag } from 'lucide-react';
import { MobileMenuItem } from './MobileMenuItem';

import Logo from '../../../assets/images/logo/logo.avif';

// Constant data for navigation items
const NAVIGATION_DATA = [
    { id: 1, label: "Home" },
    { id: 2, label: "Dirty Boys" },
    {
        id: 3,
        label: "❄️ Winter Wardrobe ❄️",
        hasArrow: true,
        children: [
            { label: "Go To ❄️ Winter Wardrobe ❄️" },
            { label: "JACKET" },
            { label: "STREETWEAR JACKET" },
            { label: "SWEATER" },
            { label: "SWEATSHIRT" },
            { label: "T-SHIRT" },
            { label: "POLO" },
            { label: "CASUAL COAT" },
            { label: "CASUAL SHIRT" },
            { label: "SUIT/COAT/BLAZER" },
            { label: "FATUA" },
        ]
    },
    { id: 4, label: "Men Top", hasArrow: true, children: [] },
    { id: 5, label: "Men Bottom", hasArrow: true, children: [] },
    { id: 6, label: "Outerware", hasArrow: true, children: [] },
    { id: 7, label: "Fragrance 30% OFF" },
    { id: 8, label: "Accessories", hasArrow: true, children: [] },
    { id: 9, label: "Gift Card" },
    { id: 10, label: "Contact Us" },
    { id: 11, label: "Sign In", isCapital: false, icon: User, isBold: false },
    { id: 12, label: "Create an Account", isCapital: false, icon: UserPlus, isBold: false },
    { id: 13, label: "My Wish List", isCapital: false, icon: Heart, isBold: false },
];

export const MobileHeader = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [activeSubMenu, setActiveSubMenu] = useState(null);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
        if (isDrawerOpen) setActiveSubMenu(null); // Reset submenu when closing
    };

    return (
        <>
            {/* --- MOBILE NAVIGATION BAR --- */}
            <nav className="flex items-center justify-between px-4 py-3 bg-white border-b sticky top-0 z-40">
                <div className="flex items-center gap-4">
                    <Menu className="w-7 h-7 cursor-pointer" onClick={toggleDrawer} />
                    <Search className="w-6 h-6 cursor-pointer" />
                </div>

                {/* Brand Logo */}
                <div className="flex items-center font-bold text-xl tracking-tighter uppercase">
                    <img src={Logo} alt="Dorjibari logo" className="h-8 w-auto ml-1" />
                </div>

                <div className="flex items-center gap-4">
                    <User className="w-6 h-6 cursor-pointer" />
                    <div className="relative">
                        <ShoppingBag className="w-6 h-6 cursor-pointer" />
                        <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                            0
                        </span>
                    </div>
                </div>
            </nav>

            {/* --- SLIDING SIDE DRAWER --- */}
            <div className={`fixed inset-0 z-50 transition-all duration-300 ${isDrawerOpen ? 'visible' : 'invisible'}`}>
                {/* Dark Overlay (Backdrop) */}
                <div 
                    className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100' : 'opacity-0'}`} 
                    onClick={toggleDrawer}
                />

                {/* Menu Panel */}
                <div className={`absolute top-0 left-0 w-80 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    
                    {/* Drawer Header */}
                    <div className='flex items-center justify-between px-4 py-4 border-b'>
                        {activeSubMenu ? (
                            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveSubMenu(null)}>
                                <ChevronLeft className="w-6 h-6" />
                                <h2 className='text-sm font-bold uppercase'>{activeSubMenu.label}</h2>
                            </div>
                        ) : (
                            <h2 className='text-lg font-bold uppercase'>Menu</h2>
                        )}
                        <X className='w-6 h-6 cursor-pointer' onClick={toggleDrawer} />
                    </div>

                    {/* Navigation Items List */}
                    <div className='flex-1 overflow-y-auto'>
                        {(activeSubMenu ? activeSubMenu.children : NAVIGATION_DATA).map((item, index) => (
                            <div 
                                key={item.id || index} 
                                onClick={() => item.children && setActiveSubMenu(item)}
                                className='cursor-pointer border-b border-gray-50'
                            >
                                <MobileMenuItem {...item} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};