import {types} from "mobx-state-tree";
import {Category} from "../category/index.js";

export const DataByTimeRange = types
    .model('DataByTimeRange', {
        id: types.identifier,
        matchCount: 0,
        outrightCount: 0,
    })
    .actions((self => ({
        setEventsCount({matchCount, outrightCount}) {
            self.matchCount = matchCount || 0;
            self.outrightCount = outrightCount || 0;
        },
        setChildrenRefs(ids) {
            self.children = ids;
        },
    })))