import {useParams} from "react-router-dom";
import React, {useEffect} from "react";
import {inject, observer} from "mobx-react";

const Qwe = (
    {
        prematchesStore: {
            activeBranch,
            activeItems,
        },
        loading
    }
) => {
    let {branchId, sportId, categoryId, tournamentId, matchId} = useParams();

    useEffect(() => {
        activeItems.setActiveItems({branchId, sportId, categoryId, tournamentId, matchId})
    }, [branchId, sportId, categoryId, tournamentId, matchId]);

    return (loading ? <p>Loading...</p> : (
        <ul>{activeBranch.sportsList.map(sport => <li key={sport.id}>
            <span>{sport.name}</span>
            <span> - </span>
            <span>{sport.link}</span>
            {sport.categoriesList.length ? <ul>{sport.categoriesList.map(item => <li key={item.id}>
                <span>{item.name}</span>
                <span> - </span>
                <span>{item.link}</span></li>)}</ul> : null}
        </li>)}</ul>
    ));
}

export default inject('prematchesStore')(observer(Qwe));