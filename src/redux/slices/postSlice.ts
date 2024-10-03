import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MemberPost } from '@/interface/board';

export interface PostUpdate {
    boardId?: number;
    memberId?: number;
    profileImage?: number;
    gameName?: string;
    tag?: string;
    tier?: string;
    rank?: number;
    contents?: string;
    createdAt?: string;
}

interface SetCurrentPostPayload {
    currentPost: MemberPost;
    currentPostId: number;
}

interface UpdateCurrentPostPayload {
    currentPostId: number;
    updates: Partial<MemberPost>;
}

interface PostState {
    currentPost: MemberPost | null;
    currentPostId: number | null;
}

const initialState: PostState = {
    currentPost: null,
    currentPostId: null,
};

const postSlice = createSlice({
    name: 'postSlice',
    initialState,
    reducers: {
        setCurrentPost(state, action: PayloadAction<SetCurrentPostPayload>) {
            state.currentPost = action.payload.currentPost;
            state.currentPostId = action.payload.currentPostId;
        },
        updateCurrentPost(state, action: PayloadAction<UpdateCurrentPostPayload>) {
            if (state.currentPostId === action.payload.currentPostId && state.currentPost) {
                state.currentPost = {
                    ...state.currentPost,
                    ...action.payload.updates,
                } as MemberPost;
            }
        },
        clearCurrentPost(state) {
            state.currentPost = null;
            state.currentPostId = null;
        },
    },
});

export const { setCurrentPost, updateCurrentPost, clearCurrentPost } = postSlice.actions;
export default postSlice.reducer;