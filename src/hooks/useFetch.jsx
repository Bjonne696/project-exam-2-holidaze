import { useState, useEffect } from "react";

export const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error("Error fetching data");
                }

                const jsonData = await response.json();
                setData(jsonData.data); // Adjust here to set the actual data array
            } catch (error) {
                console.log(error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, isLoading, error };
};
