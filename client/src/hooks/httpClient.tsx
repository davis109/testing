const useHttpRequest = () => {
    //@ts-ignore
    const sendRequest = async (URI, config = {}) => {
        try {
            const endpoint = import.meta.env.VITE_SERVER_ENDPOINT + URI;

            const response = await fetch(endpoint, {
                headers: {
                    "Content-Type": "application/json",
                    //@ts-ignore
                    ...config?.headers,
                    accept: "application/json",
                },
                credentials: "include",
                ...config,
            });
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`);
            }
            const data = await response.json();

            return { data };
        } catch (error) {
            return {
                error,
            };
        }
    };

    return sendRequest;
};

export { useHttpRequest };