import {QueryClient, QueryClientProvider} from "react-query";
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import {PrematchesQuery} from "./components/prematches-query.jsx";


const queryClient = new QueryClient();

function Prematches() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/sport" element={<PrematchesQuery children={children}/>}/>
                    <Route path="/sport/:branchId" element={<PrematchesQuery children={children}/>}/>
                    <Route path="/sport/:branchId/:sportId" element={<PrematchesQuery children={children}/>}/>
                    <Route path="/sport/:branchId/:sportId/:categoryId"
                           element={<PrematchesQuery children={children}/>}/>
                    <Route path="/sport/:branchId/:sportId/:categoryId/:tournamentId"
                           element={<PrematchesQuery children={children}/>}/>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    )
}

export default Prematches;