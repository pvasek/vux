# Vux Experiment

Is it possible to have a simple API for our react applications similar to Vue.js with 
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

__Is this a stupid idea? Does it make sence to work on it? [Please let me know](https://github.com/pvasek/vux/issues/1)__
## It is just about a model object

Everything is built around a model object. The model is defined by model template where 
the initial state, actions, models can be defined.

[Run this example in JS Bin](https://jsbin.com/dezoras/1/edit?js,console)

```typescript
const createCounterModel = () => new Model({
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

Model Template includes: 
- initialState: initial state as plain js object
- actions: reducers
- models: linked sub-models

Model includes:
- state: immutable.js structure
- $state: proxy which makes accessible state as js object 
- signals: action triggers
- models: linked sub-models
 
The mapping from template to model could be described as:
- initialState + models => state
- actions => signals
- models => models

You can subscribe to model for receiving changes and call the actions through the signals.
Before the model object can be used it needs to be initialized. That creates initial 
state which is built from template initial state and sub-models.

Because internally the state is hold in immutable structure if we want to have states as js 
objects in our actions we need to call _useJsStateForActions_ method.

```typescript
defaultSettings.transformations.useJsStateForActions();

const model = createCounterModel();
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

## Model tree

The models can be composed to the model tree. Then you need to subscribe only
to the root model.

Let's create counter pair where we will reuse our counter models.

[Run this example in JS Bin](https://jsbin.com/kiqexok/edit?js,console)
```typescript
const createCounterPairModel = () => {
    const model = new Model({
        models: {
            left: createCounterModel(),
            right: createCounterModel()
        }
    });
    model.reset = () => {
        model.models.left.signals.reset();
        model.models.right.signals.reset();
    };
    return model;
};
```

You can attach custom methods to your model which calls submodels signals. This could be
probably handled differently for example by defining custom signals in the template.

This can be used in the similar fashion as the simple model.

```typescript
const model = createCounterPairModel();
model.subscribe(() => {
    console.log(model.state.toJS());
});
model.initialize();

model.models.left.signals.increment();
model.models.left.signals.increment();
model.models.right.signals.increment();
model.signals.reset();

console.log(model.$state.left.value);
console.log(model.$state.right.value);
```

## Using it with React

If you want to use it with react you just need to pass it through props 
to your react component.

[Run this example in JS Bin](https://jsbin.com/zobatu/edit?js,output)
```typescript
class Counter extends React.Component {
    render() {  
        const model = this.props.model;
        return (
            <div>
                <span>{model.$state.value}</span>
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
const model = createCounterModel();
model.subscribe(() => {
    ReactDOM.render(React.createElement(Counter, {model}), appElement)
});
model.initialize();
```

The composition in this case is easy because you pass the root model to your root 
component and root component can passit down to its children.

[Run this example in JS Bin](https://jsbin.com/rokiwu/edit?js,output)
```typescript
class CounterPair extends React.Component {
    render() {  
        return (
            <div>
                <Counter model={model.models.left}/>
                <Counter model={model.models.right}/>
                <button onClick={model.reset}>Reset</button>
            </div>
        );        
    }
};
```

The initialization then need to be updated as well:

```typescript
const appElement = document.getElementById('app');
const model = createCounterPairModel();
model.subscribe(() => {
    ReactDOM.render(React.createElement(CounterPair, {model}), appElement)
});
model.initialize();
```

## Dynamic sub-models

Right now the model has _updateModels(models)_ method. This updates models, 
state and state proxy object. But because the API doens't suppor arrays in models
definition it need to be hacked little bit more that it should be.

## Problems
- Because the model is passed down to react components and model instance doesn't 
change over time if we want to implement _shouldComponentUpdate()_ we need to pass
the model.state as well.
- If you have custom method attached to the model which calls submodel actions. 
This generates multiple state updates.

## Theoretical directions

__Redux way:__ Right now the signals are just proxied to the methods. It could 
be possible to dispatch them up to the tree to the redux store and create reducer 
which would pass them down again. That could enable integration with redux.

__Cycle.js way__: Could we chagne signals to stream and then use cycle.js drivers?
