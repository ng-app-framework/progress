import {LoadingConfig} from "./LoadingConfig";
import {EventEmitter, Injectable} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {Progress} from "./Progress";
import {Value} from "@ng-app-framework/core";

@Injectable()
export class LoadingList extends Progress {

    static QUEUED                            = 0;
    static STARTED                           = 1;
    static FINISHED                          = 2;
    static ERRED                             = 3;
           longRunning: any                  = {};
           longRunningIntervalInMilliseconds = 1000;
           longRunningCheckLimit             = 5;
           clearDelayInMilliseconds          = 500;

    onError = new EventEmitter<string>();
    onClear = new EventEmitter<string>();

    constructor(public config: LoadingConfig) {
        super();
    }

    start(key: string) {
        this.operations[key] = LoadingList.STARTED;
        this.onStart.emit(key);
        this.timeExecute(key);

    }

    finish(key: string) {
        this.operations[key] = LoadingList.FINISHED;
        this.onFinish.emit(key);
        this.clear([key]);
    }

    error(key: string) {
        this.operations[key] = LoadingList.ERRED;
        this.onError.emit(key);
        this.clear([key]);
    }

    clear(keys: string[]) {
        for (let key of keys) {
            delete this.longRunning[key];
            setTimeout(() => {
                if (this.shouldClear(key)) {
                    this.onClear.emit(key);
                    delete this.operations[key];
                }
            }, this.clearDelayInMilliseconds);
        }
    }

    abort(keys: string[]) {
        for (let key of keys) {
            delete this.longRunning[key];
            delete this.operations[key];
        }
    }

    shouldClear(key) {
        return Value.isNotNull(this.operations[key]) && this.operations[key] > 1;
    }

    shouldDisplay() {
        return this.config.enabled && Value.hasProperties(this.operations);
    }


    timeExecute(key: string) {
        Observable.interval(this.longRunningIntervalInMilliseconds)
            .timeInterval()
            .take(this.longRunningCheckLimit)
            .subscribe({
                complete: () => {
                    if (this.isOperationLoading(key)) {
                        this.longRunning[key] = LoadingList.STARTED;
                    }
                }
            });

    }

    private isOperationLoading(key: string) {
        return this.operations[key] === LoadingList.STARTED;
    }
}
