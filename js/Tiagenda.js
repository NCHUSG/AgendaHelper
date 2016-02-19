(function($){
        //先定義JQuery為$，不要讓它衝突        
            $(function(){
                /**一開始的簡易版使用說明**/
                //toastr.success("1. 請從選擇系級開始（未選擇系級，無法使用以下功能）<br />2. 點擊課表中的+字號，旁邊欄位會顯示可排的課程，請善加利用<br />3. 任何課程都可以使用課程查詢來找<br />特別小叮嚀(1)：課程查詢以各位輸入的條件篩選，條件越少，找到符合的課程就越多<br />特別小叮嚀(2)：如果有想要查詢其他系的必選修，也可以使用課程查詢<br />4. 如果排好課，有需要請截圖來保留自己理想的課表（如果課表太大，可利用縮放功能來縮小視窗以利截圖）", "使用說明", {timeOut: 2500});

                //如果先前有使用過(沒有關機),會直接讀取之前的資料
                if (typeof(Storage) !== "undefined") {
                    // Store
                    window.credits=0//一開始的學分數是0
                    window.courses = {};//宣告一個空的物件
                    window.course_of_majors = {};//宣告一個空的物件
                    window.course_of_day = {};  //這是宣告日期的陣列
                    window.teacher_course = {}; //這是以老師姓名為index的陣列
                    window.name_of_course = {}; //這是以課程名稱為index的陣列
                    window.name_of_optional_obligatory = [] //這是用來存系上的必修課，檢查有沒有課名是重複的，若有就讓使用者自行決定要上哪堂
                    window.json_resource=[];//temp array,先暫時寫成本地端的陣列，未來會需要用ajax取得資料
                    window.user=[];//this array will be filled with student's json.
                    window.agenda_count=[[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0]];
                    window.agenda_name_count=[[{},{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{},{}]];
                    window.fileName="";
                    window.json_num=0;
                    window.obj=[];
                    window.files=[];
                    //Tiagenda的初始值就是每一段時間都沒有被重疊到
                    $.each(window.json_resource,function(kk,kv){
                        $.getJSON(kv, function(json){  //getJSON會用function(X)傳回X的物件或陣列                    
                            $("#class_credit").text(0);
                            window.language="zh_TW";//固定顯示語言為中文
                            $.each(json.time_table, function(ik, iv){
                                if(typeof(window.course_of_majors[iv.for_dept]) == 'undefined')//如果這一列(列的名稱為索引值key)是空的也就是undefined，那就對他進行初始化，{}物件裡面可以放任意的東西，在下面會把很多陣列塞進這個物件裡面
                                    window.course_of_majors[iv.for_dept] = {};
                                if(typeof(window.course_of_majors[iv.for_dept][iv.class]) == 'undefined'){
                                    window.course_of_majors[iv.for_dept][iv.class] = [];//如果這一行(列的名稱為索引值key)是空的也就是undefined，那就對他進行初始化，[]裡面的是放陣列
                                }
                                window.course_of_majors[iv.for_dept][iv.class].push(iv.code);//把東西推進這個陣列裡，概念跟stack一樣
                                if(typeof(window.courses[iv.code])=='undefined'){
                                    window.courses[iv.code]=[];
                                }
                                window.courses[iv.code].push(iv);//這邊可以直接把選課號當作索引值key，裡面的值為object
                                $.each(iv.time_parsed, function(jk, jv){//建立日期的陣列
                                    $.each(jv.time, function(mk, mv){
                                        if(typeof(window.course_of_day[jv.day])=='undefined'){
                                            window.course_of_day[jv.day]={};
                                        }
                                        if(typeof(window.course_of_day[jv.day][mv])=='undefined'){
                                            window.course_of_day[jv.day][mv]=[];
                                        }
                                        window.course_of_day[jv.day][mv].push(iv);
                                    })
                                })
                                if(typeof(window.teacher_course[iv.professor])=='undefined'){//建立老師名稱的陣列
                                    window.teacher_course[iv.professor]=[];
                                }
                                window.teacher_course[iv.professor].push(iv);
                                if(typeof(window.name_of_course[iv.title_parsed.zh_TW])=='undefined'){//中文課名陣列
                                    window.name_of_course[iv.title_parsed.zh_TW]=[];
                                }
                                window.name_of_course[iv.title_parsed.zh_TW].push(iv);
                                if(typeof(window.name_of_course[iv.title_parsed.en_US])=='undefined'){//英文課名陣列
                                    window.name_of_course[iv.title_parsed.en_US]=[];
                                }
                                window.name_of_course[iv.title_parsed.en_US].push(iv);
                            });
                        });                                         
                    });
                    if(localStorage['agenda_count']!="")
                    {
                        agenda_count=$.parseJSON(localStorage['agenda_count']);
                        agenda_name_count=$.parseJSON(localStorage['agenda_name_count']);
                        json_num=parseInt(localStorage['json_num']);
                        demo_click();
                        fileName=localStorage['fileName'];
                        $('#upload_file_name').text("已上傳:"+fileName);
                    }
                } 
                else {
                    window.credits=0//一開始的學分數是0
                    window.courses = {};//宣告一個空的物件
                    window.course_of_majors = {};//宣告一個空的物件
                    window.course_of_day = {};  //這是宣告日期的陣列
                    window.teacher_course = {}; //這是以老師姓名為index的陣列
                    window.name_of_course = {}; //這是以課程名稱為index的陣列
                    window.name_of_optional_obligatory = [] //這是用來存系上的必修課，檢查有沒有課名是重複的，若有就讓使用者自行決定要上哪堂
                    window.json_resource=[];//temp array,先暫時寫成本地端的陣列，未來會需要用ajax取得資料
                    window.user=[];//this array will be filled with student's json.
                    window.agenda_count=[[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0]];
                    window.agenda_name_count=[[{},{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{},{}]];
                    window.fileName="";
                    window.json_num=0;
                    window.obj=[];
                    window.files=[];
                    console.log("up");
                    //Tiagenda的初始值就是每一段時間都沒有被重疊到
                    $.each(window.json_resource,function(kk,kv){
                        $.getJSON(kv, function(json){  //getJSON會用function(X)傳回X的物件或陣列                    
                            $("#class_credit").text(0);
                            window.language="zh_TW";//固定顯示語言為中文
                            $.each(json.time_table, function(ik, iv){
                                if(typeof(window.course_of_majors[iv.for_dept]) == 'undefined')//如果這一列(列的名稱為索引值key)是空的也就是undefined，那就對他進行初始化，{}物件裡面可以放任意的東西，在下面會把很多陣列塞進這個物件裡面
                                    window.course_of_majors[iv.for_dept] = {};
                                if(typeof(window.course_of_majors[iv.for_dept][iv.class]) == 'undefined'){
                                    window.course_of_majors[iv.for_dept][iv.class] = [];//如果這一行(列的名稱為索引值key)是空的也就是undefined，那就對他進行初始化，[]裡面的是放陣列
                                }
                                window.course_of_majors[iv.for_dept][iv.class].push(iv.code);//把東西推進這個陣列裡，概念跟stack一樣
                                if(typeof(window.courses[iv.code])=='undefined'){
                                    window.courses[iv.code]=[];
                                }
                                window.courses[iv.code].push(iv);//這邊可以直接把選課號當作索引值key，裡面的值為object
                                $.each(iv.time_parsed, function(jk, jv){//建立日期的陣列
                                    $.each(jv.time, function(mk, mv){
                                        if(typeof(window.course_of_day[jv.day])=='undefined'){
                                            window.course_of_day[jv.day]={};
                                        }
                                        if(typeof(window.course_of_day[jv.day][mv])=='undefined'){
                                            window.course_of_day[jv.day][mv]=[];
                                        }
                                        window.course_of_day[jv.day][mv].push(iv);
                                    })
                                })
                                if(typeof(window.teacher_course[iv.professor])=='undefined'){//建立老師名稱的陣列
                                    window.teacher_course[iv.professor]=[];
                                }
                                window.teacher_course[iv.professor].push(iv);
                                if(typeof(window.name_of_course[iv.title_parsed.zh_TW])=='undefined'){//中文課名陣列
                                    window.name_of_course[iv.title_parsed.zh_TW]=[];
                                }
                                window.name_of_course[iv.title_parsed.zh_TW].push(iv);
                                if(typeof(window.name_of_course[iv.title_parsed.en_US])=='undefined'){//英文課名陣列
                                    window.name_of_course[iv.title_parsed.en_US]=[];
                                }
                                window.name_of_course[iv.title_parsed.en_US].push(iv);
                            });
                        });                                         
                    });
                } 
               
                $(".clear-button").click(function()
                {
                    reset();
                    $("td").html('<div><span></span></div>');  //再把加號的按鈕填上去
                    $("td").attr({"style":""});
                });
            });
            //顯示選擇幾個檔案
            $('input[type="file"]').change(function(e){
                $('#file_name').attr("value","共"+e.target.files.length+"個檔案");
            });
            //顯示要上傳檔案的名稱
            $('input[type="file"]').change(function(e){
                var not_upload_file_name="";
                for (var i=0;i<e.target.files.length; i++) {
                    not_upload_file_name += e.target.files[i].name;
                }
                $('#not_upload_file_name').text("未上傳:"+not_upload_file_name);

            });
            //選擇完檔案案確定後,以下function會觸發
            document.getElementById('file').addEventListener('change', readMultipleFiles, false);
              function readMultipleFiles(evt) {
                //Retrieve all the files from the FileList object
                files = evt.target.files; 
                obj=[];
                //儲存檔案
                if (files) {
                    var json_current_num=0;
                    for (var i=0, f; f=files[i]; i++) {
                          var r = new FileReader();
                        r.onload = (function(f) {
                            return function(e) {
                                var contents = e.target.result;
                                obj[json_current_num] = $.parseJSON(contents);
                                json_current_num+=1;
                            };
                        })(f);
                        r.readAsText(f);
                    }  
                } else {
                      alert("Failed to load files"); 
                }
              }
            window.user_dept={};
            $('#submit').click(function(){
                json_num+=obj.length;
                $.each(obj,function(uk,uv){
                    has_class=[[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0]];//是否有課的陣列
                    $.each(uv.time_table,function(hk,hv){
                        $.each(hv.time_parsed,function(ik, iv){
                            $.each(iv.time,function(jk, jv){
                                agenda_count[iv.day-1][jv-1]++;//那門課的重疊次數加一  
                                has_class[iv.day-1][jv-1]=1;//判斷是否有課=1               
                            });                    
                        });
                    });
                    current_name=uv['user-dept']+':'+uv['user-name']+'<br>'    //存放目前json的name
                    fileName=fileName+uv['user-name']+".json";
                    //將有課的時段的tooltip加上名子
                    $.each(has_class,function(ik,iv){
                        $.each(iv,function(jk,jv){
                            if(jv==0)
                            {
                                //將有課的name存入目前時段
                                //且將相同部門的放在一起
                                var has_key=0;
                                //判斷是否為空字典
                                if(!jQuery.isEmptyObject(agenda_name_count[ik][jk]))
                                {
                                    var str=JSON.stringify(agenda_name_count[ik][jk]);
                                    console.log(typeof(str));
                                    var agenda_name_count_obj=$.parseJSON(str);
                                    console.log(typeof(agenda_name_count_obj));
                                    $.each(agenda_name_count_obj,function(key,value){
                                        console.log("3");
                                        if(key==uv['user-dept'])
                                        {
                                            console.log("4");
                                            value+=current_name;
                                            has_key=1;
                                            agenda_name_count[ik][jk][uv['user-dept']]=value;
                                            return false;
                                        }
                                    });
                                }
                                
                                if(has_key==0)
                                {
                                    agenda_name_count[ik][jk][uv['user-dept']]=current_name;
                                }
                            }
                        });
                    });
                });
                $('#file_name').attr("value","上傳成功");
                $('#upload_file_name').text("已上傳:"+fileName);
                $('#not_upload_file_name').empty();
                localStorage['fileName']=fileName;
            });

            window.week = ["一", "二", "三", "四", "五"];
            window.no_one="沒人可以到喔";
            window.once=1;//判斷是否是第一次按
            window.current_name="" //存放目前json的name 
            $("#demo").click(function(){    
                demo_click();
            });
            window.demo_click = function(){
                $("td").html('<div><span></span></div>');
                $("td").attr({"style":""}); 
                //找尋每個時段有多少人有課的值
                $.each(agenda_count,function(ik,iv){
                    $.each(iv,function(jk,jv){
                        var tooltip_position="";
                        var $td = $("#time-table").find('tr[data-hour=' + (jk+1) + '] td[data-day=' + (ik+1) + ']');     //將目前所在的td位置指派給$td    
                        var $div = $("#time-table").find('tr[data-hour=' + (jk+1) + '] td[data-day=' + (ik+1) + '] div');//將目前所在的div位置指派給$div
                        var $sp = $("#time-table").find('tr[data-hour=' + (jk+1) + '] td[data-day=' + (ik+1) + '] span');//將目前所在的span位置指派給$sp

                        //將目前課堂時段的名字取出
                        var all_name="";
                        //判斷是否為空字典
                        if(!jQuery.isEmptyObject(agenda_name_count[ik][jk]))
                        {
                            var agenda_name_count_obj=agenda_name_count[ik][jk];
                            $.each(agenda_name_count_obj,function(key,value){
                                all_name+=value;
                            });
                        }
                        else
                        {
                           all_name=no_one; 
                        }
                        $div.attr({
                            "data-toggle": "tooltip",
                            "data-html":"true",
                            "data-placement": tooltip_position,
                            "title": all_name,
                            "style": "height: 80%;width:100%",
                            "class": 'table_name'
                        });//放上tooltip顯示有誰可到
                        $sp.attr({
                            "class":"",
                            "style":"color:black;font-weight:bold"
                        });
                        if(jk+1<5)
                        {
                            tooltip_position="bottom";
                        }
                        else
                        {
                            tooltip_position="top";
                        }

                        if(jv>=0&&jv<=json_num/4&&jv!=json_num)
                        {
                            $div.attr({
                                "data-placement": tooltip_position,
                            });//放上tooltip的顯示位置
                            $td.attr({
                                "style": "color:#3074B5;background-color:#58FA58",
                            });//0~總數的1/4個人有課就會改綠色;
                            $sp.html("<h1>"+(json_num-jv)+"</h1>");//顯示目前時段可到人數
                        }
                        else if(jv>json_num/4&&jv<=json_num/2&&jv!=json_num)
                        {
                            $div.attr({
                                "data-placement": tooltip_position,
                            });//放上tooltip的顯示位置
                            $td.attr({
                                "style": "color:#3074B5;background-color:#81F7F3",
                            });//總數的1/4個人~總數的2/4個人有課就會改藍色;
                            $sp.html("<h1>"+(json_num-jv)+"</h1>");//顯示目前時段可到人數
                        }
                        else if(jv>json_num/2&&jv<=json_num*3/4&&jv!=json_num)
                        {
                            $div.attr({
                                "data-placement": tooltip_position,
                            });//放上tooltip的顯示位置
                            $td.attr({
                                "style": "color:#3074B5;background-color:#F4FA58",
                            });//總數的2/4個人~總數的3/4個人有課就會改黃色;
                            $sp.html("<h1>"+(json_num-jv)+"</h1>");//顯示目前時段可到人數
                        }
                        else if(jv>json_num*3/4&&jv<json_num&&jv!=json_num)
                        {
                            $div.attr({
                                "data-placement": tooltip_position,
                            });//放上tooltip的顯示位置
                            $td.attr({
                                "style": "color:#3074B5;background-color:#FF8000",
                            });//總數的3/4個人~總數有課就會改黃色;
                            $sp.html("<h1>"+(json_num-jv)+"</h1>");//顯示目前時段可到人數
                        }
                        else
                        {
                            $div.attr({
                                "data-placement": tooltip_position,
                            });//放上tooltip的顯示位置
                            $td.attr({
                                "style": "color:#3074B5;background-color:#FA5858",
                            });//全部有課就會改紅色;
                            $sp.html("<h1>"+(json_num-jv)+"</h1>");//顯示目前時段可到人數
                        }
                        $('[data-toggle="tooltip"]').tooltip(); //讓tooltip功能綁上去            
                    }); 
                });
                $('#tab a[href="#profile"]').tab('show');
                //儲存目前的資料,讓使用者在重新整理頁面後,也保存資料
                localStorage['agenda_count']=JSON.stringify(agenda_count);
                localStorage['agenda_name_count']=JSON.stringify(agenda_name_count);
                localStorage['json_num']=json_num;
            }
            // 將tooltip的內容顯示在結果中
            $('td').click(function(){
                var names=$(this).find('.table_name').attr('data-original-title');
                td_click(names);
            });
            //toastr設定
            //不重複出現提示訊息
            toastr.options = {
              "preventDuplicates": true,
            }
            window.td_click = function(names){
                if(names)
                {
                    $('#name_box_content').attr({'style':'padding-top:3px;padding-left:3px;padding-bottom:3px'});
                    $('#name_box_content').html('<h4>'+names+'</h4>');
                }
                else
                {
                    toastr.warning('尚未分析資料!');
                }
                
            }
            var reset=function(){
                $('#time-table td').empty(); //把目前的time-table清空，好讓下個年級的課程能夠乾淨的顯示
                $('#obligatory-post').empty();//以下是要清掉選修課程、指定時間搜尋等課程
                $('#freshman').empty();
                $('#sophomore').empty();
                $('#senior').empty();
                $('#junior').empty();
                $('#fifth-grade').empty();
                $('#sixth-grade').empty();
                $('#seventh-grade').empty();
                $('#whole-school').empty();
                $('#humanities').empty();
                $('#social').empty();
                $('#natural').empty();
                $('#chinese').empty();
                $('#english').empty();
                $('#PE-post').empty();
                $('#military-post').empty();
                $('#teacher-post').empty();
                $('#foreign-post').empty();
                $('#non-graded-optional-post').empty();
                $('#search-post').empty();
                $('#file_name').attr("value","尚未選擇檔案");
                $('#upload_file_name').empty();
                $('#not_upload_file_name').empty();
                window.credits=0;
                $("#class_credit").text(window.credits);
                window.name_of_optional_obligatory=[];  //把數過的課程清空       
                agenda_count=[[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0]];
                agenda_name_count=[[{},{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{},{}]];
                user=[];
                json_num=0;
                obj=[];
                files=[];
                fileName="";
                $('#name_box_content').attr({'style':''});
                $('#name_box_content').html('');
                localStorage['agenda_count']="";
                localStorage['agenda_name_count']="";
                localStorage['json_num']="";
                localStorage['fileName']="";
            } 
        })(jQuery);
