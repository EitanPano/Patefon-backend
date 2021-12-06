const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy) {
    try {
        // console.log('filterBy', filterBy);
        const criteria = _buildCriteria(filterBy)
        const sortCriteria = {}
        if (filterBy.sort) {    
            if (filterBy.sort === 'Name') sortCriteria.name = 1
            else if (filterBy.sort === 'Price') sortCriteria.price = 1
            else sortCriteria.createAt = 1
        }
        // console.log('sortCriteria', sortCriteria);
        const collection = await dbService.getCollection('station')
        var stations = await collection.find(criteria).sort(sortCriteria).toArray()
        // console.log('stations', stations);
        return stations
    } catch (err) {
        logger.error('cannot find stations', err)
        throw err
    }
}

async function getById(stationId) {
    try {
        const collection = await dbService.getCollection('station')
        const station = collection.findOne({ '_id': ObjectId(stationId) })
        return station
    } catch (err) {
        logger.error(`while finding station ${stationId}`, err)
        throw err
    }
}

async function remove(stationId) {
    try {
       
        const collection = await dbService.getCollection('station')
        await collection.deleteOne({ '_id': ObjectId(stationId) })
        console.log('stationId remove', stationId)
        return stationId
    } catch (err) {
        logger.error(`cannot remove station ${stationId}`, err)
        throw err
    }
}

async function add(station) {
    try {
        const collection = await dbService.getCollection('station')
        const addedstation = await collection.insertOne(station)
        return addedstation.ops[0] // strange that we need to add the ops[0]!!
    } catch (err) {
        logger.error('cannot insert station', err)
        throw err
    }
}
async function update(station) {
    try {
        var id = ObjectId(station._id)
        delete station._id
        const collection = await dbService.getCollection('station')
        await collection.updateOne({ "_id": id }, { $set: { ...station } })
        return station
    } catch (err) {
        logger.error(`cannot update station ${stationId}`, err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    // console.log('for criteria',filterBy)
    const criteria = {}
    if (filterBy.search) {
        const txtCriteria = { $regex: filterBy.search, $options: 'i' }
        criteria.name = txtCriteria
    }
    if (filterBy.stock === 'In Stock') {
        criteria.inStock = { $eq: true }
    } else if (filterBy.stock === 'Out Of Stock') {
        criteria.inStock = { $eq: false }
    }
    if (filterBy.labels && filterBy.labels.length) {
            criteria.labels = { $in: filterBy.labels }
            // criteria.labels = { $all: filterBy.labels }
    }

    // console.log('criteria:', criteria);
    return criteria
}

async function _createstations() {
    const collection = await dbService.getCollection('stations');
    await collection.insertMany([]);
}

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
}
