import { Link } from "react-router-dom";

const Navbar = () => {
    return(
        <div className='navbar'>
            <Link to='/'>Home</Link>
            <Link to='/image-generator'>Image generator</Link>
            <Link to='/history'>History</Link>
            <Link to='/contact-us'>Contact Us</Link>
        </div>
    )
}

export default Navbar;