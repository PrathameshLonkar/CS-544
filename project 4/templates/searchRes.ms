<searchres>
{{#UserHead}}
<table class="summary">
        <thead>
           <tr>
                  <th>Manufacturer</th>
                  <th>Sensor Type ID</th>
                  <th>Model Number</th>
                  <th>Measure</th>
                  <th colspan="2">Limits</th>
           </tr>
           <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th>Min</th>
                  <th>Max</th>
           </tr>
         </thead>
{{/UserHead}}
{{#Users}}
<tbody>
                 <tr>
                 <td class="tst-manufacturer">{{manufacturer}} </td>
		<td class="tst-sensor-type-id">{{id}}</td>
		<td class="tst-model-number">{{modelNumber}}</td>
		<td class="tst-quantity">{{quantity}}</td>
		<td class="numeric interval tst-limits-min">{{limits.min}}</td>
		<td class="numeric interval tst-limits-max">{{limits.max}}</td>
               </tr>

		</tbody>
{{/Users}}    
</table>

{{#STNext}}
<form method="get" action="/nextIndex.html">
    <button type="submit">NextIndex</button>
</form>
{{/STNext}}



{{#SensorHead}}
<table class="summary">
        <thead>
    	   <tr>
                  <th>Sensor ID</th>
                  <th>Model</th>
                  <th>Period</th>
                  <th colspan="2">Expected Range</th>
    	   </tr>
    	   <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th>Min</th>
                  <th>Max</th>
    	   </tr>
         </thead>
{{/SensorHead}}
{{#SensorData}}
	<tbody>
                 <tr>
            <td class="tst-sensor-id">{{id}}</td>
            <td class="tst-model">{{model}}</td>
            <td class="tst-period numeric">{{period}}</td>
            <td class="numeric interval tst-expected-min">{{expected.min}}</td>
            <td class="numeric interval tst-expected-max">{{expected.max}}</td>
               </tr>
	 </tbody>
{{/SensorData}}
    </table>

{{#SensorNext}}
<form method="get" action="/nextIndexSensors.html">
    <button type="submit">NextIndex</button>
</form>
{{/SensorNext}}
</searchres>
