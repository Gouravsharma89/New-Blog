import React, { useState, useEffect, Fragment, useContext } from 'react';
import Axios from 'axios';
import '../App.css';
import Button from '../components/Button';
import { toast } from 'react-toastify';
// 

const Users = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        const fetchedPosts = async () => {
            setIsLoading(true);
            const getDatas = await Axios.get('/api/posts/all-posts', {
                signal: signal
            });
            setData(getDatas.data.allPosts);
            setIsLoading(false);
        }
        fetchedPosts();
        return function cleanup() {
            abortController.abort();
        }
    }, [])


    const handleDeleteButton = async (postid) => {
        try {
            const res = await Axios.delete(`/api/posts/post-details/${postid}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });
            console.log(res);
            toast.success(res.data.message, {
                autoClose: 3000,
                position: toast.POSITION.BOTTOM_RIGHT
            });
            const newData = data.filter(item => item._id !== postid);
            setData(newData);
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message, {
                autoClose: 3000,
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }
    }
    const handleApproveButton = async (postid,event) => {
        try {
            const res = await Axios.post(`/api/posts/approve/${postid}`);
            toast.success(res.data.message, {
                autoClose: 3000,
                position: toast.POSITION.BOTTOM_RIGHT
            });
            setData(res.data.allPosts);
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
            <h1 className="text-justify mb-4">All Posts</h1>
            <div className="row mb-3" >
            <table class="table">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Title</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
            {
                data && data.length > 0 ? 
                    data.map((item, index) => {
                        
                        let approved = 'Pending';
                        if(item.is_approved == '1'){
                            approved = 'Approved'
                        }
                        return (    
                            <tr key={index}>
                                <th scope="row">{index+1}</th>
                                <td>{item.author.name}</td>
                                <td>{item.title}</td>
                                <td>{approved}</td>
                                <td>
                                    <Fragment>
                                        <Button 
                                            className="btn btn-danger"
                                            onClick={() => handleDeleteButton(item._id) }>
                                            <i 
                                                className="fa fa-trash" 
                                                aria-hidden="true" 
                                                title="Delete"></i>
                                        </Button>&nbsp;
                                        {item.is_approved == '0' ?<Button 
                                            className="btn btn-success"
                                            onClick={(e) => handleApproveButton(item._id,e) }>
                                        Approve
                                        </Button>:''}
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