import * as React from 'react';
import { Component, PropTypes } from 'react';
import * as classnames from 'classnames';
import * as Immutable from 'immutable';
import { Model } from '../../../src/Model';


export const createModel = () => new Model({
    
    initialState: {
        skip: 0, 
        take: 20, 
        count: 100
    },
    
    actions: {
        changePageSize(state, pageSize: number) {
            return state.merge({ take: pageSize, skip: 0 });
        },
        goToFirstPage(state) {
            return state.merge({skip: 0 });    
        },
        goToLastPage(state) {
            const stateJs = state.toJS();
            const lastPage = Math.ceil(stateJs.count / stateJs.take);
            const newSkip = lastPage > 0 ? (lastPage-1)*stateJs.take : 0;
            return state.merge({ skip: newSkip });                
        },
        goToNextPage(state) {
            const stateJs = state.toJS();
            const newSkip = stateJs.skip + stateJs.take;
            if (newSkip > state.count) {
                return state;
            }
            return state.merge({ skip: newSkip });                
        },
        goToPreviousPage(state) {
            const stateJs = state.toJS();
            const newSkip = stateJs.skip - stateJs.take;
            if (newSkip < 0) {
                return state;
            }
            return state.merge({ skip: newSkip });                
        }
    }
});

export class View extends Component<any, {}> {

    render() {
        const {
            model,
            pageSizes = [20, 50, 100, 200]
        } = this.props;
        const { skip, take, count } = model.$state;
        
        const from = skip + 1;
        let to = skip + take;
        if (to > count) {
            to = count;
        }
        
        return (
            <div className="pager-component">
                <ul className="pager-component-pagination pagination">
                    <li><a href="#" onClick={model.signals.goToFirstPage}>&lt; &lt; </a></li>
                    <li><a href="#" onClick={model.signals.goToPreviousPage}>&lt; </a></li>
                    <li><span className="pagination-info">{from}-{to}/{count}</span></li>
                    <li><a href="#" onClick={model.signals.goToNextPage}>&gt; </a></li>
                    <li><a href="#" onClick={model.signals.goToLastPage}>&gt; &gt; </a></li>
                </ul>
                <select onChange={(e: any) => model.signals.changePageSize(parseInt(e.target.value, 10)) } value={model.$state.take }>
                    {pageSizes.map(i => (
                        <option key={i} value={i.toString() }>{i}</option>
                    )) }
                </select>
            </div>
        )
    }
};