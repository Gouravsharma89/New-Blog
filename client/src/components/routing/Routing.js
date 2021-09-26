import React, { useEffect, useContext } from 'react'
import { Switch, Route, useHistory } from 'react-router-dom'
import Home from '../../pages/Dashboard';
import About from '../../pages/About';
import Compose from '../../pages/Compose';
import NotFound from '../../pages/NotFound'
import SignInForm from '../SignInForm';
import SignUpForm from '../SignUpForm';
import DisplayPost from '../DisplayPost'
import MyBlog from '../MyBlog';
import Users from '../../pages/Users';
import AllPosts from '../../pages/AllPosts';
import { useSelector } from "react-redux";
const Router = () => {
    
    const history = useHistory();
    const authContext = useSelector (state => state.auth);
    useEffect(() => {
        // console.log(localStorage.getItem("token"))
        // console.log(JSON.parse(localStorage.getItem("user")))
        // const user = JSON.parse(localStorage.getItem("user"))
        // console.log('Use effect calling...')
        if (!authContext.isAuthenticated) {
            if(history.location.pathname != '/signin')
            history.push('/')
        }

    },[history, authContext.isAuthenticated])
    return (
        <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/about" component={About} />
            <Route path="/compose" component={Compose} />
            <Route path="/signin" component={SignInForm} />
            <Route path="/signup" component={SignUpForm} />
            <Route path="/posts/post-details/:postid" component={DisplayPost} />
            <Route path="/myblog" component={MyBlog} />
            <Route path="/users" component={Users} />
            <Route path="/allposts" component={AllPosts} />
            <Route component={NotFound} />
        </Switch>
    )
}

export default Router;