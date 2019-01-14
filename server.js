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
        if (err) 
            console.log(err);
        else {
            res.json(tasks);
        }
    });
});

router.route('/tasks/:id').get((req, res) => {
    Task.findById(req.params.id, (err, task) => {
        if (err)
            console.log(err);
        else {
            res.json(task);
        }
    });
});

router.route('/tasks/add').post((req, res) => {
    let task = new Task(req.body);
    task.save()
        .then(task => {
            res.status(200).json({'issue': 'Added Successfully'});
        })
        .catch(err => {
            res.status(400).send('Failed to create new record');
        });
});

router.route('/tasks/update/:id').post((req, res) => {
    Task.findById(req.params.id, (err, task) => {
        if (!task)
            return next(new Error('Could not load the document'));
        else {
            task.task = req.body.task;
            task.start_date = req.body.start_date;
            task.end_date = req.body.end_date;
            task.priority = req.body.priority;
            task.parent = req.body.parent;
            task.save().then(task => {
                res.json('Update Done');
            }).catch(err => {
                res.status(400).send('Update Failed!');
            });
        }
    });
});

router.route('/tasks/delete/:id').get((req, res) => {
    Task.findByIdAndRemove({_id: req.params.id}, (err, task) => {
        if (err) {
            res.json('Error deleting issue');
        } else {
            res.json('Removed Successfully');
        }
    });
});

// Attach another middleware - router
app.use('/', router);

//app.get('/', (req, res) => res.send("My First Ever Node/Express Server: Hello World, I have Arrived!!"));

app.listen(port, hostname, () => {
    logger.info(`My First ever Express Server running on Port ${hostname}:${port}`);
});

