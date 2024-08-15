import React from 'react'
import UserCard from './UserCard'
import axios from 'axios'

const SearchResults = ({ users }) => {
    //console.log("users: ", users);

    return (
        <div className='bg-white p-4 rounded-lg shadow-md'>
            {users.length > 0 ? (
                <h1 className="text-xl font-bold mb-4 text-gray-800">Search Results</h1>
            ) : (
                <h1 className="text-xl font-bold mb-4 text-gray-800">No User Found</h1>
            )}
            <div className="flex flex-col gap-4">
                {users.map((u) => (
                    <UserCard 
                        key={u.id} 
                        curruser={u} 
                        className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer shadow-sm"
                    />
                ))}
            </div>
        </div>
    )
}

export default SearchResults;
