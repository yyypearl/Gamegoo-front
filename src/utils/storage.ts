/* 토큰 저장 */
export const setToken = (accessToken: string, refreshToken: string, autoLogin: boolean) => {
    if (autoLogin) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    } else {
        sessionStorage.setItem('accessToken', accessToken);
        sessionStorage.setItem('refreshToken', refreshToken);
    }
};

/* 토큰 사용 */
export const getAccessToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    }
    return null;
};

export const getRefreshToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
    }
    return null;
};

/* 토큰 제거 */
export const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
};
