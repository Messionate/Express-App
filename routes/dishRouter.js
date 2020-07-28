const dishRouter = require('express').Router();
const mongoose = require('mongoose');
const Dishes = require('../models/dishes');

dishRouter.route('/')
// .all((req,res,next)=>{
//     res.statusCode = 200;
//     res.setHeader('Content-Text','text/plain');
//     next();
// })
.get((req,res,next)=>{
   
    Dishes.find({})
    .then(dishes =>{
         res.statusCode = 200;
         res.setHeader('Content-Type','application/json');
         res.json(dishes);
    },(err) => next(err))
    .catch(err => next(err));


})
.post((req,res,next)=>{
    const {name,description} = req.body;
    Dishes.create(req.body)
    .then(dish => {
        console.log('Dish Created ',dish);
        res.statusCode = 201;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    },(err) => next(err))
    .catch(err => next(err))
})

.put((req,res,next)=>{ 
    res.statusCode = 403;
    res.end('Put operation not suppored on dishes');
})
.delete((req,res,next)=>{
    Dishes.deleteMany()
    .then(resp =>{
        console.log(resp);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.send(resp)
    },(err) => next(err))
    .catch(err => next(err))
});

// Dish Id Routes
dishRouter.route('/:dishId')
.get((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then(dish => {
         res.statusCode = 200;
         res.setHeader('Content-Type','application/json')
         res.json(dish)
    },err => next(err))
    .catch(err => next(err)) 
})
.post((req,res,next)=>{
    res.statusCode = 403;
    res.end('Post operation not suppored on dish id: '+ req.params.dishId);
})

.put((req,res,next)=>{ 
   
    Dishes.findByIdAndUpdate(req.params.dishId,{
        $set: req.body
    },{new: true})
    .then(dish => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json')
        res.json(dish)
   },err => next(err))
   .catch(err => next(err)) 
})

.delete((req,res,next)=>{
    Dishes.findByIdAndDelete(req.params.dishId)
    .then(resp =>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json({"message":"Dish with given Id has been deleted."});
    },(err) => next(err))
    .catch(err => next(err))

});



module.exports = dishRouter;