const db = require('./db.js');
const path = require('path')
const express = require('express')
const app = express()

//require('dotenv').config();
//db.connectDB();
app.use(express.json())
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
        data = {name: req.body.name, email: req.body.reg_email, password: req.body.reg_password}
        await db.addToDB(data)
        res.json({status: 'ok'})
    } catch {
        res.json({status: 'error', error:'Did not add'})
    }
    
})

app.post('/api/login', async (req, res) => {

    let user_data = req.body

    const user = await db.findUser(user_data.login_email)

    if(user) {
        return res.json({status: 'ok', user: true})
    } else {
        return res.json({status: 'error', user: false})
    }

})

app.post('/api/post', async (req, res) => {
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

app.listen(process.env.PORT, () => {console.log('Server is running')})