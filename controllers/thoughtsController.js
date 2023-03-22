const { Thought, User } = require('../models')

module.exports = {
    getThoughts(req, res){
        Thought.find()
            .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err))
    },
    getSingleThought(req, res){
        Thought.findOne({ _id: req.params.thoughtId })
            .then((thought) => 
                !thought ? res.status(400).json({ message: "no thoughts associated with this id" }) : res.json(thought)
            )
            .catch((err) => res.status(500).json(err))
    },
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