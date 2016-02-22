import * as React from 'react';
import { Component } from 'react';
import * as Immutable from 'immutable';
import { Model } from '../../src/Model';

const modelTemplate = {
    initialState: {
        value: 0
    },
    actions: {
        increment: (state) => ({ value: state.value + 1 }), 
        decrement: (state) => ({ value: state.value - 1 }), 
        set: (state, value) => ({ value: value }),
        reset: (state) => ({ value: 0 })
    }
}

export const createModel = () => new Model(modelTemplate);

export class View extends Component<any,{}> {

    render() {  
        const counterStyle = {display: 'inline-block', padding: '2 20'};
        const model = this.props.model;
        return (
            <div style={counterStyle}>
                <input ref="input" type="text" onChange={model.signals.set} value={model.$state.value}/>
                {/*<span>{props.model.value}</span>*/}                
                <button onClick={model.signals.increment}>+</button>
                <button onClick={model.signals.decrement}>-</button>
                <button onClick={model.signals.reset}>reset</button>
            </div>
        );        
    }
};

export const effects = {
    html: View
}
