// src/Login.js
import React, { useState,useEffect } from 'react';
import { Form,Row,Col, Container ,Button} from 'react-bootstrap';
import { isUserLoggedIn, getCurrentUser, signInUser,auth } from '../auth.js';
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  useEffect(() => {
    console.log("isUserLoggedIn(),",isUserLoggedIn())
    if (isUserLoggedIn()) {
      setUser(getCurrentUser());
    }else{
      const register = location.state?.from?.pathname || "/";
      navigate(register, { replace: true });
    }
  }, []);

    return (
      <Container>
        <Row>
            <Col>
            <div>
            {user ? (
              <div>
                <p>Hoşgeldin, {user.email}!</p>
              </div>
            ) : (
              <>İçerik yok</>
            )}
    </div>
            </Col>
        </Row>
      </Container>
    );
};

export default Dashboard;