import * as React from 'react';
import { Component } from 'react';
import * as Immutable from 'immutable';
import { Subject, Observable } from '@reactivex/rxjs';
import { IModel } from '../../src/types';
import { Model } from '../../src/Model';
import { run, httpDriver } from '../../src/micro-cycle';

export const createModel = () => new Model({
    initialState: {
        value: '',
        url: ''
    },
    
    actions: {
        setSearchText: (state, value) => ({ value, url: state.url }),
        setUrl: (state, url) => ({ value: state.value, url })
    },
    
    targets: {
        searchInput$: e => e.target.value,
        click$: e => e
    },
    
    cycle({http$, searchInput$, click$}, model: IModel) {
        
        const foundImages$ = http$
            .flatMap((i: Response) => Observable.fromPromise(i.json()))
            .map((i: any) => i.data.length > 0 ? i.data[0].images.fixed_height_small.url : '')
            .subscribe(model.signals.setUrl);
        
        click$.subscribe(() => {
            console.log('click');
        });
        
        return {
            http$: searchInput$
                .do(model.signals.setSearchText)
                .debounceTime(400)
                .map(i => 'http://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=' + encodeURIComponent(i as string))
        };
    }
});

export class View extends Component<any, {}> {
    render() {
        const model = this.props.model;
        return (
            <div>
                <div>
                    <input ref="input" type="text" onChange={model.$targets.searchInput$} value={model.$state.value}/>
                    <button onClick={model.$targets.click$}>Click</button>
                </div>
                <div>
                    <img src={model.$state.url}/>
                </div>
            </div>
        );
    }
};