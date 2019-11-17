 
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27018/task-manager-api', 
{
    useNewUrlParser: true, 
    useUnifiedTopology:true,
    useCreateIndex:true,
    // turn off deprecation warning
    useFindAndModify:false
})

