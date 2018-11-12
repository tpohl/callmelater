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
    Task.find({}).where('scheduled_date').lt(new Date()).exec((err, taskArray) => {
        taskArray.forEach(task => {

            console.log('Found Task', task);
            // TODO Execute it;
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
                console.error('Cannot Execute Task', task);
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
        this.cron = new CronJob(`* * * * *`, tick).start();
    }


    private mongoSetup(): void {
        mongoose.Promise = global.Promise;
        mongoose.connect(this.mongoUrl);
    }

}

export default new App().app;