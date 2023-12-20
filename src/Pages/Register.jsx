import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { useFirebase } from '../Context/Firebase';
import Alert from 'react-bootstrap/Alert';
import { Link } from 'react-router-dom';


const RegisterPage = () => {

    const [Emailcheck, setEmailcheck] = useState(false);
    const [passwordcheck, setpasswordcheck] = useState(false);

    const firebase = useFirebase();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setEmailcheck(true);
        setpasswordcheck(true);
        e.preventDefault();
        if (password && email && validPassword) {

            console.log('Registering in...');
            const result = await firebase.signupWithEmailAndPassword(email, password);
            firebase.setIsLoggedIn(true);
            window.localStorage.setItem("ISLoggedIN", true);
            window.localStorage.setItem("LocalEmail", email);
            window.localStorage.setItem("LocalPassword", password);
            console.log('success', result);
        }
    }
    useEffect(() => {
        if (firebase.isLoggedIn) {
            navigate("/");
        }
    }, [firebase.isLoggedIn]);

    const handleGoogleSignIn = async () => {
        try {
            const result = await firebase.signinWithGoogle();
            firebase.setIsLoggedIn(true);
            console.log('Google sign-in success', result);
        } catch (error) {
            // Handle errors
            console.error('Google sign-in error', error.message);
        }
    };


    const handlePasswordofLogin = (e) => {
        const input = e.target.value;
        setpasswordcheck(true);
        setPassword(input);
        if (input.length < 8) { setValidPassword(false); return; }
        else {
            setValidPassword(true);
        }
    }

    return (
        <div className='container m-5'>
            <h1>Register</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        onChange={(e) => { setEmailcheck(true); setEmail(e.target.value); }}
                        value={email}
                        type="email"
                        placeholder="Enter email" />
                </Form.Group>
                {!email && Emailcheck &&
                    <Alert variant='danger'>
                        This field cannot be empty.
                    </Alert>
                }

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        onChange={handlePasswordofLogin}
                        value={password}
                        type="password"
                        placeholder="Password" />
                </Form.Group>
                {!password && passwordcheck &&
                    <Alert variant='danger'>
                        This field cannot be empty.
                    </Alert>
                }
                {!validPassword && password &&
                    <Alert variant='danger'>
                        The password must contain at least 8 digits.
                    </Alert>
                }
                <Button variant="primary" type="submit">
                    Register
                </Button>
                <Button>
                    <Link className="nav-link" to="/login">
                        Login
                    </Link>
                </Button>
            </Form>
            {/* <h2 className='container mt-5'>OR</h2> */}
            {/* <Button onClick={handleGoogleSignIn} variant='info'>Signing with Google</Button> */}
        </div>
    )
}

export default RegisterPage;