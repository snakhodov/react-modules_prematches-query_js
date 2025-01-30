import {types} from 'mobx-state-tree';

export const BaseItem = types
    .model('BaseItem', {
        id: types.identifier,
        order: types.maybeNull(types.integer),
        name: types.maybeNull(types.string),
        matchCount: types.maybeNull(types.integer),
    })
    .actions((self) => ({
        update({mc, o, pid, n}) {
            self.order = o;
            self.matchCount = mc;
            self.name = n;
            if (pid || pid === null) {
                self.parentId = pid ? pid.toString() : null;
            }
        },
    }))