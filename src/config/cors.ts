import { CorsOptions } from 'cors';

export const corsConfig: CorsOptions = {
    origin: function (origin, callback) {
        console.log('origin:', origin);
        const whitelist = [process.env.FRONTEND_URL];

        if (process.argv[2] === '--api') {
            whitelist.push(undefined); // Allow undefined origin as Thunderclient and Postman
        }

        if (whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};
