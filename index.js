const db = require('./db.js');
const path = require('path')
const express = require('express')
var session = require('express-session');
const app = express()


//require('dotenv').config();
//db.connectDB();
app.use(express.json())
app.use(session({
    secret: 'super secret',
    proxy: true,
    resave: true,
    saveUninitialized: true}));
app.use(express.static(path.join(__dirname,"react_files", "build")))
//console.log(process.env.ATLAS_URI);

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index')
})

//waiting for a post request to register url
app.post('/api/register', async (req, res) => {
    console.log(req.body)
    
    try {
        data = {name: req.body.name, email: req.body.reg_email, password: req.body.reg_password, security_question: req.body.security_question, security_answer: req.body.security_answer}
        const find = await db.findUser(req.body.reg_email)
        console.log('find:')
        console.log(find)
        if(find!=[]){
            await db.addToDB(data)
            res.json({status: 'ok'})
            console.log("added user to database")
        }
        else{
            res.json({status: 'exists_error', error:'User already exists!'})
        }
    } catch {
        res.json({status: 'add_error', error:'Did not add'})
    }
    
})

app.post('/api/login', async (req, res) => {

    let user_data = req.body
    // console.log('SESSION USERNAME')
    // console.log(req.session.username)

    const user = await db.findUser(user_data.login_email)

    if(user!=0) {
        req.session.username = user_data.login_email
        // console.log("THIS IS THE NEW SET SESSION USERNAME")
        // console.log(req.session.username)
        //alert("Logged in succesfully!")
        return res.json({status: 'ok', user: true, user_info: user})
    } else {
        //alert("Logged Unsuccessful: Please try again.")
        return res.json({status: 'error', user: false})
    }

})


app.post('/api/logout', async (req, res) => {

    let user_data = req.body
    console.log(user_data)
    console.log(user_data.username)
    try { 
        console.log("THIS IS THE NEW SET SESSION USERNAME")
        req.session.username = user_data.username
        console.log("LOGGED OUT")
        console.log(req.session.username)
        return res.json({status: 'ok', user: true, user_info: user_data.username})

    } catch {

        return res.json({status: 'error', user: false})
    }
})

app.post('/api/post', async (req, res) => {

    console.log('in post db server')
    console.log(req.body.title)

    let match_title = await db.findPost(req.body.title)

    if(match_title!=0){
        res.json({status: 'error', error: 'title exists'})
        return
    }

    try{
        await db.addPost(req.body)
        res.json({status: 'ok', post: req.body})
    } catch {
        res.json({status: 'error', error:'Did not add'})
    }

})

app.post('/api/search_club', async (req, res) => {
    try{
        const found_posts = await db.findClub(req.body)
        res.json({status: 'ok', found_posts: found_posts})
    } catch{
        res.json({status: 'error', error:'Search not completed'})
    }
})

app.post('/api/search_user', async (req, res) => {
    try{
        const user_info = await db.findUserSecurityInfo(req.body)
        res.json({status: 'ok', user_info: user_info})
    } catch{
        res.json({status: 'error', error:'Search not completed'})
    }
})


app.post('/api/favorite_post', async (req, res) => {

    console.log('In favorite post, server side')
    post_title = req.body.post_title
    current_user = req.session.username

    let checking_user = await db.findUser(current_user)
    console.log(checking_user)

    if(checking_user==0){
        res.json({status: 'error', error:'not logged in'})
        return
    }

    let favorited_post = await db.findPost(post_title)
    console.log('in index trying to find favorited post to get body')
    console.log(favorited_post)

    let post_body = favorited_post.post_content

    try{

        await db.addToFavorites({post_title: post_title, user: current_user, body: post_body})
        console.log("added to favories!")
        res.json({status: 'ok', user: current_user, post_title: post_title, body: post_body})
    } catch{
        res.json({status: 'error', error:'Not able to favorite post'})
    }
})

app.post('/api/view_favorites', async (req, res) => {

    console.log('in view favortes index.js')
    console.log(req.body) // {view_favorites: view}

    current_user = req.session.username

    try{
        const found_favorites = await db.findFavorites(current_user)
        res.json({status: 'ok', found_favorites: found_favorites})
    } catch(err){
        console.log(err)
        res.json({status: 'error', error:'Favorites search not completed'})
    }

})

app.post('/api/delete_post', async (req, res) => {

    console.log('In delete post, server side')
    post_title = req.body.post_title
    current_user = req.session.username

    let checking_user = await db.findUser(current_user)
    console.log(checking_user)

    if(checking_user==0){
        res.json({status: 'error', error:'not logged in'})
        return
    }

    try{
        await db.deletePost(post_title)
        console.log("deleted post!")
        res.json({status: 'ok', user: current_user, post_title: post_title})
    } catch{
        res.json({status: 'error', error:'Not able to delete post'})
    }
})

app.post('/api/edit_post', async (req, res) => {

    console.log('in edit post')
    console.log(req.body)

    try{
        const edited_post = await db.editPost(req.body)
        res.json({status: 'ok', edited_post: edited_post})
    }catch{
        res.json({status: 'error', error:'Edit not completed'})
    }

})

app.post('/api/display_posts', async (req, res) => {

    console.log('in display posts index.js')
    console.log(req.body)

    try{
        const posts = await db.getPosts()
        res.json({status: 'ok', posts: posts})
    }catch{
        res.json({status: 'error', error:'Post display not completed'})
    }

})

app.post('/api/view_favorites', async (req, res) => {

    console.log('in view favortes index.js')
    console.log(req.body) // {view_favorites: view}

    current_user = req.session.username

    try{
        const found_favorites = await db.findFavorites(current_user)
        res.json({status: 'ok', found_favorites: found_favorites})
    } catch(err){
        console.log(err)
        res.json({status: 'error', error:'Favorites search not completed'})
    }

})

app.post('/api/comment_post', async (req, res) => {

    console.log('in comment post index.js')
    console.log(req.body) // {view_favorites: view}

    current_user = req.session.username

    try{
        const comment = await db.addComment(req.body)
        res.json({status: 'ok', comment: comment})
    } catch(err){
        console.log(err)
        res.json({status: 'error', error:'Comment not completed'})
    }

})

app.listen(process.env.PORT, () => {console.log('Server is running')})

// const db = require('./db.js');
// const path = require('path')
// const express = require('express')
// var session = require('express-session');
// const app = express()

// //require('dotenv').config();
// //db.connectDB();
// app.use(express.json())
// app.use(session({
//     secret: 'super secret',
//     proxy: true,
//     resave: true,
//     saveUninitialized: true}));
// app.use(express.static(path.join(__dirname,"react_files", "build")))
// //console.log(process.env.ATLAS_URI);

// app.set('view engine', 'ejs')

// app.get('/', (req, res) => {
//     res.render('index')
// })

// //waiting for a post request to register url
// app.post('/api/register', async (req, res) => {

//     console.log(req.body)
    
//     try {

//         data = {name: req.body.name, email: req.body.reg_email, password: req.body.reg_password}
//         const find = await db.findUser(req.body.reg_email)

//         if(find===0){
//             await db.addToDB(data)
//             res.json({status: 'ok'})
//             console.log("added user to database")
//         }
//         else{
//             res.json({status: 'exists_error', error:'User already exists!'})
//         }
//     } catch {
//         res.json({status: 'add_error', error:'Did not add'})
//     }
    
// })

// app.post('/api/login', async (req, res) => {

//     let user_data = req.body
//     // console.log('SESSION USERNAME')
//     // console.log(req.session.username)

//     const user = await db.findUser(user_data.login_email)

//     if(user!=0) {
//         req.session.username = user_data.login_email
//         // console.log("THIS IS THE NEW SET SESSION USERNAME")
//         // console.log(req.session.username)
//         return res.json({status: 'ok', user: true, user_info: user})
//     } else {
//         return res.json({status: 'error', user: false})
//     }

// })

// app.post('/api/post', async (req, res) => {

//     console.log('in post db server')
//     console.log(req.body.title)

//     let match_title = await db.findPost(req.body.title)

//     if(match_title!=0){
//         res.json({status: 'error', error: 'title exists'})
//         return
//     }

//     try{
//         await db.addPost(req.body)
//         res.json({status: 'ok', post: req.body})
//     } catch {
//         res.json({status: 'error', error:'Did not add'})
//     }

// })

// app.post('/api/search_club', async (req, res) => {
//     try{
//         const found_posts = await db.findClub(req.body)
//         res.json({status: 'ok', found_posts: found_posts})
//     } catch{
//         res.json({status: 'error', error:'Search not completed'})
//     }
// })

// app.post('/api/favorite_post', async (req, res) => {

//     console.log('In favorite post, server side')
//     post_title = req.body.post_title
//     current_user = req.session.username

//     let checking_user = await db.findUser(current_user)
//     console.log(checking_user)

//     if(checking_user==0){
//         res.json({status: 'error', error:'not logged in'})
//         return
//     }

//     let favorited_post = await db.findPost(post_title)
//     console.log('in index trying to find favorited post to get body')
//     console.log(favorited_post)

//     let post_body = favorited_post.post_content

//     try{

//         await db.addToFavorites({post_title: post_title, user: current_user, body: post_body})
//         console.log("added to favories!")
//         res.json({status: 'ok', user: current_user, post_title: post_title, body: post_body})
//     } catch{
//         res.json({status: 'error', error:'Not able to favorite post'})
//     }
// })

// app.post('/api/edit_post', async (req, res) => {

//     console.log('in edit post')
//     console.log(req.body)

//     try{
//         const edited_post = await db.editPost(req.body)
//         res.json({status: 'ok', edited_post: edited_post})
//     }catch{
//         res.json({status: 'error', error:'Edit not completed'})
//     }

// })

// app.post('/api/display_posts', async (req, res) => {

//     console.log('in display posts index.js')
//     console.log(req.body)

//     try{
//         const posts = await db.getPosts()
//         res.json({status: 'ok', posts: posts})
//     }catch{
//         res.json({status: 'error', error:'Post display not completed'})
//     }

// })

// app.post('/api/view_favorites', async (req, res) => {

//     console.log('in view favortes index.js')
//     console.log(req.body) // {view_favorites: view}

//     current_user = req.session.username

//     try{
//         const found_favorites = await db.findFavorites(current_user)
//         res.json({status: 'ok', found_favorites: found_favorites})
//     } catch(err){
//         console.log(err)
//         res.json({status: 'error', error:'Favorites search not completed'})
//     }

// })

// app.listen(process.env.PORT, () => {console.log('Server is running')})