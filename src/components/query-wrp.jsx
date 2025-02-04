
import {inject, observer} from "mobx-react";
import {NavLink, useParams} from "react-router-dom";
import {useEffect} from "react";

import './_prematch-menu.scss';


const qwe = {
    sport: 'categories',
    category: 'tournaments',
    // tournament: 'tournaments'
}

const MenuItem = (
    {
        storeItem,
        activeItems,
        storeItemName,
        fetching,
    }
) => {
    return (
        <>
            <li className={`prematch-menu__item prematch-menu__item--${storeItemName}`}>
                <NavLink to={storeItem.link} className="prematch-menu__item-link">
                    <span>{storeItem.name}</span>
                    <span className={`prematch-menu__item-count prematch-menu__item-count--${storeItemName}`}>
                        {storeItem.matchCount ?? ''}
                    </span>
                </NavLink>
            </li>
            { activeItems[`${storeItemName}Id`] === storeItem.id ?
                <ul>
                    { fetching ?
                        'horizontal loading'
                        :
                        storeItem[`${qwe[storeItemName]}List`]?.map(item => {
                            return <MenuItem
                                key={storeItemName + item.id}
                                storeItem={item}
                                activeItems={activeItems}
                                storeItemName={
                                    storeItemName === 'sport' ? 'category' : storeItemName === 'category' ? 'tournament' : ''
                                }
                                fetching={storeItem.initialFetching}
                            />
                        })
                    }
                </ul>
                : null
            }
        </>
    );
};

const QueryWrp = (
    {
        prematchesStore,
    }
) => {
    const
        sports = prematchesStore.activeTimeRange?.sportsList,
        activeItems = prematchesStore.activeItems,
        activeTimeRange = prematchesStore.activeTimeRange;

    let {timeRangeId, sportId, categoryId, tournamentId, matchId} = useParams();

    useEffect(() => {
        activeItems.setActiveItems({timeRangeId, sportId, categoryId, tournamentId, matchId})
    }, [timeRangeId, sportId, categoryId, tournamentId, matchId]);

    useEffect(() => {
        activeTimeRange?.getSports();
    }, [activeTimeRange]);

    return (
        <ul className="prematch-menu">
            {prematchesStore.activeTimeRange?.initialFetching ?
                'loading'
                :
                sports?.map(sport =>
                    <MenuItem
                        key={sport.id}
                        storeItem={sport}
                        activeItems={activeItems}
                        storeItemName="sport"
                        fetching={sport.initialFetching}
                    />
                )
            }
        </ul>
    );
};

export default inject('prematchesStore')(observer(QueryWrp));