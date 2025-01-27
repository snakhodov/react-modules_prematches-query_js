import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import Prematches from "./prematches.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Prematches/>
    </StrictMode>,
)
