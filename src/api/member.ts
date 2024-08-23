import { AuthAxios } from "./auth";
import Axios from ".";

interface ReportInterface {
    targetMemberId: number;
    reportTypeIdList: number[];
    contents: string;
}

export const getOtherProfile= async (id:number) => {
    const endpoint = '/v1/member/profile/other';
    try {
        const response = await AuthAxios.get(endpoint, {
            params: { id },
          });
      console.log("다른 유저 프로필 조회 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error("다른 유저 프로필 조회 실패:", error);
      throw error;
    }
  };

/* 차단하기 */
export const blockMember = async (memberId: number) => {
    try {
        const response = await Axios.post(`/v1/member/block/${memberId}`);
        console.log("차단 성공:", response.data);
        return response.data;
    } catch (error) {
        console.error("차단 실패:", error);
        throw error;
    }
};

/* 차단 해제 */
export const unblockMember = async (memberId: number) => {
    try {
        const response = await Axios.delete(`/v1/member/block/${memberId}`);
        console.log("차단 해제 성공:", response.data);
        return response.data;
    } catch (error) {
        console.error("차단 해제 실패:", error);
        throw error;
    }
};

/* 신고하기 */
export const reportMember = async (params: ReportInterface) => {
    try {
        const response = await Axios.post("/v1/reports", params);
        console.log("신고 성공:", response.data);
        return response.data;
    } catch (error) {
        console.error("신고 실패:", error);
        throw error;
    }
};
