import { Schema, model } from "mongoose";

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        unique: true,
        index: true
    },
    rol: {
        type: String,
        default: "User"
    },
    documents: {
        type: Object,
        default: []
    },
    last_connection: {
        type: Date
    }
})

export const userModel = model("users", userSchema)