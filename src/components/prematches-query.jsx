import React, {useEffect} from "react";
import {inject, observer} from "mobx-react";
import {Link, useParams} from "react-router-dom";
import {BranchPicker} from "./branch-picker.jsx";

const Qwe = (
    {
        prematchesStore: {
            activeTimeRange,
            activeItems
        },
    }
) => {
    let {timeRangeId, sportId, categoryId, tournamentId, matchId} = useParams();

    useEffect(() => {
        activeItems.setActiveItems({timeRangeId, sportId, categoryId, tournamentId, matchId})
    }, [timeRangeId, sportId, categoryId, tournamentId, matchId]);

    useEffect(() => {
        activeTimeRange?.getSports();
    }, [activeTimeRange]);

    return (<><BranchPicker/>
    { !activeTimeRange || activeTimeRange?.initialFetching ? <p>Loading...</p> : (
        <ul>{activeTimeRange.sportsList.map(sport => <li key={sport.id}>
            <span>{sport.name}</span>
            <span> - </span>
            <Link to={sport.link}>{sport.link}</Link>
            {sport.categoriesList.length ? <ul>{sport.categoriesList.map(item => <li key={item.id}>
                <span>{item.name}</span>
                <span> - </span>
                <span>{item.link}</span></li>)}</ul> : null}
        </li>)}</ul>
    )}</>);
}

export default inject('prematchesStore')(observer(Qwe));