const { User, Thought } = require('../models');

module.exports = {
    //allows you to get all users, associated friend and thought ids
    getUsers(req, res){
        User.find()
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err))
    },
    //allows you to get a single user with the correct id
    getSingleUser(req, res){
        User.findOne({ _id: req.params.userId} )
            .select('-__v')
            .then((user) => {
                !user ? res.status(400).json({ message: 'no users with this id' }) : res.json(user)

            })
            .catch((err) => res.status(500).json(err))
    },
    //allows you to create new users
    createUser(req, res){
        User.create(req.body)
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => res.status(500).json(err))
    },
    //allows you to update users based on id
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
    //allows you to delete users based on id
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
    // allows you to add friends to a user based on id
    addUserFriend(req, res){
        User.findByIdAndUpdate(
            { _id: req.params.userId},
            { $addToSet: { friends: req.friendId }},
            { runValidators: true, new: true}
        )
            .then((user) => !user ? res.status(400).json({ message: 'no users with this id' }) : res.json(user))
            .catch((err) => res.status(500).json(err))
    },
    //allows you to delete a user based on id
    removeUserFriend(req, res){
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.friendId }},
            { runValidators: true, new: true}
        )
            .then((user) => !user ? res.status(400).json({ message: 'no users with this id' }) : res.json(user))
            .catch((err) => res.status(500).json(err))
    },
};