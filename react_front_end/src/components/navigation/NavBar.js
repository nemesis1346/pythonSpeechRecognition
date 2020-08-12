import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import '../styles/navbar.css'
class NavBar extends React.Component {
    constructor() {
        super();
        this.onLogin = this.onLogin.bind(this);

    }
    onLogin = () => {
        this.props.onLoginCallback();
    }

    render() {
        return (
            <nav className="nav-wrapper custom-nav darken-3">
                <div className="container">
                    <a className="brand-logo">NobleProg Speech Recognition</a>
                    <ul className="right">
                        {/* LINK do the same as event.preventDefault */}
                        <li><Link to={ROUTES.ROUTE_MIC_PAGE}>Microphone</Link></li>
                        <li><Link to={ROUTES.ROUTE_RECORD_LIST_PAGE}>Record List</Link></li>
                        <li><Link to={ROUTES.ROUTE_PENDING_RECORDS_CONVERSION} > PendingConversion</Link></li>
                        {/* <li onClick={this.onLogin}> Login</li> */}

                    </ul>
                </div>
            </nav>
        );
    }

}
//with Router is for givin the navbar the props input as a router
export default withRouter(NavBar);