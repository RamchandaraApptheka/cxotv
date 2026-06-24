"use client"

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import SearchNews from '../../components/SearchNews';
import { setSearchTerm, fetchSearchResults } from '../../../../redux/slices/searchSlice'; // Adjust path as needed

export default function SearchPage() {
    const params = useParams();
    const dispatch = useDispatch();
    const [originalSearchTerm, setOriginalSearchTerm] = useState('');

    useEffect(() => {
        if (params.searchTerm) {
            // First try to get the original term from session storage
            let searchTerm = sessionStorage.getItem("searchTerm");

            // If not found in session storage, convert slug back to spaces
            if (!searchTerm) {
                searchTerm = params.searchTerm.replace(/-+/g, ' ');
            }

            setOriginalSearchTerm(searchTerm);

            // Dispatch the original search term to Redux
            dispatch(setSearchTerm(searchTerm));

            // Fetch search results using the original search term
            dispatch(fetchSearchResults(searchTerm));
        }
    }, [params.searchTerm, dispatch]);

    return <SearchNews searchTerm={originalSearchTerm} />;
}