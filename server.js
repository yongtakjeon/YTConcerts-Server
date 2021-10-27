const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const Plan = require('./schemas/plan');

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

mongoose.connect('mongodb+srv://dbUser:456654@cluster0.svjg9.mongodb.net/YTConcerts_plansAPI?retryWrites=true&w=majority',
    {},
    (error) => {
        if (error) {
            console.log('DB connection failed');
        }
        else {
            console.log('DB conncetion success');
        }
    });


// middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


app.get('/', (req, res) => {
    res.send("Hello. This is YT concert's server.");
});


/*
    GET
    /api/users/:id/plans


    POST
    /api/users/:id/plans
    
    
    DELETE
    /api/users/:userId/plans/:concertId
*/


app.get('/api/users/:id/plans', async (req, res) => {

    try {
        const plans = await Plan.find({userId: req.params.id});
        res.json(plans);
    } catch (err) {
        res.json({
            error: {
                message: err.message
            }
        });
    };

})

app.post('/api/users/:id/plans', async (req, res) => {

    const newPlan = {
        userId: req.params.id,
        concertId: req.body.concertId
    };

    try {
        const planCreated = await Plan.create(newPlan);
        res.json(planCreated);
    } catch(err) {

        // console.log(err)

        if(err.code === 11000) {
            res.json({
                error: {
                    message: "The concert is already added to the plan!"
                }
            });
        }
        else {
            res.json({
                error: {
                    message: err.message
                }
            });
        }
        
    };
    
    
})


app.delete('/api/users/:userId/plans/:concertId', async (req, res) => {

    try {

        const result = await Plan.deleteOne({
            userId: req.params.userId,
            concertId: req.params.concertId
        });


        if(result.deletedCount === 1) {
            res.json({ message: "The concert is deleted from your plan."});
        }
        else {

            // send to the catch block
            throw new Error();
        }

    } catch (err) {

        res.json({
            error: {
                message: "There is an error deleting the plan!"
            }
        });

    };
})



app.listen(HTTP_PORT, () => {
    console.log("Server on: " + HTTP_PORT);
});
