import {Value} from "@ng-app-framework/core";
import {LoadingList} from "../../src/app/Service/LoadingList";
import {LoadingConfig} from "../../src/app/Service/LoadingConfig";

describe('LoadingList', () => {
    let loadingList: LoadingList;
    let key = 'test';


    beforeEach(() => {
        loadingList                                   = new LoadingList(new LoadingConfig());
        // Optimizing speed so tests run quicker. Delays are for humans who can read at the speed of light.
        loadingList.longRunningCheckLimit             = 1;
        loadingList.longRunningIntervalInMilliseconds = 10;
        loadingList.clearDelayInMilliseconds          = 10;
    });

    describe('Status Changes', () => {

        let initializeKey = function () {
            expect(loadingList.get(key)).toEqual(0);
        };
        it(`should set values to ${LoadingList.STARTED} when starting processes`, () => {
            initializeKey();
            loadingList.start(key);
            expect(loadingList.get(key)).toEqual(LoadingList.STARTED);
        });
        it(`should set values to ${LoadingList.FINISHED} when finishing processes`, () => {
            initializeKey();
            loadingList.finish(key);
            expect(loadingList.get(key)).toEqual(LoadingList.FINISHED);
        });
        it(`should set values to ${LoadingList.ERRED} when erring processes`, () => {
            initializeKey();
            loadingList.error(key);
            expect(loadingList.get(key)).toEqual(LoadingList.ERRED);
        });
    });

    describe('Clearing on Completion', () => {
        let assertKeyIsClearedAfterFunctionCall = function (done, functionCall) {
            loadingList.onClear.first().subscribe((keyCleared) => {
                expect(keyCleared).toEqual(key);
                done();
            });
            functionCall(key);
        };
        it('should remove the process after it has finished', (done) => {
            assertKeyIsClearedAfterFunctionCall(done, (key) => loadingList.finish(key));
        });
        it('should remove the process after it has erred', (done) => {
            assertKeyIsClearedAfterFunctionCall(done, (key) => loadingList.error(key));
        });
        it('should not remove if the status is running or queued', () => {
            loadingList.start(key);
            expect(loadingList.shouldClear(key)).toBeFalsy();
            loadingList.error(key);
            expect(loadingList.shouldClear(key)).toBeTruthy();
            loadingList.finish(key);
            expect(loadingList.shouldClear(key)).toBeTruthy();
            loadingList.start(key);
            expect(loadingList.shouldClear(key)).toBeFalsy();
        });
    });

    describe('Aborting Processes', () => {
        it('should clear the values immediately', () => {
            loadingList.start(key);
            expect(Value.isProvided(loadingList.operations[key])).toBeTruthy();
            loadingList.abort([key]);
            expect(Value.isProvided(loadingList.operations[key])).toBeFalsy();
        });
    });
    describe('Should Display', () => {

        it('should return true when enabled and at least one process exists in the list', () => {
            expect(loadingList.shouldDisplay()).toBeFalsy();
            loadingList.start(key);
            expect(loadingList.shouldDisplay()).toBeTruthy();
            loadingList.config.enabled = false;
            expect(loadingList.shouldDisplay()).toBeFalsy();
        });
    });
    describe('Long Running Processes', () => {
        it('should be long running by waiting after a process has started', (done) => {
            loadingList.start(key);
            expect(Value.isProvided(loadingList.longRunning[key])).toBeFalsy();
            setTimeout(() => {
                expect(Value.isProvided(loadingList.longRunning[key])).toBeTruthy();
                done();
            }, loadingList.longRunningIntervalInMilliseconds);

        });
        it('should not be long running if the process is cleared before the process finishes before the check', (done) => {
            loadingList.start(key);
            expect(Value.isProvided(loadingList.longRunning[key])).toBeFalsy();
            delete loadingList.operations[key];
            setTimeout(() => {
                expect(Value.isProvided(loadingList.longRunning[key])).toBeFalsy();
                done();
            }, loadingList.longRunningIntervalInMilliseconds);
        });
        it('should clear long running processes as well as normal operations when clearing', (done) => {
            loadingList.start(key);
            setTimeout(() => {
                expect(Value.isProvided(loadingList.longRunning[key])).toBeTruthy();
                loadingList.onClear.first().subscribe((key) => {
                    expect(Value.isProvided(loadingList.longRunning[key])).toBeFalsy();
                    done();
                });
                loadingList.finish(key);
            }, loadingList.longRunningIntervalInMilliseconds);
        });
    })
});
