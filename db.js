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

async function connectDB(){
    try {
        console.log('hi')
        await client.connect()
        console.log('hi again')
    
        return client.db().collection('UserData')
    } catch(err) {
        console.log(err)
    }
    MongoClient.connect(url, function(errors, db){
        if(errors){
            console.log(errors);
            return
        }
        console.log(db)
    return db;
    });
}





async function addToDB(data) {
    const db = await connectDB()

    console.log(await db.insertOne(data)) //returns a promise 

    //const response = await db.insertOne(data)
    //response.acknowledged == true (successful)
    
}

module.exports = {model, connectDB, addToDB}
// module.exports = connectDB //exports the method, we can then import this script in another js file