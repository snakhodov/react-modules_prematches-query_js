import {applySnapshot, types} from 'mobx-state-tree';
import {reaction} from 'mobx';
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
        setActiveItems({branchId = '1', sportId = null, categoryId = null, tournamentId = null, matchId= null}) {
            self.branchId = branchId;
            self.matchId = matchId;
            self.tournamentId = tournamentId;

            if (categoryId) {
                const categoryIds = categoryId.split('-');
                self.categoryId = categoryIds[categoryIds.length - 1];
            }
            if (sportId) {
                const sportIds = sportId.split('-');
                self.sportId = sportIds[sportIds.length - 1];
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
            self.branches.get(id).getSports();
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
        prematchesStore.activeItems.setActiveItem({id: '1', type: 'branch'});
        prematchesStore.setBranch({id: '1'});
    }
    if (snapshot) applySnapshot(prematchesStore, snapshot);
    return prematchesStore;
};

export default initStore;
