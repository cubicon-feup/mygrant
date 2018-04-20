import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import 'semantic-ui-css/semantic.min.css';
import './css/common.css';

import registerServiceWorker from './registerServiceWorker';
import App from './components/App';
import Login from './components/Login';
import Signup from './components/Signup';
import CreateService from './components/CreateService';
import User from './components/User';
import Service from './components/Service';
import { Responsive } from 'semantic-ui-react';
import { MygrantFooter, MygrantHeader, MygrantNav } from './components/Common';

ReactDom.render(
    <Router>
        <div>
            <Responsive as={MygrantHeader} minWidth={768} />
            <Route exact path="/" component={App} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/createservice" component={CreateService} />
            <Route exact path="/user/:id" component={User} />
            <Route exact path="/service/:id" component={Service} />
            <Responsive as={MygrantFooter} minWidth={768} />
            <Responsive as={MygrantNav} maxWidth={768} />
        </div>
    </Router>,
    document.getElementById('root')
);

registerServiceWorker();
