import React from 'react'


const InputReadOnly = ({label, value , direction , editPhone}) => {
  return (
    <div className={`'flex ${direction ? direction : 'flex-col gap-2'} '`}>
        <label className='font-medium w-48 flex-none' htmlFor=''>
        {label}
        </label>
        <div className='flex-auto w-full'>
        <input 
        type='text' 
        id=''
        readOnly
        className='border border-gray-200 outline-none flex-auto rounded-md bg-gray-100 p-2 w-full'
        value={value}
        />
       {editPhone && <small className='text-blue-500 py-4 cursor-pointer'>Đổi số điện thoại</small>}  
        </div>
        
    </div>
  )
}

export default InputReadOnly