import React from 'react'

const ManagePost = () => {
  return (
    <div className='flex  flex-col gap-6'>
        <div>
        <h1 className='font-bold text-2xl border-b-2 p-4'>Quản Lý Tin Đăng</h1>
        </div>
        <div>
        <table className="w-full table-auto">
         <thead>
         <tr className='bg-blue-500'>
      <th className='border p-2'>Mã Tin</th>
      <th className='border p-2'>Ảnh Đại Diện</th>
      <th className='border p-2'>Tiêu Đề</th>
      <th className='border p-2'>Ngày Đã Đăng</th>
      <th className='border p-2'>Tùy Chọn</th>
    </tr>
  </thead>
  <tbody>
                    <tr>
                        <td className='border   text-center p-2'>234</td>
                        <td className='border  p-2 flex items-center justify-center'>
                            <img src={require("../../assets/img/1.jpg")} alt='avata' className='w-10 h-10 object-cover rounded-md'>
                            </img>
                        </td>
                        <td className='border  p-2 text-center'>{`${'Hãy sống theo cách của bạn và tận hưởng nó'.slice(0,20)}...`}</td>
                        <td className='border  p-2 text-center'>1961</td>
                        <td className='border  p-2 text-center'>
                          <button className='bg-blue-400 p-2 rounded-md'>Xóa</button>
                        </td>
                     </tr> 
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default ManagePost