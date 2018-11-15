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
import CreateService from './components/CreateService';
import User from './components/User';
import Service from './components/Service';
import TableServices from './components/TableServices';
import Blog from './containers/Blog';
import Feed from './containers/Feed';
import Post from './containers/Post';
import Inbox from './containers/Inbox';
import Conversation from './containers/Conversation';
import Search from './containers/SearchPage';
import CreateCrowdfunding from './components/CreateCrowdfunding';
import Crowdfunding from './components/Crowdfunding';
import Crowdfundings from './components/Crowdfundings';
import CreateServiceCrowdfunding from './components/CreateServiceCrowdfunding';
import Dashboard from './containers/Dashboard';
import { Responsive } from 'semantic-ui-react';
import MygrantHeader from './components/MygrantHeader';
import { MygrantFooter, MygrantNav } from './components/Common';
import Poll from './components/Poll';

ReactDom.render(
    <Router>
        <div>
            <CookiesProvider >
                <Responsive as={MygrantHeader} minWidth={768} />
                <Route exact path="/" component={App} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/signup" component={SignUp} />
                <Route
                    exact path="/createservice/:type(PROVIDE|REQUEST)"
                    component={CreateService}
                />
                <ProtectedRoute exact path="/user/:id" component={User} />
                <ProtectedRoute exact path="/user/:id/blog" component={Blog} />
                <ProtectedRoute exact path="/feed" component={Feed} />
                <ProtectedRoute exact path="/post/:id" component={Post} />
                <Route exact path="/service/:id" component={Service} />
                <ProtectedRoute exact path="/inbox/" component={Inbox} />
                <ProtectedRoute exact path="/conversation/:id" component={Conversation} />
                <Route exact path="/tableservices" component={TableServices} />
                <Route exact path="/search" component={Search} />
                <Route exact path="/crowdfundings" component={Crowdfundings} />
                <ProtectedRoute exact path="/crowdfunding/:crowdfunding_id" component={Crowdfunding} />
                <Route exact path="/createcrowdfunding" component={CreateCrowdfunding} />
                <ProtectedRoute exact path="/crowdfunding/:crowdfunding_id/createservice" component={CreateServiceCrowdfunding} />
                <ProtectedRoute exact path="/dashboard" component={Dashboard} />
                <Responsive as={MygrantFooter} minWidth={768} />
                <ProtectedRoute exact path="/poll/:poll_id" component={Poll} />
            </CookiesProvider>
        </div>
    </Router>,
    document.getElementById('root')
);

registerServiceWorker();
