import {Component, NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {NgProgressModule} from "./NgProgressModule";
import {Observable} from "rxjs/Rx";
import {LoadingList} from "./Service/LoadingList";
import {EventEmitter} from "@angular/core";

@Component({
    selector: 'app',
    template: `
        <div>It works!
            <div class="loading-list"></div>
        </div>
    `
})
export class AppComponent {

    isTesting = false;
    startTest = new EventEmitter<any>();
    stopTest  = new EventEmitter<any>();

    constructor(public loadingList: LoadingList) {
        document.onkeypress = (event) => {
            // On Enter, we will toggle the test
            if (event.which === 13) {
                this.isTesting = !this.isTesting;
                if (this.isTesting) {
                    this.startTest.emit();
                    return;
                }
                this.stopTest.emit();
            }
        };
        this.stopTest.subscribe(() => {
            loadingList.finish('Test Progress');
            loadingList.finish('Test Progress 2');
            loadingList.finish('Test Progress 3');
        });
        this.startTest.subscribe(() => {
            Observable.interval(1000).do((num) => {

                if (num % 3 === 0) {
                    loadingList.start('Test Progress');
                    return;
                }
                if (num % 3 === 1) {
                    loadingList.finish('Test Progress');
                    return;
                }
            }).merge(Observable.interval(2000).do((num) => {
                if (num % 3 === 0) {
                    loadingList.start('Test Progress 2');
                    return;
                }
                if (num % 3 === 1) {
                    loadingList.error('Test Progress 2');
                    return;
                }
            })).merge(Observable.interval(4000).do((num) => {

                if (num % 3 === 0) {
                    loadingList.start('Test Progress 3');
                    return;
                }
                if (num % 3 === 2) {
                    loadingList.finish('Test Progress 3');
                    return;
                }
            }))
                .takeUntil(this.stopTest)
                .subscribe();
        });

    }
}

@NgModule({
    declarations: [AppComponent],
    imports     : [
        BrowserModule,
        CommonModule,
        NgProgressModule
    ],
    exports     : [AppComponent],
    providers   : [],
    bootstrap   : [AppComponent]

})
export class AppModule {

}
