import React, { useContext } from "react";
import { 
    BrowserRouter as Router,
    Link,
    NavLink,
} from 'react-router-dom';
import Routing from './routing/Routing'
import Footer from '../components/Footer';

import { toast } from 'react-toastify';
import { useSelector } from "react-redux";


class Nav extends Component {
    constructor(props) {
      super(props);
      this.state = {
        email: '',
        password: ''
      };
  
      this.handleSignOut = this.handleSignOut.bind(this);
    }
   
    handleSignOut = () => {
        this.props.logOutCurrentUser();
        localStorage.clear();
        toast.success("Singout successful!", {
            className: "success-toast",
            autoClose: 3000,
            position: toast.POSITION.BOTTOM_RIGHT
        })
        this.props.history.push('/')
    }

    render() {
        const userinfo = useSelector (state => state.auth);
        console.log(userinfo);
        let handleRole = false;
        if(userinfo.isAuthenticated){
            if(userinfo.user.user.role === 'admin'){
                handleRole = true
            }else{
                handleRole = false;
            }
        }
        return (
        <div>
        <Router>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <Link to="/" className="navbar-brand">Blog</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item" key="2">
                            <NavLink 
                                className="nav-link" 
                                to="/about" 
                                activeStyle={{ fontWeight: 'bold' }}>About</NavLink>
                        </li>
                        { 
                            handleRole?
                            [
                                <li className="nav-item" key="7">
                                <NavLink 
                                    className="nav-link" 
                                    activeStyle={{ fontWeight: 'bold' }} 
                                    to="/signup"> Create User </NavLink>
                                </li>,
                                <li className="nav-item" key="7">
                                <NavLink 
                                    className="nav-link" 
                                    activeStyle={{ fontWeight: 'bold' }} 
                                    to="/users"> All Users </NavLink>
                                </li>,
                                <li className="nav-item" key="7">
                                <NavLink 
                                    className="nav-link" 
                                    activeStyle={{ fontWeight: 'bold' }} 
                                    to="/allposts"> All Posts </NavLink>
                                </li>
                            ] : []
                        }
                        {   
                            userinfo.isAuthenticated ?
                             [
                                <li className="nav-item" key="5">
                                 <NavLink 
                                     className="nav-link" 
                                     activeStyle={{ fontWeight: 'bold' }} 
                                     to="/myblog">My Posts</NavLink>
                                 </li>,
                                <li className="nav-item" key="3">
                                    <NavLink 
                                        className="nav-link" 
                                        activeStyle={{ fontWeight: 'bold' }} 
                                        to="/compose">Create Post</NavLink>
                                </li>,
                                <li className="nav-item" key="5">
                                <NavLink 
                                    onClick={handleSignOut}
                                    className="nav-link" 
                                    activeStyle={{ fontWeight: 'bold' }} 
                                    to="/">Sign Out</NavLink>
                                    {/* <Button className="btn btn-danger" onClick={handleSignOut}>Sign Out</Button> */}
                                </li>
                            ] : [ ]                     
                        }
                        
                    </ul>
                </div>
            </nav>
            <Routing />
            <Footer />
            </Router>
        </div>
        
    )}
}



export default Nav;