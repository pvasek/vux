import * as React from 'react';
import { Component } from 'react';
import * as ReactDOM from 'react-dom';
import { View, createModel } from './Counter'; 

const appElement = document.getElementById('app');

const model = createModel();

const render = () => {
    console.log('rendering... ', model.$state.toJS());
    ReactDOM.render(React.createElement(View, {model}), appElement)
};

// model.$onChange = () => {
//     render();
// }

render();

