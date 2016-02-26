import { Subject, Observable } from '@reactivex/rxjs';
import { CycleFunction, IModel } from './types';

export const run = (cycle: CycleFunction, drivers: any, inputs: any = {}, model?: IModel) => {

    const sources = Object
        .keys(drivers)
        .reduce((acc: any, name) => {
            const source = new Subject();
            acc[name] = source;
            return acc;
        }, {})
        
    const sinks = cycle(Object.assign(inputs, sources), model) || {};
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
