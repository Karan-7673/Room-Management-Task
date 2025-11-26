import axios from 'axios';
import { API_BASE, API_CREDENTIALS } from '../config/constants';

const instance = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000
});

function withCreds(payload = {}) {
    return { ...API_CREDENTIALS, ...payload };
}

export async function getRoomList() {
    const body = withCreds();
    const res = await instance.post('get_room_list_demo.php', body);
    return res.data?.result?.rooms ?? [];
}

export async function getDeletedRoomList() {
    const body = withCreds();
    const res = await instance.post('get_room_list_deleted_demo.php', body);
    return res.data?.result?.deleted_rooms ?? [];
}

export async function saveRoom(payload) {
    const body = withCreds(payload);
    const res = await instance.post('save_room_demo.php', body);
    return res.data;
}
