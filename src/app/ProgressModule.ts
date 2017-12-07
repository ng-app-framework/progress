import {ModuleWithProviders, NgModule} from '@angular/core';
import {LoadingConfig} from "./Service/LoadingConfig";
import {Loader} from "./Service/Loader";
import {LoadingList} from "./Service/LoadingList";
import {LoadingComponent} from "./Component/LoadingComponent";
import {CoreModule} from "@ng-app-framework/core";
import {CommonModule} from "@angular/common";

@NgModule({
    imports     : [
        CoreModule,
        CommonModule
    ],
    declarations: [LoadingComponent],
    exports     : [LoadingComponent],
    providers   : [
        LoadingConfig,
        Loader,
        LoadingList
    ]
})
export class ProgressModule {

    /**
     * Initialization occurs here before anything else, so we can make sure all subscriptions are active that need to be
     */
    constructor(loader: Loader, loadingList: LoadingList) {
        loader.detectReadyState(document);
    }

    static forRoot(loadingConfig): ModuleWithProviders {
        return {
            ngModule : ProgressModule,
            providers: [
                {
                    provide : LoadingConfig,
                    useValue: loadingConfig
                },
                Loader,
                LoadingList
            ]
        };
    }
}

