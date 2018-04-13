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
import { MygrantHeader, MygrantFooter } from "./components/Common";

ReactDom.render(
    <Router>
        <div>
            <MygrantHeader />
            <Route exact="exact" path="/" component={App} />
            <Route exact="exact" path="/login" component={Login} />
            <Route exact="exact" path="/signup" component={Signup} />
            <Route
                exact="exact"
                path="/createservice"
                component={CreateService}
            />
            <MygrantFooter />
        </div>
    </Router>,
    document.getElementById("root")
);

registerServiceWorker();
