import React from 'react'
import Sidebar from '../../../Components/Event/Sidebar'
import Topbar from '../../../Components/Event/Topbar'

const Videolibrary = () => {
  return (
    <div className="flex flex-col lg:flex-row container mx-auto text-gray-100 py-5 gap-5">
      <div className="w-full lg:w-1/4">
        <Sidebar />
      </div>
      <div className="w-full lg:w-3/4">
        {/* <Topbar /> */}
        <div className="bg-gray-700 bg-opacity-20 rounded-xl p-5">
          {/* Your content goes here */}
        </div>
      </div>
    </div>
  )
}

export default Videolibrary