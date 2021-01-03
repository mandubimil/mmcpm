function start_page()
{

    load_title();
}



function load_title()
{
    $$('grid_1').clearAll();
    $$('grid_2').clearAll();
    
	let s_para = {
        "para":{
            "exe_id":"get_account_amt",
            "q_para":{}
        }
    };
    webix.ajax().headers({"Content-type":"application/json"}).post("/stock_api/python_exe", 
    JSON.stringify({"server_type":$$('combobox_1').getValue(), "para":JSON.stringify(s_para)}), function(text)
	{  
        jsd = JSON.parse(text);

        tmput2(  '<b>'+$$('combobox_1').getValue()+'</b> '+'총액:'+comma1000(jsd['예탁자산총액'])+' 손익:'+jsd['손익율']+' 주문가능:'+comma1000(jsd['현금주문가능금액']) );
	});		    
}


function gogo()
{
    $$('grid_1').clearAll();
    $$('grid_2').clearAll();

    if ($$('radiobox_1').getValue() === '1')
    {
        $$('title1').setHTML('주식 서버 / 데이터 베이스');
        
        list_bo();
        list_bo_db();
    }
    else if ($$('radiobox_1').getValue() === '2')
    {
        $$('title1').setHTML('매수 / 매도 (30일)');
        
        list_mesu();
        list_medo();
    }
    else if ($$('radiobox_1').getValue() === '3')
    {
        $$('title1').setHTML('주식 서버 / 주문');
        
        list_bo();
        list_ju();
    }
}


function list_bo()
{
	let s_para = {
        "para":{
            "exe_id":"get_list_bo",
            "q_para":{}
        }
    };
    webix.ajax().headers({"Content-type":"application/json"}).post("/stock_api/python_exe", 
    JSON.stringify({"server_type":$$('combobox_1').getValue(), "para":JSON.stringify(s_para)}), function(text)
	{  
        jsd = JSON.parse(text);

        set_and_sort_python(text, $$('grid_1'));
	});		    
}

function list_ju()
{
	let s_para = {
        "para":{
            "exe_id":"get_ju_list",
            "q_para":{}
        }
    };
    webix.ajax().headers({"Content-type":"application/json"}).post("/stock_api/python_exe", 
    JSON.stringify({"server_type":$$('combobox_1').getValue(), "para":JSON.stringify(s_para)}), function(text)
	{  
        //webix.message(text);
        jsd = JSON.parse(text);

        set_and_sort_python(text, $$('grid_2'));
	});		    
}


function list_bo_db()
{
	let s_para = {
        "para":{
            "exe_id":"query_list_bo_1",
            "q_para":{}
        }
    };
    webix.ajax().headers({"Content-type":"application/json"}).post("/stock_api/python_exe", 
    JSON.stringify({"server_type":$$('combobox_1').getValue(), "para":JSON.stringify(s_para)}), function(text)
	{  
        jsd = JSON.parse(text);

        set_and_sort_oracle(text, $$('grid_2'));
	});		    
}


function list_medo()
{
	let s_para = {
        "para":{
            "exe_id":"query_medo_1",
            "q_para":{}
        }
    };
    webix.ajax().headers({"Content-type":"application/json"}).post("/stock_api/python_exe", 
    JSON.stringify({"server_type":$$('combobox_1').getValue(), "para":JSON.stringify(s_para)}), function(text)
	{  
        jsd = JSON.parse(text);

        set_and_sort_oracle(text, $$('grid_2'));
	});		    
}


function list_mesu()
{
	let s_para = {
        "para":{
            "exe_id":"query_mesu_1",
            "q_para":{}
        }
    };
    webix.ajax().headers({"Content-type":"application/json"}).post("/stock_api/python_exe", 
    JSON.stringify({"server_type":$$('combobox_1').getValue(), "para":JSON.stringify(s_para)}), function(text)
	{  
        jsd = JSON.parse(text);

        set_and_sort_oracle(text, $$('grid_1'));
	});		    
}