import React from 'react'
import { CiLogout } from "react-icons/ci";
import {NavLink} from "react-router-dom"
import user from "../../assets/img/user.png"
import menusideBar from '../../ultis/menuSidebar'
const ActiveStyle = 'hover:bg-gray-200 rounded-md flex items-center gap-2 font-bold bg-gray-200 '
const NotActiveStyle = 'hover:bg-gray-200 rounded-md flex items-center gap-2'
const sidebar = () => {
  return (
    <div className='w-[256px] flex-none p-4 flex flex-col gap-6'>
      <div className='flex flex-col gap-4'>
        <div className='flex items-center gap-4'>
            <img  src={user} alt="avata" className='w-12 h-12 object-cover rounde-full border-2 border-white'/>
            <div className='flex flex-col justify-center '>
              <span className='font-semibold '>Tan</span>
              <small>123123123</small>
            </div>    
        </div>
        <span >Mã Thành Viên: <small className='font-medium'>id nguoi dung se lay sau</small></span>
      </div>
      <div className='flex flex-col gap-4'>
      {menusideBar.map(item => {
                return(
                  <NavLink className={({ isActive}) => isActive ? ActiveStyle : NotActiveStyle }key={item.id} to={item?.path}>
                        {item?.icon}{item.text}
                  </NavLink>
                )
              })
            }
            <span className='hover:bg-gray-200 rounded-md flex items-center gap-2 ml-[5px] cursor-pointercd'><CiLogout/>Thoát</span>
      </div>
    </div>
  )
}

export default sidebar