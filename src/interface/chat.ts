export interface ChatroomList {
    blocked: boolean;
    chatroomId: number;
    friend: boolean;
    friendRequestMemberId: number;
    uuid: string;
    targetMemberId: number;
    targetMemberImg: number;
    targetMemberName: string;
    lastMsg: string;
    lastMsgAt: string;
    notReadMsgCnt: number;
}

export interface SystemMessage {
    senderId: number;
    senderName: string;
    senderProfileImg: number;
    message: string;
    createdAt: string;
    timestamp: number;
    boardId: number;
    chatroomUuid: string;
}

export interface DesignedSystemMessage {
    senderId: number;
    senderName: string;
    senderProfileImg: number;
    message: string;
    createdAt: null;
    timestamp: null;
    boardId: number;
}

export interface ChatMessageDto {
    senderId: number;
    senderName: string;
    senderProfileImg: number;
    message: string;
    createdAt: string;
    timestamp: number;
    boardId?: number;
}

export interface ChatMessageList {
    chatMessageDtoList: ChatMessageDto[] | [];
    list_size: number;
    has_next: boolean;
    next_cursor: number | null;
}

interface System {
    flag: number;
    boardId: number;
}

export interface ChatContent {
    blind: boolean;
    blocked: boolean;
    chatMessageList: ChatMessageList;
    friend: boolean;
    friendRequestMemberId: number;
    gameName: string;
    memberId: number;
    memberProfileImg: number;
    system: System | null;
    uuid: string;
}

export interface Chat {
    uuid: string;
    memberId: number;
    gameName: string;
    memberProfileImg: number;
    friend: boolean;
    blocked: boolean;
    friendRequestMemberId: number;
    system?: SystemMessage | null;
    senderId?: number;
    senderName?: string;
    senderProfileImg?: number;
    message?: string;
    createdAt?: string;
    timestamp?: number;
    chatMessageList: ChatMessageList;
}

export interface FriendsList {
    memberId: number;
    name: string;
    memberProfileImg: number;
    liked: boolean;
}

export interface UnreadResponse {
    code: string;
    isSuccess: boolean;
    message: string;
    result: string[];
}