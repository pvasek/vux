import { Subject, Observable } from '@reactivex/rxjs';

export const run = (cycle: (any) => any, drivers: any, inputs: any = {}) => {

    const sources = Object
        .keys(drivers)
        .reduce((acc: any, name) => {
            const source = new Subject();
            acc[name] = source;
            return acc;
        }, {})
        
    const sinks = cycle(Object.assign(inputs, sources)) || {};
    Object.keys(sinks)
        .map(i => ({ driver: drivers[i], in$: sinks[i], out$: sources[i]}))
        .forEach(({ driver, in$, out$ }) => {
            driver(in$, out$);                
        });
};

export const httpDriver = (input$: Observable<any>, output$: Subject<any>) => {        
    input$.subscribe((url: string) => {
        console.log('fetching url: ', url)
        fetch(url).then(i => {
            output$.next(i);
        });
    });        
};
