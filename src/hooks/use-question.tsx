import React from 'react';
import { BackendApi } from '@/lib/api';
import { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios to check error types

export default function useQuestion() {
    const [question, setQuestion] = useState("");

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const { data } = await BackendApi.get('/question');
                console.log('data', data);
                setQuestion(data.code); // Set the fetched data to state
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    // Handle Axios-specific errors
                    if (err.code === 'ERR_NETWORK') {
                        console.error('Network Error: Could not connect to the server.', err);
                        // You might want to set an error state or display a user-friendly message
                    } else if (err.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        console.error('Server Error:', err.response.status, err.response.data);
                    } else if (err.request) {
                        // The request was made but no response was received
                        console.error('No response received from the server.', err.request);
                    } else {
                        // Something happened in setting up the request
                        console.error('Error setting up the request:', err.message);
                    }
                } else {
                    // Handle non-Axios errors
                    console.error('An unexpected error occurred:', err);
                }
            }
        };
        fetchQuestion();
    }, []); // Removed `question` from dependency array to prevent infinite loop

    return { question };
}
