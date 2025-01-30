
import {inject, observer} from "mobx-react";




export const StoreProviderComponent = inject('prematchesStore')
(observer(({markUp}) => {
    return markUp;
}));