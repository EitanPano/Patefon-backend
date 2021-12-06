const stationService = require('./station.service.js');
const logger = require('../../services/logger.service')

// GET LIST
async function getstations(req, res) {
  try {
    var queryParams = req.query;
    const stations = await stationService.query(queryParams)
    res.json(stations);
  } catch (err) {
    logger.error('Failed to get stations', err)
    res.status(500).send({ err: 'Failed to get stations' })
  }
}

// GET BY ID 
async function getstationById(req, res) {
  try {
    const stationId = req.params.id;
    const station = await stationService.getById(stationId)
    res.json(station)
  } catch (err) {
    logger.error('Failed to get station', err)
    res.status(500).send({ err: 'Failed to get station' })
  }
}

// POST (add station)
async function addstation(req, res) {
  try {
    const station = req.body;
    const addedstation = await stationService.add(station)
    res.json(addedstation)
    console.log('addeded station',addedstation)
  } catch (err) {
    logger.error('Failed to add station', err)
    res.status(500).send({ err: 'Failed to add station' })
  }
}

// PUT (Update station)
async function updatestation(req, res) {
  try {
    const station = req.body;
    const updatedstation = await stationService.update(station)
    res.json(updatedstation)
  } catch (err) {
    logger.error('Failed to update station', err)
    res.status(500).send({ err: 'Failed to update station' })

  }
}

// DELETE (Remove station)
async function removestation(req, res) {
  try {
    const stationId = req.params.id;
    const removedId = await stationService.remove(stationId)
    console.log('removedId', removedId);
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove station', err)
    res.status(500).send({ err: 'Failed to remove station' })
  }
}

module.exports = {
  getstations,
  getstationById,
  addstation,
  updatestation,
  removestation
}
