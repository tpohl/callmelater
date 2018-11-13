import * as express from "express";
import * as bodyParser from "body-parser";
import { Routes } from "./routes/taskRoutes";
import * as mongoose from "mongoose";
import * as request from "request-promise-native";
import { CronJob } from "cron";
import { Task } from "./models/taskSchema";

const MONGODB_URI = process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/taskDb';

const tick = function () {
    console.log('Cron Tick');
    Task.find({})
        .where('scheduled_date').lt(new Date())
        .where('retry').lt(6)
        .exec((err, taskArray) => {
            taskArray.forEach(task => {
                console.log('Found Task', task);
                request({
                    method: 'POST',
                    uri: task.url,
                    body: task.payload,
                    json: false,
                    headers: {
                        'content-type': 'text/plain'
                    }
                }).then((result) => {
                    console.log('Executed Task', task);
                    Task.remove({ _id: task._id }, (err, t2) => {
                        if (err) {
                            console.error('Could not delete task', task)
                        }

                    });
                }, err => {
                    console.error('Cannot Execute Task', err, task);
                    task.retry = task.retry ? (task.retry + 1) : 1;
                    Task.findOneAndUpdate({ _id: task._id }, task, { new: true }, (err, tasknew) => {
                        if (err) {
                            console.error('Adding retry failed', err, task);
                        }
                        else {
                            console.log('Updated retry for task', tasknew.retry, task.retry, task._id);
                        }
                    });
                });
        });
});
}

class App {

    public app: express.Application;
    public routePrv: Routes = new Routes();
    public mongoUrl: string = MONGODB_URI;

    private cron;

    constructor() {
        this.app = express();
        this.config();
        this.routePrv.routes(this.app);
        this.mongoSetup();
        tick();
    }

    private config(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        // Schedule the Cron
        this.cron = new CronJob(`*/5 * * * *`, tick).start();
    }


    private mongoSetup(): void {
        mongoose.Promise = global.Promise;
        mongoose.connect(this.mongoUrl);
    }

}

export default new App().app;