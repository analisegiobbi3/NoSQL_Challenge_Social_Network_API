const { Schema, model } = require('mongoose');
const Reaction  = require('./Reaction')

const thoughtSchema = new Schema(
    {
        thoughtText:{
            type: String,
            require: true,
            minlength: 1,
            maxlength: 280,
        },
        createAt: {
            type: Date,
            default: Date.now,
        },
        username: {
            type: String,
            require: true,
        },
        reactions: [Reaction],
    },
    {
        toJSON:{
            virtuals: true
        },
        id: true
    }
)

thoughtSchema
    .virtual('reactionCount')
    .get(function(){
        return this.reactions.length
    })

const Thought  = model('thought', thoughtSchema)
module.exports = thoughtSchema;