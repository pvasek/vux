import * as React from 'react';
import { Component } from 'react';
import * as ReactDOM from 'react-dom';
import { View, createModel } from './GifFetcher'; 
import { defaultSettings } from '../../src/Model';

const appElement = document.getElementById('app');

defaultSettings.transformations.useJsStateForActions();

const model = createModel();

model.subscribe(() => {
    console.log('rendering... ', model.state ? model.state.toJS() : {});
    ReactDOM.render(React.createElement(View, {model}), appElement)    
});

model.initialize();

