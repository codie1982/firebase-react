// src/Login.js
import React, { useState } from 'react';
import firebase from '../firebase';
import { getAuth, signInWithEmailAndPassword, updateCurrentUser} from "firebase/auth";
import { Form,Row,Col, Container ,Button} from 'react-bootstrap';

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
          console.log("Hello : " + user.uid)

          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log("Error : " + errorMessage)

        });
    };

    return (
      <Container>
        <Row className="d-flex align-items-center justify-content-center text-center min-vh-100">
            <Col md={{ span: 4 }}>
            <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="formBasicEmail" >
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Form.Text className="text-muted">
                </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}  />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Check me out" />
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
            </Form>
            </Col>
        </Row>
      </Container>
    );
};

export default Login;

/**
 *   <Container >
                        <div className="d-flex align-items-center text-center min-vh-100">
                        <Form.Group>
            <Row className="justify-content-md-center">
                <Col>
                <h2>Giriş Yap</h2>
                </Col>
            </Row>
                <Row>
                    <Col>
                    <Form.Label>Email</Form.Label>
                    <Row>
                        <Col><Form.Control placeholder="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Col>
                    </Row>
                    
                    </Col>
                                
                </Row>
            <Row>
                <Col>
                <Form.Label>Password</Form.Label>
                <Row>
                    <Col><Form.Control placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></Col>
                </Row>
                </Col>
            </Row>
            <Row>
                <Col><FloatingLabel >Kayıt Ol</FloatingLabel></Col>
                <Col><FloatingLabel >Şifremi Unuttum</FloatingLabel></Col>
            </Row>
        </Form.Group>
        </div>
     </Container>
 */