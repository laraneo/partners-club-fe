import SecureStorage from "../config/SecureStorage";

interface HeadersData {
  [key:string]: string;
}

export default function headers(type: string = '') {
    const items: HeadersData = { 'Content-Type': `${type === 'form' ? 'multipart/form-data' : 'application/json'}` };
    const token = SecureStorage.getItem('token');
    if (token) {
      items.Authorization = `Bearer ${token}`;
    }
    return items;
  }
  