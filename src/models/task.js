const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: true,
            trim:true
        },
        completed: {
            type: Boolean,
            default:false
        }
    }
)

taskSchema.pre('save', async function (next)
   {
     const task = this
     if(task.isModified('description')){
         console.log("Task has been updated, task id: " + task.id)
     }

    
     next()
   }  
)

const Task = mongoose.model('Task', taskSchema)
module.exports = Task
