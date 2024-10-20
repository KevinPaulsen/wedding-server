import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {AuthProvider} from "./auth/AuthContext";
import {BrowserRouter as Router} from "react-router-dom";
import {FlowProvider} from "./FlowProvider";
import './styles/App.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode>
    <AuthProvider>
        <Router>
            <FlowProvider>
                <App/>
            </FlowProvider>
        </Router>
    </AuthProvider>
</React.StrictMode>);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
