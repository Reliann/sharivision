import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { CssBaseline } from '@mui/material';
import axios from 'axios'
// so all calls go to api no matter the path
axios.defaults.baseURL = '/api/'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <CssBaseline/>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

