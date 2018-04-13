import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import 'semantic-ui-css/semantic.min.css';
import './scss/common.scss';

import registerServiceWorker from './registerServiceWorker';
import App from './components/App';
import Login from './components/Login';
import Signup from './components/Signup';
import { MygrantHeader, MygrantFooter } from './components/Common';

ReactDom.render(
    <Router>
        <div>
            <MygrantHeader/>
            <Route exact path="/" component={App}/>
            <Route exact path="/login" component={Login}/>
            <Route exact path="/signup" component={Signup}/>
            <MygrantFooter/>
        </div>
    </Router>, document.getElementById('root')
    );

registerServiceWorker();
