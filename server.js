import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import winston from 'winston';

import Task from './models/task';

// Logging level
//winston.level = process.env.LOG_LEVEL

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL,
    format: winston.format.json(),
    // You can also comment out the line above and uncomment the line below for JSON format
    // format: format.json(),
    transports: [
        //new winston.transports.Console(),
        new winston.transports.File({ filename: './logs/logfile.log' })
      ]
  });

const port = 8001;
const hostname = "localhost";

const app = express();
const router = express.Router();

//Setup to use cors - attach middleware cors
app.use(cors());

//Setup to parse jason data in requests
app.use(bodyParser.json());

//Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Tasks');

const connection = mongoose.connection;

connection.once('open', () => {
    logger.info("Connected to MongoDB Successfully!!");
});

//Attach end points for the router
router.route('/tasks').get((req, res) => {
    logger.info('Request Received!');

    Task.find((err, tasks) => {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).json(tasks);
        }
    });
});

router.route('/tasks/:id').get((req, res) => {
    Task.findById(req.params.id, (err, task) => {
        if (err) {
            logger.info({ "message":"Error Getting the Task",
                          "Task ID": req.params.id,
                          "Error": err
                        });
            res.status(400).json({});
        } else {
            res.json(task);
        }
    });
});

router.route('/tasks/add').post((req, res) => {
    logger.info({ "message":"Adding New Task: ",
                  "req.body": req.body
                });    
    let task = new Task(req.body);
    task.save()
        .then(task => {
            res.status(200).json({'issue': 'Added Successfully'});
            logger.info({ "message":"Adding Successfully"});
        })
        .catch(err => {
            res.status(400).send('Failed to create new record');
            logger.info({ "message":"Add Failed"});
        });
});

router.route('/tasks/update/:id').post((req, res) => {
    logger.info({ "message":"Updating Task: ",
                  "req.params.id": req.params.id,
                  "req.body": req.body
                });
    Task.findById(req.params.id, (err, task) => {
        if (!task)
            return next(new Error('Could not load the document'));
        else {
            task.task = req.body.task;
            task.start_date = req.body.start_date;
            task.end_date = req.body.end_date;
            task.priority = req.body.priority;
            if (req.body.parent !== undefined) {
                task.parent = req.body.parent;
            }
            task.save().then(task => {
                res.status(200).json('Update Done');
            }).catch(err => {
                res.status(400).send('Update Failed!');
            });
        }
    });
});

router.route('/tasks/delete/:id').get((req, res) => {
    logger.info("Deleting Task: ", req.params.id);
    Task.findByIdAndRemove({_id: req.params.id}, (err, task) => {
        if (err) {
            res.json('Error deleting issue');
        } else {
            res.json('Removed Successfully');
        }
    });
});

router.route('/tasks/endtask/:id').get((req, res) => {
    logger.info("Ending Task: ", req.params.id);
    Task.findById(req.params.id, (err, task) => {
        if (!task)
            return next(new Error('Could not load the document'));
        else {
            task.task = task.task;
            task.start_date = task.start_date;
            task.end_date = task.end_date;
            task.priority = task.priority;
            task.parent = task.parent;
            task.finished = "true";
            task.save().then(task => {
                res.json('Ended the task');
            }).catch(err => {
                res.status(400).send('End Task Failed!');
            });
        }
    });
});

// Attach another middleware - router
app.use('/', router);

//app.get('/', (req, res) => res.send("My First Ever Node/Express Server: Hello World, I have Arrived!!"));

var server = app.listen(port, hostname, () => {
    logger.info(`My First ever Express Server running on Port ${hostname}:${port}`);
});

module.exports = server;