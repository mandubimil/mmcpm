wi = 0;

function start_page()
{
	read_list();
}

function gogo()
{
	read_list();
}

function read_list()
{
	$$('tree_1').clearAll();

	var send_json = {select_path:$$('combobox_1').getText()};
	webix.ajax().headers({"Content-type":"application/json"}).post("/code_api/getListCode", send_json, function(text)
	{  
		var json_obj = JSON.parse(text);		

		$$('tree_1').parse(json_obj);
		$$('tree_1').sort('#id#');
		$$('tree_1').closeAll();
	});
}

function read_code(id)
{
	webix.message(id);
	document.f.action = '/code_view';
	document.f.select_id.value = JSON.stringify(id);
	document.f.method = 'POST';
	document.f.submit();	
}

function read_code_this(select_id) 
{
	var send_json = {"풀경로":select_id, "파일":"", "경로":""};
	webix.ajax().headers({"Content-type":"application/json"}).post("/code_api/getContentsCode", send_json, function(text)
	{  
		var json_obj = JSON.parse(text);		

		if (json_obj.length > 0)
		{
			$$('label_file').setValue(select_id);
			$$('contents_1').setValue(json_obj[0]["contents"]);
			$$('contents_1').경로 = json_obj[0]["dirName"];
			$$('contents_1').파일 = json_obj[0]["fileName"];
			$$('contents_1').풀경로 = json_obj[0]["fullName"];
		}
	});				    
}

function new_code(p_type)
{
	var send_json = { "경로":$$('statebar1').dirName, "타입":p_type};

	webix.ajax().headers({"Content-type":"application/json"}).post("/code10/newCode", send_json, function(text)
	{
		webix.message(text);
		read_list();
	});	
}

function rename_code(p_type)
{
	var id = $$('contents_1').풀경로;

	if (id === '' || id === null || id === undefined || $$('text_new').getValue() == '' || $$('text_new').getValue() == null )
	{
		webix.message('이름 넣어.');
		return 1;
	}

	var send_json = { "풀경로":$$('contents_1').풀경로, "경로":$$('contents_1').경로, "새파일이름":$$('text_new').getValue() };

	webix.ajax().headers({"Content-type":"application/json"}).post("/code10/renameCode", send_json, function(text)
	{
		webix.message(text);
		read_list();
	});	
}


function run_code()
{
	full_name = $$('contents_1').풀경로;

	if (full_name == '' || full_name == null || full_name == undefined )
		return 1;

	let mySplitResult = full_name.split(".");
	let last_split = mySplitResult[mySplitResult.length-1];

	if (last_split == 'py' || last_split == 'go' || last_split == 'js')
	{
		var send_json = { "풀경로":full_name, "내용":$$('contents_1').getValue() };

		webix.ajax().headers({"Content-type":"application/json"}).post("/code10/saveCode", send_json, function(text)
		{		
			var send_json = {"풀경로":full_name, "언어":last_split};
			webix.ajax().headers({"Content-type":"application/json"}).post("/code10/runCode", send_json, function(text)
			{
				webix.message("실행 완료~");
				$$('contents_2').setValue(text);
			});	
		});				
	}
	else if (last_split == 'sql')
	{
		var send_json = { "풀경로":full_name, "내용":$$('contents_1').getValue() };

		webix.ajax().headers({"Content-type":"application/json"}).post("/code10/saveQuery", send_json, function(text)
		{		
			webix.ajax().headers({"Content-type":"application/json"}).post("/code10/runQuery", send_json, function(text)
			{
				var jsd = JSON.parse(text);            

				if (jsd['check_result'] == 'error')
				{
					alert(jsd['error_message']);
				}
				else
				{
					$$('grid_1').clearAll();          
				
					var col_name = [];
					for (var key in jsd['cols'])
						col_name[key] = {'id':key, 'header':jsd['cols'][key]}
			
					$$('grid_1').config.columns = col_name;
					$$('grid_1').refreshColumns();
			
					$$('grid_1').parse(jsd['rows']);
			
					for (var key in jsd['rows'][0])
						$$('grid_1').adjustColumn(key, 'all');
				}                
			});	
		});				

	}
}
