'use strict';

const AppError = require('./app-error');
const validate = require('./validate');

const assert = require('assert');
const mongo = require('mongodb').MongoClient;

class Sensors {

	constructor(client,db){
		this.client=client;
		this.db=client.db(db);
		this.sensorTypes=this.db.collection('sensorTypes');
		this.sensors=this.db.collection('sensors');
		this.sensorData=this.db.collection('sensorData');
		//console.log(this[sensorTypes]);

	}
	/** Return a new instance of this class with database as
	 *  per mongoDbUrl.  Note that mongoDbUrl is expected to
	 *  be of the form mongodb://HOST:PORT/DB.
	 */
	static async newSensors(mongoDbUrl) {
		//@TODO

		console.log(mongoDbUrl);
		//const URL='mongodb://localhost:27017';
		//const db='sensors';
		const index=mongoDbUrl.lastIndexOf('/');
		const URL=mongoDbUrl.slice(0,index);
		const db=mongoDbUrl.slice(index+1);
		//console.log(db);
		//console.log(URL);
		const client=await mongo.connect(URL,MONGO_OPTIONS);


		return new Sensors(client,db);    
	}

	/** Release all resources held by this Sensors instance.
	 *  Specifically, close any database connections.
	 */
	async close() {
		//@TODO 

		await this.client.close()
	}

	/** Clear database */
	async clear() {
		//@TODO
		await this.sensorTypes.drop();
		await this.sensors.drop();
		await this.sensorData.drop();
	}

	/** Subject to field validation as per validate('addSensorType',
	 *  info), add sensor-type specified by info to this.  Replace any
	 *  earlier information for a sensor-type with the same id.
	 *
	 *  All user errors must be thrown as an array of AppError's.
	 */
	async addSensorType(info) {
		const sensorType = validate('addSensorType', info);
		//@TODO 
		var obj={id:sensorType.id};

		//console.log(obj);
		//console.log(sensorType);
		// console.log(this.db.collections(sensorTypes));
		var collection = this.sensorTypes;
		await  add(collection,sensorType,obj);

	}

	/** Subject to field validation as per validate('addSensor', info)
	 *  add sensor specified by info to this.  Note that info.model must
	 *  specify the id of an existing sensor-type.  Replace any earlier
	 *  information for a sensor with the same id.
	 *
	 *  All user errors must be thrown as an array of AppError's.
	 */
	async addSensor(info) {
		const sensor = validate('addSensor', info);
		//@TODO
		//var flag=[];
		var obj={id:sensor.model};
		//console.log(obj);
		const flag=await this.sensorTypes.find(obj);
		const found= await flag.toArray();
		//console.log(found);
		//console.log(this.sensorTypes.model);
		if(found.length!==0){
			await add(this.sensors,sensor,sensor);
		}
		else{
			const err = 'invalid sensor model';
			throw [ new AppError('addSensors', err) ];
			//console.log('Invalid Model Number');
		}
	



	}

	/** Subject to field validation as per validate('addSensorData',
	 *  info), add reading given by info for sensor specified by
	 *  info.sensorId to this. Note that info.sensorId must specify the
	 *  id of an existing sensor.  Replace any earlier reading having
	 *  the same timestamp for the same sensor.
	 *
	 *  All user errors must be thrown as an array of AppError's.
	 */
	async addSensorData(info) {
		const sensorData = validate('addSensorData', info);
		//@TODO 

		var obj={id:sensorData.sensorId}
		var obj1={sensorId:sensorData.sensorId,timestamp:sensorData.timestamp}
		const flag=await this.sensors.find(obj)
		const found= flag.toArray();
		if(found.length!==0){
			await add(this.sensorData,sensorData,obj1);
		}else{
			const err = 'Invalid sensor Id';
			throw [ new AppError('addSensorData', err) ];
			//console.error('Invalid sensorId');
		}





	}

	/** Subject to validation of search-parameters in info as per
	 *  validate('findSensorTypes', info), return all sensor-types which
	 *  satisfy search specifications in info.  Note that the
	 *  search-specs can filter the results by any of the primitive
	 *  properties of sensor types (except for meta-properties starting
	 *  with '_').
	 *
	 *  The returned value should be an object containing a data
	 *  property which is a list of sensor-types previously added using
	 *  addSensorType().  The list should be sorted in ascending order
	 *  by id.
	 *
	 *  The returned object will contain a lastIndex property.  If its
	 *  value is non-negative, then that value can be specified as the
	 *  _index meta-property for the next search.  Note that the _index
	 *  (when set to the lastIndex) and _count search-spec
	 *  meta-parameters can be used in successive calls to allow
	 *  scrolling through the collection of all sensor-types which meet
	 *  some filter criteria.
	 *
	 *  All user errors must be thrown as an array of AppError's.
	 */
	async findSensorTypes(info) {
		//@TODO
		const searchSpecs = validate('findSensorTypes', info);
		console.log(searchSpecs);
		//var data=[];
		var obj1={};
		for(let [k,v] of Object.entries(searchSpecs)){
		if(k!=='id'&&k!=='_index'&&k!=='_count'){
		obj1[k]=v;
		}
		}
		var obj={id:searchSpecs.id}
	if(searchSpecs.id!==null){
	const {data,nextIndex}= await find_data(this.sensorTypes,searchSpecs,obj);
		return{data: data, nextIndex:nextIndex}
	}else{
		console.log(obj1);
	const {data,nextIndex}= await find_data(this.sensorTypes,searchSpecs,obj1)
		return { data: data, nextIndex:nextIndex};
	}
 	

	 /* const obj1 = obj => {Object.keys(obj).forEach(key => obj[key] == null && delete obj[key]);};
	  console.log(obj);
	 // var obj=searchSpecs;
	  
	 var data=  await find_data(this.sensorTypes,searchSpecs)
*/
    //return { data: data, nextIndex: -1 };
  }
  
  /** Subject to validation of search-parameters in info as per
   *  validate('findSensors', info), return all sensors which satisfy
   *  search specifications in info.  Note that the search-specs can
   *  filter the results by any of the primitive properties of a
   *  sensor (except for meta-properties starting with '_').
   *
   *  The returned value should be an object containing a data
   *  property which is a list of all sensors satisfying the
   *  search-spec which were previously added using addSensor().  The
   *  list should be sorted in ascending order by id.
   *
   *  If info specifies a truthy value for a _doDetail meta-property,
   *  then each sensor S returned within the data array will have an
   *  additional S.sensorType property giving the complete sensor-type
   *  for that sensor S.
   *
   *  The returned object will contain a lastIndex property.  If its
   *  value is non-negative, then that value can be specified as the
   *  _index meta-property for the next search.  Note that the _index (when 
   *  set to the lastIndex) and _count search-spec meta-parameters can be used
   *  in successive calls to allow scrolling through the collection of
   *  all sensors which meet some filter criteria.
   *
   *  All user errors must be thrown as an array of AppError's.
   */
  async findSensors(info) {
    //@TODO
    const searchSpecs = validate('findSensors', info);
	  var obj1={};
	  for(let [k,v] of Object.entries(searchSpecs)){
                if(k!=='id'&&k!=='_index'&&k!=='_count'&&k!=='_doDetail'){
                obj1[k]=v;
                }
                }
	  console.log(obj1);
	  const found_sensorType= await this.sensorTypes.find({id:searchSpecs.model}).toArray();
	  if(found_sensorType.length!==0){
	  const {data,nextIndex}=await find_data(this.sensors,searchSpecs,obj1);
	  
		  
		  if(searchSpecs._doDetail){
	  for(let x of data){
		  const data=await this.sensorTypes.find({id:x.model})
		  const result= await data.toArray();
		  //console.log(result);
	  	  x.sensorType=result;
	  }
	  }
		  return{data:[data],nextIndex:nextIndex};
	  }else{
		  const err = 'Invalid sensor model';
		throw [ new AppError('findSensors', err) ];
	  //console.log('Invalid sensor Model');
	  }


    //return { data: [data], nextIndex:nextIndex };
  }
  
  /** Subject to validation of search-parameters in info as per
   *  validate('findSensorData', info), return all sensor readings
   *  which satisfy search specifications in info.  Note that info
   *  must specify a sensorId property giving the id of a previously
   *  added sensor whose readings are desired.  The search-specs can
   *  filter the results by specifying one or more statuses (separated
   *  by |).
   *
   *  The returned value should be an object containing a data
   *  property which is a list of objects giving readings for the
   *  sensor satisfying the search-specs.  Each object within data
   *  should contain the following properties:
   * 
   *     timestamp: an integer giving the timestamp of the reading.
   *     value: a number giving the value of the reading.
   *     status: one of "ok", "error" or "outOfRange".
   *
   *  The data objects should be sorted in reverse chronological
   *  order by timestamp (latest reading first).
   *
   *  If the search-specs specify a timestamp property with value T,
   *  then the first returned reading should be the latest one having
   *  timestamp <= T.
   * 
   *  If info specifies a truthy value for a doDetail property, 
   *  then the returned object will have additional 
   *  an additional sensorType giving the sensor-type information
   *  for the sensor and a sensor property giving the sensor
   *  information for the sensor.
   *
   *  Note that the timestamp search-spec parameter and _count
   *  search-spec meta-parameters can be used in successive calls to
   *  allow scrolling through the collection of all readings for the
   *  specified sensor.
   *
   *  All user errors must be thrown as an array of AppError's.
   */
  async findSensorData(info) {
    //@TODO
    const searchSpecs = validate('findSensorData', info);
	
	 // const { sensorId, timestamp, count, statuses } = searchSpecs;
	 //console.log(sensorId);
	  var obj1={};
	 var obj2={id:searchSpecs.sensorId}; 
	  for(let [k,v] of Object.entries(searchSpecs)){
                if(k!==null&&k!=='_index'&&k!=='_count'&&k!=='_doDetail'&&k!=='statuses'&&k!=='timestamp'){
                obj1[k]=v;
                }
          }
	 
	  var count=0;
	var data1=[];
	  console.log(obj1);
	  const found_sensor= await this.sensors.findOne(obj2)
	  console.log(found_sensor);
	  if(found_sensor.length!==0){
	 const found_sensorType= await this.sensorTypes.findOne({id:found_sensor.model})
	  console.log(found_sensorType);
		  const data=await this.sensorData.find(obj1).sort({sensorId:1}).toArray();
		  //console.log(data);
		  console.log(searchSpecs.statuses);
		  
		  for(let x of data){
			console.log(x);
			  if(count===searchSpecs._count) break;
			  const Status=!inRange(x.value,found_sensorType.limits)? 'error':!inRange(x.value,found_sensor.expected)? 'outofRange':'ok';
			  var obj3={
			  timestamp:searchSpecs.timestamp,
			  value:x.value,
			  Status:Status
			  }
			  if(searchSpecs.statuses.has(Status)){
			  data1.push(obj3);
			  count++;}
		  //console.log(data1);
		  }
		  
		 // console.log(data1);
	 const return_value={data1};
if(searchSpecs._doDetail){
return_value.sensorType=found_sensorType;
return_value.sensors=found_sensor;
}
return return_value;
	  }else{
		  const err = 'Invalid sensorId';
		throw [ new AppError('X_ID', err) ];
	  //console.error('Invalide sensorId');
	  }
	
	 // var arr = [{ key:"11", value:"1100" }, { key:"22", value:"2200" }];
/*var result = arr.reduce(function(obj,item){
  obj[item.key] = item.value;
  return obj;
}, {});*/
/*
const return_value={data1};
if(searchSpecs._doDetail){
return_value.sensorType=found_sensorType;
return_value.sensors=found_sensor;


}*/


   // return return_value;
  }

  
  	
} //class Sensors

module.exports = Sensors.newSensors;

//Options for creating a mongo client
const MONGO_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

async function add(collection,sensorType,obj){
	//console.log(collection);
	//const db= this.sensorTypes;
	const added =  await collection.replaceOne(obj,sensorType,{upsert: true});
	//console.log(added);
}
async function find_data(collection,searchSpecs,obj){
	
	let nextIndex=-1;
	//let data=[];

	const find_result= await collection.find(obj).sort({id:1}).skip(Number(searchSpecs._index)).limit(Number(searchSpecs._count));
	let data=await find_result.toArray();
	console.log(data);
	if(data.length>=searchSpecs._count){
	nextIndex=Number(searchSpecs._index)+Number(searchSpecs._count);
	console.log(nextIndex);
	}
	
	return {data, nextIndex};

	

	
}


//const sensorTypes='sensorTypes';

function inRange(value, range) {
  return Number(range.min) <= value && value <= Number(range.max);
}
