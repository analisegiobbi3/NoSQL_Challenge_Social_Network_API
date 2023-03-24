const router = require('express').Router();
//all associated request scripts 
const {
    getThoughts,
    getSingleThought,
    createThought,
    updateThought,
    deleteThought,
    addThoughtReaction,
    removeThoughtResponse

} = require('../../controllers/thoughtsController')

router.route('/').get(getThoughts).post(createThought)
//routes and requests
router.route('/:thoughtId').get(getSingleThought).put(updateThought).delete(deleteThought)
router.route('/:thoughtId/reactions/').post(addThoughtReaction)

router.route('/:thoughtId/reactions/:reactionId').delete(removeThoughtResponse)

module.exports = router;