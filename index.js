require('dotenv').config({});
var express = require('express');
var request = require('request');
var moment = require('moment');
var cheerio = require('cheerio');

var app = express();
var AT = require('africastalking')({
	apiKey: process.env.AT_apiKey,
	username:process.env.AT_username
});

var SMS = AT.SMS;

var port = process.env.PORT || 3000;


const getTenders = (start,count)=>{
	return new Promise((resolve,reject)=>{
		start = start || 0;
		count = count || 1000;
		var apiUrl = `https://tenders.go.ke/website/tenders/advancedSearchFilter/open?org_type=&org_name=&tender_category=&tender_type=&draw=2&columns%5B0%5D%5Bdata%5D=type&columns%5B0%5D%5Bname%5D=organizations.type&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=true&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=org_name&columns%5B1%5D%5Bname%5D=organizations.name&columns%5B1%5D%5Bsearchable%5D=true&columns%5B1%5D%5Borderable%5D=true&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=tender_ref_no&columns%5B2%5D%5Bname%5D=tender_notices.tender_ref_no&columns%5B2%5D%5Bsearchable%5D=true&columns%5B2%5D%5Borderable%5D=true&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B3%5D%5Bdata%5D=tender_title&columns%5B3%5D%5Bname%5D=tender_notices.tender_title&columns%5B3%5D%5Bsearchable%5D=true&columns%5B3%5D%5Borderable%5D=true&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B4%5D%5Bdata%5D=tender_category&columns%5B4%5D%5Bname%5D=tender_notices.tender_category&columns%5B4%5D%5Bsearchable%5D=true&columns%5B4%5D%5Borderable%5D=true&columns%5B4%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B4%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B5%5D%5Bdata%5D=tender_type&columns%5B5%5D%5Bname%5D=tender_notices.tender_type&columns%5B5%5D%5Bsearchable%5D=true&columns%5B5%5D%5Borderable%5D=true&columns%5B5%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B5%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B6%5D%5Bdata%5D=tender_status&columns%5B6%5D%5Bname%5D=tender_notices.tender_status&columns%5B6%5D%5Bsearchable%5D=true&columns%5B6%5D%5Borderable%5D=true&columns%5B6%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B6%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B7%5D%5Bdata%5D=closing_date&columns%5B7%5D%5Bname%5D=tender_notices.closing_date&columns%5B7%5D%5Bsearchable%5D=true&columns%5B7%5D%5Borderable%5D=true&columns%5B7%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B7%5D%5Bsearch%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=0&order%5B0%5D%5Bdir%5D=asc&start=${start}&length=${count}&search%5Bvalue%5D=&search%5Bregex%5D=false&_=1592656040326`
		var options = {
		  'method': 'GET',
		  'url': apiUrl,
		  'headers': {
		    'Connection': 'keep-alive',
		    'Pragma': 'no-cache',
		    'Cache-Control': 'no-cache',
		    'Accept': 'application/json, text/javascript, */*; q=0.01',
		    'DNT': '1',
		    'X-Requested-With': 'XMLHttpRequest',
		    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36',
		    'Sec-Fetch-Site': 'same-origin',
		    'Sec-Fetch-Mode': 'cors',
		    'Sec-Fetch-Dest': 'empty',
		    'Referer': 'https://tenders.go.ke/website/tenders/getSelectedResults/open?entity_type=&tab=closed&entity_name=&tender_category=&tender_type=',
		    'Accept-Language': 'en-US,en;q=0.9,id;q=0.8,pt;q=0.7,und;q=0.6',
		    'Cookie': '_ga=GA1.3.239974239.1592484092; _gid=GA1.3.1479359241.1592484092; XSRF-TOKEN=eyJpdiI6InVDWGhtZitVVGQ3OWpONWxUNFpXeXc9PSIsInZhbHVlIjoicHJcL3FWeUd2emZ0MFV4c1VHellsSHVHY0NobHlOUU00ZUpGMmZqSWloQys2cVV4R2ltV0dtY0k2R0FtaHlQdlIwYmtic3dOc2VSZUxvYlJcL0lLeTErUT09IiwibWFjIjoiMmU4MTE1YzgzZTY2MDcxMGY5OGVlYWJkZjczMjMzMDNmMDg4YThmMTY1NTRkNDEwNDlhNzgyNTI3NjQxNWNlMSJ9; laravel_session=eyJpdiI6ImFmeFhmaGtHTUZ0eG53Z1wvRVhXWmRRPT0iLCJ2YWx1ZSI6IllGUU4ydHhLajY2dVRmblp1ZVd4OEcwMjkxMmJWZURvXC9GbnhHVnlpKzZ3M3NTSTI2b1lzSWZHVk80OTJtRVp4bTBVTUhjNDRvaURzN3NDdnVkdVwvenc9PSIsIm1hYyI6IjBmNDA2ZTcyMjhjYzcyYWMwMTdjMmI3ZDk0MTAzMmIyMTdiMzAwNzI1NWJiYTIyZWY0OTIyMTk0OTljMmRiM2MifQ%3D%3D; XSRF-TOKEN=eyJpdiI6Ik52cTIycEdXemNWeGxXczRGZG9XVEE9PSIsInZhbHVlIjoiMGR0THZUWXlqNFNUS3V0NzE5K0dlTmpvdWQxalwvNzQ5Snp2OEkyOHY0WXJRS0lxc2JTR3hZVjRjR0hEaHYzdFJ2UUd4anVDTVlVTlZUNU5rMzdVWm13PT0iLCJtYWMiOiI0ZmE4M2IxYTNlMDkzYTVlMDRiOTU3N2JlMGQ3NDdkMTE4ZDdlY2I1OTBkYWIwZWUzMDA3NzI4YWQ0MzQxZWI0In0%3D; laravel_session=eyJpdiI6InFXUldrQmpQQXFDMytSeWFtN2lPdlE9PSIsInZhbHVlIjoiWFwvSFFZK2pZaUpUQ0Y3b0RWK3dldGZHUjVvVEJrK0FURW1wZ2RaR1REMW1YMnZBNThjVnZcL0tJVSt6cEVpNDhXR0pheUMrU0RvcDY4bnN3eUl3dTJpZz09IiwibWFjIjoiMWVmNjNlOTkwNjZjNWZhYThjMWIwMzQzYjk5ZTkwYWI1NTg1OWY0N2M1NmUzOWNhM2RmZjQ4OGQyNWQzMjE3ZSJ9'
		  }
		};
		request(options, function (error, response) {
			if(error){
				reject(error);
			}else{
				resolve(response.body);
			}
		});

	})
}

app.get('/',(req,res)=>{
	res.send('Welcome to the index page');
});

app.get('/findtenders',(req,res)=>{
	getTenders(0,100)
	.then((rawData)=>{
		rawData = JSON.parse(rawData);
		var allTenders = rawData.data;

		allTenders.map((tender)=>{
			var now = moment(new Date());
			var tenderCreatedAt = moment(tender.created_at);
			var tenderClosingAt = moment(tender.closing_date);

			var postedInTheLast24Hrs = now.diff(tenderCreatedAt,'h')<24 ? true: false;
			var closingIn48Hrs = tenderClosingAt.diff(now,'h') < 48 ? true: false;

			var ourInterests = /Supply|Internet|installation|School|Hospital/gi;

			if (ourInterests.test(tender.tender_title)) {
				/*
				Tenders that make it into this section are either about
				supply of things
				internet work eg installation
				school projects
				hospital projects

				*/

				//now lets play with the dom 
				//we need to extrack the link of the tender from the tender
				//in the response data, the link is inside href tags<a href="linkkkkkkkk"><a>
				const $ = cheerio.load(tender.tender_ref_no);

				//this is like jQuery but in the server not the browser
				$('a').each((i,el)=>{
					//ooops I just nticed a bug it is el not 'el'

					const learnMoreLink = $(el).attr('href');

					//we got it , now lets place it inside the tender object
					//we are going to send an sms
					//an sms has a character limit of 160 , so we need to 
					// make sure that our link only has the essential part not the https://yadayada
					tender['learnMoreLink'] = learnMoreLink.replace('https://www.','');

				});

				if (postedInTheLast24Hrs) {
					//send an sms to say there is a new tender
					var messageContent = `Hey, here's a new tender ${tender.learnMoreLink} .It was posted ${tenderCreatedAt.fromNow()}.`;
					SMS.send({
						to:'ENTER YOUR PHONE NUMBER HERE',
						message:messageContent
					})
					.then((successConfirmation)=>console.log(successConfirmation))
					.catch((err)=>console.log(err));
				};

				if (closingIn48Hrs) {
					//send an sms to remind me of the closing date
					var messageContent = `Hey, this tender expires ${tenderClosingAt.fromNow()}.See it here ${tender.learnMoreLink}.`;
					SMS.send({
						to:'ENTER YOUR PHONE NUMBER HERE',
						message:messageContent
					})
					.then((successConfirmation)=>console.log(successConfirmation))
					.catch((err)=>console.log(err));
				};
			}
		});
		res.status(200).send('Done!');
	})
	.catch((err)=>{
		res.status(500).send(err);
	})
})

app.listen(port,()=>{
	console.log(`App is now running on port ${port}`);
})