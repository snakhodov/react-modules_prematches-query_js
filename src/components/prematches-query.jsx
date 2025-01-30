import React, {useEffect} from "react";
import {inject, observer} from "mobx-react";
import {Link, useParams} from "react-router-dom";

const Qwe = (
    {
        prematchesStore: {
            activeBranch,
            activeItems
        },
    }
) => {
    let {branchId, sportId, categoryId, tournamentId, matchId} = useParams();

    useEffect(() => {
        activeItems.setActiveItems({branchId, sportId, categoryId, tournamentId, matchId})
    }, [branchId, sportId, categoryId, tournamentId, matchId]);

    return (activeBranch.initialFetching ? <p>Loading...</p> : (
        <ul>{activeBranch.sportsList.map(sport => <li key={sport.id}>
            <span>{sport.name}</span>
            <span> - </span>
            <Link to={sport.link}>{sport.link}</Link>
            {sport.categoriesList.length ? <ul>{sport.categoriesList.map(item => <li key={item.id}>
                <span>{item.name}</span>
                <span> - </span>
                <span>{item.link}</span></li>)}</ul> : null}
        </li>)}</ul>
    ));
}

export default inject('prematchesStore')(observer(Qwe));