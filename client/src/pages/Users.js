import React, { useState, useEffect, Fragment, useContext } from 'react';
import Axios from 'axios';
import ReactHtmlParser from 'react-html-parser';
import '../App.css';
import { formatDate } from '../utils/DateFormat';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { toast } from 'react-toastify';


const Users = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        const fetchedPosts = async () => {
            setIsLoading(true);
            const getDatas = await Axios.get('/api/users/all-users', {
                signal: signal
            });
            setData(getDatas.data.allUser);
            setIsLoading(false);
        }
        fetchedPosts();
        return function cleanup() {
            abortController.abort();
        }
    }, [])


    const handleDeleteButton = async (userid) => {
        try {
            const res = await Axios.delete(`/api/users/delete/${userid}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });
            toast.success(res.data.message, {
                autoClose: 3000,
                position: toast.POSITION.BOTTOM_RIGHT
            });
            const newData = data.filter(item => item._id !== userid);
            setData(newData);
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message, {
                autoClose: 3000,
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }
    }
    return (
        <Fragment>
        {
            isLoading ? (
                <div>Loading....</div>
            ) : 
            <div className="container mt-3">
            <h1 className="text-justify mb-4">Users</h1>
            <div className="row mb-3" >
            <table class="table">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
            {
                data && data.length > 0 ? 
                    data.map((item, index) => {
                        
                        return (    
                            <tr>
                            <th scope="row">{index+1}</th>
                            <td>{item.name}</td>
                            <td>{item.email}</td>
                            <td>{item.role}</td>
                            <td>
                                <Fragment>
                                    {/* <Button className="btn btn-info mx-2">
                                        <i 
                                            className="fa fa-pencil" 
                                            aria-hidden="true" 
                                            title="Edit"></i>
                                    </Button> */}
                                    <Button 
                                        className="btn btn-danger"
                                        onClick={() => handleDeleteButton(item._id) }>
                                        <i 
                                            className="fa fa-trash" 
                                            aria-hidden="true" 
                                            title="Delete"></i>
                                    </Button>
                                </Fragment>
                            </td>
                            </tr>   
                        )
                    })
                : (
                    <div>Nothing in database!</div>
                )
            }
              </tbody>
            </table>
            </div>
        </div>
        }
        </Fragment>
    )
}


export default Users;