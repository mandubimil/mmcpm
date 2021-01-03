var pop_menu = 
{ view:"popup",	id:"pop_menu", head:"Submenu", width:150,body:
    {
        type:"space",
        rows:
        [
            {
                view:"list", id:"list_menu", data:[ 
                                            {id:"1", name:"memo", location:"메모"},
                                            {id:"2", name:"code", location:"코딩"},
                                            {id:"3", name:"file", location:"파일"},
                                            {id:"4", name:"plan", location:"계획"}
                                        ],
                datatype:"json", template:"#location#",	autoheight:true, select:true
            }
        ]
    }
};

function tmput1(str_temp)
{
	$$('tms1').setHTML(str_temp);
	//webix.message(str_temp);
}

function tmput2(str_temp)
{
	$$('tms2').setHTML(str_temp);
}

 
function tput1(str_temp)
{
	$$('tl1').setHTML(str_temp);
	webix.message(str_temp);
}

function tput2(str_temp, str_bar)
{
	$$('tl1').setHTML(str_bar);

	if (str_temp != 'no_message')
	{
		webix.message(str_temp);
	}
}

function get_obj_list(data)
{
	var str_temp = '';
	
	if ((typeof data) === 'string')
		str_temp = str_temp + '[string] ' + data;
	if ((typeof data) === 'number')
		str_temp = str_temp + '[number] ' + data;
	else
		for (var key in data) { 
			//str_temp = str_temp + 'type: [' + typeof data[key] + '], key: [' + key + '], value: [' + data[key] + ']'+'\n';
			str_temp = str_temp + '[' + typeof data[key] + '] ' + key + ' : ' + data[key] + '\n';
		}

	return str_temp;
}


function insert_dc(editor) { 
    var cm = editor;
    var doc = cm.getDoc();
    var cursor = doc.getCursor(); 
    var line = doc.getLine(cursor.line);
    var pos = { line: cursor.line, ch: 0  };	
    doc.replaceRange('          "', pos);	
	pos.ch = line.length+11;
    doc.replaceRange('"', pos);
	
	pos = { line: cursor.line+1, ch: 0  };		
    doc.setCursor(pos);
}

function insert_gu(editor) { 
    var cm = editor;
    var doc = cm.getDoc();
    var cursor = doc.getCursor(); 
    var line = doc.getLine(cursor.line);
    var pos = { line: cursor.line, ch: 0  };	
    doc.replaceRange('//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////\n', pos);	
}


function showForm(winId, node)
{
    $$(winId).getBody().clear();
    $$(winId).show(node);
    $$(winId).getBody().focus();
}
		
function hideForm(winId, node)
{
    $$(winId).getBody().clear();
    $$(winId).hide(node);
}


function open_temp_popup(p_str, callback)
{
    webix.ui
    ({  view:"popup",        id:"temp_pop",        height:100,        width:300,
        position:"center",        head:false,        body:{ template:'<b>'+p_str+'</b>' }
    }).show(); 
    
    if (typeof callback == 'function')
        callback();
}

function close_temp_popup()
{
    $$('temp_pop').close();
}


function comma1000(num)
{
	num = String(num);
    return num.replace(/(\d)(?=(?:\d{3})+(?!\d))/g,"$1,");
}

function set_and_sort_oracle(text, grid)
{
    var jsd = JSON.parse(text);

    grid.clearAll();          

    if (jsd['check_result'] == 'good')
    {
        var col_title = [];
        for (var key in jsd['cols'])
            col_title.push({'id':key, 'header':jsd['cols'][key], adjust:true});

        grid.config.columns = col_title;
        grid.refreshColumns();
        
        grid.parse(jsd['rows']);        

        for (var key in jsd['cols'])
            grid.adjustColumn(key, 'all');
    }
    else
        alert(jsd['error_message']);
}

function set_and_sort_python(text, grid)
{
    var jsd = JSON.parse(text);
    
    grid.clearAll();   
    grid.config.columns = [];
    grid.refreshColumns();

    grid.parse(jsd["data"]);

    var i = 0;
    if (jsd['check_result'] == 'good')
        for (var key in jsd["data"][0])
        {
            if ((key != '일자') && (key != '단축코드') && (key != '종목코드') && (key != 'id') && 
            (!(isNaN(parseInt(jsd["data"][0][key])))))
            {
                grid.config.columns[i].sort = 'int';
                grid.config.columns[i].format = webix.i18n.intFormat;
                //grid.config.columns[i].css  = {'text-align':'right'};
            }

            grid.adjustColumn(key, 'all');
            i = i + 1;
        }
 
    grid.refresh();
}

