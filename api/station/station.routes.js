const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getstations, getstationById, addstation, updatestation, removestation } = require('./station.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getstations)
router.get('/:id', getstationById)
router.post('/', addstation)
router.put('/:id', updatestation)
router.delete('/:id', removestation)

// router.post('/', requireAuth, requireAdmin, addstation)
// router.put('/:id', requireAuth, requireAdmin, updatestation)
// router.delete('/:id', requireAuth, requireAdmin, removestation)

module.exports = router