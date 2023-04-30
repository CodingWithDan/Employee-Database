const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const Employee = require('../models/Employee')


//@desc Login/Landing page
//@route GET /

router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login',
    })
})

//@desc Login/Landing page
//@route GET /

router.get('/dashboard', ensureAuth, async (req, res) => {
    try{
        const employees = await Employee.find ({ user: req.user.id }).lean()
        res.render('dashboard', {
            name: req.user.firstName,
           employees
            })
        
    } catch (err){
        console.error(err)
        res.render('error/500')
    }    
})
   
module.exports = router