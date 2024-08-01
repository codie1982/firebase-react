import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useAuth } from '../context/authContext'
import { doSingOut } from '../firebase/auth';  
import {
    Routes,
    Route,
    Link,
    useNavigate,
    useLocation,
    Navigate,
    Outlet,
  } from "react-router-dom";
function Header(params) {
    const navigate = useNavigate();
    const {userLoggedIn} = useAuth();
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container>
            <Navbar.Brand href="/">React-Bootstrap</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                {userLoggedIn ? 
                <>
                <Nav className="me-auto">
                    <button type="" onClick={() => { doSingOut().then(() => { navigate('/login') }) }}>Logout</button>
                </Nav>
                </> : 
                <>
                <Nav className="me-auto">
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </Nav>
              </>}
             
            </Navbar.Collapse>
          </Container>
        </Navbar>
        )
}

export default Header