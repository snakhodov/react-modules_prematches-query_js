import {getParent, getRoot, types} from 'mobx-state-tree';
import {reaction} from 'mobx';

import {FetchStates} from "../compose-models/fetch-states.js";
import {BaseItem} from "../compose-models/base-item.js";
import {branchFetches} from "../branch/fetches/index.js";

export const Tournament = types
    .model('Tournament', {
        id: types.identifier,
        tournaments: types.map(types.compose(BaseItem, FetchStates))
    })
    .extend((self) => ({actions: {...branchFetches(self).tournaments}}))
    .actions((self => {
        reaction(() => getRoot(self).activeItems.tournamentId, (tournamentId) => {
            //if (tournamentId === self.id) self.getMatches();
        })

        return {

        }
    }))
    .views((self) => ({
        get link() {
            return getParent(self, 2).link + '/' + self.id;
        }
    }))