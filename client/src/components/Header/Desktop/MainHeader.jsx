import Logo from "../../../assets/images/logo/logo.avif"
import {Link} from "react-router-dom"

import { ShoppingBag, Heart, Search } from 'lucide-react';

const menuItems = [
    { name: 'Home', link: '#' },
    { 
      name: 'Services', 
      link: '#',
      submenu: [
        { name: 'Web Design', link: '#' },
        { name: 'App Development', link: '#' },
        { name: 'SEO Optimization', link: '#' },
      ]
    },
    { name: 'About', link: '#' },
    { name: 'Contact', link: '#' },
  ];

export const MainHeader = () => {
  return (
    <>
    <header className="w-full">
      <div className="max-w-[1300px] mx-auto flex items-center justify-between
                      px-[20%] py-2 sm:px-8 md:px-16 lg:px-20 transition-padding duration-300">
        {/* Left: Logo */}
        <div className="flex-shrink-0 scale-120">
          <img src={Logo} alt="Dorjibari logo" className="h-10 w-auto" />
        </div>

        {/* Right: Navigation Links */}
        <div className="flex flex-col space-x-8 space-y-4 md:space-x-6 sm:space-x-4">
          <div className="flex justify-end items-center gap-x-4">
            <Link className="no-underline! text-black font-normal text-sm">Outlets</Link>
            <div className="w-38 bg-[#FAFAFA] flex items-center border-b border-gray-200 px-3 py-1.5">
                <input className="outline-none focus:placeholder-transparent w-full" type="search" placeholder="Search" />
                <Search className="w-3 h-3 shrink-0" />
            </div>
          </div>
          <div className="flex gap-x-6 justify-center items-center">
                <div className="flex gap-x-3 cursor-pointer group">
                    <ShoppingBag className="w-5 h-5 transform transition-transform duration-300 group-hover:scale-125" />
                    <span className="text-sm">Shopping Cart</span>
                    <span className="bg-[#FFE5E8] rounded-full w-6 h-6 flex items-center justify-center text-xs">0</span>
                </div>
                <div className="flex gap-x-3 cursor-pointer items-center group">
                    <Heart className="w-5 h-5 transform transition-transform duration-300 group-hover:scale-125" />
                    <span className="text-sm">My Wish List</span>
                </div>
                <div className="flex cursor-pointer">
                    <span className="text-sm">Sign In or Create an Account</span>
                </div>
        </div>
        </div>
      </div>
    </header>
    <nav>

    </nav>
    </>

    
  )
}
