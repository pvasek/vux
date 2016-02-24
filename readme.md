# Vux Experiment

Is it possible to have simple API for our react applications similar to Vue.js with 
the following characteristics?

- Component composability
- Simplicity from user perspective
- Single application state
- Unidirectional flow
- Functional-like actions (similar to Redux)
- Type friendly  

## Questions

- Have you seen similar API for react somewhere else?
- What's wrong/bad on this approach (the implementation could be definitely better)?
- Is it possible to integrated it with other frameworks? Which one could be a good fit?

## It is just about a model object

Everything is built around a model object. The model is defined by model template where 
the initial state, actions, models can be defined.

```typescript
export const createModel = () => new Model({
    initialState: {
        value: 0
    },
    actions: {
        increment: (state) => ({ value: state.value + 1 }), 
        decrement: (state) => ({ value: state.value - 1 }),
        set: (state, value) => ({ value }), 
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

You can subscribe to model for receiving changes and call the actions through the signals.
Before the model object can be used it needs to be initialized. That creates initial 
state which is built from template initial state and sub-models.

```typescript
const model = createModel();
model.subscribe(() => {
    console.log(model.state.toJS());
});
model.initialize();

model.signals.increment();
model.signals.increment();
model.signals.decrement();
model.signals.reset();
model.signals.set(10);

console.log(model.$state.value);
```

If you want to use it with react you just need to pass it through props to your react component.

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

The initialization in that case can be done as following:
```typescript
const appElement = document.getElementById('app');
const model = createModel();
model.subscribe(() => {
    ReactDOM.render(React.createElement(View, {model}), appElement)
});
model.initialize();
```

## Theoretical directions

__Redux way:__ Right now the signals are just proxied to the methods. It could 
be possible to dispatch them up to the tree to the redux store and create reducer 
which would pass them down again. That could enable integration with redux.

__Cycle.js way__: Could we use cycle.js drivers and connect them to the signals?