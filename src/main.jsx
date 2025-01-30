import {createRoot} from 'react-dom/client'
import { Provider } from 'mobx-react';
import './index.css'
import Prematches from "./prematches.jsx";
import initStore from './store';

const prematchesStore = initStore();

createRoot(document.getElementById('root')).render(
    <Provider prematchesStore={prematchesStore}>
        <Prematches/>
    </Provider>,
)
