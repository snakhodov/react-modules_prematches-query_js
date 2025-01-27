import { apiConfig } from './config';

const isDev = window.location.hostname === 'localhost';

const methods = {
    get: 'GET',
    post: 'POST',
    put: 'PUT',
    delete: 'DELETE',
};

const headers = {
    'Content-Type': 'application/json',
};

/**
 * @file Returns the object with message from response of the API request.
 * @interface Response {error: boolean, code: number, message: string}
 * @param {string} {url - name of the request.
 * @param {object} [body] - body of the request.
 * @param {string} [slug] - slug of the request, like .../api/.../{slug}
 * @param {string} method - method of the request like 'get', 'post', 'put', 'delete'.
 * @param {object} params} - additional params of the request, like { param1: val1, param2: val2 }.
 * @returns {Response}
 */
export const apiRequest = async ({ url, body, formData, params, slug, method }) => {
    const getParams = params ? '?' + new URLSearchParams(params).toString() : '';
    let errorCode = 0;
    const config = {
        options: {
            headers: formData ? {} : headers,
            credentials: isDev ? 'include' : 'same-origin',
            method: methods[method],
        },
        url: getParams.length ? apiConfig[url] + getParams : Boolean(slug) ? apiConfig[url] + '/' + slug : apiConfig[url],
    };

    if (config.options.method === methods.post && body) {
        config.options.body = JSON.stringify(body);
    }

    if (config.options.method === methods.post && formData) {
        config.options.body = formData;
    }

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

export const dxRequest = async ({ skip, take, requireTotalCount, sort, userId }) => {
    const queryParams = {
        skip: skip || 0,
        take: take || 100,
        requireTotalCount: requireTotalCount === undefined ? true : requireTotalCount,
        sort,
        userId,
        _: Date.now(),
    };

    console.info('dxRequest queryParams: ', queryParams);

}
