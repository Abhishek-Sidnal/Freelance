import Footer from "./components/Footer"
import FilterHeader from "./components/FilterC"
import { FilterProvider } from "./components/context/FilterContext"
function App() {

  return (
    <div className="main">
      <FilterProvider>
        <FilterHeader />
      </FilterProvider>
      <Footer />
    </div>
  )
}

export default App