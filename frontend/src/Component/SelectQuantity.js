import React  from 'react'

const SelectQuantity = ({quantity , handleQuantity , handleChangeQuantity}) => {
  return (
    <div>
            <span onClick={() => handleChangeQuantity('minus')} className='p-2 border-r cursor-pointer border-black'>-</span>
            <input className='py-2  text-center outline-none w-[30px]'
            type='text'
            value={quantity}
            onChange={e => handleQuantity(e.target.value)}>
            </input>
            <span onClick={() => handleChangeQuantity('plus')} className='p-2 cursor-pointer border-l border-black  '>+</span>
    </div>
  )
}
export default SelectQuantity;