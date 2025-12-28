import axios from "axios";
import type { LoginResponse, Priority, Status, Ticket, User,Comment, RegisterResponse} from "../models";


const api_base_url = "http://localhost:4000";
/*--------------   users  -------------- */
 export const getUsers=async(token:string): Promise<User[]>=>{
    const data = await axios.get(`${api_base_url}/users`,{
        headers: { Authorization: `Bearer ${token}` }
    });
    return data.data;
}

/*--------------   auth   ---------------*/

export const getToken = async ( email:string, password :string ) : Promise<LoginResponse> => {

    const data = await axios.post(`${api_base_url}/auth/login`, {
        email,
        password
    });
    return data.data;
};

export const registerUser = async ( name:string, email:string, password :string ):Promise<RegisterResponse> => {
    const data = await axios.post(`${api_base_url}/auth/register`, {
        name,       
        email,
        password, 
    });
    return data.data;                
};

export const getMe=async(token:string): Promise<User>=>{
    const data = await axios.get(`${api_base_url}/auth/me`,{
        headers: {Authorization: `Bearer ${token}`}
    });
    return data.data;
};

/*--------------   tickets   ---------------*/

export const getTickets = async (token: string) : Promise<Ticket[]> => {
    const data = await axios.get(`${api_base_url}/tickets`,{
        headers: {  Authorization: `Bearer ${token}`}
    });
    return data.data;
};

export const newTicket = async (subject:string,description:string,priority_id:number,token:string): Promise<Ticket> => {
    const data = await axios.post(`${api_base_url}/tickets`,
    {
        subject,
        description,
        priority_id
    },{
        headers: { Authorization: `Bearer ${token}` }
    });
    return data.data;
}
export const getTicketById = async (id: string, token: string) : Promise<Ticket> => {
    const data = await axios.get(`${api_base_url}/tickets/${id}`,{
        headers: { Authorization: `Bearer ${token}` }
    });
    return data.data;
}
export const assignTo =async(id:string,assigned_to:number,token:string): Promise<Ticket>=>{
    const data = await axios.patch(`${api_base_url}/tickets/${id}`,
    { assigned_to },{
        headers: { Authorization: `Bearer ${token}` }   
    });
    return data.data;
}
export const changeTicketStatus = async (id: string, status_id: number, token: string) : Promise<Ticket> => {
    const data = await axios.patch(`${api_base_url}/tickets/${id}`,
    { status_id },
    {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data.data;
}  
export const changeTicketSPriorities = async (id: string, priority_id: number, token: string) : Promise<Ticket> => {
    const data = await axios.patch(`${api_base_url}/tickets/${id}`,
    { priority_id },{
           headers: {Authorization: `Bearer ${token}`}
    });
    return data.data;
};

export const addCommentToTicket = async (id: string, content: string, token: string): Promise<Comment> => {  
    const data = await axios.post(`${api_base_url}/tickets/${id}/comments`, 
    { content: content },
    { 
          headers: { Authorization: `Bearer ${token}` }
    });
    return data.data;
}
export const getComments=async(id:string,token:string): Promise<Comment[]>=>{
    const data = await axios.get(`${api_base_url}/tickets/${id}/comments`,{
        headers: { Authorization: `Bearer ${token}` }
    });
    return data.data;
}

/*--------------   statuses   ---------------*/
export const getStatuses=async(token:string): Promise<Status[]>=>{
    const data = await axios.get(`${api_base_url}/statuses`,{
        headers: { Authorization: `Bearer ${token}` }
    });
    return data.data;
}

export const newStatuses=async(name:string,token:string): Promise<Status>=>{
    const data = await axios.post(`${api_base_url}/statuses`,
    {name},{
        headers: { Authorization: `Bearer ${token}` }
    });
    return data.data;
}
/*--------------   priorities   ---------------*/

 export const getPriorities=async(token:string): Promise<Priority[]>=>{
    const data = await axios.get(`${api_base_url}/priorities`,{
        headers: { Authorization: `Bearer ${token}` }
    });
    return data.data;
};

export const newPriorities=async(name:string,token:string): Promise<Priority>=>{
    const data = await axios.post(`${api_base_url}/priorities`,
    {name},{
        headers: { Authorization: `Bearer ${token}` }
    });
    return data.data;
};



