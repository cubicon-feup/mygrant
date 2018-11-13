import React, { Component } from 'react';
import '../css/Crowdfunding.css';

import { Container, Header, Grid, Divider, Image, Icon, Item, Rating, Loader,Progress, Responsive, Form} from 'semantic-ui-react';
import { MygrantDividerLeft, MygrantDividerRight } from './Common';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { Link } from 'react-router-dom';


const apiPath = require('../config').apiPath;
const urlForPoll = poll_id => '/api/polls/' + poll_id;
const urlForPollAnswers = poll_id => '/api/polls/' + poll_id + '/answers';


class Poll extends Component{
    constructor(props) {
        super(props);
        this.state = {
            requestFailed: false,
            poll_id : this.props.match.params.poll_id,
            poll:{},
            creator_id: 0
        };

        //this.handleChange = this.handleChange.bind(this);

        const { cookies } = this.props;
        console.log(cookies);
    }

    
    componentDidMount() {
       this.getData(); 
    }

    /* componentWillUnmount() {
        
    } */ 

    getData(){
        fetch(urlForPoll(this.state.poll_id))
            .then(response => {
                if (!response.ok) {
                    throw Error('Network request failed');
                }

                return response;
            })
            .then(result => result.json())
            .then(result => {
                this.setState({ poll: result });
                console.log("tst");
            }, () => {
                // "catch" the error
                this.setState({ requestFailed: true });
            });
    }



    render() {
        if(this.state.requestFailed) {
          return (
              <Container className="main-container">
                  <div>
                      <h1>Request Failed</h1>
                  </div>
              </Container>
          );
        }

        return (
            
        <Container className="main-container" id="crowdfunding_base_container" fluid={true}>
            <Container>
                <p>
                    <Header as="h1" id="crowdfunding_mission">
                        {this.state.poll.question}
                    </Header>
                </p>
            </Container>
            <Responsive as={MygrantDividerLeft} minWidth={768} className="intro-divider" color="purple" />
        </Container>
        
        );
    }
}


export default withCookies(Poll);
