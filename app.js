const express = require("express")
const path = require("path")
const app = express();
const axios = require('axios');
const port = 3000

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// app.get('/', (req, res) => {
//     res.render('index')
// })

const indexRouter = require('./routes/index')
app.use(indexRouter.router)

app.listen(3000, () =>{
    console.log('App listening at port 3000')
})
