import mongoose,{Schema,Document} from "mongoose"



//interface+schema for message
export interface Message extends Document{
    content : string;
    createdAt:Date;
}
const MessageSchema: Schema<Message>= new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now

    }
})

//interface+schema for user
export interface User extends Document{
    username: string;
    email: string;
    password: string; 
    verifyCode: string;
    verifyCodeExpiry: Date; 
    isVerified:boolean;
    isAcceptingMessage: boolean;
    messages:Message[]
}

const UserSchema:Schema<User>= new Schema({
    username:{
        type:String,
        required:[true,"Username is required"],
        trim:true, 
        unique:true
    },

    email:{
        type:String,
        required:[true,"Username is required"],
        unique:true,
        match:[/.+\@.+\..+/,"please provide valid email address"]
    },
    password:{
        type:String,
        required:[true,"Password is required"],
    },
    verifyCode:{
        type:String,
        required:[true,"Verify code is required"],
        default:null,
    },   
    verifyCodeExpiry:{
        type:Date,
        required:[true,"Verify Code  Expiry is required"],
        default:null,
    }, 






    isVerified:{
        type:Boolean,
        default:false 
    },
    isAcceptingMessage:{
        type:Boolean,
        default:false
    }, 
    messages:[MessageSchema]    
})

const UserModel = (mongoose.models.User as mongoose.Model<User>)
 || mongoose.model<User>("User", UserSchema);

 export default UserModel;