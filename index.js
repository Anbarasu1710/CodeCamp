const request = require('request')
const req = require('request')
const express = require('express')

const app = express()
var ID = ""

app.get('/', (req1, result) => {
	request.post('http://rdp.avaniko.co:50001/b1s/v1/Login', 
{
  json: 
  {
    "CompanyDB": "DDWNEW",
    "Password": "********",
    "UserName": "manager"
  }
}, 
(error, res, body) => 
{
  if (error) 
  {
    result.status(500).json(error)
    return
  }
  ID = body.SessionId
  req.get('http://rdp.avaniko.co:50001/b1s/v1/SalesOpportunities?$select=CardCode,CustomerName,PredictedClosingDate,MaxLocalTotal &$filter=MaxLocalTotal ge 15000 and PredictedClosingDate le 20191010 &$top=5',
	{
		headers: {
    'Cookie': "B1SESSION=" + ID.toString()
  }
},
(error, res, body) => 
{
  if (error) 
  {
	result.status(500).json(error)
    return
  }
  
  var results=[];
  
  for(var t in JSON.parse(body).value)
  {
	  var arr={
          "title": JSON.parse(body).value[t].CardCode.toString(),
          "subtitle": JSON.parse(body).value[t].CustomerName.toString(),
          "buttons": [
            {
              "title": "More Details...",
              "type": "BUTTON_TYPE",
              "value": "Date : " + JSON.parse(body).value[t].PredictedClosingDate.toString() + " - Profit : " + JSON.parse(body).value[t].MaxLocalTotal.toString()
            }
          ]
        };
		
		results.push(arr);  
  }
  
result.status(200).json( 
{replies: [{
            type: 'list',
			delay: 0.5,
            content: {
		elements: 
        results
      
    }
  }]
   }  
)
}
)
}
)	
});
app.listen(3000, () => console.log('Server ready'))


	

