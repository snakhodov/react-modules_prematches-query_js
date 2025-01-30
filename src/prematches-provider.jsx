import React from 'react';
import {Provider} from 'mobx-react';
import initStore from './store';

import './App.css';
import {StoreProviderComponent} from "./store-provider.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Qwe from "./components/prematches-query.jsx";


const prematchesStore = initStore();
export const PrematchesProvider = ({markUp}) => {
    return <Provider prematchesStore={prematchesStore}>
        <StoreProviderComponent markUp={markUp} />
        {/*<BrowserRouter*/}
        {/*    future={{*/}
        {/*        v7_startTransition: true,*/}
        {/*        v7_relativeSplatPath: true,*/}
        {/*    }}*/}
        {/*>*/}
        {/*    <Routes>*/}
        {/*        <Route path="/" element={<Qwe/>}/>*/}
        {/*        <Route path="/pre" element={<Qwe/>}/>*/}
        {/*        <Route path="/pre/:branchId" element={<Qwe/>}/>*/}
        {/*        <Route path="/pre/:branchId/:sportId" element={<Qwe/>}/>*/}
        {/*        <Route path="/pre/:branchId/:sportId/:categoryId"*/}
        {/*               element={<Qwe/>}/>*/}
        {/*        <Route path="/pre/:branchId/:sportId/:categoryId/:tournamentId"*/}
        {/*               element={<Qwe/>}/>*/}
        {/*        <Route path="/pre/:branchId/:sportId/:categoryId/:tournamentId/:matchId"*/}
        {/*               element={<Qwe/>}/>*/}
        {/*        <Route path="*" element={<Qwe/>}/>*/}
        {/*    </Routes>*/}
        {/*</BrowserRouter>*/}
    </Provider>
};