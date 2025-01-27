
import {QueryClient, QueryClientProvider} from "react-query";

import {BrowserRouter, Route, Routes} from 'react-router-dom';

import './App.css';
import {PrematchMenuMarkup} from "./components/prematch-menu-markup.jsx";


const queryClient = new QueryClient();
// const root = createRoot(document.getElementById("root"));

function PrematchesQuery() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Main />}/>
                    <Route path="/sport" element={<PrematchMenuMarkup />} />
                    <Route path="/sport/:branchId" element={<PrematchMenuMarkup />} />
                    <Route path="*" element={<Main />}/>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    )
}

export default PrematchesQuery;