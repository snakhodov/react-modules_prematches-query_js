import {types} from 'mobx-state-tree';

export const FetchStates = types
    .model('WithFlags', {
        lastFetchTime: types.maybeNull(types.Date),
        isWaitingUpdate: false,
        isFetching: false,
        initialFetching: true,
    }).actions((self) => ({
        setLastFetchTime() {
            self.lastFetchTime = Date.now();
        },
        setInitialFetching(flag) {
            self.initialFetching = flag;
        },
        setFetching(flag) {
            self.isFetching = flag;
        },
        setWaitingUpdate(flag) {
            self.isWaitingUpdate = flag;
        },
    }))