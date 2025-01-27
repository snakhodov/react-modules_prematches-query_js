import {QueryClient, QueryClientProvider} from "react-query";
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import {PrematchesQuery} from "./components/prematches-query.jsx";

import './App.css';


const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/sport" element={<PrematchesQuery />} />
                    <Route path="/sport/:branchId" element={<PrematchesQuery />} />
                    <Route path="/sport/:branchId/:sportId" element={<PrematchesQuery />} />
                    <Route path="*" element={<Main />}/>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    )
}

export default App;