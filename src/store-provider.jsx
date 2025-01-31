import {useEffect} from "react";
import {inject, observer} from "mobx-react";
import {useParams} from "react-router-dom";


export const StoreProviderComponent = inject('prematchesStore')
(observer(({markUp, prematchesStore: {activeBranch, activeItems}}) => {
    let {branchId, sportId, categoryId, tournamentId, matchId} = useParams();

    useEffect(() => {
        activeItems.setActiveItems({branchId, sportId, categoryId, tournamentId, matchId})
    }, [branchId, sportId, categoryId, tournamentId, matchId]);

    useEffect(() => {
        activeBranch?.getSports();
    }, [activeBranch]);

    return markUp;
}));