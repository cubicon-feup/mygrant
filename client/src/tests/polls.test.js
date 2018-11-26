import 'jsdom-global/register';
import React from 'react';
import Polls from '../components/Polls.js';
import Poll from '../components/Poll.js';
import Enzyme, { shallow , mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Button, Loader, Card, Header, Checkbox, Progress, Item} from 'semantic-ui-react';
import { Pie } from 'react-chartjs-2';


import { mountWrap, shallowWrap } from '../tests/contextWrapper';

global.fetch = require('node-fetch');

Enzyme.configure({ adapter: new Adapter() });

jest.mock('react-chartjs-2', () => ({
    Pie : () => null,
}))

describe('<Polls />', () => {

    const wrappedMount = () => mountWrap(<Polls />);


    // <Polls tests> 
    it('initial state has loader', () => {
        const wrapper = wrappedMount();
        expect(wrapper.find(Loader).length).toBe(1);
    });

    it('1 poll loads when there is 1 result', () => {
        
        var result = [
            {
            "id": 1007,
            "question": "Ready?",
            "free_text": false,
            "options": "Yes|||No|||Maybe",
            "id_creator": 1001,
            "creator_name": "teste"
            }
        ];

        const wrapper = mountWrap(<Polls polls={result} />);

        expect(wrapper.find(Card).length).toBe(1);



    });

    var result = [
        {
        "id": 1008,
        "question": "Hello?",
        "free_text": false,
        "options": "Answer1|||Answer2|||Answer3",
        "id_creator": 1002,
        "creator_name": "teste2"
        },
        {
        "id": 1007,
        "question": "Ready?",
        "free_text": false,
        "options": "Yes|||No|||Maybe",
        "id_creator": 1001,
        "creator_name": "teste"
        }
    ];

    const wrapper = mountWrap(<Polls polls={result} />);

    it('2 polls load when there are 2 results', () => {
                
        expect(wrapper.find(Card).length).toBe(2);
     
    });

    it('confirm the 2 polls titles', () => {

        const poll_titles = ['Hello?','Ready?'];

        wrapper.find(Card).forEach((node,index) => {

            expect(node.find('.header').text()).toBe(poll_titles[index]);

        });
     
    });

    it('confirm the 2 polls creator names', () => {

        const poll_creators = ['teste2','teste'];

        wrapper.find(Card).forEach((node,index) => {

            expect(node.find('.creator_name').text()).toBe(poll_creators[index]);

        });
     
    });


    it('add poll modal works', () => {
        
        expect(wrapper.find(Button).hasClass('OnClick')).toBeFalsy;
        wrapper.find(Button).simulate('click');
        expect(wrapper.find(Button).hasClass('OnClick')).toBeTruthy;

    });

    // </Polls tests>
});


