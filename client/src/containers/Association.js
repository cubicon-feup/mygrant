import React, { Component } from 'react';
import '../css/Signup.css';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import ReactRouterPropTypes from 'react-router-prop-types';

import { Button, Container, Form, Header, Input, Modal, Message, Responsive } from 'semantic-ui-react';
import { MygrantDivider } from '../components/Common';
import PidgeonMaps from '../components/Map';
import SearchLocation from '../components/SearchLocation';


class Association extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired,
        history: ReactRouterPropTypes.history.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
        };
        this.data = {
          id : null,
          id_creator : null,
          ass_name : null,
          missao : null,
          criterios_entrada : null,
          joia : null,
          quota : null
        };
      //  this.getData();
    }

  /*  getData() {
          fetch('/api/associations/1', {
              body: JSON.stringify(this.data),
              headers: { 'content-type': 'application/json' },
              method: 'POST'
          }).then(res => {
              if (res.status === 201) {
                  // User created - redirect to more info
                  //this.props.history.push('/');
                  console.log(this.data);
              } else if (res.status === 409) {
                  // Email or phone already in use
                  this.setState({
                      emailError: true,
                      errorMessage: 'email or phone already in use',
                      formError: true,
                      phoneError: true
                  });
              }
          });
    }*/


    render() {
        return (
            <Container className="main-container">
                <div>{console.log(this.data)}</div>
            </Container>
        );
    }
}

export default withCookies(Association);
