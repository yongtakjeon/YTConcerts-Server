const express = require('express');
const router = express.Router();
const Plan = require('../schemas/plan');

/*
    GET
    /api/users/:id/plans


    POST
    /api/users/:id/plans
    
    
    DELETE
    /api/users/:userId/plans/:concertId
*/

router.get('/:id/plans', async (req, res, next) => {

    try {
        const plans = await Plan.find({ userId: req.params.id });
        res.json(plans);
    } catch (err) {
        next(new Error(err.message));
    };

});

router.post('/:id/plans', async (req, res, next) => {

    const newPlan = {
        userId: req.params.id,
        concertId: req.body.concertId
    };

    try {
        const planCreated = await Plan.create(newPlan);
        res.json(planCreated);
    } catch (err) {
        if (err.code === 11000) {
            next(new Error("The concert is already added to the plans!"));
        }
        else {
            next(new Error(err.message));
        }
    };
});

router.delete('/:userId/plans/:concertId', async (req, res) => {

    try {
        const result = await Plan.deleteOne({
            userId: req.params.userId,
            concertId: req.params.concertId
        });

        if (result.deletedCount === 1) {
            res.json({ message: "The concert is deleted from your plans." });
        }
        else {
            // send to the catch block
            throw new Error();
        }

    } catch (err) {
        next(new Error("There is an error deleting the plan!"));
    };
});

module.exports = router;