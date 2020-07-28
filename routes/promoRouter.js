const dishPromo = require('express').Router();


dishPromo.route('/',(req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('Will send all promotions to you');
})

.post((req,res,next)=>{
    const {name, description}  = req.body;
    res.end(`Will add the promotion: ${name} with details ${description}`)
})

.put((req,res,next)=>{
    res.end('Put operations not supported on /promotions.');
})

.delete((req,res,next)=>{
    res.end('Deleting all promotions.')
});

dishPromo.route('/:promoId')
.get((req,res,next)=>{
    res.end('Will send details of the promo  ' + req.params.promoId + ' to you');
})
.post((req,res,next)=>{
    res.statusCode = 403;
    res.end('Post operation not suppored on promo id: '+ req.params.promoId);
})

.put((req,res,next)=>{ 
    res.write('Updating the Promotion: '+ req.params.promoId +'.')
    res.end('Will update the Promotion : '+ req.body.name + ' with details '+req.body.description);
})

.delete((req,res,next)=>{
    res.end('Deleting Promotion : '+ req.params.promoId);
});

module.exports = dishPromo;