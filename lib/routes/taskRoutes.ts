import { Request, Response } from "express";

import { TaskController } from "./taskController";


export class Routes {

    public taskController: TaskController = new TaskController();

    public routes(app): void {

        app.route('/')
            .get((req: Request, res: Response) => {
                res.status(200).send({
                    message: 'GET request successfulll!!!!'
                })
            })

        // Contact 
        app.route('/tasks')
            // GET endpoint 
            .get((req: Request, res: Response) => {
                // Get all contacts            
                res.status(200).send({
                    message: 'GET request successfulll!!!!'
                })
            })
            // POST endpoint
            .post(this.taskController.createTask)
        /*
        .post((req: Request, res: Response) => {   
        // Create new contact         
            res.status(200).send({
                message: 'POST request successfulll!!!!'
            })
        })
        */

        // Contact detail
        app.route('/tasks/:taskId')
            // get specific contact
            .get(this.taskController.getTaskWithID)
            .put(this.taskController.scheduleTask)
            .delete(this.taskController.deleteTask)
    }
}