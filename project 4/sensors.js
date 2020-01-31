'use strict';

const assert = require('assert');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const querystring = require('querystring');

const mustache = require('mustache');
const widgetView = require('./widget-view');

const STATIC_DIR = 'statics';
const TEMPLATES_DIR = 'templates';
let nextindex=0;
function serve(port, model, base='') {
  //@TODO

  const app = express();
  app.locals.port = port;
  app.locals.base = base;
  app.locals.model = model;
  process.chdir(__dirname);
  app.use(base,express.static(STATIC_DIR));
  setupTemplates(app);
  setupRoutes(app);
  app.listen(port, function() {
    console.log(`listening on port ${port}`);
  });

}




module.exports = serve;

//@TODO

function setupRoutes(app) {
  const base = app.locals.base;
  app.get(`${base}/sensor-types.html`, doSearch(app));
  app.get(`${base}/sensors.html`, doSearchSensor(app));
  app.get(`${base}/add-sensor-types.html`, createUserForm(app));
  app.post(`${base}/sensor-types.html`, bodyParser.urlencoded({extended: false}),createUpdateUser(app));
  app.get(`${base}/add-sensors.html`, createSensorsForm(app));
  app.post(`${base}/addSensors.html`, bodyParser.urlencoded({extended: false}),createSensorsUser(app));
  app.get(`${base}/nextIndex.html`, getnextindex(app,'sensor-types')); //must be last
  app.get(`${base}/nextIndexSensors.html`, getnextindex(app,'sensors'));


}
const ID={name: 'Sensor Type ID',label: 'Input 1',type:'text'};
const MEASURE={name: 'Measure',label: 'Select 1 widget',type:'select'}
const OPT={value:['Temperature','Relative Humidity','Pressure','Flow Rate']};
const temp1=getwidget(MEASURE,OPT);
temp1.friendlyName=temp1.name;
const temp2=getwidget(ID,{})
//console.log(temp1);

const FIELDS_INFO = {
	title:{title:'Search Sensor Types'},
  id:{
    friendlyName: 'Sensor Type ID',
    isSearch: true,
    isId: true,
    regex: /[\w\-\d\W]+$/,
    error: 'User Id field cannot contain alphanumerics or _',
  },
  modelNumber: {
    friendlyName: 'Model Number',
    isSearch: true,
    regex: /[a-zA-Z0-9]/,
    error: "First Name field can only contain alphabetics, -, ' or space",
  },
	manufacturer:{
    friendlyName: 'Manufacturer',
    isSearch: true,
    regex: /^[a-zA-Z\-\' ]+$/,
    error: "Last Name field can only contain alphabetics, -, ' or space",
  },
	quantity:{
		friendlyName: 'Measure',
		type: 'text',
		isSearch: true,
		regex: /[a-zA-Z]/,
		
		}
	
};

const FIELDS_INFO_SEARCH_SENSOR = {
        title:{title:'Search Sensor'},
  id:{
    friendlyName: 'Sensor ID',
    isSearch: true,
    isId: true,
    regex: /[\w\-\d]+$/,
    error: 'User Id field cannot contain alphanumerics or _',
  },
  model: {
    friendlyName: 'Model',
    isSearch: true,
    regex: /[a-zA-Z0-9]/,
    error: "First Name field can only contain alphabetics, -, ' or space",
  },
        period:{
    friendlyName: 'Period',
    isSearch: true,
    regex: /^[0-9]/,
    error: "Last Name field can only contain alphabetics, -, ' or space",
  },

};


const FIELDS_INFO_ADD_SENSOR_TYPES = {
	title:{title:'Add Sensor Type' },
  id:{
    friendlyName: 'Sensor Type ID',
    isSearch: true,
    isId: true,
    regex: /[\w\-\d]+$/,
    error: 'User Id field cannot contain alphanumerics or _',
  },
  modelNumber: {
    friendlyName: 'Model Number',
    isSearch: true,
    regex: /[a-zA-Z0-9]/,
    error: "First Name field can only contain alphabetics, -, ' or space",
  },
        manufacturer:{
    friendlyName: 'Manufacturer',
    isSearch: true,
    regex: /^[a-zA-Z\-\' ]+$/,
    error: "Last Name field can only contain alphabetics, -, ' or space",
  },
        quantity:{
                friendlyName: 'Measure',
                type: 'text',
                isSearch: true,
                regex: /[a-zA-Z]/,
                
                },
	unit:{
		friendlyName:'Unit',
		type:'text',
		isSearch:true,
		regex:/[a-zA-z0-9]/,
	},
	limitsMin:{
			friendlyName:'Limits Minimum',
			type:'text',
			isSearch: true,
			regex:/[0-9]/,
		},
		limitsMax:{
			friendlyName:'Limits Maximum',
			type: 'text',
			isSearch:true,
			regex:/[0-9]/
		},
	
        

};

const FIELDS_INFO_ADD_SENSOR = {
        title:{title:'Add Sensor' },
  id:{
    friendlyName: 'Sensor ID',
    isSearch: true,
    isId: true,
    regex: /[\w\-\d]+$/,
    error: 'User Id field cannot contain alphanumerics or _',
  },
  model: {
    friendlyName: 'Model',
    isSearch: true,
    regex: /[a-zA-Z0-9]/,
    error: "First Name field can only contain alphabetics, -, ' or space",
  },
        period:{
                friendlyName: 'Period',
                type: 'text',
                isSearch: true,
                regex: /[0-9]/,

                },
        expectedMin:{
	               friendlyName:'Expected Minimum',
                        type:'text',
                        isSearch: true,
                        regex:/[0-9]/,
                },
                expectedMax:{
                        friendlyName:'Expected Maximum',
                        type: 'text',
                        isSearch:true,
                        regex:/[0-9]/
                },



};

const NEXT_DB={
'sensor-types':'sensor-types',
'sensors':'sensors',
}

const FIELDS =
  Object.keys(FIELDS_INFO).map((n) => Object.assign({name: n}, FIELDS_INFO[n]));

const FIELDS1 =
  Object.keys(FIELDS_INFO_ADD_SENSOR_TYPES).map((n) => Object.assign({name: n}, FIELDS_INFO_ADD_SENSOR_TYPES[n]));

const FIELDS2 =
  Object.keys(FIELDS_INFO_SEARCH_SENSOR).map((n) => Object.assign({name: n}, FIELDS_INFO_SEARCH_SENSOR[n]));

const FIELDS3 =
  Object.keys(FIELDS_INFO_ADD_SENSOR).map((n) => Object.assign({name: n}, FIELDS_INFO_ADD_SENSOR[n]));

function setupTemplates(app) {
  app.templates = {};
  for (let fname of fs.readdirSync(TEMPLATES_DIR)) {
    const m = fname.match(/^([\w\-]+)\.ms$/);
    if (!m) continue;
    try {
      app.templates[m[1]] =
	String(fs.readFileSync(`${TEMPLATES_DIR}/${fname}`));
    }
    catch (e) {
      console.error(`cannot read ${fname}: ${e}`);
      process.exit(1);
    }
  }
}

function getnextindex(app,type){

	

  return async function(req, res) {
	  let field;
	  if(NEXT_DB[type]=='sensor-types'){
	  field=NEXT_DB[type];
	  }else if(NEXT_DB[type]=='sensors'){
	  field=NEXT_DB[type];
	  }
	  let search={_index:nextindex};
	  let users = await app.locals.model.list(field,search);

	
	  let errors=undefined;
	  //errors = validate(search,'SearchSensorTypes');
	  for(let [key,value]of Object.entries(users)){
                  if(key=='nextIndex'){
                  nextindex=value;
                  }
                  }
                  
	
	  let template=field;
	  let model;
	  if (Object.keys(users).length > 0) {
      //let template = 'sensor-types';
	if(field=='sensor-types'){
     model={base: app.locals.base,
    errors: errors,
    Users:users["data"],

             STNext:1,
        fields:FIELDS,
             UserHead:1,


        }
	}else if(field=='sensors'){
	model={
	base: app.locals.base,
    errors: errors,
    SensorData:users["data"],
        fields:FIELDS2,
             SensorNext:1,
             SensorHead:1

	}
	}

    }
    else {
      template = field;
      model = errorModel(app, search, errors);
    }
    const html = doMustache(app, template, model);
    res.send(html);
  };

}

function createUserForm(app) {
  return async function(req, res) {
    const model = { base: app.locals.base, fields: FIELDS1 };
    const html = doMustache(app, 'addSensorType', model);
    res.send(html);
  };
};

function createSensorsForm(app) {
  return async function(req, res) {
    const model = { base: app.locals.base, fields: FIELDS3 };
    const html = doMustache(app, 'addSensors', model);
    res.send(html);
  };
};


function doSearch(app) {
  return async function(req, res) {
    const isSubmit = req.query.submit !== undefined;
    let users = [];
    let errors = undefined;
	 let empt={};
	  empt=req.query;

    const search = getNonEmptyValues(req.query,'SearchSensorTypes');
	  
	  if(Object.keys(search).length == 0){

      users = await app.locals.model.list('sensor-types',search);
        
	var senDetails = Object.keys(users).map(key=>users[key])
		  
		  for(let [key,value]of Object.entries(users)){
		  if(key=='nextIndex'){
		  nextindex=value;
		  }
		  }
		  
		  
	 }
    if (isSubmit) {
      errors = validate(search,'SearchSensorTypes');
      if (Object.keys(search).length == 0) {
	const msg = 'at least one search parameter must be specified';
	errors = Object.assign(errors || {}, { _: msg });
      }
	if (!errors) {
	const q = querystring.stringify(search);
	try {
	  users = await app.locals.model.list('sensor-types',search);
		
	var senDetails = Object.keys(users).map(key=>users[key])
		//console.log(users);
		//console.log(users["data"]);
	}
	catch (err) {
          console.error(err);
	  errors = wsErrors(err);
	}
	if (Object.keys(users).length === 0) {
	  errors = {_: 'no users found for specified criteria; please retry'};
	}
      }
    }
    let model, template;
    if (Object.keys(users).length > 0) {
      template = 'sensor-types';
	
     model={
    base: app.locals.base,
    errors: errors,
    Users:users["data"],

	     STNext:1,
	fields:FIELDS,
	     UserHead:1,
    
	}
    
    }
    else {
      template =  'sensor-types';
      model = errorModel(app, search, errors);
    }
    const html = doMustache(app, template, model);
    res.send(html);
  };
};

function doSearchSensor(app) {
  return async function(req, res) {
    const isSubmit = req.query.submit !== undefined;
    let users = [];
    let errors = undefined;
         let empt={};
          empt=req.query;
          
    const search = getNonEmptyValues(req.query,'SearchSensors');
          
          if(Object.keys(search).length == 0){

      users = await app.locals.model.list('sensors',search);
        
                  
        //var senDetails = Object.keys(users).map(key=>users[key])
                 

         }
    if (isSubmit) {
      errors = validate(search,'SearchSensors');
      if (Object.keys(search).length == 0) {
        const msg = 'at least one search parameter must be specified';
        errors = Object.assign(errors || {}, { _: msg });
      }
        if (!errors) {
        const q = querystring.stringify(search);
        try {
          users = await app.locals.model.list('sensors',search);

        //var senDetails = Object.keys(users).map(key=>users[key])
                //console.log(users);
                //console.log(users["data"]);
        }
	catch (err) {
          console.error(err);
          errors = wsErrors(err);
        }
        if (Object.keys(users).length === 0) {
          errors = {_: 'no users found for specified criteria; please retry'};
        }
      }
    }
    let model, template;
    if (Object.keys(users).length > 0) {
      template = 'sensors';

     model={
    base: app.locals.base,
    errors: errors,
    SensorData:users["data"],
        fields:FIELDS2,
	     SensorNext:1,
	     SensorHead:1

        }

    }
    else {
      template =  'sensors';
      model = errorModel(app, search, errors);
    }
    const html = doMustache(app, template, model);
    res.send(html);
  };
};


function createUpdateUser(app) {
  return async function(req, res) {
	  let query={};
	  query.limits={};
    const user = getNonEmptyValues(req.body,'AddSensorType');
	  for(let [key,value] of Object.entries(user)){
	  if(key=='limitsMin'){
	  query.limits["min"]=value;
	  }else if(key=='limitsMax'){
	  query.limits["max"]=value;
	  }else{
	  query[key]=value;
	  }
	  }
	//console.log(query);
    let errors = {};
    const isSubmit = req.body.submit !==undefined;
    
	   
      try {
	if (isSubmit) {
		
	  await app.locals.model.update('sensor-types',query);
	//model = errorModel(app, search, errors,);
	
		let model={base: app.locals.base, fields: FIELDS1}
		let template='addSensorType';
	const html = doMustache(app,'addSensorType', model);
    res.send(html);

	}
	
	
      }
      catch (err) {
	console.error(err);
	errors = wsErrors(err);
      }
  }    
};


function createSensorsUser(app) {
  return async function(req, res) {
          let query={};
          query.expected={};
    const user = getNonEmptyValues(req.body,'AddSensors');
          for(let [key,value] of Object.entries(user)){
          if(key=='expectedMin'){
          query.expected["min"]=value;
          }else if(key=='expectedMax'){
          query.expected["max"]=value;
          }else{
          query[key]=value;
          }
          }
        
    let errors = {};
    const isSubmit = req.body.submit !==undefined;

            
      try {
        if (isSubmit) {
                
          await app.locals.model.update('sensors',query);
        //model = errorModel(app, search, errors,);

                let model={base: app.locals.base, fields: FIELDS3}
                let template='addSensors';
        const html = doMustache(app,'addSensors', model);
    res.send(html);

        }



      }
      catch (err) {
        console.error(err);
        errors = wsErrors(err);
      }
  }
};


const FIELDS_DB={
'SearchSensorTypes':FIELDS,
'AddSensorType':FIELDS1,
'SearchSensors':FIELDS2,
'AddSensors':FIELDS3,
}
const FIELDS_INFO_DB={
'SearchSensorTypes':FIELDS_INFO,
'AddSensorType':FIELDS_INFO_ADD_SENSOR_TYPES,
'SearchSensors':FIELDS_INFO_SEARCH_SENSOR,
'AddSensors':FIELDS_INFO_ADD_SENSOR,
}

function fieldsWithValues(values, errors={},name) {
	console.log(name);
	let fields=FIELDS_DB[name];
  return fields.map(function (info) {
    const name = info.name;
    const extraInfo = { value: values[name] };
    if (errors[name]) extraInfo.errorMessage = errors[name];
    return Object.assign(extraInfo, info);
  });


}


function validate(values, name,requires=[]) {

  const errors = {};
	let fields=FIELDS_INFO_DB[name];
//	console.log(fields);
//	console.log('entered validate');
  requires.forEach(function (name) {
    if (values[name] === undefined) {
      errors[name] =
	`A value for '${fields[name].friendlyName}' must be provided`;
    }
  });
  for (const name of Object.keys(values)) {
    const fieldInfo = fields[name];
    const value = values[name];
    if (fieldInfo.regex && !value.match(fieldInfo.regex)) {
      errors[name] = fieldInfo.error;
    }
  }
  return Object.keys(errors).length > 0 && errors;
}

function getNonEmptyValues(values,name) {
  const out = {};
//	console.log('entered get non empty value');
	let fields=FIELDS_INFO_DB[name];
//	console.log(fields);
//	if(FIELDS_DB[name]==FIELDS){
  Object.keys(values).forEach(function(k) {
    if (fields[k] !== undefined) {
      const v = values[k];
      if (v && v.trim().length > 0) out[k] = v.trim();
    }
  });

  return out;
}

function errorModel(app, values={}, errors={},name) {
  return {
    base: app.locals.base,
    errors: errors._,
    fields: fieldsWithValues(values, errors,name)
  };
}


function wsErrors(err) {
  const msg = (err.message) ? err.message : 'web service error';
  console.error(msg);
  return { _: [ msg ] };
}

function doMustache(app, templateId, view) {
	//const temp1= getwidget(MEASURE,OPT);
	//console.log(temp1);
	
  const templates = { footer: app.templates.footer,searchres:app.templates.searchRes};
  return mustache.render(app.templates[templateId], view, templates);
}

function errorPage(app, errors, res) {
  if (!Array.isArray(errors)) errors = [ errors ];
  const html = doMustache(app, 'errors', { errors: errors });
  res.send(html);
}

function isNonEmpty(v) {
  return (v !== undefined) && v.trim().length > 0;
}
function setupTemplates(app) {
  app.templates = {};
  for (let fname of fs.readdirSync(TEMPLATES_DIR)) {
    const m = fname.match(/^([\w\-]+)\.ms$/);
    if (!m) continue;
    try {
      app.templates[m[1]] =
	String(fs.readFileSync(`${TEMPLATES_DIR}/${fname}`));
    }
    catch (e) {
      console.error(`cannot read ${fname}: ${e}`);
      process.exit(1);
    }
  }
}

function getwidget(wid,opt){
const temp=widgetView(wid,opt);
return temp;
}
