import React from 'react'
import { FilterProvider } from './context/FilterContext'
import FilterHeader from './FilterC'
import Footer from './Footer'
import './Table.scss'

const Report = () => {
    return (
        <div className="main">
            <FilterProvider>
                <FilterHeader />
            </FilterProvider>
            <Footer />
        </div>
    )
}

export default Report