import React from "react";
import ReactDom from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";

import "semantic-ui-css/semantic.min.css";
import "./css/common.css";

import registerServiceWorker from "./registerServiceWorker";
import App from "./components/App";
import Login from "./components/Login";
import Signup from "./components/Signup";
import CreateService from "./components/CreateService";
import Search from "./components/SearchStandard";
import CreateCrowdfunding from "./components/CreateCrowdfunding";
import Crowdfunding from "./components/Crowdfunding";
import Crowdfundings from "./components/Crowdfundings";
import { Responsive } from "semantic-ui-react";
import { MygrantFooter, MygrantHeader, MygrantNav } from "./components/Common";

ReactDom.render(
    <Router>
        <div>
            <Responsive as={MygrantHeader} minWidth={768} />
            <Route exact path="/" component={App} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/createservice" component={CreateService} />
            <Route exact path="/search" component={Search} />
            <Route exact path="/crowdfundings" component={Crowdfundings} />
            <Route exact path="/crowdfunding/:id" component={Crowdfunding} />
            <Route exact path="/createcrowdfunding" component={CreateCrowdfunding} />
            <Responsive as={MygrantFooter} minWidth={768} />
            <Responsive as={MygrantNav} maxWidth={768} />
        </div>
    </Router>,
    document.getElementById("root")
);

registerServiceWorker();
