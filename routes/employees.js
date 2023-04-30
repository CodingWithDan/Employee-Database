const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const Employee = require('../models/Employee')

// @desc    Show add page
// @route   GET /employees/add
router.get('/add', ensureAuth, (req, res) => {
  res.render('employees/add')
})



// @desc    Process add employee form
// @route   POST /employees
router.post('/', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id
    await Employee.create(req.body)
    res.redirect('/dashboard')
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})


// @desc    Show all employees   //************** CHANGE THIS in the future so "cleared: yes" actually means something*/
// @route   GET /employees
router.get('/', ensureAuth, async (req, res) => {
  try {
    const employees = await Employee.find({ cleared: 'Yes' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean()

    res.render('employees/index', {
      employees,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Show single employee     //************** THIS IS BASICALLY THE SHOW PAGE; might need to make changes here */
// @route   GET /employees/:id
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    let employee = await Employee.findById(req.params.id).populate('user').lean()

    if (!employee) {
      return res.render('error/404')
    }

    if (employee.user._id != req.user.id && employee.cleared == 'Yes') {
      res.render('error/404')
    } else {
      res.render('employees/employeeProfile', {
        employee
      })
    }
  } catch (err) {
    console.error(err)
    res.render('error/404')
  }
})



// @desc    Show edit page
// @route   GET /employees/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
    }).lean()

    if (!employee) {
      return res.render('error/404')
    }

    if (employee.user != req.user.id) {
      res.redirect('/employees')
    } else {
      res.render('employees/edit', {
        employee,
      })
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})


// @desc    Update employee info
// @route   PUT /employees/:id
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    let employee = await Employee.findById(req.params.id).lean()

    if (!employee) {
      return res.render('error/404')
    }

    if (employee.user != req.user.id) {
      res.redirect('/employees')
    } else {
     employee = await Employee.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      })

      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})



// @desc    Delete employees
// @route   DELETE /employees/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    let employee = await Employee.findById(req.params.id).lean()

    if (!employee) {
      return res.render('error/404')
    }

    if (employee.user != req.user.id) {
      res.redirect('/employees')
    } else {
      await Employee.deleteOne({ _id: req.params.id })
      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    User employees
// @route   GET /employees/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
  try {
    const employees = await Employee.find({
      user: req.params.userId,
      cleared: 'No',
    })
      .populate('user')
      .lean()

    res.render('employees/dashboard', {
     employees,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

module.exports = router

// @desc    Show viewInfo page
router.get('/viewInfo/:id', ensureAuth, async (req, res) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
    }).lean()

    if (!employee) {
      return res.render('error/404')
    }

    if (employee.user != req.user.id) {
      res.redirect('/employees')
    } else {
      res.render('employees/viewInfo', {
        employee,
      })
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

