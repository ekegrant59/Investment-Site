require('dotenv').config()
const ejs = require('ejs')
const mongoose = require('mongoose')
const express = require('express')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')

const app = express()

app.set('view engine', 'ejs')
app.use('/assets', express.static('assets'))
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))

app.get('/', (req,res)=>{
    res.render('index')
})

app.get('/about', (req,res)=>{
    res.render('about-us')
})

app.get('/contact-us', (req,res)=>{
    res.render('contact-us')
})

app.get('/privacy', (req,res)=>{
    res.render('privacy')
})

app.get('/FAQ', (req,res)=>{
    res.render('FAQ')
})
const port = process.env.PORT || 3000
app.listen(port, ()=>{
    console.log(`App started on port ${port}`)
} )