const express = require('express');
const favRouter = express.Router();
const authenticate = require('../authenticate');
const cors = require('./cors');
const Favorites = require('../models/favorite');
const Dishes = require('../models/dishes');



favRouter
.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.cors,authenticate.verifyUser, (req,res,next)=>{
	
	Favorites.findOne({user:req.user._id})
	.populate('user')
	.populate('dishes')
	.then(fav => {
			res.status = 200;
			res.setHeader('Content-Type','application/json');
			res.json(fav)
	}).catch(err => next(err))

})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{

	let arr = []	
	for(let i=0;  i < req.body.length; i++){
			arr[i] = req.body[i]._id	
		}

	Dishes.find({
		'_id':{
			$in:arr
		}
	}).then(dishes => {

		if(dishes != null){
		Favorites.findOne({user:req.user._id})
	.then(fav => {
		if(fav != null){
			let err = []
			for(let i=0; i<arr.length; i++){
				if(fav.dishes.includes(arr[i])){	
					let msg ="This dish with id "+arr[i]+" is already in your favourites list." 
					err.push(msg)
				}
			}
			if(err.length > 0){
				res.status = 409;
				res.setHeader('Content-Type','application/json');
				res.json(err)
			}else{
				fav.dishes = fav.dishes.concat(arr)
				fav.save().then(result => {
				res.status = 201;
				res.setHeader('Content-Type','application/json');
				res.json(result)
			}).catch(err => next(err))
			}
		}else{
			Favorites.create({user:req.user._id})
			.then(fav => {
				fav.dishes = arr;
				fav.save().then(result => {
					res.status = 201;
					res.setHeader('Content-Type','application/json');
					res.json(result)
				}).catch(err => next(err))
			})
			.catch(err => next(err))
		}
	}).catch(err => next(err))	

		}else{
			err = new Error('The requested ids dishes are not found.')
			err.status = 404;
			return next(err);
		}
	}).catch(err => next(err))
})

.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res)=>{

	Favorites.deleteOne({user:req.user._id})
	.then(result => {
		res.statusCode = 200;
		res.setHeader("Content-Type", "application/json");
		res.json(result);
	})
	.catch(err => next(err));
});


favRouter
.route('/:dishId')
.post(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
	Dishes.findById(req.params.dishId)
	.then(dish => {

		if(dish != null){
			
		Favorites.findOne({user:req.user._id})
			.then(fav => {

			if(fav != null){
			
			if(fav.dishes.includes(req.params.dishId))
			{	
				res.status = 409;
				res.setHeader('Content-Type','application/json');
				res.json({msg:"This dish is already in your favourites list."})
			}else{
				fav.dishes.push(req.params.dishId)
				fav.save().then(result => {
					res.status = 201;
					res.setHeader('Content-Type','application/json')
					res.json(result)
				}).catch(err => next(err))
			}
		}
		else{
			Favorites.create({
				user:req.user._id,
				dishes:req.params.dishId
			})
			.then(result => {
				result.status = 201;
				res.setHeader('Content-Type','application/json');
				res.json(result)
			})	
			.catch(err => next(err))
	}
	}).catch(err => next(err))
		}else{
			err = new Error('Dish with given id does not exist')
			err.status = 404;
			return next(err);
		}
	}).catch(err => next(err))
})

favRouter
.route('/:dishId')
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
		Dishes.findById(req.params.dishId)
		.then(dish => {

		if(dish != null){	

		Favorites.findOne({user:req.user._id})
		.then(fav => {
		if(fav != null){
		
			if(fav.dishes.includes(req.params.dishId)){
				const dishes = fav.dishes.filter(id => id.toString() !== req.params.dishId.toString())				
				fav.dishes = dishes;
				fav.save().then(result => {
					res.status = 200;
					res.setHeader('Content-Type','application/json')
					res.json(result)
				}).catch(err => next(err));
			}else{
				res.status = 409;
				res.setHeader('Content-Type','application/json')
				res.json({msg:'The dish with given id is not included in your favourites list'})
			}
		}else{
			err = new Error('You do not have Favorites list.')
			err.status = 409;
			res.json(err);
		}
	})
	.catch(err => next(err))
		}else{
			err = new Error('Dish with given id does not exist')
			err.status = 404;
			return next(err);
		}
	}).catch(err => next(err))

})





module.exports = favRouter;