const express = require('express');
const commentRouter = express.Router();

const mongoose = require('mongoose');
const Comments = require('../models/comments');
const cors = require('./cors');
const authenticate = require('../authenticate');

commentRouter
  .route("/")
  .options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
  .get(cors.cors,(req, res, next) => {
    Comments.find(req.query)
      .populate('author')
      .then(comments => {
      	res.statusCode = 200;
      	res.setHeader('Content-Type','application/json');
      	res.json(comments);
      })
      .catch(err => next(err));
  })
  .post(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
  	
  	if(req.body != null){
  		req.body.author = req.user._id;

  		Comments.create(req.body)
  		.then(comment => {
  			Comments.findById(comment._id)
  			.populate('author')
  			.then(comment => {
  				res.statusCode = 200;
  				res.setHeader('Content-Type','application/json');
  				res.json(comment);
  			}).catch(err => next(err))
  		}).catch(err => next(err));


  	}else{
  		err = new Error('comment not found in body of request');
  		err.statusCode = 404;
  		return next(err);
  	}
  })


  .put(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(
      "Put operation not suppored on dishes/" + req.params.dishId + "/comments"
    );
  })
  .delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Comments.deleteMany()
      .then(resp => {	
      		res.statusCode = 200;
  			res.setHeader('Content-Type','application/json');
  			res.json(resp);
      },err => next(err))
      .catch(err => next(err));
  });

// Dish Id Route and comment Id Route
commentRouter
  .route("/:commentId")
  .options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
  .get(cors.cors,(req, res, next) => {
    Comments.findById(req.params.commentId)
      .populate('author')
      .then(comment => {
            res.statusCode = 200;
  			res.setHeader('Content-Type','application/json');
  			res.json(comment);
        })
      .catch(err => next(err));
  })

  .post(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(
      "POST operation not supported on /comments/commentId" 
    );
  })

  .put(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    Comments.findById(req.params.commentId)
      .then(
        comment => {

          if (comment != null){
	            if(comment.author.equals(req.user._id)){              
	              req.body.author = req.user._id;
	      			
	              Comments.findByIdAndUpdate(req.user._id,{$set:req.body},{new:true})
	              .then(comment =>{

	              	Comments.findById(comment._id)
	              	.populate('author')
	              	.then(comment => {
	              		res.statusCode = 200;
	              		res.setHeader("Content-Type",'application/json');
	              		res.json(comment);
	              	})
	              	.catch(err => next(err))
	              })
	              .catch(err => next(err))
	          }else{
	            err = new Error("You are not Authorized to Update this Comment.");
	            err.status = 403;
	            return next(err);
	          }
          }else{
                err = new Error("Comment " + req.params.commentId + " not Found");
                err.status = 404;
                return next(err);
          }
        },
         err => next(err)
      )
      .catch(err => next(err));
  })

  .delete(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    Comments.findById(req.params.commentId)
      .then(
        comment => {      
        if (comment != null){
            if(comment.author.equals(req.user._id)){ 
                Comments.findByIdAndDelete(comment._id)
                .then(comment => {
                      res.status = 200;
                      res.setHeader("Content-Type", "application/json");
                      res.json({msg:'The comment has been deleted.',"comment":comment});
                }) 
                .catch(err => next(err));
            }else{
              err = new Error("You are not Authorized to Delete this Comment.");
              err.status = 403;
              return next(err);
            }

          }else{
            err = new Error("Comment " + req.params.commentId + " not Found");
            err.status = 404;
            return next(err);
      	}
    })
    .catch(err => next(err));
});


module.exports = commentRouter;


