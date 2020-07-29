const leaderRouter = require('express').Router();
const Leaders = require('../models/leaders');

leaderRouter.route('/')
.get((req,res,next)=>{
    
    Leaders.find({})
    .then(leaders => {
        res.status = 200;
        res.setHeader('Content-Type','application/json')
        res.json(leaders)
    },err => next(err))
    .catch(err => console.log(err))
})

.post((req,res,next)=>{
    
    Leaders.create(req.body)
    .then(leader => {
        res.status = 200;
        res.setHeader('Content-Type','application/json')
        res.json(leader)
    },err => next(err))
    .catch(err => console.log(err))
})

.put((req,res,next)=>{
    res.end('Put operations not supported on /leaders.');
})

.delete((req,res,next)=>{
   
    Leaders.deleteMany()
    .then(resp => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp)
    },err => next(err))
    .catch(err => console.log(err))

});

leaderRouter.route('/:leaderId')
.get((req,res,next)=>{
   
    Leaders.findById(req.params.leaderId)
    .then(leader => {
         res.statusCode = 200;
         res.setHeader('Content-Type','application/json')
         res.json(leader)
    },err => next(err))
    .catch(err => next(err)) 


})
.post((req,res,next)=>{
    res.statusCode = 403;
    res.end('Post operation not suppored on leader id: '+ req.params.leaderId);
})

.put((req,res,next)=>{ 
    Leaders.findByIdAndUpdate(req.params.leaderId,{
        $set: req.body
    },{new: true})
    .then(leader => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json')
        res.json(leader)
   },err => next(err))
   .catch(err => next(err)) 
})

.delete((req,res,next)=>{
    Leaders.findByIdAndDelete(req.params.leaderId)
    .then(resp =>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err) => next(err))
    .catch(err => next(err))
});

module.exports = leaderRouter;
