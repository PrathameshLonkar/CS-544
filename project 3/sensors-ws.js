const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

const AppError = require('./app-error');

const OK = 200;
const CREATED = 201;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const CONFLICT = 409;
const SERVER_ERROR = 500;

const base_sensor_type='/sensor-types';

function serve(port, sensors) {
  //@TODO set up express app, routing and listen
	//console.log(sensors);
 	//console.log(port); 
	const app=express();
	app.locals.port=port;
	app.locals.model=sensors;
	setupRoutes(app);
	app.listen(port,function(){
	console.log(`listening on port ${port}`);
	});
}

module.exports = { serve:serve }

function setupRoutes(app){
	app.use(cors());
	app.use(bodyParser.json());
	app.get('/sensor-types',findSensorType(app));
	//console.log(base_sensor_type);
	app.get('/sensor-types/:id',findSensorTypeById(app));
	app.get('/sensors',findSensors(app));
	app.get('/sensors/:id',findSensorsById(app));
	app.get('/sensor-data/:sensorId',findSensorData(app));
	app.get('/sensor-data/:sensorId/:timestamp',findSensorDataByIdTs(app));
  	app.post('/sensor-types',addSensorTypes(app));
	app.post('/sensors',addSensor(app));
	app.post('/sensor-data/:sensorId',addSensorData(app));
	app.use(doErrors());   

}

function findSensorType(app){
return errorWrap(async function(req, res) {
    const q = req.query || {};
	const id=req.params.id;
    try {
	    //console.log(q);
      const results = await app.locals.model.findSensorTypes(q);
	    if (results.length === 0) {
        throw {
          
          errorCode: 'NOT_FOUND',
          message: `user ${id} not found`,
        };
	}
	else{
	var url= req.originalUrl;
	//console.log(url);
	if(results.nextIndex <= 0){
	results.self=requestUrl(req);
	}else{
	results.self=requestUrl(req);
	var url1=requestUrl(req);
	var reg=/\b_index=\b\d/ ;
	results.next=reg.test(url1) ? url1.replace(/\b_index=\b\d/,`_index=${results.nextIndex}`):url1 + `_index=${results.nextIndex}`; 
	results.prev=reg.test(url1) ? url1.replace(/\b_index=\b\d/,`_index=${results.previousIndex}`):url1 + `_index=${results.previousIndex}`;
	}
	for(var x of results.data){
	
	x.self=reqUrl(req)+'/'+'sensor-types'+'/'+x.id;
	}
      		res.json(results);
	}

    }
    catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json({error:mapped.err});
    }
  });
}
function findSensorTypeById(app){
return errorWrap(async function(req, res) {
    try {
      const id = req.params.id;
      const results = await app.locals.model.findSensorTypes({ id: id });
      if (results.length === 0) {
	throw {
	  
	  errorCode: 'NOT_FOUND',
	  message: `user ${id} not found`,
	};
      }
      else {
	var url= req.originalUrl;
        //console.log(url);
        if(results.nextIndex <= 0){
        results.self=requestUrl(req);
        }else{
        results.self=requestUrl(req);
        var url1=requestUrl(req);
        var reg=/\b_index=\b\d/ ;
        results.next=reg.test(url1) ? url1.replace(/\b_index=\b\d/,`_index=${results.nextIndex}`):url1 + `_index=${results.nextIndex}`;
        results.prev=reg.test(url1) ? url1.replace(/\b_index=\b\d/,`_index=${results.previousIndex}`):url1 + `_index=${results.previousIndex}`;
        }
        for(var x of results.data){

        x.self=reqUrl(req)+'/'+'sensor-types'+'/'+x.id;
        }
        res.json(results);
      }
    }
    catch(err) {
      const mapped = mapError(err);
      res.status(mapped.status).json({error:mapped.err});
    }
  });
}


function findSensors(app){
return errorWrap(async function(req,res){
	const id=req.params.id;
	//console.log(id);
const q = req.query || {};
    try {
            //console.log(q);
      const results = await app.locals.model.findSensors(q);
	    if (results.length === 0) {
        throw {
          
          errorCode: 'NOT_FOUND',
          message: `user ${id} not found`,
        };
	}else{
	var url= req.originalUrl;
        //console.log(url);
        if(results.nextIndex <= 0){
        results.self=requestUrl(req);
        }else{
        results.self=requestUrl(req);
        var url1=requestUrl(req);
        var reg=/\b_index=\b\d/ ;
        results.next=reg.test(url1) ? url1.replace(/\b_index=\b\d/,`_index=${results.nextIndex}`):url1 + `_index=${results.nextIndex}`;
        results.prev=reg.test(url1) ? url1.replace(/\b_index=\b\d/,`_index=${results.previousIndex}`):url1 + `_index=${results.previousIndex}`;
        }
        for(var x of results.data){

        x.self=reqUrl(req)+'/'+'sensors'+'/'+x.id;
        }

      res.json(results);
	}

    }
    catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json({error:mapped.err});
    }

});
}
function findSensorsById(app){
return errorWrap(async function(req, res) {
    try {
      const id = req.params.id;
      const results = await app.locals.model.findSensors({ id: id });
      if (results.length === 0) {
        throw {
          
          errorCode: 'NOT_FOUND',
          message: `user ${id} not found`,
        };
      }
      else {
	var url= req.originalUrl;
        //console.log(url);
        if(results.nextIndex <= 0){
        results.self=requestUrl(req);
        }else{
        results.self=requestUrl(req);
        var url1=requestUrl(req);
        var reg=/\b_index=\b\d/ ;
        results.next=reg.test(url1) ? url1.replace(/\b_index=\b\d/,`_index=${results.nextIndex}`):url1 + `_index=${results.nextIndex}`;
        results.prev=reg.test(url1) ? url1.replace(/\b_index=\b\d/,`_index=${results.previousIndex}`):url1 + `_index=${results.previousIndex}`;
        }
        for(var x of results.data){

        x.self=reqUrl(req)+'/'+'sensors'+'/'+x.id;
        }

        res.json(results);
      }
    }
    catch(err) {
      const mapped = mapError(err);
      res.status(mapped.status).json({error:mapped.err});
    }
  });

}

function findSensorData(app){
return errorWrap(async function(req, res) {
    try {
      const id = req.params.sensorId;
	   const q=req.query || {};
	    q.sensorId=id;
	    //console.log(q);

      const results = await app.locals.model.findSensorData(q);
      if (results.length === 0) {
        throw {
          
          errorCode: 'NOT_FOUND',
          message: `user ${id} not found`,
        };
      }
      else {
	results.self=requestUrl(req);
	for(var x of results.data){

        x.self=reqUrl(req)+'/'+'sensor-data'+'/'+id+'/'+x.timestamp;
        }

        res.json(results);
      }
    }
    catch(err) {
      const mapped = mapError(err);
      res.status(mapped.status).json({error:mapped.err});
    }
  });

}

function findSensorDataByIdTs(app){
return errorWrap(async function(req, res) {
    try {
      const id = req.params.sensorId;
      const ts = req.params.timestamp;
	const q={};
	    q.sensorId=id;
	    q.timestamp=ts;
	//console.log(ts);
	    //console.log(q);
	    var result1={data:[]};
      const results = await app.locals.model.findSensorData(q);
	    //console.log(results);
	for(var x of results.data){
		//console.log(x);
        
	if(Number(x.timestamp)===Number(ts)){
	result1.data.push(x);
	}
	}
      if (result1.data.length === 0) {
        throw {
          
          errorCode: 'NOT_FOUND',
          message: `no data for timestamp ${ts}`,
        };
      }
      else {
	result1.self=requestUrl(req);
	for(var x of result1.data){

        x.self=reqUrl(req)+'/'+'sensor-data'+'/'+id+'/'+x.timestamp;
        }

        res.json(result1);
      }
    }
    catch(err) {
      const mapped = mapError(err);
      res.status(mapped.status).json({error:mapped.err});
    }
  });

}
	
function addSensorTypes(app){
return errorWrap(async function(req,res){
try{
const obj=req.body;
	
	const results=await app.locals.model.addSensorType(obj);
	res.append('Location',requestUrl(req)+'/'+obj.id);
	res.sendStatus(CREATED);
}
catch(err){
const mapped=mapError(err);
	res.status(mapped.status).json({error:mapped.err});
}
});
}
function addSensor(app){
return errorWrap(async function(req,res){
try{
const obj=req.body;
        
        const results=await app.locals.model.addSensor(obj);
        res.append('Location',requestUrl(req)+'/'+obj.id);
        res.sendStatus(CREATED);
}
catch(err){
const mapped=mapError(err);
        res.status(mapped.status).json({error:mapped.err});
}
});

}

function addSensorData(app){
return errorWrap(async function(req,res){
try{
	const id=req.params.sensorId;
const obj=req.body;
	obj.sensorId=id;
        
        const results=await app.locals.model.addSensorData(obj);
        res.append('Location',requestUrl(req)+'/'+obj.id);
        res.sendStatus(CREATED);
}
catch(err){
const mapped=mapError(err);
        res.status(mapped.status).json({error:mapped.err});
}
});


}
function doErrors(app) {
	
  return async function(err, req, res, next) {
	  
    res.status(SERVER_ERROR);
    res.json({ code: 'SERVER_ERROR', message: err.message });
    console.error(err);
  };
}

function errorWrap(handler) {
  return async (req, res, next) => {
    try {
	    
      await handler(req, res, next);
    }
    catch (err) {
      next(err);
    }
  };
}

const ERROR_MAP = {
  'EXISTS': 'CONFLICT',
  'NOT_FOUND': 'NOT_FOUND'
}

function mapError(err) {
  console.error(err);
	
	return {status:NOT_FOUND,err};
}

function requestUrl(req) {
  const port = req.app.locals.port;
  return `${req.protocol}:${req.hostname}:${port}${req.originalUrl}`;
}

function reqUrl(req){
const port = req.app.locals.port;
return `${req.protocol}:${req.hostname}:${port}`;
}
//@TODO routing function, handlers, utility functions
