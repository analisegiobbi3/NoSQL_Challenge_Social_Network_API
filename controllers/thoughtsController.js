const { Thought, User } = require('../models')

module.exports = {
    //Gets all thoughts that have been posted and their associated users, friends, and reactions
    getThoughts(req, res){
        Thought.find()
            .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err))
    },
    //gets one single thought based on id
    getSingleThought(req, res){
        Thought.findOne({ _id: req.params.thoughtId })
            .then((thought) => 
                !thought ? res.status(400).json({ message: "no thoughts associated with this id" }) : res.json(thought)
            )
            .catch((err) => res.status(500).json(err))
    },
    //allows users to post new thoughts to specific users
    createThought(req, res){
        Thought.create(req.body)
            .then((thought) =>{
                return User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $addToSet: { thoughts: thought._id }},
                    { new: true }
                );
            })
            .then((user) =>  !user ? res.status(404).json({ message: 'Thought created, but found no user with that ID'}) : res.json('Created the Thought 🎉')
        )
        .catch((err) => res.status(500).json(err))
    },
    // allows users to update thoughts using the thought id
    updateThought(req, res){
        Thought.findByIdAndUpdate(
            { _id:  req.params.thoughtId },
            { $set: req.body},
            { runValidators: true, new: true}
        )
            .then((thought) => 
                !thought ? res.status(400).json({ message: 'no thoughts with this id' }) : res.json(thought)
            )
            .catch((err) => res.status(500).json(err))
    }, 
    //allows users to delete thoughts using the thought id
    deleteThought(req, res){
        Thought.findOneAndRemove({ _id: req.params.thoughtId })
            .then((thought) => 
                !thought ? res.status(400).json({ message: "no thoughts with this id" }) : User.findOneAndUpdate(
                    { thoughts: req.params.thoughtId },
                    { $pull: { thoughts: req.params.thoughtId }},
                    { new: true }
                )
            )
            .then((user) =>
                !user ? res.status(400).json({ message: "thought deleted but no user with this id" }) : res.json({ message: 'Thought successfully deleted!' })
            )
            .catch((err) => res.status(500).json(err))
    },
    //allows users to add reactions using the thought id
    addThoughtReaction(req, res){
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body }},
            { runValidators: true, new: true}
        )
        .then((thought) =>
            !thought ? res.status(400).json({ message: 'no thoughts with this id' }) : res.json(thought)
        )
        .catch((err) => res.status(500).json(err))
    },
    //allows users to remove responses using the thought id and teh response id
    removeThoughtResponse(req, res){
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } }},
            { runValidators: true, new: true}
        )
        .then((thought) =>
            !thought ? res.status(400).json({ message: 'no thoughts with this id' }) : res.json(thought)
        )
        .catch((err) => res.status(500).json(err))
    },
}