import {getRoot, types} from 'mobx-state-tree';
import {reaction} from 'mobx';

import {Sport} from "../sport";
import {baseItemFetches} from "../compose-models/base-item-fetches";
import {refreshTime} from "../../configs/refresh-time.js";
import {orderBy} from "lodash/collection.js";

export const TimeRange = types
    .model('TimeRange', {
        id: types.identifier,
        sports: types.array(types.reference(Sport))
    })
    .extend((self) => ({actions: {...baseItemFetches(self).sports}}))
    .actions((self => {
        reaction(() => getRoot(self).activeItems.branchId, (branchId) => {
            if (branchId !== self.id) {
                clearTimeout(window.__prematchesSportUpdater);
                self.setWaitingUpdate(false);
            }
        })

        return {
            setSportRefs(ids) {
                self.sports = ids;
            },
            getSports() {
                if (
                    self.lastFetchTime &&
                    Date.now() < +new Date(self.lastFetchTime + refreshTime.sports)
                ) {
                    const timeLeft =
                        +new Date(+self.lastFetchTime + refreshTime.sports) - Date.now();
                    self.setWaitingUpdate(false);
                    self.setUpdateSports({timeLeft});
                } else {
                    clearTimeout(window.__prematchesSportUpdater);
                    self.setWaitingUpdate(false);
                    self.setFetching(true);
                    self.fetchSports({}).then(res => {
                        if (!res || res?.error) {
                            console.log('error');
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
                            self.setSportRefs(ids, 'sports');
                        }
                        self.setLastFetchTime();
                        self.setFetching(false);
                        self.setInitialFetching(false);
                        if (getRoot(self).activeSport) {
                            getRoot(self).activeSport.getCategories();
                        }
                        self.setUpdateSports();
                    })
                }
            },
            setUpdateSports({timeLeft} = {}) {
                if (!self.isWaitingUpdate) {
                    self.setWaitingUpdate(true);
                    clearTimeout(window.__prematchesSportUpdater);
                    window.__prematchesSportUpdater = setTimeout(
                        () => self.getSports(),
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