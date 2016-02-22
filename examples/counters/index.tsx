import * as React from 'react';
import { Component } from 'react';
import * as ReactDOM from 'react-dom';
import { View, createModel } from './CounterList'; 
import { defaultSettings } from '../../src/Model';

const appElement = document.getElementById('app');

defaultSettings.transformations.useJsStateForActions();

const model = createModel();
model.initialize();

const render = () => {
    console.log('rendering... ', model.state ? model.state.toJS() : {});
    ReactDOM.render(React.createElement(View, {model}), appElement)
};

model.subscribe(() => {
    render();
});

render();

