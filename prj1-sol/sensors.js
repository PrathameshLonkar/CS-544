'use strict';


const assert = require('assert');


	this.sensorTypes=[];//stores the sensor-types recieved from info variable passed in the function addsensortypes
        this.sensors=[]; //stores the sensor's data recieved from the info variable passed in the function add sensors
        this.sensorData=[]; //stores the sensordata recieved from the info variable in the function addsensorData  
        this.data=[];// used to store the data found in the function findsensorTypes
        this.nextInteger=0;//used to find the next index in the find function 
        this.sorted_sensor_data=[];// sorting the data by status=ok/error/out of range

        this.data1=[];//used to store data found in the function findsensors
        this.doDetail_sensor_type=[];//used to store the data when doDetail is true in find function
        this.data2=[];

class Sensors {

  constructor() {
    //@TODO
	 
	this.sensorTypes=[];
	this.sensors=[];
	this.sensorData=[];
	this.data=[];
	this.nextInteger=0;
	this.sorted_sensor_data=[];
	
	this.data1=[];
	this.doDetail_sensor_type=[];
	this.data2=[];
  }

  /** Clear out all data from this object. */
  async clear() {
    //@TODO
 }

  /** Subject to field validation as per FN_INFOS.addSensorType,
   *  add sensor-type specified by info to this.  Replace any
   *  earlier information for a sensor-type with the same id.
   *
   *  All user errors must be thrown as an array of objects.
   */
  async addSensorType(info) {
    const sensorType = validate('addSensorType', info);
    //@TODO
	  //saving value in another variable as sensorType has timestamp and value as integer not number and while adding them into the array they were getting duplicated 
	var obj2={
		id: info.id,
		manufacturer: info.manufacturer,
		modelNumber: info.modelNumber,
		quantity: info.quantity,
		unit: info.unit,
		limits: info.limits
	};
	  let e=0;
	  var y;

	  for(y of this.sensorTypes){
          if(y.id==sensorType.id){
                  y.manufacturer=obj2.manufacturer;
                  y.modelNumber=obj2.modelNumber;
                  y.quantity=obj2.quantity;
		  y.unit=obj2.unit;
		  y.limits=obj2.limits;
                  e=e+1;
		  
		  
	  }
	  }




	
	if(e==0||this.sensorTypes.length==0){
		this.sensorTypes.push(obj2);
		
		
	}
	  
	  
	  
	
	
  }
  
  /** Subject to field validation as per FN_INFOS.addSensor, add
   *  sensor specified by info to this.  Replace any earlier
   *  information for a sensor with the same id.
   *
   *  All user errors must be thrown as an array of objects.
   */
  async addSensor(info) {
    const sensor = validate('addSensor', info);
    //@TODO
	
	
	var obj1={
		id: info.id,
		model: info.model,
		period: info.period,
		expected: info.expected
	};
	  let d=0;
	  var z;
	  var k=0;

	  for(var j of this.sensorTypes){
	  if(j.id===obj1.model)
		  {
		  k=k+1;
			  //console.log('value:',k);
		  }
		  
	  }

          if(k>0){
	  for(z of this.sensors){
          if(z.id==sensor.id){
		  z.model=obj1.model;
		  z.period=obj1.period;
		  z.expected=obj1.expected;
		  d=d+1;
		  
          

          }
          }
	 

          if(d==0||this.sensors.length==0){
                  this.sensors.push(obj1);
		  
		  //JSON.srtingify(data1.push(obj1),null,2);


          }
	}else{
	console.log('Invalid sensor, sensor does not belong to  a valid sensor type');
	}

	  
	  //const new_data1=JSON.stringify(data1,null,2);
	  //fs.writeFileSync('/home/plonkar1/cs544/data/sensors.json',new_data1,'utf8')

  }

  /** Subject to field validation as per FN_INFOS.addSensorData, add
   *  reading given by info for sensor specified by info.sensorId to
   *  this. Replace any earlier reading having the same timestamp for
   *  the same sensor.
   *
   *  All user errors must be thrown as an array of objects.
   */
  async addSensorData(info) {
    const sensorData = validate('addSensorData', info);
    //@TODO
	//JSON.stringify(data,null,2);

	var obj={sensorId: info.sensorId,
		timestamp: info.timestamp,
		value: info.value
	
	};
	  var compare_obj={limits:{}};
	  var err_obj={
		  sensorId: {},
		  timestamp:{},
		  value: {},
		  Status: {}
	  };
	  //doing the following operation to sort out the data as it is being added by statuses=ok or error or out of range
	  for(var v of this.sensors){
                  if(v.id==obj.sensorId){
                  var sensor_expected_min=Number(v.expected.min);
                  var sensor_expected_max=Number(v.expected.max);
                  var obj_number_value=Number(obj.value);
                  if(sensor_expected_min>obj_number_value || sensor_expected_max<obj_number_value)
                          {
                          err_obj.sensorId=obj.sensorId;
                          err_obj.timestamp=obj.timestamp;
                          err_obj.value=obj.value;
                          err_obj.Status='Out of Range';
                          this.sorted_sensor_data.push(err_obj);
                                  //console.log(err_obj);
                                  //console.log(v);
                          }else{
                          err_obj.sensorId=obj.sensorId;
                          err_obj.timestamp=obj.timestamp;
                          err_obj.value=obj.value;
                          err_obj.Status='ok';
                          this.sorted_sensor_data.push(err_obj);
                          //console.log(err_obj);
                          //console.log(v);
                          }
                          for(var h of this.sensorTypes){
                          if(h.id==v.model){
                          var sensor_type_limits_min=Number(h.limits.min);
                          var sensor_type_limits_max=Number(h.limits.max);
                          if(sensor_type_limits_min>obj_number_value || sensor_type_limits_max<obj_number_value){
			  err_obj.sensorId=obj.sensorId;
                          err_obj.timestamp=obj.timestamp;
                          err_obj.value=obj.value;
                          err_obj.Status='error';
                          this.sorted_sensor_data.push(err_obj);
                                 //console.log(err_obj);
                                 //console.log(h);
                          }
                          }
                          }
                  }
	  }



	  let c=0;
	  var x;
	  for(x of this.sensorData){
	  if(x.sensorId===sensorData.sensorId && x.timestamp===obj.timestamp){
	  x.sensorId=obj.sensorId;
	  x.timestamp=obj.timestamp;
	  x.value=obj.value;
          c=c+1;
	 

	  }
	  }
	 
	  if(c==0||this.sensorData.length==0){
		  this.sensorData.push(obj);

		 
	
	  }
	  
	
	  
	  

  }

  /** Subject to validation of search-parameters in info as per
   *  FN_INFOS.findSensorTypes, return all sensor-types which
   *  satisfy search specifications in info.  Note that the
   *  search-specs can filter the results by any of the primitive
   *  properties of sensor types.  
   *
   *  The returned value should be an object containing a data
   *  property which is a list of sensor-types previously added using
   *  addSensorType().  The list should be sorted in ascending order
   *  by id.
   *
   *  The returned object will contain a lastIndex property.  If its
   *  value is non-negative, then that value can be specified as the
   *  index property for the next search.  Note that the index (when 
   *  set to the lastIndex) and count search-spec parameters can be used
   *  in successive calls to allow scrolling through the collection of
   *  all sensor-types which meet some filter criteria.
   *
   *
   *  All user errors must be thrown as an array of objects.
   */
  async findSensorTypes(info) {
    const searchSpecs = validate('findSensorTypes', info);
    //@TODO
	var nextInteger;
	
	
	var findsensorType={nextInteger:{},data:{}};
	 
	  
	  var index=0;
	var findObj={
		id: searchSpecs.id,
		index: searchSpecs.index,
		count: searchSpecs.count,
		quantity: searchSpecs.quantity,
		unit: searchSpecs.unit,
		manufacturer: searchSpecs.manufacturer,
		modelNumber: searchSpecs.modelNumber
	};
	  
	if(findObj.id==null && findObj.manufacturer==null && findObj.modelNumber==null && findObj.unit==null && findObj.quantity==null){
		//console.log(searchSpecs.index);
		for(var i=findObj.index;i<(findObj.index+findObj.count);i++){
			this.data.push(this.sensorTypes[i]);
			
			this.nextInteger=i+1;

			
		}
		
		findsensorType.nextInteger=this.nextInteger;
		findsensorType.data= this.data;
		this.data=[];
	  
	  }else{
	  for(var v of this.sensorTypes){
	  if(v.id==findObj.id||v.manufacturer==findObj.manufacturer||v.modelNumber==findObj.modelNumber|| v.quantity==findObj.quantity)
		  {
		  this.data.push(v);
		  }
	  }
		 findsensorType.nextInteger=-1;
                findsensorType.data= this.data;
                this.data=[];
	  }
	  
	// console.log(this.sorted_sensor_data); 

    return findsensorType;
  }
  
  /** Subject to validation of search-parameters in info as per
   *  FN_INFOS.findSensors, return all sensors which
   *  satisfy search specifications in info.  Note that the
   *  search-specs can filter the results by any of the primitive
   *  properties of a sensor.  
   *
   *  The returned value should be an object containing a data
   *  property which is a list of all sensors satisfying the
   *  search-spec which were previously added using addSensor().  The
   *  list should be sorted in ascending order by id.
   *
   *  If info specifies a truthy value for a doDetail property, 
   *  then each sensor S returned within the data array will have
   *  an additional S.sensorType property giving the complete 
   *  sensor-type for that sensor S.
   *
   *  The returned object will contain a lastIndex property.  If its
   *  value is non-negative, then that value can be specified as the
   *  index property for the next search.  Note that the index (when 
   *  set to the lastIndex) and count search-spec parameters can be used
   *  in successive calls to allow scrolling through the collection of
   *  all sensors which meet some filter criteria.
   *
   *  All user errors must be thrown as an array of objects.
   */
  async findSensors(info) {
    const searchSpecs = validate('findSensors', info);
    //@TODO
	var nextInteger;
	var findsensors={nextInteger:{},data:{},sensorType:{}};
	
	  var findObj2={
		  id:searchSpecs.id,
		  index: searchSpecs.count,
		  model: searchSpecs.model,
		  count: searchSpecs.count,
		  doDetail: searchSpecs.doDetail,
	  
	  
	  };
	  if(findObj2.id==null && findObj2.model==null){
	  for(var i=findObj2.index;i<(findObj2.index+findObj2.count);i++){
                        this.data1.push(this.sensors[i]);

                        this.nextInteger=i+1;


                }

                findsensors.nextInteger=this.nextInteger;
                findsensors.data= this.data1;
                this.data1=[];

	  }else if(findObj2.model!=null||findObj2.doDetail!=null){
		  var p=0;
		  while(p!=findObj2.count){
	  for(var u of this.sensors){
		  this.nextInteger+=1;
	  if(u.model==findObj2.model && p!=findObj2.count){
	  this.data1.push(u);
		  p++;

	  }
		  if(p===findObj2.count)
			  break;
	  }
		  
	  }
		  if(findObj2.doDetail!=null){
		  for(var t of this.sensorTypes){
		  if(t.id===findObj2.model){
		  this.doDetail_sensor_type.push(t);
			  break;
		  }
		  }
		  
		  }
		  findsensors.nextInteger=this.nextInteger;
		  findsensors.data=this.data1;
		  findsensors.sensorType=this.doDetail_sensor_type;
		  this.data1=[];
		  this.doDetail_sensor_type=[];
	  }


    return findsensors;
  }
  
  /** Subject to validation of search-parameters in info as per
   *  FN_INFOS.findSensorData, return all sensor reading which satisfy
   *  search specifications in info.  Note that info must specify a
   *  sensorId property giving the id of a previously added sensor
   *  whose readings are desired.  The search-specs can filter the
   *  results by specifying one or more statuses (separated by |).
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
   *  Note that the timestamp and count search-spec parameters can be
   *  used in successive calls to allow scrolling through the
   *  collection of all readings for the specified sensor.
   *
   *  All user errors must be thrown as an array of objects.
   */
  async findSensorData(info) {
    const searchSpecs = validate('findSensorData', info);
    //@TODO
	  //in this function i am not getting the correct result for statuses= error or out of range as the statuses is being set to Set(['error']) rather than error hence i had to make changes to the statuses in FN_INFOS to get the apropriate result
	
	  var findsensorData={data:[],sensors:[],sensorType:[]};
	  

	  var findObj3={
		  sensorId: searchSpecs.sensorId,
		  timestamp: searchSpecs.timestamp,
		  count: searchSpecs.count,
		  statuses: searchSpecs.statuses,
		  doDetail: searchSpecs.doDetail
	  
	  };

	  var foundObj={
		  timestamp: {},
		  value: {},
		  statuses: {}
	  };
	  var t=0;

	  if(findObj3.doDetail==null){
	  while(t!=findObj3.count){
		  //console.log(t);
		 
	  for(var r  of this.sorted_sensor_data){
		  //console.log(this.sorted_sensor_data);
		  if(r.sensorId==findObj3.sensorId && r.Status==findObj3.statuses){
		  t=t+1;
		  foundObj.timestamp=findObj3.timestamp;
		  foundObj.value=r.value;
		  foundObj.statuses=findObj3.statuses;
		  this.data2.push(foundObj);
		  //t=t+1;
			  
		  }
			  if(t===findObj3.count){

				  break;}
		  }
	  }
		  findsensorData.data=this.data2;
		  this.data2=[];

	  
	  
	  }
    return findsensorData;
  
  }  
  
}

module.exports = Sensors;

//@TODO add auxiliary functions as necessary




const DEFAULT_COUNT = 5;    

/** Validate info parameters for function fn.  If errors are
 *  encountered, then throw array of error messages.  Otherwise return
 *  an object built from info, with type conversions performed and
 *  default values plugged in.  Note that any unknown properties in
 *  info are passed unchanged into the returned object.
 */
function validate(fn, info) {
  const errors = [];
  const values = validateLow(fn, info, errors);
  if (errors.length > 0) throw errors; 
  return values;
}

function validateLow(fn, info, errors, name='') {
  const values = Object.assign({}, info);
  for (const [k, v] of Object.entries(FN_INFOS[fn])) {
    const validator = TYPE_VALIDATORS[v.type] || validateString;
    const xname = name ? `${name}.${k}` : k;
    const value = info[k];
    const isUndef = (
      value === undefined ||
      value === null ||
      String(value).trim() === ''
    );
    values[k] =
      (isUndef)
      ? getDefaultValue(xname, v, errors)
      : validator(xname, value, v, errors);
  }
  return values;
}

function getDefaultValue(name, spec, errors) {
  if (spec.default !== undefined) {
    return spec.default;
  }
  else {
    errors.push(`missing value for ${name}`);
    return;
  }
}

function validateString(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  if (typeof value !== 'string') {
    errors.push(`require type String for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
    return;
  }
  else {
    return value;
  }
}

function validateNumber(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  switch (typeof value) {
  case 'number':
    return value;
  case 'string':
    if (value.match(/^[-+]?\d+(\.\d+)?([eE][-+]?\d+)?$/)) {
      return Number(value);
    }
    else {
      errors.push(`value ${value} for ${name} is not a number`);
      return;
    }
  default:
    errors.push(`require type Number or String for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
  }
}

function validateInteger(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  switch (typeof value) {
  case 'number':
    if (Number.isInteger(value)) {
      return value;
    }
    else {
      errors.push(`value ${value} for ${name} is not an integer`);
      return;
    }
  case 'string':
    if (value.match(/^[-+]?\d+$/)) {
      return Number(value);
    }
    else {
      errors.push(`value ${value} for ${name} is not an integer`);
      return;
    }
  default:
    errors.push(`require type Number or String for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
  }
}

function validateRange(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  if (typeof value !== 'object') {
    errors.push(`require type Object for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
  }
  return validateLow('_range', value, errors, name);
}

const STATUSES = new Set(['ok', 'error', 'outOfRange']);

function validateStatuses(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  if (typeof value !== 'string') {
    errors.push(`require type String for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
  }
  if (value === 'all') return STATUSES;
  const statuses = value.split('|');
  const badStatuses = statuses.filter(s => !STATUSES.has(s));
  if (badStatuses.length > 0) {
    errors.push(`invalid status ${badStatuses} in status ${value}`);
  }
  return new Set(statuses);
}

const TYPE_VALIDATORS = {
  'integer': validateInteger,
  'number': validateNumber,
  'range': validateRange,
  'statuses': validateStatuses,
};


/** Documents the info properties for different commands.
 *  Each property is documented by an object with the
 *  following properties:
 *     type: the type of the property.  Defaults to string.
 *     default: default value for the property.  If not
 *              specified, then the property is required.
 */
const FN_INFOS = {
  addSensorType: {
    id: { }, 
    manufacturer: { }, 
    modelNumber: { }, 
    quantity: { }, 
    unit: { },
    limits: { type: 'range', },
  },
  addSensor:   {
    id: { },
    model: { },
    period: { type: 'integer' },
    expected: { type: 'range' },
  },
  addSensorData: {
    sensorId: { },
    timestamp: { type: 'integer' },
    value: { type: 'number' },
  },
  findSensorTypes: {
    id: { default: null },  //if specified, only matching sensorType returned.
    index: {  //starting index of first result in underlying collection
      type: 'integer',
      default: 0,
    },
    count: {  //max # of results
      type: 'integer',
      default: DEFAULT_COUNT,
    },
  },
  findSensors: {
    id: { default: null }, //if specified, only matching sensor returned.
    index: {  //starting index of first result in underlying collection
      type: 'integer',
      default: 0,
    },
    count: {  //max # of results
      type: 'integer',
      default: DEFAULT_COUNT,
    },
    doDetail: { //if truthy string, then sensorType property also returned
      default: null, 
    },
  },
  findSensorData: {
    sensorId: { },
    timestamp: {
      type: 'integer',
      default: Date.now() + 999999999, //some future date
    },
    count: {  //max # of results
      type: 'integer',
      default: DEFAULT_COUNT,
    },
    statuses: { //ok, error or outOfRange, combined using '|'; returned as Set
      type: 'statuses',
      default: 'ok',
    },
    doDetail: {     //if truthy string, then sensor and sensorType properties
      default: null,//also returned
    },
  },
  _range: { //pseudo-command; used internally for validating ranges
    min: { type: 'number' },
    max: { type: 'number' },
  },
};  

