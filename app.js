const path = require('path')
const express = require('express')
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connectDB = require('./config/db')

//load config
dotenv.config({ path: './config/config.env' })

//Passport config
require('./config/passport')(passport)

connectDB()

const app = express()

//Body parser
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Method Override
app.use(methodOverride(function (req, res){
    if(req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method
        delete req.body._method
        return method
    }
}))




// Logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

//Handlebar Helpers
const {formatDate, stripTags, truncate, editIcon, select} = require('./helpers/hbs')

//Handlebars
//!Add the word .engine after exphbs
app.engine('.hbs', exphbs.engine({ 
    helpers: {
      formatDate,
      stripTags,
      truncate,
      editIcon,
      select
    },
    defaultLayout: 'main', 
    extname: '.hbs'
    })
);

app.set('view engine', '.hbs')

//Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
    })
)

//Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

//Set global var
app.use(function (req, res, next) {
    res.locals.user = req.user || null
    next()
})

// Static folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/dashboard'))
app.use('/auth', require('./routes/auth'))
app.use('/employees', require('./routes/employees'))

const PORT = process.env.PORT || 3030

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`))