const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var {MongoClient} = require('mongodb');
require('dotenv').config();
const client = new MongoClient(process.env.ATLAS_URI);

const User = new mongoose.Schema({
    name: {type: String, required:true},
    email: {type: String, required:true},
    password: {type: String, required:true},
    quote: {type: String},
    },
    {collection: 'user-data'}
)

const model = mongoose.model('UserData', User)

async function connectDB(collection){
    try {
        console.log('hi')
        await client.connect()
        console.log('hi again')
    
        return client.db().collection(collection)
    } catch(err) {
        console.log(err)
    }
}

async function addToDB(data) {

    const db = await connectDB('UserData')

    const result = await db.insertOne(data) //returns a promise
    console.log(result)
    return result
    
}

async function addPost(data) {

    const db = await connectDB('Posts')

    const result = await db.insertOne(data) //returns a promise
    console.log(result)
    return result
    
}

async function findClub(data) {
    const db = await connectDB('Posts')

    //search database and get only posts with certain club tag
    //look for query method
}

module.exports = { model, connectDB, addToDB, addPost}
// module.exports = connectDB //exports the method, we can then import this script in another js file