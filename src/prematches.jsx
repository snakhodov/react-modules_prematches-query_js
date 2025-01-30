import {PrematchesProvider} from './prematches-provider.jsx'

const Prematches = ({children}) => {
    return <PrematchesProvider markUp={children}/>
}

export default Prematches;