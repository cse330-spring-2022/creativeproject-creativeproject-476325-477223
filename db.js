const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var {MongoClient} = require('mongodb');
require('dotenv').config();
const client = new MongoClient(process.env.ATLAS_URI);
var mongodb = require("mongodb");

const User = new mongoose.Schema({
    name: {type: String, required:true},
    email: {type: String, required:true},
    password: {type: String, required:true},
    quote: {type: String},
    security_question: {type: String},
    security_answer: {type: String}
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
        console.log('in found user')
        return found_user
    } catch(err) {
        console.log("could not find user")
        let user_count = 0
        return user_count
    }

}

async function findUserSecurityInfo(data) {

    console.log('in security ingo')
    const db = await connectDB('UserData')

    let found_user_info = await db.find({name: data.user_to_find}).toArray()

    return found_user_info

}

async function addPost(data) {

    const db = await connectDB('Posts')

    const result = await db.insertOne(data) //returns a promise
    console.log(result)
    return result
    
}

async function deletePost(post_title) {
    //takes in post title
    //find id associated with post title
    console.log(post_title)
    const db_posts = await connectDB('Posts')
    try {
        var post = await db_posts.findOne({title: post_title})
        console.log("found post (id below)")
        console.log(post)
        console.log(post._id.valueOf())

        console.log('in deletePost')
        id = post._id.valueOf()
        const result = await db_posts.deleteOne({ _id : new mongodb.ObjectId(id)}) //returns a promise
        console.log(result)
        
        return result

    } catch(err) {
        console.log("could not find post")

    }
   
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

module.exports = { model, connectDB, addToDB, addPost, findClub, findUser, addToFavorites, deletePost, findUserSecurityInfo}
// module.exports = connectDB //exports the method, we can then import this script in another js file