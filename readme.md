# Vux Experiment

Is it possible to have simple API for our react application similar to Vue.js with following 
characteristics?

- Component composability
- Simplicity from user perspective
- Single application state
- Unidirectional flow
- Functional-like actions (similar to Redux)
- Type friendly  

## Questions

- Have you seen similar API for react somewere else?
- What's wrong/bad on this approach (the implementation could be definitelly improved)?
- Is it possible to integrated it with another frameworks? Which one would be a good fit?

## It is just about a model object

Everything is build around a model object. The model is defined by model template with 
the initial state, actions, models.

```typescript
export const createModel = () => new Model({
    initialState: {
        value: 0
    },
    actions: {
        increment: (state) => ({ value: state.value + 1 }), 
        decrement: (state) => ({ value: state.value - 1 }), 
        reset: (state) => ({ value: 0 })
    }
});
```

The mapping from template to model could be described as:
- initialState + models => state
- actions => signals
- models => models

In addition there is also $state proxy which make accessible state as JS object 
(state is held in immutable.js for now).

This model is passed through props to our react component.

```typescript
export class View extends Component<any,{}> {
    render() {  
        const counterStyle = {display: 'inline-block', padding: '2 20'};
        const model = this.props.model;
        return (
            <div style={counterStyle}>
                <span>{model.$state.value}<span/>
                <button onClick={model.signals.increment}>+</button>
                <button onClick={model.signals.decrement}>-</button>
                <button onClick={model.signals.reset}>reset</button>
            </div>
        );        
    }
};
```

The initialization can be done as following:
```typescript
const appElement = document.getElementById('app');
const model = createModel();
model.subscribe(() => {
    ReactDOM.render(React.createElement(View, {model}), appElement)
});
model.initialize();
```
Because during initialization phase the initial state is gathered from models 
and set as the root state we can be sure that the render is called also for 
the first time. 

## Theoretical directions

__Redux way:__ Right now the signals are just proxied to the methods. It could 
be posible to dispatch them up to the tree to the redux store and create reducer 
which would pass them down again. That could enable integration with redux.

__Cycle.js way__: Could we use cycle.js drivers and connect them to the signals?