// Description:
//   searching the Apigee answer repository [AAR]
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   hubot rfp <keyword> - searches for answers
//
// Author:
//   Mukundha Madhavan <mukundha@apigee.com>


var request = require('request')
module.exports = function(robot) {
    robot.respond(/rfp (.*)/i, function(msg){           	
        var url = process.env.RFP_URL
        var ql = msg.match[1]
		if(ql != null) {
		  var baasquery = 'select * where ';
		  var qlsplits = ql.split(' ');
		  baasquery = baasquery + addSplitPartsToQuery_searchString(qlsplits);
		  console.log(baasquery)  
		  //msg.reply(baasquery);  
		  request(url + '?ql=' + baasquery , function(error,response,body){
		  	var b = JSON.parse(body)
		  	b.entities.forEach(function(e){
		  		msg.reply('Question: ' + e.question)
		  		msg.reply('Answer:' + e.answer)
		  	})
		  })
		} else  {
			msg.reply("USAGE: rfp <search query>");  
		}

    });
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




  
