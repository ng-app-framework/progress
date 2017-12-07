import {Injectable} from "@angular/core";
import {Progress} from "./Progress";
import {Name} from "@ng-app-framework/validation";

@Name('Loader')
@Injectable()
export class Loader extends Progress {


    static AJAX = 'ajax';

    static useReadyState: boolean = true;

    protected documentReadyState = 'loading';

    public detectReadyState(document: Document) {
        this.documentReadyState = 'loading';
        if (Loader.useReadyState && document) {
            document.addEventListener('readystatechange', () => {
                this.documentReadyState = document.readyState;
            });
            return;
        }
        this.documentReadyState = 'complete';
    }

    public isLoading() {
        return this.isInProgress() || this.documentReadyState !== 'complete';
    }

    public getDocumentReadyState() {
        return this.documentReadyState;
    }
}
