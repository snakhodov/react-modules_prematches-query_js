import {useEffect} from "react";
import {inject, observer} from "mobx-react";
import {useParams} from "react-router-dom";


export const StoreProviderComponent = inject('prematchesStore')
(observer(({markUp, prematchesStore: {activeTimeRange, activeItems}}) => {
    let {timeRangeId, sportId, categoryId, tournamentId, matchId} = useParams();

    useEffect(() => {
        activeItems.setActiveItems({timeRangeId, sportId, categoryId, tournamentId, matchId})
    }, [timeRangeId, sportId, categoryId, tournamentId, matchId]);

    useEffect(() => {
        activeTimeRange?.getSports();
    }, [activeTimeRange]);

    return markUp;
}));