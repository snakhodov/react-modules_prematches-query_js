import {getRoot, types} from 'mobx-state-tree';
import {reaction} from 'mobx';

import {FetchStates} from "../compose-models/fetch-states.js";
import {BaseItem} from "../compose-models/base-item.js";
import {baseItemFetches} from "../compose-models/base-item-fetches";
import {Errors} from "../compose-models/errors.js";

const TournamentDataByTimeRange = types
    .model('TournamentDataByTimeRange', {
        id: types.identifier,
        matchCount: 0,
        outrightCount: 0,
        // matches: types.array(types.reference(Match))
    })
    .actions((self => ({
        setEventsCount({matchCount, outrightCount}) {
            self.matchCount = matchCount || 0;
            self.outrightCount = outrightCount || 0;
        },
        setMatchesRefs(ids) {
            //self.matches = ids;
        },
    })))

const TournamentItem = types
    .model('TournamentItem', {
        id: types.identifier,
        dataByTimeRange: types.map(TournamentDataByTimeRange)
    })
    .extend((self) => ({actions: {...baseItemFetches(self).tournaments}}))
    .actions((self => {
        reaction(() => getRoot(self).activeItems.tournamentId, (tournamentId) => {
            if (tournamentId === self.id && getRoot(self).activeCategory.tournamentsList.find(tournament => tournament.id === self.id)) {
                //self.getMatches();
            }
        })

        return {}
    }))
    .views((self) => ({
        get link() {
            return getRoot(self).activeCategory.link + '/' + self.id;
        }
    }));

export const Tournament = types.compose(TournamentItem, BaseItem, FetchStates, Errors);