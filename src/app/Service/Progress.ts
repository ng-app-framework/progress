import {EventEmitter} from "@angular/core";

export class Progress {

    public operations = {};

    onStart  = new EventEmitter<string>();
    onFinish = new EventEmitter<string>();

    public start(key) {
        this.initializeOperationKey(key);
        this.operations[key] = 1;
        this.onStart.emit(key);

    }

    public stop(key) {
        this.initializeOperationKey(key);
        this.operations[key] = 0;
        this.onFinish.emit(key);
    }

    public increment(key) {
        this.initializeOperationKey(key);
        this.operations[key]++;
    }

    public decrement(key) {
        this.initializeOperationKey(key);
        if (this.operations[key] > 0) {
            this.operations[key]--;
        }
    }

    public get(key: string) {
        this.initializeOperationKey(key);
        return this.operations[key];
    }

    protected initializeOperationKey(key) {
        if (this.operations[key] === undefined) {
            this.operations[key] = 0;
        }
    }

    isInProgress() {
        for (let key in this.operations) {
            if (this.operations[key] > 0) {
                return true;
            }
        }
        return false;
    }
}
