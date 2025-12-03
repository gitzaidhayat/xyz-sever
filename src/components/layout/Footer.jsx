import { useState } from 'react';
import { Link } from 'react-router-dom';
import { subscribeEmail } from '../../api/subscriptionApi';
import { VisaIcon, MastercardIcon, } from 'react-svg-credit-card-payment-icons';

const infoLinks = [
  { name: 'About Us', path: '/about-us' },
  { name: 'Contact Us', path: '/contact-us' },
  { name: 'Blog', path: '/blog' },
  { name: 'Size Chart', path: '/size-chart' },
  { name: 'Feedback', path: '/feedback' }
];
const careLinks = [
  'My Account','Terms & Conditions','Privacy Policy','Klarna FAQ','Delivery','Returns Information','Returns Centre','Gift Card','FAQs'
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateEmail = (value) => /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!validateEmail(trimmed)) {
      setStatus({ type: 'error', message: 'Please enter a valid email.' });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const res = await subscribeEmail(trimmed);
      if (res.success) {
        setStatus({ type: 'success', message: res.message || 'Subscribed successfully!' });
        setEmail('');
        setTimeout(() => setStatus(null), 5000);
      } else {
        setStatus({ type: 'error', message: res.message || 'Subscription failed.' });
      }
    } catch (err) {
      console.error('Subscription error:', err);
      const msg = err?.response?.data?.message || 'Server error. Please try again later.';
      setStatus({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };



  return (
    <footer className="bg-[#00242A] text-white pt-16 pb-10 mt-20">
      {/* Top CTA */}
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="tracking-wide font-medium text-base md:text-lg lg:text-xl mb-3">READY TO TAKE YOUR STYLE & DEEN TO NEW HEIGHTS?</h2>
        <p className="text-xs md:text-sm lg:text-base text-gray-200 mb-6 md:mb-8">We'll let you in on exclusive offers, new drops and updates</p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row max-w-3xl mx-auto gap-2 sm:gap-0">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            aria-label="Email address"
            disabled={loading}
            className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-white text-black text-sm focus:outline-none rounded sm:rounded-none"
          />
          <button
            type="submit"
            disabled={loading}
            className={`px-6 sm:px-8 py-3 sm:py-4 cursor-pointer text-sm font-medium transition-colors rounded sm:rounded-none ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#eec9af] text-black hover:bg-[#e3b798]'}`}
          >
            {loading ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
          </button>
        </form>
        {status && (
          <div className={`mt-3 text-xs md:text-sm mx-auto w-fit px-4 py-2 rounded-md ${status.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>{status.message}</div>
        )}
      </div>

      {/* Link Columns */}
      <div className="max-w-7xl mx-auto px-4 mt-12 md:mt-15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
        {/* Logo & Blurb */}
        <div className='mb-6 md:mb-0'>
          <img src="https://ik.imagekit.io/j90xpcrfe/Abaya_wholesale_white_logo.png" alt="AbayaButh Logo" className="w-[120px] md:w-[150px] mb-4 md:mb-6 bg-white rounded-tl-4xl rounded-br-4xl rounded-tr-lg" />
          <p className="text-xs md:text-sm leading-relaxed text-gray-200">Influential, innovative and progressive. At NAHT, we pride ourselves on fusing traditional modest clothing with contemporary fashion to stand out rather than fit in.</p>
        </div>
        {/* Information */}
        <div className='mb-6 md:mb-0'>
          <h3 className="uppercase text-xs md:text-sm tracking-wider font-semibold mb-4 md:mb-8">INFORMATION</h3>
          <ul className="space-y-2 text-xs md:text-sm text-gray-400">
            {infoLinks.map(item => (
              <li key={item.name}>
                <Link 
                  to={item.path} 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="hover:text-[#F4D9C6] transition-colors"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Customer Care */}
        <div className='mb-6 md:mb-0'>
          <h3 className="uppercase text-xs md:text-sm tracking-wider font-semibold mb-4 md:mb-8 font-weight-100">CUSTOMER CARE</h3>
            <ul className="space-y-2 text-xs md:text-sm text-gray-400">
              {careLinks.map(item => (
                <li key={item}><a href="#" className="hover:text-[#F4D9C6] transition-colors">{item}</a></li>
              ))}
            </ul>
        </div>
        {/* Get In Touch */}
        <div className='mb-6 md:mb-0'>
          <h3 className="uppercase text-xs md:text-sm tracking-wider font-semibold mb-4 md:mb-5">GET IN TOUCH</h3>
          <div className="space-y-1 text-xs md:text-sm items-center">
           <div className='flex flex-col space-y-2'>
             <a href="mailto:zaid243zaid.com" className="text-gray-400 hover:text-[#F4D9C6]">zaid243zaid.com</a>
            <a href="tel:+911234567890" className="text-gray-400 hover:text-[#F4D9C6]">+91 123 456 7890</a>
           </div>
            
            <div className="mt-4 md:mt-6 text-xs md:text-sm">
              <p className="font-semibold mb-2">CUSTOMER CARE</p>
            <div className='text-gray-400 mt-3 md:mt-5'>
              <p className="flex justify-between"><span>Mon - Fri</span><span>09:30 - 17:00</span></p>
              <p className="flex justify-between"><span>Saturday</span><span>Closed</span></p>
              <p className="flex justify-between"><span>Sunday</span><span>Closed</span></p>
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Icons & Bottom */}
      <div className="max-w-7xl mx-auto px-4 mt-8 md:mt-12">
        <div className="flex flex-wrap gap-2 justify-center md:justify-end mb-6 md:mb-8">
          <VisaIcon format="flatRounded" className='w-9 h-6'  />
          <MastercardIcon format="flatRounded" className='w-9 h-6' />
          
          
          
        </div>
        <div className="text-xs text-gray-300">© {currentYear} Noor Al Haya . All Rights Reserved</div>
      </div>
    </footer>
  );
};

export default Footer;
