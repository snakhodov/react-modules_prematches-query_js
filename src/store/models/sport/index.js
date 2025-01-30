import {getParent, getRoot, types} from 'mobx-state-tree';
import {reaction, values} from 'mobx';

import {FetchStates} from "../compose-models/fetch-states.js";
import {BaseItem} from "../compose-models/base-item.js";
import {branchFetches} from "../branch/fetches/index.js";
import {Category} from "../category/index.js";
import {refreshTime} from "../../configs/refresh-time.js";

export const Sport = types
    .model('Sport', {
        id: types.identifier,
        parentId: types.maybeNull(types.string),
        matchCount: types.maybeNull(types.integer),
        categories: types.map(types.compose(Category, BaseItem, FetchStates))
    })
    .extend((self) => ({actions: {...branchFetches(self).categories}}))
    .actions((self => {
        reaction(() => getRoot(self).activeItems.sportId, (sportId) => {
            if (sportId === self.id) {
                self.getCategories();
            }
        })

        return {
            setCategory({ i, mc, o, pid, n }) {
                self.categories.put({
                    id: i.toString(),
                    matchCount: mc,
                    order: o,
                    parentId: pid.toString(),
                    name: n,
                })
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
                            res.data.forEach((category) => {
                                const id = category.i.toString();
                                if (self.categories.has(id)) {
                                    self.categories.get(id).update(category)
                                } else {
                                    self.setCategory(category)
                                }
                            })
                        }
                        self.setLastFetchTime();
                        self.setInitialFetching(false);
                        if (self.activeCategory) {
                            self.activeCategory.getTournaments();
                        }
                    })
                    self.setFetching(false);
                }
            },
        }
    }))
    .views((self) => ({
        get categoriesList() {
            return values(self.categories).reduce((acc, category) => {
                if (category.matchCount) {
                    return [...acc, category]
                } else {
                    return acc
                }
            }, []);
        },
        get activeCategory() {
            const activeCategoryId = getRoot(self).activeItems.categoryId;
            return self.categories.get(activeCategoryId);
        },
        get link() {
            return getParent(self, 2).link + '/' + self.id;
        }
    }))