import { useParams, Outlet } from 'react-router-dom';
import './Header.css'

const Header = () => {

  return (
    <>
        <div className='header'>
            <h1>Offers and Needs market</h1>
        </div>
        <Outlet />
    </>
  );
};

export default Header;