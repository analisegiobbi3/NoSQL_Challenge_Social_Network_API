const { Schema, model } = require('mongoose');
//user schema 
const userSchema = new Schema (
    {
        username: {
            type: String,
            required: true,            
            unique: true,
            trim: true,

        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/.+@.+\..+/],

        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought'
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Users'
            }
        ]
    },
    {
        toJSON: {
            virtuals: true, 
        },
        id: true,
    }
);

userSchema
    .virtual('friendCount')
    .get(function() {
        return this.friends.length
    })



const User = model('user', userSchema)
module.exports = User;