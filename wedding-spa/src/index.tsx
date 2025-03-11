// index.tsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import reportWebVitals from './app/reportWebVitals';
import {AuthProvider} from "./context/AuthContext";
import {BrowserRouter as Router} from "react-router-dom";
import {FlowProvider} from "./context/FlowProvider";
import './styles/App.css';

// Get the root element and throw an error if it isn't found
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

// Create the root container
const root = ReactDOM.createRoot(rootElement);

root.render(
    <React.StrictMode>
      <AuthProvider>
        <Router>
          <FlowProvider>
            <App/>
          </FlowProvider>
        </Router>
      </AuthProvider>
    </React.StrictMode>
);

// Start measuring performance in your app (optional)
reportWebVitals();
