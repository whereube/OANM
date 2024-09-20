import { Outlet, Link } from 'react-router-dom';
import { useAuth, checkIfAdmin, logOut} from '../auth/AuthProvider.js';
import { useState } from "react";
import ProfilePopOver from './ProfilePopOver.js';
import './Header.css'

const Header = () => {

  const { user } = useAuth();
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false)

    const togglePopover = () => {
        setDropdownIsOpen(!dropdownIsOpen);
    };

  return (
    <>
        <div className='header'>
            <div className='logoImage'>
            </div>
            <div className='profileDiv'>
              {user !== null && user ? (
                <>
                  <p className='profileButton' onClick={togglePopover}>&#128100;</p>
                  <ProfilePopOver 
                    dropdownIsOpen={dropdownIsOpen}
                    setDropdownIsOpen={setDropdownIsOpen}
                  />
                </>
              ) : ( 
                <Link className='profileButton linkButton' to={'/profile/login'} >&#128100;</Link>
              ) 
              }
            </div>
        </div>
        <Outlet />
    </>
  );
};

export default Header;