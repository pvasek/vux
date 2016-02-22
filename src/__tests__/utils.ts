import { describe, it } from 'mocha';
import { assert } from 'chai';
import { IModel } from '../types';
import { buildSignalsObject, buildInitialStateObject, buildStateProxyObject } from '../utils';

describe('Utils:', () => {
    describe('buildSignalsObject:', () => {        
        
        it('Should map signals to actions', () => {        
            const actions = {
                test1: (state, arg1 = '') => state + 'B' + arg1
            };
            let lastState = '';
            const result = buildSignalsObject(actions, key => 'A', (key, state) => lastState = state);
            assert.ok(result.test1);
            result.test1();
            assert.equal(lastState, 'AB')
            result.test1('C');
            assert.equal(lastState, 'ABC')
        });
        
    });
    
    describe('buildStateObject: ', () => {
        
        it('Should map initalState to state', () => {
            const initalState = {
                message: 'test'
            };            
            const result = buildInitialStateObject(initalState, null, state => state);
            assert.ok(result.message);
        });
        
        it('Should map models to state', () => {
            const model = {
                template: {
                    initialState: ({ message2: 'test' })
                },
                $state: {},                
                signals: {},
                models: {}
            };
            const models = {
                submodel: model
            }
            const result = buildInitialStateObject(null, models, state => state);
            assert.ok(result.submodel, 'submodel');
            assert.ok(result.submodel.message2, 'submodel.message2');
        });
        
    });
    
    describe('buildStateProxyObject', () => {

        it('Should proxy to initalState', () => {
            const initalState = {
                message: 'messageValue'
            };            
            const result = buildStateProxyObject(initalState, null, key => initalState[key]);
            assert.ok(result.message);
            assert.equal(result.message, 'messageValue');
        });
        
        it('Should proxy to models', () => {
            const model: IModel = {
                $state: { message2: 'message2Value' },                
                signals: {},
                models: {}
            };
            const models = {
                submodel: model
            }
            const result = buildStateProxyObject(null, models, null);
            assert.ok(result.submodel, 'submodel');
            assert.ok(result.submodel.message2, 'submodel.message2');
            assert.equal(result.submodel.message2, 'message2Value');
        });

    });
});
