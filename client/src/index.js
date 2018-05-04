import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { CookiesProvider } from 'react-cookie';

import 'semantic-ui-css/semantic.min.css';

import registerServiceWorker from './registerServiceWorker';
import App from './containers/App';
import Login from './containers/Login';
import SignUp from './containers/Signup';
import SignUpInfo from './containers/SignupInfo';
import CreateService from './components/CreateService';
import User from './components/User';
import Service from './components/Service';
import TableServices from './components/TableServices';
import Search from "./containers/SearchPage";
import CreateCrowdfunding from "./components/CreateCrowdfunding";
import Crowdfunding from "./components/Crowdfunding";
import Crowdfundings from "./components/Crowdfundings";
import { Responsive } from "semantic-ui-react";
import { MygrantFooter, MygrantHeader, MygrantNav } from "./components/Common";

ReactDom.render(
    <Router>
        <div>
            <CookiesProvider >
                <Responsive as={MygrantHeader} minWidth={768} />
                <Route exact path="/" component={App} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/signup" component={SignUp} />
                <ProtectedRoute exact path="/signupinfo" component={SignUpInfo} />
                <Route exact path="/createservice" component={CreateService} />
                <Route exact path="/user/:id" component={User} />
                <Route exact path="/service/:id" component={Service} />
                <Route exact path="/tableservices" component={TableServices} />
                <Route exact path="/search" component={Search} />
                <Route exact path="/crowdfundings" component={Crowdfundings} />
                <Route exact path="/crowdfunding/:id" component={Crowdfunding} />
                <Route exact path="/createcrowdfunding" component={CreateCrowdfunding} />
                <Responsive as={MygrantFooter} minWidth={768} />
                <Responsive as={MygrantNav} maxWidth={768} />
            </CookiesProvider>
        </div>
    </Router>,
    document.getElementById('root')
);

registerServiceWorker();
