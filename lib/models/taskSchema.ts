import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const TaskSchema = new Schema({
    url: {
        type: String,
        required: 'Provide an URL'
    },
    payload: {
        type: String,
        required: 'Provide some payload'
    },
    scheduled_date: {
        type: Date,
        required: 'Provide a scheduled date.'
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    retry: {
        type: Number,
        default: 0
    }
});

export const Task = mongoose.model('Task', TaskSchema);