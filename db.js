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

    console.log("in find user (db.js)")
    console.log(user_email)
    const db = await connectDB('UserData')

    try {
        let found_user = await db.find({email: user_email}).toArray()
        console.log("found user (user email below)")
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

async function findPost(post_title){

    console.log("in find post (db.js)")
    console.log(post_title)
    const db = await connectDB('Posts')

    let arr = await db.find({title: post_title}).toArray()

    if(arr.length!=0){
        return arr[0]
    }
        
    console.log("no post with this title yet")
    post_count = 0
    return post_count

}

async function addToFavorites(data) {

    const db = await connectDB('Favorites')

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

async function findFavorites(current_user) {

    const db = await connectDB('Favorites')

    let found_favorites = await db.find({user: current_user}).toArray()

    return found_favorites

}

module.exports = { model, connectDB, addToDB, addPost, findClub, findUser, addToFavorites, findFavorites, findPost}
// module.exports = connectDB //exports the method, we can then import this script in another js file