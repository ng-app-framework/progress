import {Progress} from "../../src/app/Service/Progress";

describe('Progress', () => {

    let progress: Progress;
    let key = 'test';

    beforeEach(() => {
        progress = new Progress();
    });

    it('should increase a counter of your choosing when increment is called', () => {
        expect(progress.get(key)).toEqual(0);
        progress.increment(key);
        expect(progress.get(key)).toEqual(1);
    });
    it('should decrease a counter of your choosing when decrement is called', () => {
        progress.increment(key);
        expect(progress.get(key)).toEqual(1);
        progress.increment(key);
        expect(progress.get(key)).toEqual(2);
        progress.decrement(key);
        expect(progress.get(key)).toEqual(1);
        progress.decrement(key);
        expect(progress.get(key)).toEqual(0);
        progress.decrement(key);
        expect(progress.get(key)).toEqual(0);
    });

    it('should set a counter of your choosing to 1 when start is called', () => {
        progress.start(key);
        expect(progress.get(key)).toEqual(1);
        progress.increment(key);
        progress.start(key);
        expect(progress.get(key)).toEqual(1);
    });

    it('should set a counter of your choosing to 0 when stop is called', () => {
        progress.start(key);
        expect(progress.get(key)).toEqual(1);
        progress.stop(key);
        expect(progress.get(key)).toEqual(0);
        progress.increment(key);
        progress.increment(key);
        expect(progress.get(key)).toEqual(2);
        progress.stop(key);
        expect(progress.get(key)).toEqual(0);
    });

    it('should set a counter of your choosing to 1 when start is called', () => {
        progress.start(key);
        expect(progress.get(key)).toEqual(1);
        progress.increment(key);
        progress.start(key);
        expect(progress.get(key)).toEqual(1);
    });

    it('should set a counter of your choosing to 0 when stop is called', () => {
        progress.start(key);
        expect(progress.get(key)).toEqual(1);
        progress.stop(key);
        expect(progress.get(key)).toEqual(0);
        progress.increment(key);
        progress.increment(key);
        expect(progress.get(key)).toEqual(2);
        progress.stop(key);
        expect(progress.get(key)).toEqual(0);
    });
    it('should return whether anything is loading when calling isInProgress', () => {
        expect(progress.isInProgress()).toBeFalsy('just started');
        progress.start(key);
        expect(progress.isInProgress()).toBeTruthy();
        progress.stop(key);
        expect(progress.isInProgress()).toBeFalsy();
        progress.start(key);
        progress.start('Other Test');
        expect(progress.isInProgress()).toBeTruthy();
        progress.stop(key);
        expect(progress.isInProgress()).toBeTruthy();
        progress.stop('Other Test');
        expect(progress.isInProgress()).toBeFalsy();
    });
});
