import {z} from "zod";

export const messageSchema= z.object({
    content : z
    .string()
    .min(10,{message:'Content must be at least of 10 characters'})
    .max(300,{message:"Sorry ! you have reached the limit of 300 character "})
    

})