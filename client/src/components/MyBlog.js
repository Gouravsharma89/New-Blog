import React, { useState, useEffect, Fragment, useContext } from 'react';
import Axios from 'axios';
import ReactHtmlParser from 'react-html-parser';
import '../App.css';
import { formatDate } from '../utils/DateFormat';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { toast } from 'react-toastify';
import { useSelector } from "react-redux";

const MyBlog = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const userinfo = useSelector (state => state.auth);
    console.log(userinfo);
    useEffect(() => {
        
        const abortController = new AbortController();
        const signal = abortController.signal;
        const fetchedPosts = async () => {
            setIsLoading(true);
            const getDatas = await Axios.get(`/api/posts/myposts/${userinfo.user.user._id}`, {
                signal: signal
            });
            setData(getDatas.data.allPosts);
            setIsLoading(false);
        }
        if(userinfo.isAuthenticated){
            fetchedPosts();
        }
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
    return (
        <Fragment>
        {
            isLoading ? (
                <div>Loading....</div>
            ) : 
            <div className="container mt-3">
            <h1 className="text-justify mb-4">My Posts</h1>
            {
                data && data.length > 0 ? 
                    data.map((item, index) => {
                        let approved = 'Pending';
                        if(item.is_approved == '1'){
                            approved = 'Approved'
                        }
                        return (
                            <div className="row mb-3" key={index}>
                                <div className="col-12">
                                    <div className="card">
                                        <div className="card-body text-justify">
                                        <Link 
                                                    style={{ textDecoration: 'none' }} 
                                                    to={{
                                                        pathname: `/posts/post-details/${item._id}`,                                             
                                                        author: item.author.name
                                                    }}>
                                            <h1 className="card-title text-left">{item.title}</h1>
                                            <div className="d-flex">
                                                <p className="card-text text-justify mr-3">
                                                    <i className="fa fa-user mr-1" aria-hidden="true"></i>{ item.author.name }
                                                </p>
                                                <p className="card-text text-justify">
                                                <i className="fa fa-calendar mr-1" aria-hidden="true"></i>{ formatDate(item.createdAt) }
                                                </p>
                                            </div> 
                                            { ReactHtmlParser((item.content).substring(0,150) )}
                                            </Link>
                                            <div>
                                                {
                                                    // authContext.userState.user && authContext.userState.user._id === item.author._id && 
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
                                                        </Button>&nbsp;&nbsp;
                                                       { item.is_approved=='1'? <span style={{color: 'green'}}>Approved</span>:
                                                        <span style={{color: 'red'}}>Not Approved</span>
                                                    }
                                                    </Fragment>   
                                                }  
                                            </div>
                                        </div> 
                                    </div>   
                                </div>
                            </div>
                        )
                    })
                : (
                    <div>Something went wrong!</div>
                )
            }
            
        </div>
        }
        </Fragment>
    )
}
export default MyBlog;