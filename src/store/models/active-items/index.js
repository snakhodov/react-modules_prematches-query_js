import {types} from "mobx-state-tree";

export const ActiveItems = types
    .model('ActiveItems', {
        timeRangeId: types.maybeNull(types.string),
        sportId: types.maybeNull(types.string),
        categoryId: types.maybeNull(types.string),
        tournamentId: types.maybeNull(types.string),
        matchId: types.maybeNull(types.string),

        globalError: types.maybeNull(types.string),
    })
    .actions((self) => ({
        setGlobalError({message} = {}) {
            self.globalError = message ?? 'GLOBAL_ERROR'
        },
        setActiveItems({timeRangeId, sportId, categoryId, tournamentId, matchId}) {
            if (self.timeRangeId !== timeRangeId) {
                self.timeRangeId = timeRangeId ?? '1';
            }
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