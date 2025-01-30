import {useEffect} from "react";
import {inject, observer} from "mobx-react";
import {useParams} from "react-router-dom";


export const StoreProviderComponent = inject('prematchesStore')
(observer(({markUp, prematchesStore: {activeItems}}) => {
    let {branchId, sportId, categoryId, tournamentId, matchId} = useParams();

    useEffect(() => {
        activeItems.setActiveItems({branchId, sportId, categoryId, tournamentId, matchId})
    }, [branchId, sportId, categoryId, tournamentId, matchId]);

    return markUp;
}));