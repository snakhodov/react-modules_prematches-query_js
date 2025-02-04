import React from 'react';
import {Provider} from 'mobx-react';
import initStore from './store';

import './App.css';
import {StoreProviderComponent} from "./store-provider.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Qwe from "./components/prematches-query.jsx";
import QueryWrp from "./components/query-wrp.jsx";


const prematchesStore = initStore();
export const PrematchesProvider = ({markUp}) => {
    return <Provider prematchesStore={prematchesStore}>
        {/*<StoreProviderComponent markUp={markUp} />*/}
        <BrowserRouter
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            <Routes>
                <Route path="/" element={<QueryWrp/>}/>
                <Route path="/pre" element={<QueryWrp/>}/>
                <Route path="/pre/:timeRangeId" element={<QueryWrp/>}/>
                <Route path="/pre/:timeRangeId/:sportId" element={<QueryWrp/>}/>
                <Route path="/pre/:timeRangeId/:sportId/:categoryId"
                       element={<QueryWrp/>}/>
                <Route path="/pre/:timeRangeId/:sportId/:categoryId/:tournamentId"
                       element={<QueryWrp/>}/>
                <Route path="/pre/:timeRangeId/:sportId/:categoryId/:tournamentId/:matchId"
                       element={<QueryWrp/>}/>
                <Route path="*" element={<QueryWrp/>}/>
            </Routes>
        </BrowserRouter>
    </Provider>
};