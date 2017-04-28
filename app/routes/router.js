'use strict';

var express = require('express');
var router 	= express.Router();
var knex 	= require('../db/knex');

router.get('/', function(req, res, next){
	res.render('index', { title : 'Home' });
});

router.get('/api', function(req, res, next){
	knex.raw("select count(*) as count, msgtime::date as day, date_part('hour', msgtime) as hour from event group by day, hour order by day, hour")
		.then(function(data) {
			res.json(data);
		});
});

module.exports = router;