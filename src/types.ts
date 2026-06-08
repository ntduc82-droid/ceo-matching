export interface Member {
  id: string;
  fullName: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  bio: string;
  skills: string[];
  interests: string[];
  avatar: string;
  status: 'active' | 'inactive' | 'busy';
  joinedDate: string;
  location: string;
}

export interface Connection {
  id: string;
  fromId: string;
  toId: string;
  status: 'pending' | 'connected' | 'declined';
  message?: string;
  timestamp: string;
}

export interface Message {
  id: string;
  connectionId: string;
  senderId: string;
  text: string;
  timestamp: string;
}
