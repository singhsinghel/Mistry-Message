import { Message } from "@/model/User";
export interface ApiResponse{
    success:boolean,
    message:string,
    isAcceptingMessages?:boolean,  // '?' means optional
    messages?:Array<Message>   // messages is an array of type Message
}