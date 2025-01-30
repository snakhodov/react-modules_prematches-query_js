import React from 'react';
import {inject, observer, Provider} from 'mobx-react';
import initStore from './store';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Qwe from './components/prematches-query.jsx';

import './App.css';


// function Prematches({prematchesStore: {activeBranch, activeItems}}) {
//     // const [isLoading, setLoading] = useState(true);
//
//     return <BrowserRouter
//         future={{
//             v7_startTransition: true,
//             v7_relativeSplatPath: true,
//         }}
//     >
//         <Routes>
//             <Route path="/" element={<Qwe loading={activeBranch.initialFetching}/>}/>
//             <Route path="/sport" element={<Qwe loading={activeBranch.initialFetching}/>}/>
//             <Route path="/sport/:branchId" element={<Qwe loading={activeBranch.initialFetching}/>}/>
//             <Route path="/sport/:branchId/:sportId" element={<Qwe loading={activeBranch.initialFetching}/>}/>
//             <Route path="/sport/:branchId/:sportId/:categoryId" element={<Qwe loading={activeBranch.initialFetching}/>}/>
//             <Route path="/sport/:branchId/:sportId/:categoryId/:tournamentId" element={<Qwe loading={activeBranch.initialFetching}/>}/>
//             <Route path="/sport/:branchId/:sportId/:categoryId/:tournamentId/:matchId" element={<Qwe loading={activeBranch.initialFetching}/>}/>
//             <Route path="*" element={<Qwe loading={activeBranch.initialFetching}/>}/>
//         </Routes>
//     </BrowserRouter>;
// }



const prematchesStore = initStore();
const Prematches = ({children}) => {
    return <Provider prematchesStore={prematchesStore}>{children}</Provider>
};

export default inject('prematchesStore')(observer(Prematches));