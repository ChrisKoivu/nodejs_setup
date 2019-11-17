const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')


router.post('/users' , async (req,res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()        
        res.status(201).send({user, token})
    } catch(e) {
        res.status(400).send(e)
    }  
})

router.post('/user/login', async (req,res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    }catch(e){
        res.status(400).send()
    } 
})

router.post('/user/logout', auth, async(req,res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }

})

router.post('/users/logout/all', auth, async(req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.get('/users/profile', auth, async (req,res) => {
    try{       
        res.send(req.user)
    }catch(e){
        res.status(500).send()
    } 
    
})

router.get('/users/:id', async (req,res) => {
    _id = req.params.id
    try{
        const user = await User.findById(_id);
        if(!user) {
            return res.status(404).send('User not found')
        }
        res.send(user)
    } catch(e){
        res.status(500).send()
    }    

})

router.patch('/users/:id', async (req,res) => {   
    const updates = Object.keys(req.body)
   
    const allowedUpdates = ['name', 'age', 'email', 'password']
 
    const isValidUpdate = updates.every((update) => 
     allowedUpdates.includes(update))
 
    if(!isValidUpdate){
        return res.status(400).send({ error: "This update is not permitted"})
    }
 
    try {     
         const user = await User.findById(req.params.id)
         console.log(user)
          updates.forEach((update) =>  user[update] = req.body[update])
          await user.save()
    
         if(!user) {
             return res.status(404).send()
         }
         res.send(user)
    }catch(e){
         res.status(400).send(e)
    }
 })
 
 router.delete('/users/:id', async (req,res) => {
    _id = req.params.id
    try{
        user = await User.findByIdAndDelete(_id)
        if(!user) {
            return res.status(404).send("User with the id of '" + _id + "' was not found.")
        }
        res.send ("User with the id of '" + _id + "' has been successfully  deleted.")
    }catch(e){
        res.status(500).send()
    }    
 })


module.exports = router