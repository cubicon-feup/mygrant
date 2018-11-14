import React, { Component } from 'react';
import '../css/Crowdfunding.css';

import { Container, Header, Grid, Divider, Image, Icon, Item, Rating, Loader,Progress, Responsive, Form} from 'semantic-ui-react';
import { MygrantDividerLeft, MygrantDividerRight } from './Common';
import { Pie } from 'react-chartjs-2';
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
            poll_answers:[],
            options_values: null,
            total_answers:null,
            colors : ['green','blue','purple','violet','orange','yellow','brown','red','grey','pink','black'],
            colors_hex : ['#8ee8bc','#2185d0','#a333c8;','#6435c9','#f2711c','#fbbd08','#a5673f','#db2828','#767676','#e03997','#1b1c1d'],
            colors_hex_dimmed : ['#aaeecd','#3897e0','#ae49d0;','#835ed4','#f4873e','#fcca36','#c08259','#e15151','#8c8c8c','#e765ae','#313335'],
            creator_id: 0,
            pie_chart_data: {}
            
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
                console.log(this.state.poll);
            }, () => {
                // "catch" the error
                this.setState({ requestFailed: true });
            });

        fetch(urlForPollAnswers(this.state.poll_id))
        .then(response => {
            if (!response.ok) {
                throw Error('Network request failed');
            }

            return response;
        })
        .then(result => result.json())
        .then(result => {
            this.setState({ poll_answers: result });

        }, () => {
            // "catch" the error
            this.setState({ requestFailed: true });
        });
    }


    mountData(){
        //Poll Answers

        console.log(this.state.poll.options);
        var options = this.state.poll.options.split('|||');

        
        var options_values = [];

        for (var i = 0; i < options.length; i++){
            options_values[i] = 0;
        }
        
        //TODO : NO REPEATED QUESTIONS

        var total_answers = 0;

        for (var j = 0; j < this.state.poll_answers.length; j++){
            for (var k = 0; k < options.length; k++){
                if (this.state.poll_answers[j].answer == options[k]){
                    options_values[k] += 1;
                    total_answers++;
                }
            }
        }

        var answers = [];
        var labels = [];
        var data = [];
        var backgroundColor = [];
        var hoverBackgroundColor =[];
        
        for (var i = 0; i < options.length; i++){
            if (i != options.length - 1){
                answers.push (
                    <Item>
                    <Item.Content>
                        <Item.Header>{options[i]}</Item.Header>
                        <Item.Description><Progress progress='value' value={options_values[i]} total={total_answers} color={this.state.colors[i]}/></Item.Description>
                    </Item.Content>
                    </Item>
                );
            } else{
                answers.push (
                    <Item>
                    <Item.Content>
                        <Item.Header>{options[i]}</Item.Header>
                        <Item.Description><Progress progress='value' value={options_values[i]} total={total_answers} color={this.state.colors[i]} /></Item.Description>
                        <Item.Extra>Total votes: {total_answers}</Item.Extra>
                    </Item.Content>
                    </Item>
                );
            }

            labels.push(options[i]);
            data.push(options_values[i]);
            backgroundColor.push(this.state.colors_hex[i]);
            hoverBackgroundColor.push(this.state.colors_hex_dimmed[i]);

        }

        var pie_chart_data = {
            labels : labels,
            datasets: [{
                data : data,
                backgroundColor : backgroundColor,
                hoverBackgroundColor : hoverBackgroundColor
            }]
        };
        
        return [answers,pie_chart_data];
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

        if(!this.state.poll.options || !this.state.poll_answers) {
            return (
                <Container className="main-container">
                <div>
                <Loader active inline='centered' />
                </div>
                </Container>
            );
        } 

        var mountData = this.mountData();
        var answers = mountData[0];
        var pie_chart_data = mountData[1];

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
            <Container>
                <Grid stackable columns={3} className="crowdfunding_grid">
                    <Grid.Column width={8} className="left_col">
                        <Item.Group> 
                            {answers}
                        </Item.Group>
                    </Grid.Column>
                    <Grid.Column width={2} />
                    <Grid.Column width={6} className="right_col">
                        <Pie data={pie_chart_data} legend={false} width={200} height={200}/>
                    </Grid.Column>
                </Grid>
            </Container>
        </Container>
        
        );
    }
}


export default withCookies(Poll);
