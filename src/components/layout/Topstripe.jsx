import { FaFacebook, FaXTwitter, FaInstagram, FaPinterest, FaYoutube } from "react-icons/fa6";
import { Link } from "react-router-dom";

function Topstripe() {
  return (
    <div className="bg-[#02333a] flex flex-row justify-between text-white text-center py-2 text-sm font-medium">
        <div className='flex px-4  gap-4 h-full '>


          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook  className='text-white text-[18px] cursor-pointer'/>
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
            <FaXTwitter className='text-white text-[18px] cursor-pointer'/>
          </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram className='text-white text-[18px] cursor-pointer'/>
            </a>
            <a href="https://www.pinterest.com" target="_blank" rel="noopener noreferrer">  
            <FaPinterest className='text-white text-[18px] cursor-pointer'/>
            </a>
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">  
            <FaYoutube className='text-white text-[18px] cursor-pointer'/>
            </a>
            
        </div>
        <div>
            Free Shipping on Orders Over ₹2000
        </div>
      
        <div className='flex px-5'>
            <div>
                
            </div>

            
        </div>
    </div>
  )
}

export default Topstripe