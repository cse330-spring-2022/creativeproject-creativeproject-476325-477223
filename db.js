var {MongoClient} = require('mongodb');
require('dotenv').config();
const client = new MongoClient(process.env.ATLAS_URI);

async function connectDB(){
    try {
        console.log('hi')
        await client.connect()
        console.log('hi again')
        return client.db().collection('myFirstDatabase')
    } catch(err) {
        console.log(err)
    }
    // MongoClient.connect(url, function(errors, db){
    //     if(errors){
    //         console.log(errors);
    //         return
    //     }
    //     console.log(db)
    // return db;
    // });
}

async function addToDB(data) {
    const db = await connectDB()
    console.log(await db.insertOne(data)) //returns a promise 

    //const response = await db.insertOne(data)
    //response.acknowledged == true (successful)
    
}


module.exports = {addToDB} //exports the method, we can then import this script in another js file