import React, { Component } from 'react';
import '../css/Crowdfunding.css';

import { Container, Button, Checkbox, Header, Grid, Label, Modal, Icon, Item, Rating, Loader,Progress, Responsive, Form, Radio} from 'semantic-ui-react';
import { MygrantDividerLeft, MygrantDividerRight } from './Common';
import { Pie } from 'react-chartjs-2';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { Link } from 'react-router-dom';


const apiPath = require('../config').apiPath;
const urlForPoll = poll_id => '/api/polls/' + poll_id;
const urlForPollAnswers = poll_id => '/api/polls/' + poll_id + '/answers';
const urlForPollClose = poll_id => '/api/polls/' + poll_id + '/close';


class Poll extends Component{
    constructor(props) {
        super(props);
        this.state = {
            requestFailed: false,
            poll_id : this.props.match.params.poll_id,
            poll: this.props.poll,
            poll_answers: this.props.answers,
            has_voted : this.props.has_voted,
            options_values: null,
            total_answers:null,
            optionChecked: 'No option',
            colors : ['green','blue','purple','violet','orange','yellow','brown','red','grey','pink','black'],
            colors_hex : ['#8ee8bc','#2185d0','#a333c8','#6435c9','#f2711c','#fbbd08','#a5673f','#db2828','#767676','#e03997','#1b1c1d'],
            colors_hex_dimmed : ['#aaeecd','#3897e0','#ae49d0','#835ed4','#f4873e','#fcca36','#c08259','#e15151','#8c8c8c','#e765ae','#313335'],
            creator_id: 0,
            pie_chart_data: {},
            open: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleModalClick = this.handleModalClick.bind(this);

        const { cookies } = this.props;
        //console.log(cookies);
    }


    componentDidMount() {
       this.getData();
    }

    show = dimmer => () => this.setState({ dimmer, open: true });
    close = () => this.setState({ open: false });

    /* componentWillUnmount() {

    } */

    handleChange = (e, { value }) => this.setState({ optionChecked : value })

    handleSubmit = (event) => {
        const { cookies } = this.props;
        if (this.state.optionChecked != 'No option' && this.state.has_voted == false){

            fetch(urlForPollAnswers(this.state.poll_id), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${cookies.get('id_token')}`
                },
                body: JSON.stringify({
                    answer: this.state.optionChecked
                })
            }).then(res => {
                if(res.status === 201) {
                    console.log('Answer sent succesfully');
                    this.getData();
                    this.displayData();
                    this.setState({has_voted : true});
                }
            })
        }
    }

    handleModalClick = (event) => {
        const { cookies } = this.props;

        var closed_state = this.state.poll.closed;

        closed_state = !closed_state;

        fetch(urlForPollClose(this.state.poll_id), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${cookies.get('id_token')}`
            },
            body: JSON.stringify({
                closed: closed_state
            })
        }).then(res => {
            if(res.status === 201) {
                console.log('Answer sent succesfully');
                var poll = this.state.poll;
                Object.assign(poll,{closed : closed_state});
                this.setState({poll : poll });
                this.close();

            }
        })

    }

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

            const { cookies } = this.props;
            let userId = cookies.get('user_id');
            for (let voter of result){
                if (voter['id_user'] == userId)
                {
                    this.setState({has_voted : true});
                    break;
                }
            }

            if (this.state.has_voted == undefined)
            {
                this.setState({has_voted : false});
            }

        }, () => {
            // "catch" the error
            this.setState({ requestFailed: true });
        });



    }


    totalVotes(index, total_answers){
        var options = this.state.poll.options.split('|||');

        if (index == options.length - 1)
            return(<Item.Extra>Total votes: {total_answers}</Item.Extra>);
    }


    displayData(){
        //Poll Answers

        var options = this.state.poll.options.split('|||');


        var options_values = [];

        for (var i = 0; i < options.length; i++){
            options_values[i] = 0;
        }


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

            if (this.state.has_voted || this.state.poll.closed){
                answers.push (
                    <Item key={`Item_${i}`} >
                    <Item.Content>
                        <Item.Header>{options[i]}</Item.Header>
                        <Item.Description><Progress progress='value' value={options_values[i]} total={total_answers} color={this.state.colors[i]} /></Item.Description>
                        {this.totalVotes(i,total_answers)}
                    </Item.Content>
                    </Item>
                );
            } else {
                answers.push(
                    <Form.Field key={`Form.Field_${i}`}>
                      <Checkbox
                        radio
                        label={options[i]}
                        name='checkboxRadioGroup'
                        value={options[i]}
                        checked={this.state.optionChecked === options[i]}
                        onChange={this.handleChange}
                      />
                    </Form.Field>
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

    visible_pie_graph(pie_chart_data){
        if (this.state.has_voted || this.state.poll.closed)
            return (<Pie data={pie_chart_data} legend={{display:false,position:'bottom'}} width={200} height={200}/>);
    }

    visible_vote_button(){
        if (!this.state.poll.closed)
            return (<Form.Button floated='right' onClick={this.handleSubmit}>Vote</Form.Button>);

    }

    displayDecision(answers){
        if (this.state.has_voted)
            return(<Item.Group> {answers} </Item.Group>);
        else
            return(
                <Form>
                    {answers}
                    {this.visible_vote_button()}
                </Form>
                );
    }

    open_voting(){
        var closed = this.state.poll.closed;
        const { cookies } = this.props;
        var userId = cookies.get('user_id');
        var poll_creator_id = this.state.poll.id_creator;



        if (closed){

            if (userId == poll_creator_id){

                return(
                <Label as='a' color='red' attached='top right'  onClick={this.show(true)}>
                    Open
                </Label>
                );

            }

            return(
            <Label color='red' attached='top right'>
                Closed
            </Label>);

        } else {
            if (userId == poll_creator_id){
                if (this.state.has_voted){
                    return(
                    <Label as='a' color='red' attached='top right'  onClick={this.show(true)}>
                        Close
                    </Label>
                    );
                }
            }

            if (this.state.has_voted){
                return(
                <Label color='blue' attached='top right'>
                    Open
                </Label>);
            }
        }
    }

    getModalContent(){
        if (this.state.poll.closed)
            return 'open';
        else
            return 'close';
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

        if(this.state.poll == undefined || this.state.poll_answers == undefined || this.state.has_voted == undefined) {
            return (
                <Container className="main-container">
                <div>
                <Loader active inline='centered' />
                </div>
                </Container>
            );
        }

        var mountData = this.displayData();

        var answers = mountData[0];
        var pie_chart_data = mountData[1];

        const { open, dimmer } = this.state;

        var modal_content = this.getModalContent();

        return (
        <Container className="main-container" id="crowdfunding_base_container" fluid={true}>
            <Container>
                <Grid columns={3}>
                    <Grid.Column>
                        <Header as="h1" id="crowdfunding_mission">
                            {this.state.poll.question}
                        </Header>
                    </Grid.Column>
                    <Grid.Column>
                    </Grid.Column>
                    <Grid.Column textAlign='right' style={{marginLeft:'-50px'}} verticalAlign='middle'>
                        {this.open_voting()}
                        <Modal dimmer={dimmer} open={open} onClose={this.close} size='small' closeIcon>
                            <Modal.Content>
                            <p>Are you sure you want to {modal_content} this poll?</p>
                            </Modal.Content>
                            <Modal.Actions>
                            <Button positive icon='checkmark' labelPosition='right' content='Yes' onClick={this.handleModalClick} />
                            <Button negative style={{height:'40px'}} onClick={this.close}>No</Button>
                            </Modal.Actions>
                        </Modal>
                    </Grid.Column>
                </Grid>
            </Container>
            <Responsive as={MygrantDividerLeft} minWidth={768} className="intro-divider" color="purple" />
            <Container>
                <Grid stackable columns={3} className="crowdfunding_grid">
                    <Grid.Column width={8} className="left_col">
                        {this.displayDecision(answers)}
                    </Grid.Column>
                    <Grid.Column width={2} />
                    <Grid.Column width={6} className="right_col">
                        {this.visible_pie_graph(pie_chart_data)}
                    </Grid.Column>
                </Grid>
            </Container>

        </Container>

        );

    }
}


export default withCookies(Poll);
