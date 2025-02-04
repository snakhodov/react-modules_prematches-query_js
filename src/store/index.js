import {applySnapshot, types} from 'mobx-state-tree';
import {TimeRange} from "./models/time-range";
import {BaseItem} from "./models/compose-models/base-item.js";
import {FetchStates} from "./models/compose-models/fetch-states.js";
import {Sport} from "./models/sport";
import {Category} from "./models/category";
import {Tournament} from "./models/tourmanent";


const ActiveItems = types
    .model('ActiveItems', {
        timeRangeId: types.maybeNull(types.string),
        sportId: types.maybeNull(types.string),
        categoryId: types.maybeNull(types.string),
        tournamentId: types.maybeNull(types.string),
        matchId: types.maybeNull(types.string),
    })
    .actions((self) => ({
        setActiveItem({id, type}) {
            self[type + 'Id'] = id;
        },
        setActiveItems({timeRangeId, sportId, categoryId, tournamentId, matchId}) {
            self.timeRangeId = timeRangeId ?? '1';
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
        timeRanges: types.map(types.compose(TimeRange, BaseItem, FetchStates)),
        sports: types.map(Sport),
        categories: types.map(Category),
        tournaments: types.map(Tournament),
        activeItems: types.optional(ActiveItems, {})
    })
    .actions((self) => ({
        setTimeRange({id}) {
            if (!self.timeRanges.has(id)) {
                self.timeRanges.set(id, {id: id});
            }
        },
        setItem({i, mc, oc, o, pid, n}, type) {
            const item = {
                id: i.toString(),
                order: o,
                name: n,
            };
            if (pid || pid === null) {
                self.parentId = pid ? pid.toString() : null;
            }
            const newItem = self[type].put(item);
            newItem.setEventsCount({matchCount: mc, outrightCount: oc});
        },
    }))
    .views((self) => ({
        get activeTimeRange() {
            return self.timeRanges.get(self.activeItems.timeRangeId);
        },
        get activeSport() {
            return self.sports.get(self.activeItems.sportId);
        },
        get activeCategory() {
            return self.categories.get(self.activeItems.categoryId);
        },
        get activeTournament() {
            return self.tournaments.get(self.activeItems.tournamentId);
        },
    }))
;

let prematchesStore = null;
const initStore = (snapshot = null) => {
    if (prematchesStore === null) {
        prematchesStore = PrematchesStore.create();
        prematchesStore.setTimeRange({id: '1'});
        prematchesStore.setTimeRange({id: '2'});
        prematchesStore.setTimeRange({id: '3'});
        prematchesStore.setTimeRange({id: '4'});
        prematchesStore.setTimeRange({id: '5'});
    }
    if (snapshot) applySnapshot(prematchesStore, snapshot);
    return prematchesStore;
};

export default initStore;
