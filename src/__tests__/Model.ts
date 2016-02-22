import { describe, it } from 'mocha';
import { assert } from 'chai';
import { IModelTemplate } from '../types';
import { Model } from '../Model';

describe('Model:', () => {
   
    describe('Simple model:', () => {
        
        it('Should initialize state correctly', () => {
            const modelTemplate: IModelTemplate = {
                initialState: {
                    value: 0
                }
            }
            
            const target = new Model(modelTemplate);
            target.initialize();
            
            assert.ok(target.state, 'state');
            assert.equal(target.state.get('value'), 0, 'state.get("value")');
            assert.equal(target.$state.value, 0, '$state.value');    
        }); 
        
        it('Should update state correctly', () => {
            const modelTemplate: IModelTemplate = {
                initialState: {
                    value: 0
                }
            }
            const target = new Model(modelTemplate);
            target.initialize();
            
            target.setStateItem('value', 5);
            assert.equal(target.state.get('value'), 5, 'state.get("value")');
            assert.equal(target.$state.value, 5, '$state.value');    
        });         

        it('Should update state correctly via signals', () => {
            const modelTemplate: IModelTemplate = {
                initialState: {
                    value: 0
                },
                actions: {
                    updateValue(state: any, value: number) {
                        return state.set('value', value);
                    }
                }
            }
            const target = new Model(modelTemplate);
            target.initialize();
            
            assert.ok(target.signals.updateValue);
            target.signals.updateValue(5);
            assert.equal(target.state.get('value'), 5, 'state.get("value")');
            assert.equal(target.$state.value, 5, '$state.value');    
        });         
               
    });
    
    describe('Nested model:', () => {
        
        it('Should initialize state correctly', () => {
            const leftModel = new Model({
                initialState: {
                    value: 0
                }
            });
            
            const modelTemplate = {
                models: {
                    left: leftModel
                }    
            };
            
            const target = new Model(modelTemplate);
            target.initialize();
            
            assert.ok(target.state, 'state');
            
            assert.equal(target.state.get('left').get('value'), 0, 'state.get("left").get("value")');
            assert.equal(target.$state.left.value, 0, '$state.left.value');    
        }); 
        
        it('Should update state correctly', () => {
            const leftModel = new Model({
                initialState: {
                    value: 0
                }
            });
            
            const modelTemplate = {
                models: {
                    left: leftModel
                }    
            };
            const target = new Model(modelTemplate);
            target.initialize();
            
            leftModel.setStateItem('value', 5);
            assert.equal(target.state.get('left').get('value'), 5, 'state.get("left").get("value")');
            assert.equal(target.$state.left.value, 5, '$state.left.value');    
        });         
        
        
        it('Should update state correctly via signals', () => {
           const leftModel = new Model({
                initialState: {
                    value: 0
                },
                actions: {
                    updateValue(state: any, value: number) {
                        return state.set('value', value);
                    }
                }
            });
            
            const modelTemplate = {
                models: {
                    left: leftModel
                }    
            };
            const target = new Model(modelTemplate);
            target.initialize();
            
            assert.ok(target.models.left, 'models.left');
            assert.ok(target.models.left.signals.updateValue, 'models.left.signals.updateValue');
            target.models.left.signals.updateValue(5);
            assert.equal(target.state.get('left').get('value'), 5, 'state.get("left").get("value")');
            assert.equal(target.$state.left.value, 5, '$state.left.value');    
        });    
               
        describe('Dynamic models: ', () => {
           
            it('Should initialize state correctly', () => {
                const leftModel = new Model({
                    initialState: {
                        value: 5
                    }
                });
                const rightModel = new Model({
                    initialState: {
                        value: -5
                    }
                });
                
                const modelTemplate = {
                    models: {
                        left: leftModel
                    }    
                };
                
                const target = new Model(modelTemplate);
                target.initialize();
                
                target.updateModels({
                    left: leftModel,
                    right: rightModel
                });
                
                assert.ok(target.state, 'state');
                
                assert.equal(target.state.get('left').get('value'), 5, 'state.get("left").get("value")');
                assert.equal(target.$state.left.value, 5, '$state.left.value');                    

                assert.equal(target.state.get('right').get('value'), -5, 'state.get("right").get("value")');
                assert.equal(target.$state.right.value, -5, '$state.right.value');                    
            }) 
        
            it('Should update state correctly', () => {
                const leftModel = new Model({
                        initialState: {
                            value: 5
                        }
                    });
                    const rightModel = new Model({
                        initialState: {
                            value: -5
                        }
                    });
                    
                    const modelTemplate = {
                        models: {
                            left: leftModel
                        }    
                    };
                    
                    const target = new Model(modelTemplate);
                    target.initialize();
                
                    target.updateModels({
                        left: leftModel,
                        right: rightModel
                    });

                    leftModel.setStateItem('value', 6);
                    assert.equal(target.state.get('left').get('value'), 6, 'state.get("left").get("value")');
                    assert.equal(target.$state.left.value, 6, '$state.left.value');    

                    rightModel.setStateItem('value', -6);
                    assert.equal(target.state.get('right').get('value'), -6, 'state.get("right").get("value")');
                    assert.equal(target.$state.right.value, -6, '$state.right.value');    
            });  
        });
    });
    
});