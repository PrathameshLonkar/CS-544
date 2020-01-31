<!DOCTYPE html>
<html>
  <head>

    <title>{{title}}</title>
    <link rel="stylesheet" href="{{{base}}}/css/style.css">
  </head>
  <body>

    <div class="page">
	{{#fields}}
    <h1 class="tst-sensor-types-search-page">{{title}}</h1>
	{{/fields}}
    <ul>
      {{#errors}}
        <li class="error">{{.}}</li>
      {{/errors}}

    </ul>
	<p>Please fill atleast one value</p>
    <form method="GET" action="{{{base}}}/sensor-types.html">
       
         {{#fields}}
          {{#isSearch}}
<div>
            <label for="{{friendlyName}}"> 
            <span class="in-line">{{friendlyName}}:</span>

            <input name="{{name}}" {{#type}}type="{{type}}"{{/type}} value="{{value}}">
    </div>        
</label>

            <br/>
            {{#errorMessage}}  
              <span class="error">{{errorMessage}}</span><br/>
            {{/errorMessage}}
          {{/isSearch}}
         {{/fields}}

      <input name="submit" type="submit" value="search" class="control">
    </form> 
	</div>
	{{>searchres}}
    {{>footer}}
  </body>
</html>


