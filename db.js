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

async function findUser(user_email){

    console.log("in find user")
    console.log(user_email)
    const db = await connectDB('UserData')

    try {
        let found_user = await db.find({email: user_email}).toArray()
        console.log("found user")
        console.log(found_user)
        return found_user
    } catch(err) {
        console.log("could not find user")
        let user_count = 0
        return user_count
    }

}

async function addPost(data) {

    const db = await connectDB('Posts')

    const result = await db.insertOne(data) //returns a promise
    console.log(result)
    return result
    
}

async function findClub(data) {

    const db = await connectDB('Posts')

    let found_posts = await db.find({tagged_clubs: data.club_tag}).toArray()

    console.log(found_posts)
   
    found_posts.forEach(element => {
        console.log(element.title)
        console.log(element.post_content)
    }); 
    
    return found_posts

}

async function addToFavorites(login_email){

}

module.exports = { model, connectDB, addToDB, addPost, findClub, findUser}
// module.exports = connectDB //exports the method, we can then import this script in another js file