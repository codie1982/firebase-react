// src/Login.js
import React, { useState } from 'react';
import {
    Routes,
    Route,
    Link,
    useNavigate,
    useLocation,
    Navigate,
    Outlet,
  } from "react-router-dom";
import { fakeAuthProvider } from "../auth.js";
import firebase from '../firebase';
import { getAuth, signInWithEmailAndPassword, updateCurrentUser} from "firebase/auth";
import { Form,Row,Col, Container ,Button} from 'react-bootstrap';

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useAuth();
  
    const from = location.state?.from?.pathname || "/";
  
    function handleSubmit(event) {
      event.preventDefault();
  
      const formData = new FormData(event.currentTarget);
      const email = formData.get("email");
      const password = formData.get("passworn");
  
      auth.signin(email, () => {
        navigate(from, { replace: true });
      });
    }
    function AuthProvider({ children }) {
        const [user, setUser] = React.useState(null);
      
        const signin = (newUser, callback) => {
          return fakeAuthProvider.signin(() => {
            setUser(newUser);
            callback();
          });
        };
      
        const signout = (callback) => {
          return fakeAuthProvider.signout(() => {
            setUser(null);
            callback();
          });
        };
      
        const value = { user, signin, signout };
      
        return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
      }
/* const Login = () => {
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
    }; */

    return (
        <AuthProvider>
            <Container>
                    <Row className="d-flex align-items-center justify-content-center text-center">
                    <Row>
                      <Col>
                      <h1>Giriş Yapın</h1>
                      </Col>
                    </Row>
                        <Col md={{ span:8}}>
                        <Form onSubmit={handleSubmit}>
                        <Form.Group as={Row} className="mb-3" controlId="formBasicEmail" >
                            <Form.Label column sm="4">Mail Adresi</Form.Label>
                            <Col>
                            <Form.Control type="email" placeholder="mail adresinizi giriniz"  />
                            <Form.Text className="text-muted"></Form.Text>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="formBasicPassword">
                            <Form.Label column sm="4">Şifre</Form.Label>
                            <Col>
                              <Form.Control type="password" placeholder="şifreniz"  />
                            </Col>
                        </Form.Group>
                        <Row>
                          <Col md={{offset:4,span:2}}><Button variant="primary" type="submit">Giriş Yap</Button></Col>
                          <Col  md={{span:2}}><Button variant="outline-primary" type="submit">Kayıt Ol</Button></Col>
                        </Row>
                          
                          
                        </Form>
                        </Col>
                    </Row>
                </Container>
        </AuthProvider>
    );
};

export default Login;

function useAuth() {
    return React.useContext(AuthContext);
  }
  const AuthContext = React.createContext(null);

 
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