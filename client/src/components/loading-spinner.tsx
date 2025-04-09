import React, { useCallback } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';


const LoadingSpinner: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();


    const request = useCallback(() => {
        // Check if there's already a guest login token
        const existingToken = localStorage.getItem('token');
        if (existingToken === 'guest-mock-token-123456') {
            // If this is a guest user, just navigate back to the home page
            navigate('/');
            return;
        }

        const queryParams = new URLSearchParams(location.search);
        const queryParamValue = queryParams.get('code');
        
        // If there's no code in the URL, redirect to login page
        if (!queryParamValue) {
            navigate('/login');
            return;
        }
        
        const postData = {
            code: queryParamValue,
        };


        console.log(postData)

        axios
            .post(`${import.meta.env.VITE_SERVER_ENDPOINT}/api/oauth/google`, postData)
            .then((response) => {
                const { token, userId } = response.data;
                localStorage.setItem('token', token)
                localStorage.setItem('userId', userId)

                navigate('/');

            })
            .catch((error) => {
                if (error.response) {
                    console.log(
                        'Server responded with an error status:',
                        error.response.status,
                    );
                    console.log('Response data:', error.response.data);
                }
                // On error, redirect to login page
                navigate('/login');
            });
    }, [location, navigate]);

    useEffect(() => {
        request();
    }, [request]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full border-t-4 border-black border-solid h-12 w-12"></div>
        </div>
    );
};

export default LoadingSpinner;