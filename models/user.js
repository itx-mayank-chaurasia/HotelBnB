import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import passportLocalMongoos from 'passport-local-mongoose';

const userSchema = new Schema({
        email: {
        type: String,
        required: true
    },
});

userSchema.plugin(passportLocalMongoos);

export default mongoose.model("User", userSchema);