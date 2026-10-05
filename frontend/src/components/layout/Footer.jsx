import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, MessageCircle, Clock, ChevronRight } from 'lucide-react';
import { businessConfig } from '../../config/businessConfig';

const Footer = () => {
  return (
    <footer className="bg-primary text-gray-300 pt-16 pb-8 border-t-[6px] border-accent mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-16">
          
          {/* Brand & About */}
          <div className="lg:pr-6">
            <Link to="/" className="text-2xl font-extrabold tracking-tight block mb-6 uppercase">
              <span className="text-white">{businessConfig.shopName.split(' ')[0]}</span>
              <span className="text-accent ml-1.5">{businessConfig.shopName.split(' ').slice(1).join(' ')}</span>
            </Link>
            <p className="text-sm mb-6 leading-relaxed text-gray-400">
              Your trusted local destination for premium home appliances. We bring you the best brands with exceptional showroom service and support since 2005.
            </p>
            <div className="flex space-x-4">
              {['FB', 'IG', 'TW'].map((social, idx) => (
                <a key={idx} href="#" className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center hover:bg-accent hover:text-white hover:shadow-lg transition-all hover:-translate-y-1 text-xs font-bold text-white">
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6 uppercase tracking-wider text-sm">Explore</h3>
            <ul className="space-y-3 font-medium">
              {[
                { name: 'Home', path: '/' },
                { name: 'Shop Appliances', path: '/shop' },
                { name: 'Our Categories', path: '/categories' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact Showroom', path: '/contact' }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className="group flex items-center text-gray-400 hover:text-accent transition-colors">
                    <ChevronRight size={16} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-accent mr-1" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6 uppercase tracking-wider text-sm">Customer</h3>
            <ul className="space-y-3 font-medium">
              {[
                { name: 'Enquiry Cart', path: '/enquiry-cart' },
                { name: 'My Profile', path: '/account' },
                { name: 'Privacy Policy', path: '/privacy' },
                { name: 'Terms of Service', path: '/terms' }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className="group flex items-center text-gray-400 hover:text-accent transition-colors">
                    <ChevronRight size={16} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-accent mr-1" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6 uppercase tracking-wider text-sm">Visit Showroom</h3>
            <ul className="space-y-5">
              <li className="flex items-start">
                <MapPin size={22} className="text-accent mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-400 leading-relaxed">{businessConfig.address}</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="text-accent mr-3 flex-shrink-0" />
                <a href={`tel:${businessConfig.phone.replace(/[^0-9+]/g, '')}`} className="text-sm text-gray-400 hover:text-white font-medium transition-colors">{businessConfig.phone}</a>
              </li>
              <li className="flex items-center">
                <MessageCircle size={20} className="text-green-500 mr-3 flex-shrink-0" />
                <a href={`https://wa.me/${businessConfig.whatsappNumber}`} target="_blank" rel="noreferrer" className="text-sm text-gray-400 hover:text-white font-medium transition-colors">WhatsApp Enquiry</a>
              </li>
              <li className="flex items-center">
                <Clock size={20} className="text-accent mr-3 flex-shrink-0" />
                <span className="text-sm text-gray-400">{businessConfig.openingHours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-light pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} {businessConfig.shopName}. All Rights Reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <span>Premium Home Appliances Showroom</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
