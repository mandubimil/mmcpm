function start_page()
{
    get_python_exe();
}

function get_python_exe()
{
	let s_para = {
        "para":{
            "exe_id":"query_get_python_cron",
            "q_para":{}
        }
    };
    webix.ajax().headers({"Content-type":"application/json"}).post("/stock_api/python_exe", 
    JSON.stringify({"server_type":"demo", "para":JSON.stringify(s_para)}), function(text)
	{  
        set_and_sort_oracle(text, $$('grid_1'));
	});		    
}

function tg_exe()
{
	let s_para = {
        "para":{
            "exe_id":"query_python_cron_toggle",
            "q_para":{
                "서버":$$("text_server").getValue(),
                "파일":$$("text_file").getValue(),
                "구분":$$("text_gubun").getValue(),
            }
        }
    };
    webix.ajax().headers({"Content-type":"application/json"}).post("/stock_api/python_exe", 
    JSON.stringify({"server_type":"demo", "para":JSON.stringify(s_para)}), function(text)
	{  
        get_python_exe();        
	});		    
}

