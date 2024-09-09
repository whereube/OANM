import { useParams, Outlet } from 'react-router-dom';
import './Header.css'

const Header = () => {

  return (
    <>
        <div className='header'>
            <div className='logoImage'>
            </div>
        </div>
        <Outlet />
    </>
  );
};

export default Header;