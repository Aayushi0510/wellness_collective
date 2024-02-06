import { HiOutlineVideoCamera } from "react-icons/hi2";
import { BsTelephoneFill,BsFillMicFill } from "react-icons/bs";


const VideomenuIcon = () => {
  return (
    <div className='lg:px-8 px-2 flex sm:gap-5 gap-1 justify-between'>
  <div className='bg-primary rounded-full sm:w-10 sm:h-10 w-8 h-8 flex justify-center items-center text-white'>
  <HiOutlineVideoCamera size={22}  />
  </div>
  <div className='bg-secondry rounded-full sm:w-10 sm:h-10 w-8 h-8 flex justify-center items-center text-white'>
  <BsTelephoneFill size={20} />
  </div>
  <div className='bg-primary rounded-full sm:w-10 sm:h-10 w-8 h-8 flex justify-center items-center text-white'>
  <BsFillMicFill size={20}/>
  </div>
    </div>
  )
}

export default VideomenuIcon