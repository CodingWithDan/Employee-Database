const mongoose = require('mongoose')

const EmployeeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    fullName: {
        type: String,
        required: true,
        trim: true
    },

    birthday:{
        type: String,
        required: true,
        trim: true
    },

    address:{
        type: String,
        required: true,
        trim: true
    },

    email:{
        type: String,
        required: true,
        trim: true
    },

    phoneNumber:{
        type: Number,
        required: true,
        trim: true
    },

    socialSecurity:{
        type: Number,
        required: true,
        trim: true
    },

    additionalInfo: {
        type: String,
    },

    verification: {
        type: String,
        default: 'Yes',
        enum: ['Yes', 'No']
    },

    firstWorkDay:{
        type: String,
        required: true,
        trim: true
    },

    identityAndEmploymentAuth: {
        type: String,
        default: "socndrive",
        enum: ["socndrive", 'passport']
    },

    citizenship: {
        type: String,
        default: "attestCit",
        enum: ["attestCit", 'attestNonCit', 'attestPerm', 'attestAlien']
    },

    issuerDL: {
        type: String,
        required: true,
        trim: true
    },

    driverLicenseNum: {
        type: String,
        required: true,
        trim: true
    },

    driverLicenseExp: {
        type: String,
        required: true,
        trim: true
    },

    socialSecurity: {
        type: Number,
        required: true,
        trim: true
    },

    
    marital:{
        type: String,
        default: "single",
        enum: ["single", 'married', "head"],
    },

    employee: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: 'Employee'
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    i9: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'I9',
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Employee', EmployeeSchema)