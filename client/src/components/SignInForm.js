import React, { Component } from 'react';
import Button from './Button'
import Input from './Input'
import { toast } from 'react-toastify';
import { connect } from "react-redux";
import { setCurrentUser } from "../actions/authActions";

class SignInForm extends Component {
    constructor(props) {
      super(props);
      this.state = {
        email: '',
        password: ''
      };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSignInClick = this.handleSignInClick.bind(this);
    }

    handleChange = (event) => {
        // const { value, name } = event.target;
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSignInClick = async (event) => {
        
        event.preventDefault();
    console.log(this.state);
        try {
            const userInfo = {
                email: this.state.email,
                password: this.state.password
              };
            this.props.setCurrentUser(userInfo);
            toast.success("Signed in successful!", {
                className: "success-toast",
                autoClose: 3000,
                position: toast.POSITION.BOTTOM_RIGHT
            })
            this.props.history.push('/')
        } catch (error) {
            toast.error(error.response.data.error.message, {
                className: "error-toast",
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 3000
            })
        }
    }

    render() {
        return (
        <div className="card text-center mx-auto mt-5" style={{height: "22rem", width: "28rem"}}>
            <div className="card-body">
                <h4 className="card-title">Sign In</h4>
                <form>
                    <Input 
                        type="text" 
                        name="email"
                        value={this.state.email}
                        className="form-control form-control-lg mt-5" 
                        placeholder="Enter email address" 
                        onChange={this.handleChange} />
                    <Input 
                        type="password" 
                        name="password"
                        value={this.state.password}
                        className="form-control form-control-lg mt-3" 
                        placeholder="Enter password" 
                        onChange={this.handleChange} />
                    <Button 
                        type="submit" 
                        onClick={this.handleSignInClick}
                        className="btn btn-block btn-lg btn-success mt-5"> Sign In </Button>
                </form>
                {/* <p className="mt-2">New to Blog? <Link to="/signup">Create an account</Link> </p> */}
            </div>
        </div>
        
    )}
}

const mapStateToProps = state => ({
    auth: state.auth
  });
  
  export default connect(
    mapStateToProps,
    { setCurrentUser }
  )(SignInForm);