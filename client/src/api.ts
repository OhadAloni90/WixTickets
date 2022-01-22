import axios from 'axios';
import {APIRootPath} from '@fed-exam/config';

export type Ticket = {
    id: string,
    title: string;
    content: string;
    creationTime: number;
    userEmail: string;
    labels?: string[];
    isHidden: boolean,
    isFav: boolean
}
export type TicketResponse = {
    ticketPage: Ticket[], 
    numberOfPages: number, 
    pageNumber: number
}
export type ApiClient = {
    getTickets: (search: string, page: number) => Promise<TicketResponse>;
}


export const createApiClient = (): ApiClient => {
    return {
        getTickets: (search: string, page: number) => {
            return axios.get(APIRootPath, {params: {search: search, page: page}}).then((res) => res.data);
        }
    }
}
