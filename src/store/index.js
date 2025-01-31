import {applySnapshot, getRoot, types} from 'mobx-state-tree';
import {Branch} from "./models/branch";
import {BaseItem} from "./models/compose-models/base-item.js";
import {FetchStates} from "./models/compose-models/fetch-states.js";


const ActiveItems = types
    .model('ActiveItems', {
        branchId: types.maybeNull(types.string),
        sportId: types.maybeNull(types.string),
        categoryId: types.maybeNull(types.string),
        tournamentId: types.maybeNull(types.string),
        matchId: types.maybeNull(types.string),
    })
    .actions((self) => ({
        setActiveItem({id, type}) {
            self[type + 'Id'] = id;
        },
        setActiveItems({branchId, sportId, categoryId, tournamentId, matchId}) {
            self.branchId = branchId ?? '1';
            self.matchId = matchId;
            self.tournamentId = tournamentId;

            if (categoryId) {
                const categoryIds = categoryId.split('-');
                self.categoryId = categoryIds[categoryIds.length - 1];
            } else {
                self.categoryId = null
            }

            if (sportId) {
                const sportIds = sportId.split('-');
                self.sportId = sportIds[sportIds.length - 1];
            } else {
                self.sportId = null
            }
        },
    }));

const PrematchesStore = types
    .model('PrematchesStore', {
        branches: types.map(types.compose(Branch, BaseItem, FetchStates)),
        activeItems: types.optional(ActiveItems, {})
    })
    .actions((self) => ({
        setBranch({id}) {
            if (!self.branches.has(id)) {
                self.branches.set(id, {id: id});
            }
        },
    }))
    .views((self) => ({
        get activeBranch() {
            return self.branches.get(self.activeItems.branchId);
        },
    }))
;

let prematchesStore = null;
const initStore = (snapshot = null) => {
    if (prematchesStore === null) {
        prematchesStore = PrematchesStore.create();
        prematchesStore.setBranch({id: '1'});
        prematchesStore.setBranch({id: '2'});
        prematchesStore.setBranch({id: '3'});
        prematchesStore.setBranch({id: '4'});
        prematchesStore.setBranch({id: '5'});
    }
    if (snapshot) applySnapshot(prematchesStore, snapshot);
    return prematchesStore;
};

export default initStore;
