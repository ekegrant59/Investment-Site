require('dotenv').config()
const ejs = require('ejs')
const mongoose = require('mongoose')
const express = require('express')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const userSchema = require('./schema/userSchema')
const depositSchema = require('./schema/depositSchema')
// const flash = require('connect-flash')
const session = require('express-session')

const app = express()
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(express.json())
app.use(
    session({
      resave: false,
      saveUninitialized: true,
      secret: 'secret',
    })
);

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


const mongodb = process.env.MONGODB
const secretkey = process.env.SECRETKEY
mongoose.connect(mongodb)
.then(() => {
   console.log('Connection successful')
}).catch((err) => {
    console.log(err, "Connection failed")
})

app.set('view engine', 'ejs')
app.use('/assets', express.static('assets'))
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))

app.get('/', async (req,res)=>{
    if (req.cookies.logintoken){
        const token = req.cookies.logintoken
        // console.log(token)
        try{
            const user = jwt.verify(token, secretkey)
        req.user = user
        const auser = req.user.user.email
        const theuser = await userSchema.findOne({email: auser})
        res.render('index', {name: theuser.firstName})
        } catch(err){
            console.log(err)
            res.clearCookie('logintoken')
            return res.redirect('/')
        }
    }else{
        const theuser = ''
        res.render('index', {name: theuser})
      }
    // res.render('index')
})

app.get('/about', async (req,res)=>{
    if (req.cookies.logintoken){
        const token = req.cookies.logintoken
        // console.log(token)
        try{
            const user = jwt.verify(token, secretkey)
        req.user = user
        const auser = req.user.user.email
        const theuser = await userSchema.findOne({email: auser})
        res.render('about-us', {name: theuser.firstName})
        } catch(err){
            console.log(err)
            res.clearCookie('logintoken')
            return res.redirect('/about')
        }
    }else{
        const theuser = ''
        res.render('about-us', {name: theuser})
      }
})

app.get('/contact-us', async (req,res)=>{
    if (req.cookies.logintoken){
        const token = req.cookies.logintoken
        // console.log(token)
        try{
            const user = jwt.verify(token, secretkey)
            req.user = user
            const auser = req.user.user.email
            const theuser = await userSchema.findOne({email: auser})
            res.render('contact-us', {name: theuser.firstName})
        } catch(err){
            console.log(err)
            res.clearCookie('logintoken')
            return res.redirect('/contact-us')
        }
    }else{
        const theuser = ''
        res.render('contact-us', {name: theuser})
      }
})

app.get('/privacy', async (req,res)=>{
    if (req.cookies.logintoken){
        const token = req.cookies.logintoken
        // console.log(token)
        try{
            const user = jwt.verify(token, secretkey)
        req.user = user
        const auser = req.user.user.email
        const theuser = await userSchema.findOne({email: auser})
        res.render('privacy', {name: theuser.firstName})
        } catch(err){
            console.log(err)
            res.clearCookie('logintoken')
            return res.redirect('/privacy')
        }
    }else{
        const theuser = ''
        res.render('privacy', {name: theuser})
      }
})

app.get('/FAQ', async (req,res)=>{
    if (req.cookies.logintoken){
        const token = req.cookies.logintoken
        // console.log(token)
        try{
            const user = jwt.verify(token, secretkey)
        req.user = user
        const auser = req.user.user.email
        const theuser = await userSchema.findOne({email: auser})
        res.render('FAQ', {name: theuser.firstName})
        } catch(err){
            console.log(err)
            res.clearCookie('logintoken')
            return res.redirect('/FAQ')
        }
    }else{
        const theuser = ''
        res.render('FAQ', {name: theuser})
      }
})

app.get('/terms-of-service', async (req,res)=>{
    if (req.cookies.logintoken){
        const token = req.cookies.logintoken
        // console.log(token)
        try{
            const user = jwt.verify(token, secretkey)
            req.user = user
            const auser = req.user.user.email
            const theuser = await userSchema.findOne({email: auser})
            res.render('terms', {name: theuser.firstName})
        } catch(err){
            console.log(err)
            res.clearCookie('logintoken')
            return res.redirect('/terms-of-service')
        }
    }else{
        const theuser = ''
        res.render('terms', {name: theuser})
      }
})

app.get('/register', async (req,res)=>{
    if (req.cookies.logintoken){
        const token = req.cookies.logintoken
        // console.log(token)
        try{
            const user = jwt.verify(token, secretkey)
        req.user = user
        const auser = req.user.user.email
        const theuser = await userSchema.findOne({email: auser})
        res.render('register', {name: theuser.firstName})
        } catch(err){
            console.log(err)
            res.clearCookie('logintoken')
            return res.redirect('/register')
        }
    }else{
        const theuser = ''
        res.render('register', {name: theuser})
      }
})

app.get('/login', async (req,res)=>{
    if (req.cookies.logintoken){
        const token = req.cookies.logintoken
        // console.log(token)
        try{
            const user = jwt.verify(token, secretkey)
            req.user = user
            const auser = req.user.user.email
            const theuser = await userSchema.findOne({email: auser})
            res.render('login', {name: theuser.firstName})
        } catch(err){
            console.log(err)
            res.clearCookie('logintoken')
            return res.redirect('/login')
        }
    }else{
        const theuser = ''
        res.render('login', {name: theuser})
      }
})

app.get('/logout', (req,res)=>{
    res.clearCookie('logintoken')
     return res.redirect('/')
})

app.post('/register', async (req,res)=>{
    const details = req.body
    const password = details.password
    const email = details.email

    const date = new Date()
    // console.log(date)
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    userSchema.findOne({email: email}, (err, details)=>{
        if(details){
            res.redirect('/register')
        } else{
            registerUser()
        }
    })


    async function registerUser(){
        try{
            const user = new userSchema({
                firstName: details.firstName,
                lastName: details.lastName,
                email: details.email,
                password: hashedPassword,
                password1: details.password,
                country: details.country,
                number: details.number,
                referrer: details.referrer,
                balance: 0.00,
                date: date
            })
            await user.save()

            res.redirect('/login')
        }catch(err){
            console.log(err)
        }

    }

})

app.post('/login', (req,res)=>{
    const loginInfo = req.body

    const email = loginInfo.email
    const password = loginInfo.password

    userSchema.findOne({email})
    .then((user)=>{
        userSchema.findOne({email: email}, (err, details)=>{
            if (!details){
                req.flash('danger', 'user does not exist')
                res.redirect('/login')
            } else {
                bcrypt.compare(password, user.password, async (err,data)=>{
                    if (data){
                        const payload = {
                            user: {
                                email: user.email
                            }
                        }
                        const token = jwt.sign(payload, secretkey,{
                            expiresIn: '3600s'
                        })
    
                        res.cookie('logintoken', token, {
                            httpOnly: false
                        })
    
                        res.redirect('/dashboard')
                    } else {
                        req.flash('danger', 'incorrect password ')
                        res.redirect('/login')
                    }
                })
            }
        } )
    }).catch((err)=>{
        console.log(err)
    })
})

app.get('/dashboard',protectRoute, async (req,res)=>{
    // console.log(req.user)
    try{
        const auser = req.user.user.email
        const theuser = await userSchema.findOne({email: auser})
        res.render('dashboard', {user: theuser})
    } catch(err){
        console.log(err)
    }
})

app.get('/account-settings',protectRoute, async (req,res)=>{
    try{
        const auser = req.user.user.email
        const theuser = await userSchema.findOne({email: auser})
        res.render('account-settings', {user: theuser})
    } catch(err){
        console.log(err)
    }
})
app.get('/deposit-history',protectRoute, async (req,res)=>{
    try{
        const auser = req.user.user.email
        const theuser = await userSchema.findOne({email: auser})
        const name = `${theuser.firstName} ${theuser.lastName}`
        const deposit = await depositSchema.find({name: name })
        res.render('deposit-history', {user: theuser, deposits: deposit})
        // console.log(deposit)
    } catch(err){
        console.log(err)
    }
})
app.get('/withdrawal-history',protectRoute, async (req,res)=>{
    try{
        const auser = req.user.user.email
        const theuser = await userSchema.findOne({email: auser})
        res.render('withdrawal-history', {user: theuser})
    } catch(err){
        console.log(err)
    }
})
app.get('/deposit',protectRoute, async (req,res)=>{
    try{
        const auser = req.user.user.email
        const theuser = await userSchema.findOne({email: auser})
        res.render('deposit', {user: theuser})
    } catch(err){
        console.log(err)
    }
})
app.get('/withdraw',protectRoute, async (req,res)=>{
    try{
        const auser = req.user.user.email
        const theuser = await userSchema.findOne({email: auser})
        res.render('withdraw', {user: theuser})
    } catch(err){
        console.log(err)
    }
})



function protectRoute(req, res, next){
    const token = req.cookies.logintoken
    try{
        const user = jwt.verify(token, secretkey)

        req.user = user
        // console.log(req.user)
        next()
    }
    catch(err){
        res.clearCookie('logintoken')
        return res.redirect('/')
    }
}

app.post('/edit-account', async (req,res)=>{
    const details = req.body
    const pass1 = details.password
    const pass2 = details.passworda
    const email1 = details.email
    // console.log(pass1)
    
    const filter = {email: email1}
    const salt = await bcrypt.genSalt(10)
    const hashedPassword1 = await bcrypt.hash(pass1,salt)

    
    if(pass1 !== pass2){
        req.flash('danger', 'please input the same password')
        res.redirect('/account-settings')
    }else if(!pass1){
        userSchema.findOneAndUpdate(filter, {$set:{bitcoin:details.btc}}, {new: true}, (err,dets)=>{
            if(err){
                console.log(err)
            }
            // console.log(dets)
        })
        req.flash('success','Your account has been updated sucsesfully')
        res.redirect('/account-settings')
    }else{
        userSchema.findOneAndUpdate(filter, {$set:{password:hashedPassword1, bitcoin:details.btc}}, {new: true}, (err,dets)=>{
            if(err){
                console.log(err)
            }
            // console.log(dets)
        })
        req.flash('success','Your account has been updated sucsesfully')
        res.redirect('/account-settings')
    }
})

app.post('/deposit', async (req,res)=>{
    const token = req.cookies.logintoken
    const user = jwt.verify(token, secretkey)
    req.user = user
    const auser = req.user.user.email
    const theuser = await userSchema.findOne({email: auser})

    const details = req.body
    const id = details.transactID
    const name = `${theuser.firstName} ${theuser.lastName}`
    const date = new Date()

    if(!(id)){
        req.flash('danger', 'Please Input the transcation ID')
        res.redirect('/deposit')
    } else{
        deposited()
    }

    async function deposited(){
        try{
            const deposit = new depositSchema({
                name: name,
                transactID: id,
                amount: details.amount,
                status: 'pending',
                date: date
            })
            await deposit.save()
            res.redirect('/deposit-history')
        } catch(err){
            console.log(err)
        }
    }
})

const port = process.env.PORT || 3000
app.listen(port, ()=>{
    console.log(`App started on port ${port}`)
})