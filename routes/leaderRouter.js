const leaderRouter = require('express').Router();


leaderRouter.route('/',(req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('Will send all leaders to you');
})

.post((req,res,next)=>{
    const {name, description}  = req.body;
    res.end(`Will add the leader: ${name} with details ${description}`)
})

.put((req,res,next)=>{
    res.end('Put operations not supported on /leaders.');
})

.delete((req,res,next)=>{
    res.end('Deleting all Leaders.')
});

leaderRouter.route('/:leaderId')
.get((req,res,next)=>{
    res.end('Will send details of the leader  ' + req.params.leaderId + ' to you');
})
.post((req,res,next)=>{
    res.statusCode = 403;
    res.end('Post operation not suppored on leader id: '+ req.params.leaderId);
})

.put((req,res,next)=>{ 
    res.write('Updating the Leader: '+ req.params.leaderId +'.')
    res.end('Will update the Leader : '+ req.body.name + ' with details '+req.body.description);
})

.delete((req,res,next)=>{
    res.end('Deleting Leader : '+ req.params.leaderId);
});

module.exports = leaderRouter;
