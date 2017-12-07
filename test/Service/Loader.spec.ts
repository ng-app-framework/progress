import {Loader} from "../../src/app/Service/Loader";

describe('Loader', () => {
    let loader: Loader   = null;
    Loader.useReadyState = false;
    let mockDocument     = {
        readyState      : 'loading',
        callback        : null,
        addEventListener: function (eventName, callback) {
            this.callback = () => {
                this.readyState = 'complete';
                callback();
            };
        }
    };
    beforeEach(() => {
        loader               = new Loader();
        // Disable the document readyState check so we can ignore that aspect and focus on the counts.
        Loader.useReadyState = true;
        loader.operations    = {};
    });
    it('should be loading until the document readyState changes', () => {
        loader.detectReadyState(<any>mockDocument);
        expect(loader.isLoading()).toBeTruthy();
        mockDocument.callback();
        expect(loader.isLoading()).toBeFalsy();
    });
    it('should just set readyState as complete if document does not exist', () => {
        loader.detectReadyState(<Document>null);
        expect(loader.getDocumentReadyState()).toEqual('complete');
    });
    it('should just set readyState as complete if useReadyState is false', () => {
        Loader.useReadyState = false;
        loader.detectReadyState(<any>mockDocument);
        expect(loader.getDocumentReadyState()).toEqual('complete');
    });
});
