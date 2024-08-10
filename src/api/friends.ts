import Axios from ".";

let token = JSON.stringify(localStorage.getItem('refreshToken'));

const headers = {
    Authorization: `Bearer ${token}`
};

export const reqFriend = async (memberId: number) => {
    try {
        const response = await Axios.post(`/v1/friends/request/${memberId}`, { headers });
        console.log("친구 요청 완료:", response.data);
        return response.data;
    } catch (error) {
        console.error("친구 요청 실패:", error);
        throw error;
    }
};


export const deleteFriend = async (memberId: number) => {
    try {
        const response = await Axios.delete(`/v1/friends/${memberId}`);
        console.log("친구 삭제 완료:", response.data);
        return response.data;
    } catch (error) {
        console.error("친구 삭제 실패:", error);
        throw error;
    }
};