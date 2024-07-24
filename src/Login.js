// src/Login.js
import React, { useState } from 'react';
import firebase from './firebase';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Form,Row,Col, Container } from 'react-bootstrap';

const Login = () => {
    const auth = getAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          alert("Hello : " + user.uid)
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert("Error : " + errorMessage)
        });
    };

    return (
        <Container>
            <Form.Group className="mb-3">
            <Row className="justify-content-md-center">
                <Col>
                <h2>Login</h2>
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col>
                <Form.Label>Email</Form.Label>
                    <Form.Control placeholder="email" type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} />
                                </Col>
                               
            </Row>
            <Row>
            <Col>
                                <Form.Label>Password</Form.Label>
                    <Form.Control placeholder="password" type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)} />
                                </Col>
            </Row>
            
           
        </Form.Group>
     </Container>
    );
};

export default Login;