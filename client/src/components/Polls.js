import React, { Component } from 'react';
import '../css/common.css';
import { Link, Redirect } from 'react-router-dom';
import { Container, Header, Divider, Transition, Message, Grid, Tab, Form, Card, Loader, Label, Modal, Item, Button, Icon, Menu} from 'semantic-ui-react';
import { withCookies, cookies } from 'react-cookie';
import { Z_PARTIAL_FLUSH } from 'zlib';

const apiPath = require('../config').apiPath;
const urlForPolls = `/api/polls`;
const urlForUser = id => `/api/users/${id}`;
const urlForPoll = poll_id => '/api/polls/' + poll_id;

class Polls extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            question:'',
            nr_answers:2,
            message_content : '',
            visible : false,
            answers : [],
            polls : this.props.polls,
            time_interval : 7
        };

        this.table_body = [];
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeAnswer = this.handleChangeAnswer.bind(this);
        this.add_answers = this.add_answers.bind(this);
        this.remove_answers = this.remove_answers.bind(this);
        this.handleFreeTextSubmit = this.handleFreeTextSubmit.bind(this);
        this.max_answers = 10;
    }

    componentDidMount() {
        fetch(urlForPolls)
            .then(response => {
                if (!response.ok) {
                    throw Error('Network request failed');
                }

                return response;
            })
            .then(result => result.json())
            .then(result => {

                //this.add_creator_names(result);

                this.setState({polls: result});

            }, () => {
                // "catch" the error
                this.setState({ requestFailed: true });
            });

    }

    show = dimmer => () => this.setState({ dimmer, open: true });
    close = () => this.setState({ open: false });
    handleChange = (e, { name, value }) => this.setState({ [name]: value });
    handleChangeAnswer = (e, { name, value }) => {
        var index = name.split('_')[1];
        var answers = this.state.answers;
        answers[index] = value;
        this.setState({ answers : answers });
    };
    toggleVisibility = () => this.setState({ visible: !this.state.visible });

    show_message(message){
        this.setState({message_content : message});
        if (this.state.visible != true){
            this.toggleVisibility();
            setTimeout(
                function() {
                    this.toggleVisibility();
                    this.setState({message_content : ''});
                }
                .bind(this),
                3000
            );
        }
    }

    check_empty_field(content){

        var can_send = true;

        if (content == ''){
            can_send = false;
        }

        return can_send;
    }


    handleSubmit = (event) => {

        var can_send = true;
        var question_exists = this.check_empty_field(this.state.question, 'No question provided.');
        var answers_exist = true;
        var answers_different = true;

        var user_answers =  this.state.answers;
        if (user_answers.length < 2)
            answers_exist = false;
        else
            for (var i = 0; i < user_answers.length; i++)
                for (var j = 0; j < user_answers.length; j++)
                    if (i != j)
                        if (user_answers[i] == user_answers[j])
                            answers_different = false;

        var message_to_send = '';
        if (!question_exists)
            message_to_send = message_to_send.concat('No question provided. ');
        if (!answers_exist)
            message_to_send = message_to_send.concat('You need at least 2 answers to start a poll.');
        if (!answers_different)
            message_to_send =  message_to_send.concat("You can't use duplicate answers.");

        if (message_to_send == ''){

            var time_interval = this.state.time_interval;
            if (isNaN(time_interval)){
                time_interval = 7;
            } else {
                if (time_interval < 1)
                    time_interval = 7;
                if (time_interval > 365)
                    time_interval = 7;
            }

            const { cookies } = this.props;
            fetch(urlForPolls, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${cookies.get('id_token')}`
                },
                body: JSON.stringify({
                    question : this.state.question,
                    options : this.state.answers,
                    free_text : 'false',
                    creator_name : cookies.get('user_full_name'),
                    time_interval : time_interval
                })
            }).then(res => {
                res.json()
                .then(data => {
                    this.props.history.push(`/poll/${data.id}`);
                })
            })
        } else
            this.show_message(message_to_send);

    }

    handleFreeTextSubmit = (event) => {

        if (this.state.question != ''){

            var time_interval = this.state.time_interval;
            if (isNaN(time_interval)){
                time_interval = 7;
            } else {
                if (time_interval < 1)
                    time_interval = 7;
                if (time_interval > 365)
                    time_interval = 7;
            }

            const { cookies } = this.props;
            fetch(urlForPolls, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${cookies.get('id_token')}`
                },
                body: JSON.stringify({
                    question : this.state.question,
                    free_text : 'true',
                    creator_name : cookies.get('user_full_name'),
                    time_interval : time_interval
                })
            }).then(res => {
                res.json()
                .then(data => {
                    this.props.history.push(`/poll/${data.id}`);
                })
            })
        }

    }


    /*add_creator_names = async (result) => {
        for (var i = 0; i < result.length; i++){

            await fetch(urlForUser(result[i]['id_creator']))
            .then(response => {
                if (!response.ok) {
                    throw Error('Network request failed');
                }

                return response;
            })
            .then(result2 => result2.json())
            .then(result2 => {
                //Object.assign(result[i],{'creator_name' : result2['full_name']});
                result[i]['creator_name'] = result2['full_name'];
            }, () => {
                // "catch" the error
                this.setState({ requestFailed: true });
            });
        }


        this.setState({polls: result});
    }*/

    add_answers(){
        var current_answers = parseInt(this.state.nr_answers);
        if (current_answers < this.max_answers){
            var new_answer = parseInt(this.state.nr_answers) + 1;
            this.setState({nr_answers : new_answer});
        }
    }


    remove_answers(){
        var current_answers = parseInt(this.state.nr_answers);
        if (current_answers > 2){
            var new_answer = parseInt(this.state.nr_answers) - 1;
            this.setState({nr_answers : new_answer});
        }
    }

    create_answer_forms(){

        var nr_answers = this.state.nr_answers;

        var forms = [];

        for (var i = 0; i < nr_answers; i++){
            forms.push(
                <Form.Input
                    key={`Form.input_${i}`}
                    type='text'
                    placeholder={"Answer #" + (i+1)}
                    name={"answer_" + i}
                    value={this.state.answer}
                    onChange={this.handleChangeAnswer}
                />
            );
        }

        return forms;
    }


    compare_ids(id1, id2, operation){
        switch(operation){
            case '==':
                if (id1 == id2){
                    return true;
                } else
                    return false;
            case '!=':
                if (id1 != id2){
                    return true;
                } else
                return false;
        }
    }

    poll_divider(operation){

        const { cookies } = this.props;
        var userId = cookies.get('user_id');
        var card_group;
        var index = 0;


        for (let table_row of this.state.polls){

            if (this.compare_ids(table_row.id_creator,userId,operation)){

                this.table_body.push(
                    <Card key={`card_${index}`}>
                        <Card.Content>
                        <Card.Header>{table_row.question}</Card.Header>
                        <Card.Meta>
                        Created by <Link to={"/user/" + table_row.id_creator}><span className='creator_name'>{table_row.creator_name}</span></Link>
                        </Card.Meta>
                        </Card.Content>
                        <Card.Content extra style={{textAlign: 'right'}}>
                            <Link to={"/poll/" + table_row.id}>Vote<Icon name='chevron right' /></Link>
                        </Card.Content>
                    </Card>
                );

            }
            index++;
        }

        card_group = this.table_body;
        this.table_body = [];

        return card_group;
    }

    define_panes(){

        const { open, dimmer } = this.state;
        const { visible } = this.state

        this.state.panes = [
            { menuItem: 'Multiple choice poll', render: () => 
            <Tab.Pane style={{border:'0px'}}>
                <Form>
                    <Header size='medium'>What do you want to ask?</Header>
                    <Form.Input
                        type='text'
                        placeholder="Question"
                        name="question"
                        value={this.state.question}
                        onChange={this.handleChange}
                    />
                    <Form.Group inline>
                        <Header size='medium' style={{marginTop:'10px'}}>Close in (Days):</Header>
                        <span>&nbsp;&nbsp;</span>
                        <Form.Input
                            type='text'
                            placeholder="7"
                            name="time_interval"
                            value={this.state.time_interval}
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Header size='medium'>Possible Answers
                        <Label as='a' onClick={this.add_answers}>
                            Add an answer
                            <Label.Detail>
                                <Icon name='plus'/>
                            </Label.Detail>
                        </Label>
                        <Label as='a' style={{width:'30px'}} onClick={this.remove_answers}>
                            <Icon name='minus'/>
                        </Label>
                    </Header>
                    {this.create_answer_forms()}

                    <Form.Button style={{marginBottom:'20px'}}  content="Submit" floated='right' onClick={this.handleSubmit}/>
                </Form>
                <div>
                        <Transition visible={visible} animation='scale' duration={500}>
                        <Message
                            warning
                            header='Missing content'
                            content={this.state.message_content}
                            style={{width:'80%',height:'65px'}}
                        />
                        </Transition>
                </div>
            </Tab.Pane> },
            { menuItem: 'Free text poll', render: () => 
            <Tab.Pane style={{border:'0px'}}>
                <Form>
                    <Header size='medium'>What do you want to ask?</Header>
                    <Form.Input
                        type='text'
                        placeholder="Question"
                        name="question"
                        value={this.state.question}
                        onChange={this.handleChange}
                    />
                    <Form.Group inline>
                        <Header size='medium' style={{marginTop:'10px'}}>Close in (Days):</Header>
                        <span>&nbsp;&nbsp;</span>
                        <Form.Input
                            type='text'
                            placeholder="7"
                            name="time_interval"
                            value={this.state.time_interval}
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Button style={{marginBottom:'20px'}}  content="Submit" floated='right' onClick={this.handleFreeTextSubmit}/>
                </Form>
            </Tab.Pane> },            
          ];

    }

    render() {
        if(!this.state.polls || !this.state.nr_answers){
            return (
                <Container className="main-container">
                    <div>
                        <Loader active inline='centered' />
                    </div>
                </Container>
            );
        }else{
            var polls = this.state.polls;
            const { cookies } = this.props;
            let userId = cookies.get('user_id');
            var user_created_header;

            var user_created_polls = polls.find(function(poll){
                if (poll['id_creator'] == userId)
                    return true;
            });

            if (user_created_polls != undefined)
            {
                user_created_header = <Header> User created polls</Header>;
            }

        }
        const { open, dimmer } = this.state;
        const { visible } = this.state

        return (
            <Container className="main-container">
                <div>

                    <Header as='h2'>
                    <span style={{marginRight:'50px'}}>Polls</span>
                    <Button style={{height:'35px'}} onClick={this.show(true)}>Add a poll</Button>
                    </Header>

                    <Modal style={{height:'400px'}} dimmer={dimmer} open={open} onClose={this.close} size='small' closeIcon>
                        <Modal.Header>Create a poll</Modal.Header>
                        <Modal.Content scrolling>
                            <Modal.Description>
                                {this.define_panes()}
                                <Tab menu={{ secondary: true, pointing: true }} panes={this.state.panes} />
                            </Modal.Description>
                        </Modal.Content>
                    </Modal>
                    {user_created_header}
                    <Card.Group divided="true">
                        {this.poll_divider('==')}
                    </Card.Group>
                    <Header>Public Polls</Header>
                    <Card.Group divided="true">
                        {this.poll_divider('!=')}
                    </Card.Group>
                </div>
            </Container>
        );
    }
}

export default withCookies(Polls);
