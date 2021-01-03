wi = 0;

function start_page()
{
	read_list();
}

function clear_contents()
{
	$$('text_title').setValue("");
	$$('text_b1').setValue("");
	$$('text_b2').setValue("");
	$$('text_b3').setValue("");
	$$('contents_1').setValue("");
	$$('contents_1').메모번호 = "";
	$$('contents_1').제목 = "";
}

function read_list(select_id)
{
	var send_json = {};	
	webix.ajax().headers({"Content-type":"application/json"}).post("/memo_api/getListMemo", send_json, function(text)
	{  
		var json_obj = JSON.parse(text);		
		var tree_data = [];
		
		for (var i=0 ; i <json_obj.length ; i++)
		{			
			tree_data[i] = {id:json_obj[i].메모번호, value:json_obj[i].제목, 제목:json_obj[i].제목, 대분류:json_obj[i].대분류, 중분류:json_obj[i].중분류};
		}		
				
		$$('tree_1').clearAll(); 
		$$('tree_1').parse(tree_data);		
		$$('tree_1').sort('#value#');
		$$('tree_1').openAll();
	});		
}

function read_memo(id)
{

	//var status = "toolbar=no,directories=no,scrollbars=no,resizable=yes,status=no,menubar=no";
    // window.open('', 'f1', status);

    // document.f.action = '/memo_view';
    // document.f.target = 'f1';
	// document.f.submit();	

	// webix.message("fd");

	document.f.action = '/memo_view';
	document.f.select_id.value = id;
	document.f.method = 'POST';
	document.f.submit();	
}


function read_memo_this(select_id)
{
    var send_json = {"메모번호":select_id};	
	webix.ajax().headers({"Content-type":"application/json"}).post("/memo_api/getContentsMemo", send_json, function(text)
	{  
		var json_obj = JSON.parse(text);		

		if (json_obj.length > 0)
		{
            // $$('text_title').setValue(json_obj[0]["제목"]);
			$$('contents_1').setValue(json_obj[0]["내용"]);
			$$('contents_1').메모번호 = json_obj[0]["메모번호"];
			$$('contents_1').제목 = json_obj[0]["제목"];
		}		
	});				    
}


function new_memo()
{
	var send_json = { "대분류":""};

	webix.ajax().headers({"Content-type":"application/json"}).post("/memo_api/newMemo", send_json, function(text)
	{
		webix.message(text);
		var json_obj = JSON.parse(text);		

		read_memo(json_obj[0]["메모번호"]);
	});	
}
