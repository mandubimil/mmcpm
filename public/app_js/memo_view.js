function read_memo(select_id)
{
    var send_json = {"메모번호":select_id};	
	webix.ajax().headers({"Content-type":"application/json"}).post("/memo_api/getContentsMemo", send_json, function(text)
	{  
		var json_obj = JSON.parse(text);		

		if (json_obj.length > 0)
		{
            $$('text_title').setValue(json_obj[0]["제목"]);
			$$('contents_1').setValue(json_obj[0]["내용"]);
			$$('contents_1').메모번호 = json_obj[0]["메모번호"];
			$$('contents_1').제목 = json_obj[0]["제목"];
		}
	});				    
}

function save_memo(sub_windows)
{
	var id = $$('contents_1').메모번호;

	if (id === '' || id === null || id === undefined)
	{ 
		webix.message('메모를 선택하세요.');
		return 1;
	}

	webix.message(id);
  
	var send_json = { "메모번호":id, 
				  	  "제목":$$('text_title').getValue(), 
					  "대분류":"",
					  "중분류":"",
					  "소분류":"", 
					  "내용":$$('contents_1').getValue() 
					};

	webix.ajax().headers({"Content-type":"application/json"}).post("/memo_api/saveMemo", send_json, function(text)
	{		
		webix.message(text);
	});	
}


function del_memo()
{
	var id = $$('contents_1').메모번호;

	if (id === '' || id === null || id === undefined)
	{
		webix.message('메모를 선택하세요.');
		return 1;
	}
  
	webix.confirm({title:$$('contents_1').제목, text:"정말 지울껴?", callback:function(result)
	{
		var send_json = { "메모번호":id};

		if (result === true)
			webix.ajax().headers({"Content-type":"application/json"}).post("/memo_api/delMemo", send_json, function(text)
			{
				webix.message(text);

				document.f.action = '/memo';
				document.f.method = 'POST';
				document.f.submit();	
			});	
	}});	

}
