import * as React from 'react';
import { Component } from 'react';
import * as Immutable from 'immutable';
import { Model } from '../../src/Model';
import { View as Counter, createModel as createCounterModel } from './Counter';

export const createModel = () => {
    
    const model = new Model({
        models: {
            left: createCounterModel(),
            right: createCounterModel()
        }
    });
    
    // use sub-model knowledge for calling their actions 
    (model as any).reset = () => {
        model.models.left.signals.reset();
        model.models.right.signals.reset();
    } 
    return model;
}

export class View extends Component<any,{}> {    

    render() {
        const boxStyle = {float:'left', minWidth: 180};
        const model = this.props.model;
        return (
            <div style={boxStyle}>
                <Counter model={model.models.left}/>
                <Counter model={model.models.right}/>
                <button onClick={model.reset}>reset</button>
            </div>
        );
    }    
}

export const effects = {
    html: View
}
