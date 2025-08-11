import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import SpriteLogo from "../../assets/sprite.png";
import { getBalance } from "../../Handlers/getBalance";
import { FiLogOut } from "react-icons/fi";

export default function Navbar({connected, address, setConnected, setAddress }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
    const [balance, setBalance] = useState(null);
  
  const linkStyle = (path) =>
    location.pathname === path
      ? "text-[#51FFD6] font-bold"
      : "text-[#FFFFFF] hover:text-[#51FFD6] ";

  const toggleMenu = () => setIsOpen(!isOpen);
  
  async function fetchBalance() {
      const bal = await getBalance(address); // your async function
      setBalance(bal);
    }

    useEffect(() => {
    fetchBalance();
  }, [address]);

    const disconnectWallet = () => {
    // Clear wallet data
    setConnected(false);
    setBalance(null);
    setAddress("");
    console.log("Wallet disconnected");
    };


  

  return (
    <nav className="w-full shadow py-3 text-white relative z-50 bg-[#121212]">
      <div className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-10 flex justify-between items-center">

        {/* Logo + Name */}
        <div className="flex items-center gap-1">
          <img src={SpriteLogo} className="w-[50px]" />
          <h1 className="text-xl font-semibold text-[#51FFD6]">IRYS Amplifiers</h1>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className={linkStyle("/")}>
            Home
          </Link>
          <Link to="/gallery" className={linkStyle("/gallery")}>
            Gallery
          </Link>

          {/* Balance + Address Pills */}
          { connected && (
            <div className="flex items-center gap-2">
              <span className="bg-gray-800 text-white px-4 py-1 rounded-full text-sm font-medium">
              {balance !== null ? `${balance} IRYS` : "IRYS"}
              </span>
              <span className="bg-gray-700 text-white px-4 py-1 rounded-full text-sm font-mono">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>

              <button
              onClick={disconnectWallet} // <--  disconnect function here
            className="bg-gray-800 hover:bg-gray-700 text-white p-1 rounded-full flex items-center justify-center"
            title="Disconnect Wallet"
            >
             <FiLogOut size={20} />
         </button>
            </div>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu with animation */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-60 opacity-100 scale-100" : "max-h-0 opacity-0 scale-95"
        }`}
      >
        <div className="mt-2 flex flex-col space-y-2 px-2">
          <Link to="/" className={linkStyle("/")} onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link
            to="/gallery"
            className={linkStyle("/gallery")}
            onClick={() => setIsOpen(false)}
          >
            Irys Gallery
          </Link>

          {/* Balance + Address Pills in Mobile Menu */}
          {connected && (
            <div className="flex flex-col gap-2 mt-3">
              <span className="bg-gray-800 text-white px-4 py-1 rounded-full text-sm font-bold  text-center ">
               {balance !== null ? `${balance} IRYS` : "IRYS"}
              </span>
              <span className="bg-gray-700 text-white px-4 py-1 rounded-full text-sm font-mono text-center">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>

              <button
              onClick={disconnectWallet} // <--  disconnect function here
            className="bg-gray-800 hover:bg-gray-700 text-white p-1 rounded-full flex items-center justify-center"
            title="Disconnect Wallet"
            >
             <FiLogOut size={20} />
         </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
