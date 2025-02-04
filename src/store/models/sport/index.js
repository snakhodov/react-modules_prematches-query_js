import {getRoot, types} from 'mobx-state-tree';
import {reaction} from 'mobx';

import {FetchStates} from "../compose-models/fetch-states.js";
import {BaseItem} from "../compose-models/base-item.js";
import {baseItemFetches} from "../compose-models/base-item-fetches";
import {Category} from "../category/index.js";
import {refreshTime} from "../../configs/refresh-time.js";
import {orderBy} from "lodash/collection.js";


const CategoriesByTimeRange = types
    .model('CategoriesByTimeRange', {
        id: types.identifier,
        matchCount: 0,
        outrightCount: 0,
        categories: types.array(types.reference(Category))
    })
    .actions((self => ({
        setEventsCount({matchCount, outrightCount}) {
            self.matchCount = matchCount || 0;
            self.outrightCount = outrightCount || 0;
        },
        setCategoriesRefs(ids) {
            self.categories = ids;
        },
    })))

const SportItem = types
    .model('SportItem', {
        id: types.identifier,
        parentId: types.maybeNull(types.string),
        dataByTimeRange: types.map(CategoriesByTimeRange),
    })
    .extend((self) => ({actions: {...baseItemFetches(self).categories}}))
    .actions((self => {
        reaction(() => getRoot(self).activeItems.sportId, (sportId) => {
            if (sportId === self.id && getRoot(self).activeTimeRange.sports.find(sport => sport.id === self.id)) {
                self.getCategories();
            }
        })

        return {
            setCategoryRefsByTimeRange(ids) {
                const timeRangeId = getRoot(self).activeTimeRange.id;
                if (!self.dataByTimeRange.has(timeRangeId)) {
                    self.dataByTimeRange.set(timeRangeId, {id: timeRangeId})
                }
                const range = self.dataByTimeRange.get(timeRangeId);
                range.setCategoriesRefs(ids);
            },
            getCategories() {
                if (
                    !self.lastFetchTime ||
                    Date.now() < +new Date(self.lastFetchTime + refreshTime.categories)
                ) {
                    self.setFetching(true);
                    self.fetchCategories({}).then(res => {
                        if (!res || res?.error) {
                            console.log('error');
                        } else {
                            const data = orderBy(
                                res.data,
                                ['o', 'n'],
                                ['asc', 'asc']
                            )
                            const ids = [];
                            data.forEach((category) => {
                                const id = category.i.toString();
                                if (getRoot(self).categories.has(id)) {
                                    getRoot(self).categories.get(id).update(category)
                                } else {
                                    getRoot(self).setItem(category, 'categories')
                                }
                                ids.push(id);
                            })
                            self.setCategoryRefsByTimeRange(ids);
                        }
                        self.setLastFetchTime();
                        self.setInitialFetching(false);
                        if (getRoot(self).activeCategory) {
                            getRoot(self).activeCategory.getTournaments();
                        }
                    })
                    self.setFetching(false);
                }
            },
        }
    }))
    .views((self) => ({
        get categoriesList() {
            const timeRangeId = getRoot(self).activeTimeRange.id;
            const range = self.dataByTimeRange.get(timeRangeId);
            return range.categories.reduce((acc, category) => {
                const matchCount = category.dataByTimeRange.get(timeRangeId).matchCount;
                const outrightCount = category.dataByTimeRange.get(timeRangeId).outrightCount;
                return [...acc, {
                    ...category,
                    matchCount,
                    outrightCount,
                    tournamentsList: category.tournamentsList,
                    link: category.link,
                }]
            }, []);
        },
        get link() {
            return getRoot(self).activeTimeRange.link + '/' + self.id;
        }
    }));

export const Sport = types.compose(SportItem, BaseItem, FetchStates);