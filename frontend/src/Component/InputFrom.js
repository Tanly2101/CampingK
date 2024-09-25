import React from 'react'

const InputFrom = ({label,value ,setValue, name , small , invalidFields, setInvalidFields , direction}) => {
  return (
    <div className={`flex ${direction ? direction : 'flex-col'}`}>
        <label className='w-48 flex-none ' htmlFor='title'>{label}</label>
        <div className='flex flex-auto w-full items-center'>
                <input
                type='text'
                id='title'
                className='outline-none border w-full flex-auto border-gray-300 p-2'
                value={value}
                onChange={(e) => setValue(prev => ({...prev, [name]: e.target.value}))}
                onFocus={() => setInvalidFields([])}
                >
                </input>
                {small && <small className='opacity-70 whitespace-nowrap'>{small}</small>}
                
        </div>
    </div>
  )
}

export default InputFrom