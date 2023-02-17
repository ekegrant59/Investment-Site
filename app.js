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
const withdrawSchema = require('./schema/withdrawSchema')
const adminSchema = require('./schema/adminSchema')
const balanceSchema = require('./schema/balanceSchema')
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
const adminkey = process.env.ADMINKEY
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
                date: date
            })
            await user.save()

            const balance = new balanceSchema({
                name: `${details.firstName} ${details.lastName}`,
                email: details.email,
                balance: 0.00,
                ROI: 0.00,
                bonus: 0.00
            })
            await balance.save()

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
        const theuser1 = await balanceSchema.findOne({email: auser})
        res.render('dashboard', {user: theuser, user1: theuser1})
    } catch(err){
        console.log(err)
    }
})

app.get('/account-settings',protectRoute, async (req,res)=>{
    try{
        const auser = req.user.user.email
        const theuser = await userSchema.findOne({email: auser})
        const theuser1 = await balanceSchema.findOne({email: auser})
        res.render('account-settings', {user: theuser, user1: theuser1})
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
        const theuser1 = await balanceSchema.findOne({email: auser})
        res.render('deposit-history', {user: theuser, deposits: deposit, user1: theuser1})
        // console.log(deposit)
    } catch(err){
        console.log(err)
    }
})
app.get('/withdrawal-history',protectRoute, async (req,res)=>{
    try{
        const auser = req.user.user.email
        const theuser = await userSchema.findOne({email: auser})
        const name = `${theuser.firstName} ${theuser.lastName}`
        const withdrawal = await withdrawSchema.find({name: name})
        const theuser1 = await balanceSchema.findOne({email: auser})
        res.render('withdrawal-history', {user: theuser, withdrawals: withdrawal, user1: theuser1})
    } catch(err){
        console.log(err)
    }
})
app.get('/deposit',protectRoute, async (req,res)=>{
    try{
        const auser = req.user.user.email
        const theuser = await userSchema.findOne({email: auser})
        const theuser1 = await balanceSchema.findOne({email: auser})
        res.render('deposit', {user: theuser, user1: theuser1})
    } catch(err){
        console.log(err)
    }
})

app.get('/deposit_main',protectRoute, async (req,res)=>{
    try{
        const auser = req.user.user.email
        const theuser = await userSchema.findOne({email: auser})
        const theuser1 = await balanceSchema.findOne({email: auser})
        res.render('deposit_main', {user: theuser, user1: theuser1})
    } catch(err){
        console.log(err)
    }
})

app.get('/withdraw',protectRoute, async (req,res)=>{
    try{
        const auser = req.user.user.email
        const theuser1 = await balanceSchema.findOne({email: auser})
        const theuser = await userSchema.findOne({email: auser})
        res.render('withdraw', {user: theuser, user1:theuser1})
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
        userSchema.findOneAndUpdate(filter, {$set:{password:hashedPassword1, bitcoin:details.btc, password1:pass1}}, {new: true}, (err,dets)=>{
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
    const theuser1 = await balanceSchema.findOne({email: auser})

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
                date: date,
            })
            await deposit.save()

            balanceSchema.findOneAndUpdate({email: auser}, {$set:{plan:details.plan }}, {new: true}, (err,dets)=>{
                if(err){
                    console.log(err)
                }
                // console.log(dets)
            })
            res.redirect('/deposit-history')
        } catch(err){
            console.log(err)
        }
    }
})
app.post('/deposit_main', async (req,res)=>{
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
        res.redirect('/deposit_main')
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

app.post('/withdraw', async (req,res)=>{
    const token = req.cookies.logintoken
    const user = jwt.verify(token, secretkey)
    req.user = user
    const auser = req.user.user.email
    const theuser = await balanceSchema.findOne({email: auser})
    const theuser1 = await userSchema.findOne({email: auser})

    const details = req.body
    const balance = theuser.balance
    const date = new Date()
    const amount = details.amount
    const name = `${theuser1.firstName} ${theuser1.lastName}`

    if(amount > balance){
        req.flash('danger', 'Insufficient Funds')
        res.redirect('/withdraw')
    }else if(!amount){
        req.flash('danger', 'Please input a valid amount')
        res.redirect('/withdraw')
    } else{
        withdrawn()
    }

    async function withdrawn(){
        try{
            const withdraw = new withdrawSchema({
                name: name,
                email: auser,
                amount: amount,
                status: 'pending',
                date: date,
                address: details.address
            })
            await withdraw.save()
            res.redirect('/withdrawal-history')
        } catch(err){
            console.log(err)
        }
    }
})

// app.get('/adminregister', (req,res)=>{
//     res.render('adminregister')
// })

// app.post('/adminregister', async(req,res)=>{
//       const regInfo = req.body
//       const password = regInfo.password
    
//       const salt = await bcrypt.genSalt(10)
//       const hashedPassword = await bcrypt.hash(password, salt)
    
//         run()
//         async function run(){
//             try {
//                 const admin = new adminSchema({
//                     email: regInfo.email,
//                     password: hashedPassword
//                 })
//                 await admin.save()
//             }
//             catch (err) {
//                 console.log(err.message)
            
//             }
//         }
    
//         res.redirect('/admin')
//     })

app.get('/admin',protectAdminRoute, async (req,res)=>{
    try{
        const user = await userSchema.find()
        const pendDeposit = await depositSchema.find({status: 'pending'})
        const confirmDeposit = await depositSchema.find({status: 'confirmed'})
        const pendingwithdrawal = await withdrawSchema.find({status: 'pending'})
        const confirmwithdrawal = await withdrawSchema.find({status: 'confirmed'})
        res.render('admin', {users: user, pendDeposits: pendDeposit, confirmDeposits: confirmDeposit, confirmWithdrawals: confirmwithdrawal, pendingWithdrawals: pendingwithdrawal })
    } catch(err){
        console.log(err)
    }
})
    
    function protectAdminRoute(req, res, next){
        const token = req.cookies.admintoken
        try{
            const user = jwt.verify(token, adminkey)
    
            req.user = user
            // console.log(req.user)
            next()
        }
        catch(err){
            res.clearCookie('admintoken')
            return res.render('adminlogin')
        }
    }

app.post('/adminlogin', (req,res)=>{
    const loginInfo = req.body

    const email = loginInfo.email
    const password = loginInfo.password

    adminSchema.findOne({email})
    .then((admin)=>{
        adminSchema.findOne({email: email}, (err,details)=>{
            if(!details){
                req.flash('danger','Incorrect email')
                res.redirect('/admin')
            } else{
                bcrypt.compare(password, admin.password, async (err,data)=>{
                    if(data){
                        const payload1 = {
                            user:{
                                email: admin.email
                            }
                        }
                        const token1 = jwt.sign(payload1, adminkey,{
                            expiresIn: '3600s'
                        })

                        res.cookie('admintoken', token1, {
                            httpOnly: false
                        })

                        res.redirect('/admin')
                    } else{
                        req.flash('danger', 'incorrect password')
                        res.redirect('/admin')
                    }
                })
            }
        })
    }).catch((err)=>{
        console.log(err)
    })
})

app.get('/admin/update',protectAdminRoute, (req,res)=>{
    res.render('adminUpdate')
})

app.get('/edit/:id', async (req,res)=>{
    let email = req.params.id 
    // console.log(email)

    try{
        let balance = await balanceSchema.findOne({email: email})
    // console.log(balance)
        res.send(balance)
    } catch(err){
        console.log(err)
    }
})

app.post('/edit', (req,res)=>{
    const details = req.body
    const filter = {email: details.email}
    balanceSchema.findOneAndUpdate(filter, {$set: {balance: details.balance, ROI: details.ROI, bonus: details.bonus}}, {new: true}, (err,dets)=>{
        if (err){
            console.log(err)
            req.flash('danger', 'An Error Occured, Please try again')
            res.redirect('/admin/update')
        } else{
            req.flash('success', 'User Updated Successfully')
            res.redirect('/admin/update')
        }
    })

})

app.post('/confirm/deposit', (req,res)=>{
    const body = req.body
    // console.log(body.transactID)
    const filter = {transactID: body.transactID}
    depositSchema.findOneAndUpdate(filter, {$set: {status: 'confirmed'}}, {new: true}, (err)=>{
        if(err){
            console.log(err)
        }
    })
    res.redirect('/admin')
})

app.post('/unconfirm/deposit', (req,res)=>{
    const body = req.body
    // console.log(body.transactID)
    const filter = {transactID: body.transactID}
    depositSchema.findOneAndUpdate(filter, {$set: {status: 'pending'}}, {new: true}, (err)=>{
        if(err){
            console.log(err)
        }
    })
    res.redirect('/admin')
})

app.post('/confirm/withdrawal', (req,res)=>{
    const body = req.body
    // console.log(body.transactID)
    // console.log(body.id)
    const filter = {_id: body.id}
    withdrawSchema.findOneAndUpdate(filter, {$set: {status: 'confirmed'}}, {new: true}, (err)=>{
        if(err){
            console.log(err)
        }
    })
    res.redirect('/admin')
})

app.post('/unconfirm/withdrawal', async (req,res)=>{
    const body = req.body
    // console.log(body.transactID)
    const filter = {_id: body.id}
    // const found = await withdrawSchema.findOne(filter)
    // console.log(found)
    withdrawSchema.findOneAndUpdate(filter, {$set: {status: 'pending'}}, {new: true}, (err)=>{
        if(err){
            console.log(err)
        }
    })
    res.redirect('/admin')
})

const port = process.env.PORT || 3000
app.listen(port, ()=>{
    console.log(`App started on port ${port}`)
})