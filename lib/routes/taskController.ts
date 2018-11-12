
import { Task } from '../models/taskSchema';
import { Request, Response } from 'express';


export class TaskController {

    public createTask(req: Request, res: Response) {
        let newTask = new Task(req.body);

        newTask.save((err, task) => {
            if (err) {
                res.send(err);
            }
            res.json(task);
        });
    }

    public getAllTasks(req: Request, res: Response) {
        Task.find({}, (err, task) => {
            if (err) {
                res.send(err);
            }
            res.json(task);
        });
    }

    public getTaskWithID(req: Request, res: Response) {
        Task.findById(req.params.taskId, (err, contact) => {
            if (err) {
                res.send(err);
            }
            res.json(contact);
        });
    }

    public scheduleTask(req: Request, res: Response) {
        Task.findOneAndUpdate({ _id: req.params.taskId }, req.body, { new: true }, (err, contact) => {
            if (err) {
                res.send(err);
            }
            res.json(contact);
        });
    }

    public deleteTask(req: Request, res: Response) {
        Task.remove({ _id: req.params.taskId }, (err, contact) => {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Successfully deleted Task!' });
        });
    }
}
