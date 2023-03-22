const { User, Thought } = require('../models');

module.exports = {
    getUsers(req, res){
        User.find()
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err))
    },
    getSingleUser(req, res){
        User.findOne({ _id: req.params.userId} )
            .select('-__v')
            .then((user) => {
                !user ? res.status(400).json({ message: 'no users with this id' }) : res.json(user)

            })
            .catch((err) => res.status(500).json(err))
    },
    createUser(req, res){
        User.create(req.body)
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => res.status(500).json(err))
    },
    updateUser(req, res){
        User.findByIdAndUpdate(
            { _id:  req.params.userId },
            { $set: req.body},
            { runValidators: true, new: true}
        )
            .then((user) => 
                !user ? res.status(400).json({ message: 'no users with this id' }) : res.json(user)
            )
            .catch((err) => res.status(500).json(err))
    },
    deleteUser(req, res){
        User.findByIdAndDelete({ _id: req.params.userId })
        .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: 'User and associated thoughts have been deleted' }))
      .catch((err) => res.status(500).json(err))
    },
    addUserFriend(req, res){
        User.findByIdAndUpdate(
            { _id: req.params.friendId},
            { $addToSet: { friends: req.body }},
            { runValidators: true, new: true}
        )
            .then((user) => !user ? res.status(400).json({ message: 'no users with this id' }) : res.json(user))
            .catch((err) => res.status(500).json(err))
    },
    removeUserFriend(req, res){
        User.findOneAndUpdate(
            { _id: req.params.friendId},
            { $addToSet: { friends: req.body }},
            { runValidators: true, new: true}
        )
            .then((user) => !user ? res.status(400).json({ message: 'no users with this id' }) : res.json(user))
            .catch((err) => res.status(500).json(err))
    },
};