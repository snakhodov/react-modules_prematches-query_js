import {getRoot, types} from 'mobx-state-tree';
import {reaction} from 'mobx';

import {FetchStates} from "../compose-models/fetch-states.js";
import {BaseItem} from "../compose-models/base-item.js";
import {baseItemFetches} from "../compose-models/base-item-fetches";
import {refreshTime} from "../../configs/refresh-time.js";
import {Tournament} from "../tourmanent/index.js";
import {orderBy} from "lodash/collection.js";


const TournamentsByTimeRange = types
    .model('TournamentsByTimeRange', {
        id: types.identifier,
        matchCount: 0,
        outrightCount: 0,
        tournaments: types.array(types.reference(Tournament))
    })
    .actions((self => ({
        setEventsCount({matchCount, outrightCount}) {
            self.matchCount = matchCount || 0;
            self.outrightCount = outrightCount || 0;
        },
        setTournamentsRefs(ids) {
            self.tournaments = ids;
        },
    })))

const CategoryItem = types
    .model('CategoryItem', {
        id: types.identifier,
        parentId: types.maybeNull(types.string),
        dataByTimeRange: types.map(TournamentsByTimeRange)
    })
    .extend((self) => ({actions: {...baseItemFetches(self).tournaments}}))
    .actions((self => {
        reaction(() => getRoot(self).activeItems.categoryId, (categoryId) => {
            if (categoryId === self.id && getRoot(self).activeSport.categoriesList.find(category => category.id === self.id)) {
                self.getTournaments();
            }
        })

        return {
            setTournamentRefsByTimeRange(ids) {
                const timeRangeId = getRoot(self).activeTimeRange.id;
                if (!self.dataByTimeRange.has(timeRangeId)) {
                    self.dataByTimeRange.set(timeRangeId, {id: timeRangeId})
                }
                const range = self.dataByTimeRange.get(timeRangeId);
                range.setTournamentsRefs(ids);
            },

            getTournaments() {
                if (
                    !self.lastFetchTime ||
                    Date.now() < +new Date(self.lastFetchTime + refreshTime.categories)
                ) {
                    self.setFetching(true);
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
                                    getRoot(self).tournaments.get(id).update(tournament)
                                } else {
                                    getRoot(self).setItem(tournament, 'tournaments')
                                }
                                ids.push(id);
                            })
                            self.setTournamentRefsByTimeRange(ids);
                        }
                        self.setLastFetchTime();
                        self.setInitialFetching(false);
                        if (getRoot(self).activeTournament) {
                            // getRoot(self).activeTournament.getMatches();
                        }
                    })
                    self.setFetching(false);
                }
            },
        }
    }))
    .views((self) => ({
        get tournamentsList() {
            const timeRangeId = getRoot(self).activeTimeRange.id;
            const range = self.dataByTimeRange.get(timeRangeId);
            return range.tournaments.reduce((acc, tournament) => {
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

export const Category = types.compose(CategoryItem, BaseItem, FetchStates);