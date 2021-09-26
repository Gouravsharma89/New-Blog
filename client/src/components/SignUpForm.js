import React, { useState } from 'react';
import Button from './Button'
import Input from './Input'
import { Link, useHistory } from 'react-router-dom'
import Axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


toast.configure();
const SignUpForm = () => {
    const history = useHistory();
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        password: '',
        role:''
    });

    const handleChange = (event) => {
        
        const { value, name } = event.target;
        setUserInfo(prevValue => {
            return {
                ...prevValue,
                [name]: value
            }  
        });
    }

    const postUserInfo = async (event) => {
        event.preventDefault();
        try {
            const res = await Axios.post('/api/auth/signup', JSON.stringify(userInfo), {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            toast.success(res.data.message, {
                className: "success-toast",
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 3000
            }); 
            history.push('/users');
        } catch (error) {
            toast.error(error.response.data.error.message, {
                className: "error-toast",
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 3000
            });            
        }
        
    }

    return (
        <div className="card text-center mx-auto mt-5" style={{height: "30rem", width: "32rem"}}>
            <div className="card-body">
                <h4 className="card-title">Create User</h4>
                <form>
                    <Input 
                        type="text" 
                        name="name"
                        className="form-control mt-3 form-control-lg mt-4" 
                        placeholder="Enter name"
                        value={userInfo.name} 
                        onChange={handleChange} />
                    <Input 
                        type="email" 
                        name="email"
                        className="form-control mt-3 form-control-lg" 
                        placeholder="Enter email" 
                        onChange={handleChange}
                        value={userInfo.email}  />
                    <select className="form-control mt-3 form-control-lg" 
                        onChange={handleChange}
                        value={userInfo.role} name="role" >
                            <option value=''>Select Role</option>
                            <option value='admin'>Admin</option>
                            <option value='content-writer'>Content Writer</option>
                        </select>
                    <Input 
                        type="password" 
                        name="password"
                        className="form-control mt-3 form-control-lg" 
                        placeholder="Enter password"
                        value={userInfo.password}  
                        onChange={handleChange} />
                    <Input 
                        type="password" 
                        name="repassword"
                        className="form-control mt-3 form-control-lg" 
                        placeholder="Re-type password"
                        value={userInfo.rePassword}  
                        onChange={handleChange} />
                    
                    <Button 
                        type="submit" 
                        onClick={postUserInfo}
                        className="btn btn-lg btn-block btn-success mt-5"> Create User </Button>
                </form>
                <br></br>
                <br></br>
            </div>
        </div>
    )
}


export default SignUpForm;