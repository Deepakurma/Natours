import express from 'express';
import morgan from 'morgan';
import tourRouter from './routes/tourRoutes.js';
import { fileURLToPath } from 'url';
import userRouter from './routes/userRoutes.js';
import { dirname } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//middlewares----------------------------------------------------------------

app.use(express.json());
app.use(express.static(`${__dirname}/public`));


app.use((req, res, next) => {
   req.requestTime = new Date().toISOString();
   next();
});




//routes----------------------------------------------------------------




// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTours);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.use('/api/v1/tours', tourRouter);

app.use('/api/v1/users', userRouter);

//server----------------------------------------------------------------

export default app;