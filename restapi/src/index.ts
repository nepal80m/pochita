// import express, { json } from 'express';
import * as express from 'express';
import { set, connect } from 'mongoose';
import userRouter from './routes/userRoutes';
import NIDRouter from './routes/NIDRoutes';
import CTZRouter from './routes/CTZRoutes';
import DVLRouter from './routes/DVLRoutes';
import { Connection } from './connection';
import auth from './middlewares/auth';
const utf8Decoder = new TextDecoder();

new Connection().init();

const app = express();
var cors = require('cors');
app.use(cors());

app.use(express.json());


app.use('/users', userRouter);
app.use('/nid', NIDRouter);
app.use('/ctz', CTZRouter);
app.use('/dvl', DVLRouter);
app.get('/', (req, res) => {
    res.send('chalyo')
});



set("strictQuery", false);
connect("mongodb+srv://testuser:testuser@cluster0.teegdcn.mongodb.net/?retryWrites=true&w=majority")
    .then(() => {
        app.listen(3000, () => {
            console.log('listening on port 3000');
        });

    })
    .catch((error) => {
        console.log(error)
    })