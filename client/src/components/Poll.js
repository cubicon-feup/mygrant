import React, { Component } from 'react';
import '../css/Crowdfunding.css';

import { Container, Button, Checkbox, Header, Grid, Label, Modal, Icon, Item, Message, Loader,Progress, Responsive, Form, Transition} from 'semantic-ui-react';
import { MygrantDividerLeft, MygrantDividerRight } from './Common';
import { Pie } from 'react-chartjs-2';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { Link } from 'react-router-dom';


const apiPath = require('../config').apiPath;
const urlForPoll = poll_id => '/api/polls/' + poll_id;
const urlForPollAnswers = poll_id => '/api/polls/' + poll_id + '/answers';
const urlForPollClose = poll_id => '/api/polls/' + poll_id + '/close';
const urlForPollDelete = poll_id => '/api/polls/' + poll_id + '/delete';
const urlForPollRate = poll_id => '/api/polls/' + poll_id + '/rate';

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;


class Poll extends Component {
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
            free_text_answer: '',
            colors : ['green','blue','purple','violet','orange','yellow','brown','red','grey','pink','black'],
            colors_hex : ['#8ee8bc','#2185d0','#a333c8','#6435c9','#f2711c','#fbbd08','#a5673f','#db2828','#767676','#e03997','#1b1c1d'],
            colors_hex_dimmed : ['#aaeecd','#3897e0','#ae49d0','#835ed4','#f4873e','#fcca36','#c08259','#e15151','#8c8c8c','#e765ae','#313335'],
            creator_id: 0,
            pie_chart_data: {},
            open: false,
            open2: false,
            timer: null,
            timeDiff: this.props.timeDiff,
            poll_rating : null,
            visible : false,
            approval_perc : 0
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeFreeText = this.handleChangeFreeText.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleModalClick = this.handleModalClick.bind(this);
        this.handleModalDeleteClick = this.handleModalDeleteClick.bind(this);
        this.handleRatingClick = this.handleRatingClick.bind(this);
        this.tick = this.tick.bind(this);

        const { cookies } = this.props;
        //console.log(cookies);
    }


    componentDidMount() {
       this.getData();
       let timer = setInterval(this.tick, 1000);
       this.setState({timer});
    }

    show = dimmer => () => this.setState({ dimmer, open: true });
    close = () => this.setState({ open: false });

    show2 = dimmer2 => () => this.setState({ dimmer2, open2: true });
    close2 = () => this.setState({ open2: false });

    toggleVisibility = () => this.setState({ visible: !this.state.visible });

    componentWillUnmount() {
        clearInterval(this.state.timer);
    }

    tick() {
        if(this.state.timeDiff <= 0) {
            clearInterval(this.state.timer);
            // this.getData();
        }

        this.setState({days: Math.floor(this.state.timeDiff / day)})
        this.setState({hours: Math.floor((this.state.timeDiff % day) / hour)})
        this.setState({minutes: Math.floor((this.state.timeDiff % hour) / minute)})
        this.setState({seconds: Math.floor((this.state.timeDiff % minute) / second)})
        this.setState({timeDiff: this.state.timeDiff - 1000});
    }

    handleChange = (e, { value }) => { 
        this.setState({ optionChecked : value });
        this.setState({ free_text_answer : ''});
    }

    handleChangeFreeText = (e, { value }) => {
        
        this.setState({ free_text_answer : value});
        this.setState({ optionChecked : 'No option' })

    };

    submit_answer(answer){
        const { cookies } = this.props;
        fetch(urlForPollAnswers(this.state.poll_id), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${cookies.get('id_token')}`
            },
            body: JSON.stringify({
                answer: answer
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

    update_options(new_options){

        const { cookies } = this.props;
        fetch(urlForPoll(this.state.poll_id), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${cookies.get('id_token')}`
            },
            body: JSON.stringify({
                options: new_options
            })
        }).then(res => {
            if(res.status === 200) {
                if (this.state.free_text_answer != '')
                    this.submit_answer(this.state.free_text_answer);
                else
                    this.submit_answer(this.state.optionChecked);
            }
        })
    }

    handleSubmit = (event) => {
        
        if (this.state.optionChecked != 'No option' && this.state.has_voted == false){
            this.submit_answer(this.state.optionChecked);
        }else if (this.state.free_text_answer != ''){

            console.log(this.state.poll.options);

            if(this.state.poll.options == null){
                this.update_options(this.state.free_text_answer);
            }else{

                var options = this.state.poll.options.split('|||');

                if (options.includes(this.state.free_text_answer)){
                    console.log('here');
                    this.submit_answer(this.state.free_text_answer);
                } else { 
                    var new_options = this.state.poll.options + '|||' + this.state.free_text_answer;
                    console.log(new_options);
                    this.update_options(new_options);
                }
            }

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

    handleRatingClick = (e, { name, value }) => {
        const { cookies } = this.props;

        fetch(urlForPollRate(this.state.poll_id), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${cookies.get('id_token')}`
            },
            body: JSON.stringify({
                was_useful: value
            })
        }).then(res => {
            if(res.status === 201) {
                this.setState({visible : false});

                const { cookies } = this.props;
                let userId = cookies.get('user_id');

                var poll_answers = this.state.poll_answers;

                for (var i = 0; i < poll_answers.length; i++){
                    

                    if (poll_answers[i]['id_user'] == userId){
                        poll_answers[i]['was_useful'] = value;
                        //Object.assign(poll_answers[i],{was_useful : value});
                        break;
                    }
                }
                console.log(poll_answers);
                this.setState({poll_answers : poll_answers}, this.update_approval_rate());

            }
        })
    
    };


    handleModalDeleteClick = (event) => {
        const { cookies } = this.props;
            
        fetch(urlForPollDelete(this.state.poll_id), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${cookies.get('id_token')}`
            },
            body: JSON.stringify({
                deleted: true
            })
        }).then(res => {
            if(res.status === 201) {
                this.props.history.push(`/polls`);
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
                let timeDiff = new Date(result.date_finished) - new Date().getTime();
                this.setState({ timeDiff: timeDiff});
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

            var total_rating_answers = 0;
            var pos_rating_answers = 0;
    
            for (let voter of result){
                if (voter['id_user'] == userId)
                {
                    this.setState({has_voted : true});
                    if (voter['was_useful'] == null)
                        this.setState({visible : true});
                }
    
                if (voter['was_useful'] != null){
                    total_rating_answers++;
                }
    
                if (voter['was_useful'] == 1){
                    pos_rating_answers++;
                }
            }
    
            var ratio = (pos_rating_answers/total_rating_answers)*100;
    
            this.setState({approval_perc : ratio});

            if (this.state.has_voted == undefined)
            {
                this.setState({has_voted : false});
            }

        }, () => {
            // "catch" the error
            this.setState({ requestFailed: true });
        });

    }

    update_approval_rate(){

        const { cookies } = this.props;
        let userId = cookies.get('user_id');

        var total_rating_answers = 0;
        var pos_rating_answers = 0;

        for (let voter of this.state.poll_answers){

            if (voter['was_useful'] != null){
                total_rating_answers++;
            }

            if (voter['was_useful'] == 1){
                pos_rating_answers++;
            }
        }

        var ratio = (pos_rating_answers/total_rating_answers)*100;

        this.setState({approval_perc : ratio});
    }


    totalVotes(index, total_answers){
        var options = this.state.poll.options.split('|||');

        if (index == options.length - 1){
            if (this.state.visible == true)
                return(<Item.Extra>Total votes: {total_answers} </Item.Extra>);
            else
                return(
                    <Item.Extra>
                        Total votes: {total_answers} 
                        <span>&nbsp;&nbsp;</span> | <span>&nbsp;&nbsp;</span>
                        {this.state.approval_perc}% of the users thought this poll was useful
                    </Item.Extra>);
        }

    }


    displayData(){
        //Poll Answers

        var options;

        if (this.state.poll.free_text && this.state.poll.options == undefined)
            options = [];
        else
            options = this.state.poll.options.split('|||');


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

        if (this.state.poll.free_text && !this.state.has_voted){
            if (options.length < 11){
            answers.push(
            <Form.Field  key={`Form.Field_Free_text_answer`}>
                <Header size='medium'>Your own answer:</Header>
                <Form.Input placeholder='Your answer' value={this.state.free_text_answer} onChange={this.handleChangeFreeText} />
            </Form.Field>
            );
            }
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
                <Label as='a' color='green' attached='top right'  onClick={this.show(true)}>
                    Open this poll
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
                    <Label as='a' attached='top right'  onClick={this.show(true)}>
                        Close this poll
                    </Label>
                    );
                }
            }

            if (this.state.has_voted){
                return(            
                <Label color='green' attached='top right'>
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

    delete_poll_content(){
        
        const { cookies } = this.props;
        var userId = cookies.get('user_id');
        var poll_creator_id = this.state.poll.id_creator;


        if (userId == poll_creator_id){
            if (this.state.has_voted){
                return(            
                <Label as='a' color='red' attached='top right'  onClick={this.show2(true)}>
                    Delete this poll
                </Label>
                );
            }
        }
    }

    poll_creator_options(){

        const { open, dimmer, open2, dimmer2 } = this.state;

        var modal_content = this.getModalContent();


        const { cookies } = this.props;
        var userId = cookies.get('user_id');
        var poll_creator_id = this.state.poll.id_creator;

        if (userId == poll_creator_id){
        return(
        <Grid columns={2}> 
            <Grid.Column>
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
            <Grid.Column style={{marginLeft:'-50px'}} >
                {this.delete_poll_content()}
                <Modal dimmer={dimmer2} open={open2} onClose={this.close2} size='small' closeIcon>
                    <Modal.Content>
                    <p>Are you sure you want to delete this poll?</p>
                    </Modal.Content>
                    <Modal.Actions>
                    <Button positive icon='checkmark' labelPosition='right' content='Yes' onClick={this.handleModalDeleteClick} />
                    <Button negative style={{height:'40px'}} onClick={this.close}>No</Button>
                    </Modal.Actions>
                </Modal>
            </Grid.Column>
        </Grid>);
        } else{
            return(
                <Grid columns={1}> 
                    <Grid.Column style={{marginLeft:'-50px'}}>
                    {this.open_voting()}
                    </Grid.Column>
                </Grid>
            );
        }
    }

    ratePoll(){
        const { visible } = this.state;
        if (this.state.has_voted){
            return(
                <Transition visible={visible} animation='scale' duration={500}>
                    <Message info>
                        <Message.Content>
                        <Message.Header>Please give us your thoughts.</Message.Header>
                        <Grid columns={2}>
                            <Grid.Column>
                                Was this poll useful?
                            </Grid.Column>
                            <Grid.Column textAlign='right'>
                                <Label as='a' size='large' name='poll_rating' value='1' onClick={this.handleRatingClick}>Yes</Label>
                                <Label as='a' size='large' name='poll_rating' value='0' onClick={this.handleRatingClick} style={{marginLeft:'20px'}}>No</Label>
                            </Grid.Column>
                        </Grid>
                        </Message.Content>
                    </Message>
                </Transition>
            );
        }
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

        if(this.state.poll == undefined || this.state.poll_answers == undefined || this.state.has_voted == undefined || this.state.timeDiff == undefined) {
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

        let timer;
        if (this.state.has_voted){
            if(this.state.timeDiff > 0)
                timer = <Header as="h3" style={{marginTop:' 42px',textAlign:'right'}}>{this.state.days} days, {this.state.hours}:{this.state.minutes}:{this.state.seconds} hours left</Header>
            else timer = <Header as="h3" style={{marginTop:' 42px',textAlign:'right'}}>Voting time has finished</Header>;
        }

        
        return (
        <Container className="main-container" id="crowdfunding_base_container" fluid={true}>
            <Container>
                <Grid columns={3}>
                    <Grid.Column>
                        <Header as="h1" id="crowdfunding_mission" style={{marginTop:' 35px'}}>
                            {this.state.poll.question}
                        </Header>
                    </Grid.Column>
                    <Grid.Column>
                        {timer}
                    </Grid.Column>
                    <Grid.Column textAlign='right' verticalAlign='middle'>
                        {this.poll_creator_options()}
                    </Grid.Column>
                </Grid>
            </Container>
            <Responsive as={MygrantDividerLeft} minWidth={768} className="intro-divider" color="purple" />
            <Container>
                <Grid stackable columns={3} className="crowdfunding_grid">
                    <Grid.Column width={8} className="left_col">
                        {this.displayDecision(answers)}
                        {this.ratePoll()}
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
