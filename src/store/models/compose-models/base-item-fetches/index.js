import { getRoot, flow } from 'mobx-state-tree';

import { timeRangesConfig } from '../../../configs/time-ranges.js';
import {apiRequest} from "../../../../common/api/index.js";


export const baseItemFetches = (self) => ({
    sports: {
        fetchSports: flow(function* fetch({from, to} = {}) {
            let sportFetchParams = {
                to: to || timeRangesConfig[getRoot(self).activeTimeRange.id].to(),
            };

            if (from) {
                sportFetchParams.from = from;
            }
            return apiRequest({
                    url: 'sports',
                    body: sportFetchParams
                }
            );
        }),
    },
    categories: {
        fetchCategories: flow(function* fetch({ sportId, from, to }) {
            const categoryFetchParams = {
                to: to || timeRangesConfig[getRoot(self).activeTimeRange.id].to(),
                sportId: sportId || getRoot(self).activeItems.sportId,
            };

            if (from) {
                categoryFetchParams.from = from;
            }

            return apiRequest({
                    url: 'categories',
                    body: categoryFetchParams
                }
            );
        }),
    },

    tournaments: {
        fetchTournaments: flow(function* fetch({ categoryId, from, to }) {
            const tournamentFetchParams = {
                to: to || timeRangesConfig[getRoot(self).activeTimeRange.id].to(),
                categoryId: categoryId || getRoot(self).activeItems.categoryId,
            };

            if (from) {
                tournamentFetchParams.from = from
            }

            return apiRequest({
                    url: 'tournaments',
                    body: tournamentFetchParams
                }
            );
        }),
        fetchPopularTournaments: flow(function* fetch({}) {
            return apiRequest({
                    url: 'popularTournaments',
                    body: {
                        to: timeRangesConfig[getRoot(self).activeTimeRange.id].to(),
                    }
                }
            );
        }),
    },
});