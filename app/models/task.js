var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TaskSchema   = new Schema({
    id: Number,
    description: String,
    done: Boolean,
    dueDate: Date,
    priority: Number
});

module.exports = mongoose.model('Task', TaskSchema);