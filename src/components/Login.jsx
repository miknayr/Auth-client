import { useState } from 'react'
import { Redirect, Link } from 'react-router-dom'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import Home from './Home'

export default function Login(props) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

    // LOGIN USER - - - - - - - - - - - - - - - -
    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
            // 1. make request body
            const requestBody = { email, password }
            // 2. post to backend with axios
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api-v1/users/login`, requestBody)
            // 3. destructure response
            const { token } = response.data
            // 4. save response to localStorage
            localStorage.setItem('jwtToken', token)
            // 5. decode the jwt token
            const decoded = jwt.decode(token)
            // 6. set user in App.jsx's state
            props.setCurrentUser(decoded)
        } catch (err) {
            if (err.response.status === 400) {
                setMessage(err.response.data.msg)
                console.dir(message)
            } else {
                console.dir(err)
            }
            setMessage(err)
        }
    }

    // REDIRECT ON USER ERROR  - - - - - - - - - - - - - - - -
    if (props.currentUser) return (
        <Redirect 
            to='/home' 
            component={ Home } 
            currentUser={ props.currentUser } 
        />
    ) 

    // RETURN  - - - - - - - - - - - - - - - - 
    return (
        <div className="log-box">
            <div className="header-box">
                <div className="text-box">
                    <h2 className="log-header">Totemize</h2>
                    <div className="h6-box">
                        <h6 className="h6-header">GET LOST</h6>
                        <h6 className="h6-header">MEET AGAIN</h6>
                    </div>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div>
                    <input 
                        type='email'
                        placeholder='Email'
                        onChange ={e => setEmail(e.target.value)}
                        value={email}
                        className="login-input"
                        required
                    />
                    <input
                        type='password'
                        placeholder='Password'
                        onChange = {e => setPassword(e.target.value)}
                        value={password}
                        className="login-input"
                        required
                    />
                </div>
                <input
                    type='submit'
                    value='Login'
                    className="btn login-input"
                />
                <Link className="register btn login-input" to="/register">
                    Sign Up
                </Link>
            </form>
            <p className="tiny-text">Forgot Your Password?</p>
        </div>
    )
}
