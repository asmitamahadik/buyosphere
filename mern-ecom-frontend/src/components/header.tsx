import { useState } from 'react';
import { FaSearch, FaShoppingBag, FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { User } from '../types/types';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import logo from '/images/appLogo.png';
import toast from 'react-hot-toast';



interface PropsType  {
  user: User | null
}

const Header = ({user}:PropsType) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const logoutHandler = async () => {
    try {
      await signOut(auth);
      toast.success("SignedOut Successfully!");
      setIsOpen(false);
    } catch (error) {
      toast.error("SignOut Failed!")
    }
  }

  return (
    <nav className='header'>
      <Link to={'/'}><img src={logo} className='logo'/></Link>
      <Link to={'/'} onClick={() => setIsOpen (false)}>Home</Link>
      <Link to={'/search'} onClick={() => setIsOpen (false)}>
        <FaSearch/>
      </Link>
      <Link to={'/cart'} onClick={() => setIsOpen (false)}>
        <FaShoppingBag/>
      </Link>

      { user?._id ? (
          <button onClick={()=>setIsOpen((prev) => !prev)}>
            <FaUser/>
            <dialog open={isOpen}>
              <div>
                {user.role === "admin" && (
                  <Link to={"/admin/dashboard"}>Admin</Link>
                )}
                <Link to={"/orders"}>Orders</Link>
                <button onClick={logoutHandler}>
                  <FaSignOutAlt/>
                </button>
              </div>
            </dialog>
          </button>
        ) : (
          <Link to={'/login'}>
            <FaSignInAlt/>
          </Link>
        )
      }

    </nav>
  )
}

export default Header;
