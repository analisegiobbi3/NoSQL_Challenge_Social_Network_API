const { Schema, model } = require('mongoose');

const userSchema = new Schema (
    {
        username: {
            type: String,
            require: true,            
            unique: true,
            trimmed: true,

        },
        email: {
            type: String,
            require: true,
            unique: true,
            trimmed: true,

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