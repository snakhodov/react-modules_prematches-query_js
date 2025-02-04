import {getRoot, types} from 'mobx-state-tree';

const MAX_ERRORS_COUNTER = 3;

export const Errors = types
    .model('Errors', {
        errorCount: 0,
        errorMessage: types.maybeNull(types.string),
    }).actions((self) => ({
        setError({message} = {}) {
            if (self.initialFetching) {
                getRoot(self).setGlobalError();
            } else {
                if (MAX_ERRORS_COUNTER <= self.errorCount) {
                    self.errorMessage = message ?? 'SOME_ERROR'
                } else {
                    self.errorCount = self.errorCount + 1;
                }
            }
        },
        clearErrors() {
            self.errorCount = 0;
            self.errorMessage = null;
        }
    }))