import React from 'react';
import {Link, withRouter} from 'react-router-dom';

const NavBar = (props) => {
    return (
        <nav className="nav wrapper blue darken-3">
            <div className="container">
                <a className="brand-logo">NobleProg Speech Recognition</a>
                <ul className="right">
                    {/* LINK do the same as event.preventDefault */}
                    <li><Link to="/custom">Custom</Link></li>
                    <li><Link to="/original">Original</Link></li>
                </ul>
            </div>
        </nav>
    );
}
//with Router is for givin the navbar the props input as a router
export default withRouter(NavBar);