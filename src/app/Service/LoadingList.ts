import {LoadingConfig}            from "./LoadingConfig";
import {EventEmitter, Injectable} from "@angular/core";
import {Observable}               from "rxjs/Rx";
import {Progress}                 from "./Progress";
import {Value}                    from "@ng-app-framework/core";

@Injectable()
export class LoadingList extends Progress {

    static QUEUED                            = 0;
    static STARTED                           = 1;
    static FINISHED                          = 2;
    static ERRED                             = 3;
           clearDelayInMilliseconds          = 500;

    onError = new EventEmitter<string>();
    onClear = new EventEmitter<string>();
    start$  = new EventEmitter<string>();
    finish$ = new EventEmitter<string>();
    error$  = new EventEmitter<string>();

    constructor(public config: LoadingConfig) {
        super();
        this.start$.subscribe((value) => this.start(value));
        this.finish$.subscribe((value) => this.finish(value));
        this.error$.subscribe((value) => this.error(value));
    }

    start(key: string) {
        this.operations[key] = LoadingList.STARTED;
        this.onStart.emit(key);

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
            delete this.operations[key];
        }
    }

    shouldClear(key) {
        return Value.isNotNull(this.operations[key]) && this.operations[key] > 1;
    }

    shouldDisplay() {
        return this.config.enabled && Value.hasProperties(this.operations);
    }
}
