import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './css/index.css';
import registerServiceWorker from './registerServiceWorker';
import App from './components/App';
import Login from './components/Login';

ReactDom.render(
    <Router>
        <div>
            <Route exact path="/" component={App}/>
            <Route exact path="/login" component={Login}/>
        </div>
    </Router>, document.getElementById('root')
    );

registerServiceWorker();
