import React from 'react'

const THead = ({ tHeader }) => {
    return (
        <>
            {tHeader.map((thead) => (
                <th key={thead} > {thead} </th>
            ))
            }
        </>
    )
}

export default THead