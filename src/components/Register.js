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
import { firebaseAuthProvider } from "../auth.js";
import { Form,Row,Col, Container ,Button} from 'react-bootstrap';
import { useAuth } from '../context/authContext/index.js';
import { doCreateUserWithEmailandPassword } from '../firebase/auth.js';
function Register() {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isRegister, setIsRegister] = useState(false)
    const [confirmPAssword, setConfirmPAssword] = useState(null)
const [errorMessage, setErrorMessage] = useState('')
    const auth = useAuth();
  
    const from = location.state?.from?.pathname || "/";
  

    const onSubmit = async (e)=>{
      e.preventDefault()
      if(confirmPAssword){
        if(!isRegister){
          await doCreateUserWithEmailandPassword(email,password).catch((err)=>{
            setErrorMessage(err)
          })
        }
      }
     


    }
    function handleSubmit(event) {
      event.preventDefault();
  

  
      /* auth.signin(email, () => {
        navigate(from, { replace: true });
      }); */
    }
 
      
      const goSingIn = ()=>{
        const register = location.state?.from?.pathname || "/";
        navigate(register, { replace: true });
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
      <Container>
      <Row className="d-flex align-items-center justify-content-center text-center">
      <Row>
        <Col>
        <h1>Kayıt Olun</h1>
        </Col>
      </Row>
          <Col md={{ span:8}}>
          <Form onSubmit={onSubmit}>
          <Form.Group as={Row} className="mb-3" controlId="formBasicEmail" >
              <Form.Label column sm="4">Mail Adresi</Form.Label>
              <Col>
              <Form.Control type="email" placeholder="mail adresinizi giriniz" value={email} onChange={(e)=>setEmail(e.target.value)}  />
              <Form.Text className="text-muted"></Form.Text>
              </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="formBasicPassword">
              <Form.Label column sm="4">Şifre</Form.Label>
              <Col>
                <Form.Control type="password" placeholder="şifreniz"  value={password} onChange={(e)=>setPassword(e.target.value)}    />
              </Col>
          </Form.Group>
          <Row>
            <Col md={{offset:4,span:2}}><Button variant="primary" type="submit">Kayıt Ol</Button></Col>
            <Col  md={{span:2}}><Button variant="outline-primary" onClick={goSingIn}>Giriş Yapın</Button></Col>
          </Row>
          </Form>
          </Col>
      </Row>
  </Container>
    );
};

export default Register;

 
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