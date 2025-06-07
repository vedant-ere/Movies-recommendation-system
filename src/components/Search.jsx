import React from 'react'

const Search = ({term, setSeachTerm}) => {
  return (
    <div   className='search'>
        <div>
            <img src="Vector.svg" alt="search" />
            <input
                type="text"
                placeholder='Search for thousands of movies'
                value={term}
                onChange={(e) => {
                    setSeachTerm(e.target.value)
                }}
             />
        </div>
    </div>
  )
}

export default Search
