export interface Message{
    _id: string;
    senderId: string;
    receiverId: string;
    text: string;
    timestamp: Date;
}

export interface newMessagePayload {
    lastMessage: {
        text: string;
        timestamp: Date;
        isSentByMe: boolean;
    };
    participant: {
        _id: string;
        firstName: string;
        surname: string;
        avatar: string;
    };
    senderId: string;
    receiverId: string;
}