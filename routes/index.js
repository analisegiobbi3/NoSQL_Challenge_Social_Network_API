const router = require('express').Router();
const apiRoutes = require('./api')

router.get('/api', apiRoutes)
router.use((req, res) => res.send('Wrong Route!'))

module.exports = router;