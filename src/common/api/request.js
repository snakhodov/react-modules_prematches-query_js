import { apiConfig } from './config';

const isDev = window.location.hostname === 'localhost';

export const apiRequest = async ({ url, body }) => {
    let errorCode = 0;
    const config = {
        options: {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            credentials: isDev ? 'include' : 'same-origin',
            method: 'POST',
            body: JSON.stringify(body),
        },
        url: apiConfig[url],
    };

    try {
        const response = await fetch(config.url, { ...config.options });
        const data = await response.json();

        if (data.error) {
            errorCode = Number(data.error);
            throw new Error(`API: code: ${data.error}, message: ${data.errorText}`);
        }
        return {
            error: false,
            message: 'Success!',
            data: data.data || data,
        };
    } catch (error) {
        return {
            error: true,
            code: errorCode,
            message: error.message,
        };
    }
};
