import React from "react";
import ReactDom from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";

import "semantic-ui-css/semantic.min.css";
import "./css/common.css";

import registerServiceWorker from "./registerServiceWorker";
import App from "./containers/App";
import Login from "./containers/Login";
import SignUp from "./containers/Signup";
import SignUpInfo from "./containers/SignupInfo";
import CreateService from "./components/CreateService";
import { Responsive } from "semantic-ui-react";
import { MygrantFooter, MygrantHeader, MygrantNav } from "./components/Common";

ReactDom.render(
    <Router>
        <div>
            <Responsive as={MygrantHeader} minWidth={768} />
            <Route exact path="/" component={App} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/signupinfo" component={SignUpInfo} />
            <Route exact path="/createservice" component={CreateService} />
            <Responsive as={MygrantFooter} minWidth={768} />
            <Responsive as={MygrantNav} maxWidth={768} />
        </div>
    </Router>,
    document.getElementById("root")
);

registerServiceWorker();
