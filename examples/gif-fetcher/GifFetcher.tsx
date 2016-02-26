import * as React from 'react';
import { Component } from 'react';
import * as Immutable from 'immutable';
import { Subject, Observable } from '@reactivex/rxjs';
import { Model } from '../../src/Model';
import { run, httpDriver } from '../../src/micro-cycle';

export const createModel = () => {
    const model = new Model({
        initialState: {
            value: '',
            url: ''
        },
        actions: {
            setSearchText: (state, value) => ({ value, url: state.url }),
            newGif: (state, gif) => ({ value: state.value, url: gif })
        }
        // ,
        // targets: {
        //     searchInput$: e => e.target.value
        //     click$: e => e
        // }
    });

    // targets/handlers:
    const click$ = new Subject();
    (model as any).clickHandler = () => click$.next(null);
    const searchInput$ = new Subject();
    (model as any).searchInputHandler = e => searchInput$.next(e.target.value);

    function cycle({http$, searchInput$, click$}) {
        
        const foundImages$ = http$
            .flatMap((i: Response) => Observable.fromPromise(i.json()))
            .filter((i: any) => i.data.length > 0)
            .map((i: any) => (i.data[0].images.fixed_height_small.url))
            .subscribe(i => model.signals.newGif(i));
        
        click$.subscribe(() => {
            console.log('click');
        });
        
        return {
            http$: searchInput$
                .do(i => model.signals.setSearchText(i))
                .debounceTime(400)
                .map(i => 'http://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=' + encodeURIComponent(i as string))
        };
    };

    run(cycle, {http$: httpDriver}, {click$, searchInput$ });
    
    return model;
};

export class View extends Component<any, {}> {
    render() {
        const counterStyle = { display: 'inline-block', padding: '2 20' };
        const model = this.props.model;
        return (
            <div style={counterStyle}>
                <div>
                    <input ref="input" type="text" onChange={model.searchInputHandler} value={model.$state.value}/>
                    <button onClick={model.clickHandler}>Click</button>
                </div>
                <div>
                    <img src={model.$state.url}/>
                </div>
                </div>
        );
    }
};