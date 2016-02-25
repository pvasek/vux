import * as React from 'react';
import { Component } from 'react';
import * as Immutable from 'immutable';
import { Subject, Observable } from '@reactivex/rxjs';
import { Model } from '../../src/Model';

export const createModel = () => {
    const model = new Model({
        initialState: {
            value: 0
        },
        actions: {
            newGif: (state) => {
                return state;
            }
        },
    });
    
    
    const click$ = new Subject();    
    (model as any).clickHandler = () => click$.next(null);
    
    function cycle(sources) {
       sources.click$.subscribe(() => {
            console.log('click');    
       });       
       return {
           http$: Observable.interval(1000)
       }
    };
    
    const sinks = cycle({click$});
    sinks.http$.subscribe(i => console.log('http sink: ', i));
    return model;
};





export class View extends Component<any,{}> {
    render() {  
        const counterStyle = {display: 'inline-block', padding: '2 20'};
        const model = this.props.model;
        return (
            <div style={counterStyle}>
                <input ref="input" type="text" onChange={(e: any) => model.signals.set(e.target.value)} value={model.$state.value}/>
                <button onClick={model.clickHandler}>Click</button>                
            </div>
        );        
    }
};