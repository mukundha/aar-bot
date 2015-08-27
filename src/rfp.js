// Description:
//   searching the Apigee answer repository [AAR]
//
// Dependencies:
//   None
//
// Configuration:
//   AAR_CONFIG_FILE - google service account config file
//
// Commands:
//   hubot rfp <keyword> - searches for answers
//
// Author:
//   Mukundha Madhavan <mukundha@apigee.com>

var jwt ;
var request = require('request')
var fs = require('fs')
var googleAuth = require('google-oauth-jwt');

try{
  console.log(process.env.AAR_CONFIG_FILE)
  var creds = fs.readFileSync(process.env.AAR_CONFIG_FILE)
  creds = JSON.parse(creds)
  var privateKey=creds.private_key
  var email = creds.client_email
  getJWT()
}catch(err){
  console.log('sadly, rfp bot failed to start, more information below')
  console.log(err)
}

module.exports = function(robot) {
    robot.respond(/rfp (.*)/i, function(msg){           	
        var url = process.env.RFP_URL
        var ql = msg.match[1]
		if(ql && jwt) {
		  var baasquery = 'select * where ';
		  var qlsplits = ql.split(' ');
		  baasquery = baasquery + addSplitPartsToQuery_searchString(qlsplits);
		  request({
        url:url + '?ql=' + baasquery , 
        headers:{
          Authorization: 'BearerToken ' + jwt
          }
      },function(error,response,body){
		  	var b = JSON.parse(body)
		  	b.entities.forEach(function(e){
		  		msg.send('Question: ' + e.question)
		  		msg.send('Answer:```' + e.answer + '```')
		  	})
		  })
		} else  {
			if(!jwt)
        msg.send('This is certainly not a user error!, pls try again later - @mukundha @jeremybrown')
      else
        msg.send("USAGE: rfp <search query>");  
		}
    })

    robot.respond(/rfpdebug/i, function(msg){ 
      msg.send(JSON.stringify(creds))
      msg.send(jwt)
    })    
}

function addSplitPartsToQuery_searchString(splits){
  var queryStrPartial = "";
  for(i=0;i<splits.length;i++){
    var t = splits[i].trim();
	var temp = "(question contains '" + t + "*' or " + 
                " answer contains '" + t + "*' or " + 
                " description contains '" + t + "*')";
    queryStrPartial = queryStrPartial + temp;
  	if(splits.length-i>1)
      queryStrPartial = queryStrPartial + 'and ' ;
  }
  return queryStrPartial;
}

function addSplitPartsToQuery_tags(splits){
  var queryStrPartial = "";
  for(i=0;i<splits.length;i++){
    var t = splits[i].trim();
	var temp = "(tags = '" + t + "')";
    queryStrPartial = queryStrPartial + temp;
  	if(splits.length-i>1)
      queryStrPartial = queryStrPartial + 'or ' ;
  }
  return queryStrPartial;
}


function getJWT(){
  googleAuth.encodeJWT({
    email: email,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/plus.login']
  }, function (err, token) {    
    if(!err)
     jwt = token     

  })
}


  
