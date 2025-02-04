import {getRoot, types} from 'mobx-state-tree';
import {reaction} from 'mobx';

import {FetchStates} from "../compose-models/fetch-states.js";
import {BaseItem} from "../compose-models/base-item.js";
import {baseItemFetches} from "../compose-models/base-item-fetches";
import {refreshTime} from "../../configs/refresh-time.js";
import {Tournament} from "../tourmanent/index.js";
import orderBy from "lodash/orderBy.js";
import {Errors} from "../compose-models/errors.js";
import {DataByTimeRange} from "../compose-models/data-by-time-range.js";


const TournamentsByTimeRange = types
    .model('TournamentsByTimeRange', {
        children: types.array(types.reference(Tournament))
    })

const CategoryItem = types
    .model('CategoryItem', {
        id: types.identifier,
        parentId: types.maybeNull(types.string),
        dataByTimeRange: types.map(types.compose(DataByTimeRange, TournamentsByTimeRange))
    })
    .extend((self) => ({actions: {...baseItemFetches(self).tournaments}}))
    .actions((self => {
        reaction(() => getRoot(self).activeItems.categoryId, (categoryId) => {
            if (categoryId === self.id && getRoot(self).activeSport.categoriesList.find(category => category.id === self.id)) {
                self.getTournaments();
            }
            if (categoryId !== self.id) {
                clearTimeout(window.__prematches_tournamentsUpdater);
                self.setWaitingUpdate(false);
            }
        })

        return {
            afterGetTournaments() {
                self.setLastFetchTime();
                self.setFetching(false);
                if (getRoot(self).activeTournament) {
                    // getRoot(self).activeTournament.getMatches();
                } else {
                    self.setInitialFetching(false);
                    getRoot(self).activeSport.setInitialFetching(false);
                    getRoot(self).activeTimeRange.setInitialFetching(false);
                }
                if (getRoot(self).activeItems.categoryId === self.id) {
                    self.setUpdate({instance: 'tournaments', getter: self.getTournaments});
                }
            },
            getTournaments() {
                if (
                    self.lastFetchTime &&
                    Date.now() < +new Date(self.lastFetchTime + refreshTime.tournaments)
                ) {
                    const timeLeft =
                        +new Date(+self.lastFetchTime + refreshTime.tournaments) - Date.now();
                    self.setWaitingUpdate(false);
                    self.setUpdate({timeLeft, instance: 'tournaments', getter: self.getTournaments});
                } else {
                    clearTimeout(window.__prematches_tournamentsUpdater);
                    self.setWaitingUpdate(false);
                    self.setFetching(true);
                    try {
                        self.fetchTournaments({}).then(res => {
                            if (!res || res?.error) {
                                console.log('error');
                            } else {
                                const data = orderBy(
                                    res.data,
                                    ['o', 'n'],
                                    ['asc', 'asc']
                                )
                                const ids = [];
                                data.forEach((tournament) => {
                                    const id = tournament.i.toString();
                                    if (getRoot(self).tournaments.has(id)) {
                                        getRoot(self).tournaments.get(id).updateItem(tournament)
                                    } else {
                                        getRoot(self).setItem(tournament, 'tournaments')
                                    }
                                    ids.push(id);
                                })
                                self.setDataRefsByTimeRange(ids);
                                self.afterGetTournaments();
                            }
                        })
                    } catch(e) {
                        self.setError();
                        self.afterGetTournaments();
                    }
                }
            },
        }
    }))
    .views((self) => ({
        get tournamentsList() {
            const timeRangeId = getRoot(self).activeTimeRange.id;
            const range = self.dataByTimeRange.get(timeRangeId);
            return range.children.reduce((acc, tournament) => {
                const matchCount = tournament.dataByTimeRange.get(timeRangeId).matchCount;
                const outrightCount = tournament.dataByTimeRange.get(timeRangeId).outrightCount;
                return [...acc, {
                    ...tournament,
                    matchCount,
                    outrightCount
                }]
            }, []);
        },
        get link() {
            return getRoot(self).activeSport.link + '/' + self.id;
        }
    }));

export const Category = types.compose(CategoryItem, BaseItem, FetchStates, Errors);