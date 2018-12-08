//https://github.com/airbnb/enzyme/issues/1112

import { BrowserRouter } from 'react-router-dom';
import { shape } from 'prop-types';
import { Cookies } from 'react-cookie';
import Enzyme, { shallow , mount } from 'enzyme';

const cookies = new Cookies({});
cookies.HAS_DOCUMENT_COOKIE = false;

// Instantiate router context
const router = {
  history: new BrowserRouter().history,
  route: {
    location: {},
    match: {},
  },
};

const createContext = () => ({
  context: { cookies, router },
  childContextTypes: { router: shape({}) },
});

export function mountWrap(node) {
  return mount(node, createContext());
}