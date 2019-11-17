const express = require('express')
const router = new express.Router()
const Task = require('../models/task')

router.get('/tasks', async (req,res) => {
    try{
       const tasks = await Task.find({})
       res.send(tasks)
    }catch(e) {
        res.status(500).send()
    } 
})

router.get('/tasks/:id', async (req, res) => {    
    _id = req.params.id
    try{
      const task = await Task.findById(_id)
      if(!task) {
          return res.status(404).send()
      }
      res.send(task)
    } catch(e){
        res.status(500).send()
    }        
})


router.post('/tasks' , (req,res) => {
    const task = new Task(req.body)
    task.save().then(() => {
        res.status(201).send(task)
    }).catch((e) => {
        res.status(400).send(e)
    })
})

router.patch('/tasks/:id', async (req,res) => {   
   const updates = Object.keys(req.body)
  
   const allowedUpdates = ['description', 'completed']

   const isValidUpdate = updates.every((update) => 
    allowedUpdates.includes(update))

   if(!isValidUpdate){
       return res.status(400).send({ error: "This update is not permitted"})
   }
 
   try {       
     const task = await Task.findById(req.params.id)
     updates.forEach((update) => task[update] = req.body[update])
     await task.save() 
     if(!task) {
        return res.status(404).send()
     }
     res.send(task)
   }catch(e){
        res.status(400).send(e)
   }
})

router.delete('/tasks/:id', async (req, res) => {
    _id = req.params.id
    try {        
        task = await Task.findByIdAndDelete(_id)    
        if(!task){
            return res.status(404).send("The task with the id of '"+ _id + "' was not found")
        }
        res.send( 
          "Record with the id '" + _id + "' has been successfully deleted\n" +
            task        
        )      
    }catch(e){
        res.status(500).send()
    }
})




module.exports = router 