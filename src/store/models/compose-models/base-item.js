import {getRoot, types} from 'mobx-state-tree';

export const BaseItem = types
    .model('BaseItem', {
        id: types.identifier,
        order: types.maybeNull(types.integer),
        name: types.maybeNull(types.string),
    })
    .actions((self) => ({
        updateItem({mc, oc, o, pid, n}) {
            self.order = o;
            self.name = n;
            if (pid || pid === null) {
                self.parentId = pid ? pid.toString() : null;
            }
            self.setEventsCount({matchCount: mc, outrightCount: oc});
        },
        setEventsCount({matchCount, outrightCount}) {
            const timeRangeId = getRoot(self).activeTimeRange.id;
            if (!self.dataByTimeRange.has(timeRangeId)) {
                self.dataByTimeRange.set(timeRangeId, {id: timeRangeId})
            }
            const range = self.dataByTimeRange.get(timeRangeId);
            range.setEventsCount({matchCount, outrightCount});
        },
    }))