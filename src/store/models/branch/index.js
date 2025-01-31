import {getRoot, types} from 'mobx-state-tree';
import {reaction, values} from 'mobx';

import {FetchStates} from "../compose-models/fetch-states.js";
import {BaseItem} from "../compose-models/base-item.js";
import {Sport} from "../sport";
import {branchFetches} from "./fetches";
import {refreshTime} from "../../configs/refresh-time.js";

export const Branch = types
    .model('Branch', {
        id: types.identifier,
        sports: types.map(types.compose(BaseItem, FetchStates, Sport))
    })
    .extend((self) => ({actions: {...branchFetches(self).sports}}))
    .actions((self => {
        reaction(() => getRoot(self).activeItems.branchId, (branchId) => {
            // if (branchId === self.id) {
            //     console.log('change branchId', branchId)
            //     self.getSports();
            // }
        })

        console.log(getRoot(self).activeItems.branchId)

        return {
            setSport({i, mc, o, pid, n}) {
                self.sports.put({
                    id: i.toString(),
                    matchCount: mc,
                    parentId: pid ? pid.toString() : null,
                    order: o,
                    name: n,
                })
            },
            getSports() {
                if (
                    !self.lastFetchTime ||
                    Date.now() < +new Date(self.lastFetchTime + refreshTime.sports)
                ) {
                    self.setFetching(true);
                    self.fetchSports({}).then(res => {
                        if (!res || res?.error) {
                            console.log('error');
                        } else {
                            res.data.forEach((sport) => {
                                const id = sport.i.toString();
                                if (self.sports.has(id)) {
                                    self.sports.get(id).update(sport)
                                } else {
                                    self.setSport(sport)
                                }
                            })
                        }
                        self.setLastFetchTime();
                        self.setInitialFetching(false);
                        if (self.activeSport) {
                            self.activeSport.getCategories();
                        }
                    })
                    self.setFetching(false);
                }
            },
        }
    }))
    .views((self) => ({
        get sportsList() {
            return values(self.sports).reduce((acc, sport) => {
                if (sport.matchCount) {
                    return [...acc, sport]
                } else {
                    return acc
                }
            }, []);
        },
        get activeSport() {
            const activeSportId = getRoot(self).activeItems.sportId;
            return self.sports.get(activeSportId);
        },
        get link() {
            return '/pre/' + self.id;
        }
    }))