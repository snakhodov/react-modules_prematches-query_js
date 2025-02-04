import {getRoot, types} from 'mobx-state-tree';
import {reaction} from 'mobx';

import {FetchStates} from "../compose-models/fetch-states.js";
import {BaseItem} from "../compose-models/base-item.js";
import {baseItemFetches} from "../compose-models/base-item-fetches";
import {Category} from "../category/index.js";
import {refreshTime} from "../../configs/refresh-time.js";
import orderBy from "lodash/orderBy.js";
import {Errors} from "../compose-models/errors.js";
import {DataByTimeRange} from "../compose-models/data-by-time-range.js";


const CategoriesByTimeRange = types
    .model('CategoriesByTimeRange', {
        children: types.array(types.reference(Category))
    })

const SportItem = types
    .model('SportItem', {
        id: types.identifier,
        parentId: types.maybeNull(types.string),
        dataByTimeRange: types.map(types.compose(DataByTimeRange, CategoriesByTimeRange)),
    })
    .extend((self) => ({actions: {...baseItemFetches(self).categories}}))
    .actions((self => {
        reaction(() => getRoot(self).activeItems.sportId, (sportId) => {
            if (sportId === self.id && getRoot(self).activeTimeRange.sports.find(sport => sport.id === self.id)) {
                self.getCategories();
            }
            if (sportId !== self.id) {
                clearTimeout(window.__prematches_categoriesUpdater);
                self.setWaitingUpdate(false);
            }
        })

        return {
            afterGetCategories() {
                self.setLastFetchTime();
                self.setFetching(false);
                if (getRoot(self).activeCategory) {
                    getRoot(self).activeCategory.getTournaments();
                } else {
                    self.setInitialFetching(false);
                    getRoot(self).activeTimeRange.setInitialFetching(false);
                }
                if (getRoot(self).activeItems.sportId === self.id) {
                    self.setUpdate({instance: 'categories', getter: self.getCategories});
                }
            },
            getCategories() {
                if (
                    self.lastFetchTime &&
                    Date.now() < +new Date(self.lastFetchTime + refreshTime.categories)
                ) {
                    const timeLeft =
                        +new Date(+self.lastFetchTime + refreshTime.categories) - Date.now();
                    self.setWaitingUpdate(false);
                    self.setUpdate({timeLeft, instance: 'categories', getter: self.getCategories});
                } else {
                    clearTimeout(window.__prematches_categoriesUpdater);
                    self.setWaitingUpdate(false);
                    self.setFetching(true);
                    try {
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
                                        getRoot(self).categories.get(id).updateItem(category)
                                    } else {
                                        getRoot(self).setItem(category, 'categories')
                                    }
                                    ids.push(id);
                                })
                                self.setDataRefsByTimeRange(ids);
                                self.afterGetCategories();
                            }
                        })
                    } catch(e) {
                        self.setError();
                        self.afterGetCategories();
                    }
                }
            },
        }
    }))
    .views((self) => ({
        get categoriesList() {
            const timeRangeId = getRoot(self).activeTimeRange.id;
            const range = self.dataByTimeRange.get(timeRangeId);
            return range.children.reduce((acc, category) => {
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

export const Sport = types.compose(SportItem, BaseItem, FetchStates, Errors);