const db = require('./db.js');
const path = require('path')
const express = require('express')
const app = express()

//require('dotenv').config();
//db.connectDB();
app.use(express.json())
app.use(express.static(path.join(__dirname,"client", "build")))
//console.log(process.env.ATLAS_URI);

// app.use((req, res, next) => {
//     res.sendFile(path.join(__dirname, "creative_project", 'build', 'index.html'))
    
// })

app.post('/api/register', async (req, res) => {
    console.log(req.body)
    await db.connectDB()
    try {
        data = {name: req.body.name, email: req.body.email, password: req.body.password}
        db.addToDB(data)
        res.json({status: 'ok'})
    } catch {
        res.json({status: 'error', error:'Did not add'})
    }
    
})

app.post('/api/login', async (req, res) => {
    console.log(req.body)

    const user = await User.findOne({
        email: req.body.email,
        password: req.body.password,
    })
    if(user) {
        return res.json({status: 'ok', user: true})
    } else {
        return res.json({status: 'error', user: false})
    }

})

async function start(){
  await db.connectDB()
//   let data = {hello:'maya'}
//   await db.addToDB(data)
}

(async () => {
    await start()
}) ()

app.listen(process.env.PORT, () => {console.log('Server is running')})