import axios from 'axios';

export interface MessageRecord {
  id: string;
  type: string;
  title: string;
  subTitle: string;
  avatar?: string;
  content: string;
  time: string;
  status: 0 | 1;
  messageType?: number;
}

export type MessageListType = MessageRecord[];

export function queryMessageList() {
  return axios.get<MessageListType>('/api/settings/message/query');
}

interface MessageStatus {
  ids: string[];
}

export function setMessageStatus(data: MessageStatus) {
  return axios.post<MessageListType>('/api/settings/message/read', data);
}

export interface ChatRecord {
  id: number;
  username: string;
  content: string;
  time: string;
  isCollect: boolean;
}

export function queryChatList() {
  return axios.post<ChatRecord[]>('/api/chat/list');
}
