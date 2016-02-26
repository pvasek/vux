import { describe, it } from 'mocha';
import { assert } from 'chai';
import { Subject, Observable } from '@reactivex/rxjs';
import { run } from '../micro-cycle';

describe('micro cycle', () => {

    it('should run', () => {
        let called = false;
        const cycle = (sources) => {
            sources.driver.subscribe(i => {
                assert.equal(i, 5);
                called = true;
            });
            return {
                driver: Observable.never()
            };
        };  
        
        const driver = (in$, out$) => {
            out$.next(5);  
        };
        
        run(cycle, { driver });
        
        assert.ok(called);
    });
 
});