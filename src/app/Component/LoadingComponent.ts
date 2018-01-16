import {Component} from '@angular/core';
import {LoadingList} from "../Service/LoadingList";
import {Name} from "@ng-app-framework/validation";

@Component({
    selector     : 'div.loading-list',
    templateUrl  : './loading-list.html',
    styleUrls: ['./loading-list.scss']
})
@Name('LoadingComponent')
export class LoadingComponent {


    constructor(public list: LoadingList) {
    }

    getKeys(object) {
        return Object.keys(object).sort(function(a,b){return object[b]-object[a]});
    }
}
