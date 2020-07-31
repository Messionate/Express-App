const promoRouter = require('express').Router();
const Promos = require('../models/promotions');
const authenticate = require('../authenticate');

promoRouter.route('/')
.get((req,res,next)=>{
   
    Promos.find({})
     .then(promos => {
        res.status = 200;
        res.setHeader('Content-Type','application/json')
        res.json(promos)
     },err => next(err))
     .catch(err => console.log(err))

})

.post(authenticate.verifyUser,(req,res,next)=>{
    Promos.create(req.body)
    .then(promo => {
        res.status = 201;
        res.setHeader('Content-Type','application/json')
        res.json(promo)
    },err => next(err))
    .catch(err => console.log(err));
})

.put(authenticate.verifyUser,(req,res,next)=>{
    res.end('Put operations not supported on /promotions.');
})

.delete(authenticate.verifyUser,(req,res,next)=>{
    
    Promos.deleteMany()
    .then(resp => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp)
    },err => next(err))
    .catch(err => console.log(err));
});

promoRouter.route('/:promoId')
.get((req,res,next)=>{
  
    Promos.findById(req.params.promoId)
    .then(promo => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json')
        res.json(promo)
    },err => next(err))
    .catch(err => console.log(err));
})

.post(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.end('Post operation not suppored on promo id: ',req.params.promoId);
})

.put(authenticate.verifyUser,(req,res,next)=>{ 
   
    Promos.findByIdAndUpdate(req.params.promoId,{$set: req.body},{new : true})
    .then(promo => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json')
        res.json(promo)
    },err => next(err))
    .catch(err => console.log(err));
})

.delete(authenticate.verifyUser,(req,res,next)=>{
    
    Promos.findByIdAndDelete(req.params.promoId)
    .then(resp => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },err => next(err))
    .catch(err => console.log(err));
});

module.exports = promoRouter;