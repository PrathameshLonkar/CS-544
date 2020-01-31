Name: Prathamesh Nitin Lonkar
Email: plonkar1@binghamton.edu


Requirements:
This project will only require NodeJs to work, link is as follows:
https://nodejs.org/en/download/

In this project while coding i have used array to store the data recieved as info in each add function.
I have also declare some other variables in constructor which i am using in the program.

working of Each Function:

1.) async addSensorType:
In this function i have compared each incomming data in the arrary this.sensorTypes if it is present the i am replacing them by accesing each property of that object, if the data is not present i am using the push function to push the data into array.

2.) async addSensor:
In this function first i'm checking whether the sensor to be added is valid or not by checking its model by sensor type's id.
Then im performing the functions as mentioned in addSensorType.

3.) async addSensor-Data:
In this function when each data is being entered or accessed the program is checking its status i.e whether status=ok/error/Out of range and then storing it in the array sorted_sensor_data which is declared in the constructor. I have done this as it will make finding the data with respect tu statuses easier.
Then i am performing the similar operations as mentioned in above to functions.

For the rest of the find function I am accessing the arrays in the constructor to search the data entered by the user and using an array to store the searched data and returning the whole array at the end of the function.
