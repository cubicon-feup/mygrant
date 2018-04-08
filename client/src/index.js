import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import registerServiceWorker from './registerServiceWorker';
import App from './App.js';

ReactDom.render(
    <Router>
        <div>
            <Route exact path="/" component={App}/>
        </div>
    </Router>, document.getElementById('root')
    );

registerServiceWorker();