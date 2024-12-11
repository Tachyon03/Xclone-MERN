import mongoose from "mongoose";

const notificationSchema = mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ["follow", "like"]
    },
    read: {
        type: Boolean,
        default: false
    }
}, {Timestamp: true})

const notification = mongoose.model("Notification", notificationSchema)

export default notification;