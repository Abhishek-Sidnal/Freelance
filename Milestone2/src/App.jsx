import React from 'react'
import GeoSelector from './components/GeoSelector'
import TableComponent from './components/TableComponent'
import { GeoProvider } from './context/GeoContext'

const App = () => {
  return (
    <div>
      <GeoProvider >
        <TableComponent />
        {/* <GeoSelector /> */}
      </GeoProvider>
      {/* <Geo2 regions={regions} /> */}
    </div>
  )
}

export default App