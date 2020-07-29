const dishRouter = require('express').Router();
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
        res.statusCode = 201;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    },(err) => next(err))
    .catch(err => next(err))
})

.put((req,res,next)=>{ 
    res.statusCode = 403;
    res.end('Put operation not suppored on /dishes');
})
.delete((req,res,next)=>{
    Dishes.deleteMany()
    .then(resp =>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp)
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
        res.json(resp);
    },(err) => next(err))
    .catch(err => next(err))

})

// Comments routes
dishRouter.route('/:dishId/comments')
.get((req,res,next)=>{
   
    Dishes.findById(req.params.dishId)
    .then(dish =>{
        if(dish != null){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(dish.comments);
        }else{
            err = new Error('Dish '+ req.params.dishId + ' not Found')
            err.status = 404;
            return next(err);
        }
    },(err) => next(err))
    .catch(err => next(err));


})
.post((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then(dish => {       
        if(dish != null){
            dish.comments.push(req.body);
            dish.save()
            .then(dish =>{
                res.statusCode = 201;
                res.setHeader('Content-Type','application/json');
                res.json(dish);
            },(err) => next(err))      
        }else{
            err = new Error('Dish '+ req.params.dishId + ' not Found')
            err.status = 404;
            return next(err);
        }
    },(err) => next(err))
    .catch(err => next(err))
})

.put((req,res,next)=>{ 
    res.statusCode = 403;
    res.end('Put operation not suppored on dishes/'+req.params.dishId+'/comments');
})
.delete((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then(dish =>{
        if(dish != null){
            dish.comments.splice(0,dish.comments.length);
            dish.save()
            .then(dish => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(dish);
            }, err => next(err))
        }else{
            err = new Error('Dish '+ req.params.dishId + ' not Found')
            err.status = 404;
            return next(err);
        }
    },(err) => next(err))
    .catch(err => next(err))
});

// Dish Id Route and comment Id Route
dishRouter.route('/:dishId/comments/:commentId')
.get((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then(dish => {
        if(dish == null){
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else if(dish != null && dish.comments.id(req.params.commentId) != null){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(dish.comments.id(req.params.commentId));
        } 
        else{
            err = new Error('Comment '+ req.params.commentId + ' not Found')
            err.status = 404;
            return next(err);
        }
    },err => next(err))
    .catch(err => next(err)) 
})
.post((req,res,next)=>{
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+ req.params.dishId
    + '/comments/' + req.params.commentId);
})

.put((req,res,next)=>{ 
   
    Dishes.findById(req.params.dishId)
    .then(dish => {

        if(dish == null){
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
            
        }
        else if(dish !== null && dish.comments.id(req.params.commentId) !== null){
            const {rating,comment} = req.body;
            if(rating !== null){
                dish.comments.id(req.params.commentId).rating = rating;
            }
            if(comment !== null){
                dish.comments.id(req.params.commentId).comment = comment;
            }
            dish.save()
            .then(dish => {
                res.status = 200;
                res.setHeader('Content-Type','application/json');
                res.json(dish);
            },err => next(err))
        }else{
            err = new Error('Comment '+ req.params.commentId + ' not Found')
            err.status = 404;
            return next(err);
        }     
   },err => next(err))
   .catch(err => next(err)) 
})

.delete((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then(dish =>{   
        if(dish == null){
            err = new Error('Dish with '+ req.params.dishId+ ' not Found');
            err.status = 404;
            return next(err);
        }
        else if(dish !== null && dish.comments.id(req.params.commentId) !== null){
            dish.comments.id(req.params.commentId).remove();
            dish.save()
            .then(dish => {
                res.status = 200;
                res.setHeader('Content-Type','application/json');
                res.json(dish);
            }, err => next(err))
        }
        else{
            err = new Error('Comment '+ req.params.commentId + ' not Found')
            err.status = 404;
            return next(err);
        }


    },(err) => next(err))
    .catch(err => next(err))

});


module.exports = dishRouter;