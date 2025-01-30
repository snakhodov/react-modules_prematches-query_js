import {getParent, getRoot, types} from 'mobx-state-tree';
import {reaction, values} from 'mobx';

import {FetchStates} from "../compose-models/fetch-states.js";
import {BaseItem} from "../compose-models/base-item.js";
import {branchFetches} from "../branch/fetches/index.js";
import {refreshTime} from "../../configs/refresh-time.js";
import {Tournament} from "../tourmanent/index.js";

export const Category = types
    .model('Category', {
        id: types.identifier,
        parentId: types.maybeNull(types.string),
        tournaments: types.map(types.compose(Tournament, BaseItem, FetchStates))
    })
    .extend((self) => ({actions: {...branchFetches(self).tournaments}}))
    .actions((self => {
        reaction(() => getRoot(self).activeItems.categoryId, (categoryId) => {
            if (categoryId === self.id) {
                console.log('change categoryId', categoryId)
                self.getTournaments();
            }
        })

        return {
            setTournament({ i, mc, o, n }) {
                self.tournaments.put({
                    id: i.toString(),
                    matchCount: mc,
                    order: o,
                    name: n,
                })
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
                            res.data.forEach((tournament) => {
                                const id = tournament.i.toString();
                                if (self.tournaments.has(id)) {
                                    self.tournaments.get(id).update(tournament)
                                } else {
                                    self.setTournament(tournament)
                                }
                            })
                        }
                        self.setLastFetchTime();
                        self.setInitialFetching(false);
                        if (self.activeTournament) {
                            // self.activeTournament.getMatches();
                        }
                    })
                    self.setFetching(false);
                }
            },
        }
    }))
    .views((self) => ({
        get tournamentsList() {
            return values(self.tournaments).reduce((acc, category) => {
                if (category.matchCount) {
                    return [...acc, category]
                } else {
                    return acc
                }
            }, []);
        },
        get activeTournament() {
            const activeTournamentId = getRoot(self).activeItems.tournamentId;
            return self.tournaments.get(activeTournamentId);
        },
        get link() {
            return getParent(self, 2).link + '/' + self.id;
        }
    }))