import {getRoot, types} from 'mobx-state-tree';
import {reaction} from 'mobx';

import {Sport} from "../sport";
import {baseItemFetches} from "../compose-models/base-item-fetches";
import {refreshTime} from "../../configs/refresh-time.js";
import {orderBy} from "../../../utils/order-by.js";

export const TimeRange = types
    .model('TimeRange', {
        id: types.identifier,
        sports: types.array(types.reference(Sport)),
        topMatchesFetchTime: types.maybeNull(types.Date),
        topMatchesIsFetching: false,
        topMatchesWaitingUpdate: false,
    })
    .extend((self) => ({
        actions: {...baseItemFetches(self).sports, ...baseItemFetches(self).matches}
    }))
    .actions((self => {
        reaction(() => getRoot(self).activeItems.timeRangeId, (timeRangeId) => {
            if (timeRangeId !== self.id) {
                clearTimeout(window.__prematches_sportsUpdater);
                self.setWaitingUpdate(false);
            }
        })
        reaction(() => getRoot(self).activeItems.sportId, (sportId) => {
            if (sportId) {
                clearTimeout(window.__prematches_topMatchesUpdater);
                self.setTopMatchesWaitingUpdate(false);
            }
        })

        return {
            setSportRefs(ids) {
                self.sports = ids;
            },
            setTopMatchesFetchTime() {
                self.topMatchesFetchTime = Date.now();
            },
            setTopMatchesFetching(flag) {
                self.topMatchesIsFetching = flag;
            },
            setTopMatchesWaitingUpdate(flag) {
                self.topMatchesWaitingUpdate = flag;
            },
            afterGetSports() {
                self.setLastFetchTime();
                self.setFetching(false);
                if (getRoot(self).activeSport) {
                    getRoot(self).activeSport.getCategories();
                } else {
                    self.setInitialFetching(false);
                    self.getTopMatches();
                }
                if (getRoot(self).activeItems.timeRangeId === self.id) {
                    self.setUpdate({instance: 'sports', getter: self.getSports});
                }
            },
            afterGetTopMatches() {
                self.setTopMatchesFetchTime();
                self.setTopMatchesFetching(false);
                if (!getRoot(self).activeItems.sportId) {
                    self.setTopMatchesUpdate({});
                }
            },
            getSports() {
                if (
                    self.lastFetchTime &&
                    Date.now() < +new Date(self.lastFetchTime + refreshTime.sports)
                ) {
                    const timeLeft =
                        +new Date(+self.lastFetchTime + refreshTime.sports) - Date.now();
                    self.setWaitingUpdate(false);
                    self.setUpdate({timeLeft, instance: 'sports', getter: self.getSports});
                } else {
                    clearTimeout(window.__prematches_sportsUpdater);
                    self.setWaitingUpdate(false);
                    self.setFetching(true);
                    try {
                        self.fetchSports({}).then(res => {
                            if (!res || res?.error) {
                                console.log(res?.error ?? 'fetchSports error');
                                self.setError({message: res?.error || null});
                            } else {
                                const sportsData = orderBy(
                                    res.data,
                                    ['o', 'n'],
                                    ['asc', 'asc']
                                )
                                const ids = [];
                                sportsData.forEach((sport) => {
                                    const id = sport.i.toString();
                                    if (getRoot(self).sports.has(id)) {
                                        getRoot(self).sports.get(id).updateItem(sport);
                                    } else {
                                        getRoot(self).setItem(sport, 'sports');
                                    }
                                    ids.push(id);
                                })
                                self.setSportRefs(ids);
                                self.afterGetSports();
                            }
                        })
                    } catch(e) {
                        self.setError();
                        self.afterGetSports();
                    }
                }
            },
            getTopMatches() {
                const timeLeft = +new Date(+self.topMatchesFetchTime + refreshTime.sports) - Date.now();
                if (
                    self.lastFetchTime &&
                    Date.now() < +new Date(self.topMatchesFetchTime + refreshTime.sports)
                ) {
                    self.setWaitingUpdate(false);
                    self.setTopMatchesUpdate({timeLeft});
                } else {
                    clearTimeout(window.__prematches_topMatchesUpdater);
                    self.setTopMatchesWaitingUpdate(false);
                    self.setTopMatchesFetching(true);
                    try {
                        self.fetchTopMatches({}).then(res => {
                            if (!res || res?.error) {
                                console.log(res?.error ?? 'fetchTopMatches error');
                                self.setError({message: res?.error || null});
                            } else {
                                const ids = [];

                                // sportsData.forEach((sport) => {
                                //
                                //     ids.push(id);
                                // })
                                // self.setTopMatchesRefs(ids, 'sports');
                                // self.afterGetTopMatches();
                            }
                        })
                    } catch(e) {
                        self.setError();
                        self.afterGetTopMatches();
                    }
                }
            },
            setTopMatchesUpdate({timeLeft} = {}) {
                if (!self.isTopMatchesWaitingUpdate) {
                    self.setTopMatchesWaitingUpdate(true);
                    clearTimeout(window.__prematches_topMatchesUpdater);
                    window.__prematches_topMatchesUpdater = setTimeout(
                        () => self.getTopMatches(),
                        timeLeft ?? refreshTime.sports
                    );
                }
            },
        }
    }))
    .views((self) => ({
        get sportsList() {
            const timeRangeId = getRoot(self).activeTimeRange.id;
            return self.sports.reduce((acc, sport) => {
                const matchCount = sport.dataByTimeRange.get(timeRangeId).matchCount;
                const outrightCount = sport.dataByTimeRange.get(timeRangeId).outrightCount;
                return [...acc, {
                    ...sport,
                    matchCount,
                    outrightCount,
                    categoriesList: sport.categoriesList,
                    link: sport.link,
                }]
            }, []);
        },
        get link() {
            return '/pre/' + self.id;
        }
    }))