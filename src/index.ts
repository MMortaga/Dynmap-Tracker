import express from 'express';
import dotenv from 'dotenv';
import { track } from './controllers/track';
import { homepage } from './controllers/homepage';
import { audio } from './controllers/audio';

const app = express();
dotenv.config();

const port = process.env.PORT || 8080;

app.get('/track', track);
app.get('/audio.wav', audio);
app.get('/', homepage);

app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log(`Server started at http://localhost:${port}` );
} );