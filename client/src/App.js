import React from 'react';
import './App.css';
import Nav from './components/Nav';
import { ToastContainer } from 'react-toastify';
import { Provider } from "react-redux";
import store from "./store";


function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Nav />
        <ToastContainer />
      </div>
    </Provider>
  );
}

export default App;
