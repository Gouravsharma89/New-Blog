import React, { useState, useEffect, Fragment, useContext } from 'react';
import Axios from 'axios';
import ReactHtmlParser from 'react-html-parser';
import '../App.css';
import { formatDate } from '../utils/DateFormat';
import { Link } from 'react-router-dom';


const Dashboard = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCollapsed, setCollapsed] = useState(false);

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        const fetchedPosts = async () => {
            setIsLoading(true);
            const getDatas = await Axios.get('/api/posts', {
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
    return (
        <Fragment>
        {
            isLoading ? (
                <div>Loading....</div>
            ) : 
            <div className="container mt-3">
            <h1 className="text-justify mb-4">The Blog</h1>
            {
                data && data.length > 0 ? 
                    data.map((item, index) => {
                        return (
                            <div className="row mb-3" key={index}>
                                <div className="col-12">
                                    <div className="card">
                                    <Link 
                                                    style={{ textDecoration: 'none' }} 
                                                    to={{
                                                        pathname: `/posts/post-details/${item._id}`,                                             
                                                        author: item.author.name
                                                    }}>
                                        <div className="card-body text-justify">
                                            <h1 className="card-title text-left">{item.title}</h1>
                                            <div className="d-flex">
                                                <p className="card-text text-justify mr-3">
                                                    <i 
                                                        className="fa fa-user mr-1" 
                                                        aria-hidden="true"></i>{ item.author.name }
                                                </p>
                                                <p className="card-text text-justify">
                                                <i 
                                                    className="fa fa-calendar mr-1" 
                                                    aria-hidden="true"></i>{ formatDate(item.createdAt) }
                                                </p>
                                            </div>
                                            { ReactHtmlParser((item.content).substring(0,150) )}
                                            
                                        </div> 
                                        </Link>
                                    </div>   
                                </div>
                            </div>
                        )
                    })
                : (
                    <div>Nothing in database!</div>
                )
            }
            
        </div>
        }
        </Fragment>
    )
}


export default Dashboard;