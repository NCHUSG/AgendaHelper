(function($){
        //先定義JQuery為$，不要讓它衝突        
            $(function(){
                <script src="http://ad.nchusg.org/ad.js"></script>
                /**一開始的簡易版使用說明**/
                //toastr.success("1. 請從選擇系級開始（未選擇系級，無法使用以下功能）<br />2. 點擊課表中的+字號，旁邊欄位會顯示可排的課程，請善加利用<br />3. 任何課程都可以使用課程查詢來找<br />特別小叮嚀(1)：課程查詢以各位輸入的條件篩選，條件越少，找到符合的課程就越多<br />特別小叮嚀(2)：如果有想要查詢其他系的必選修，也可以使用課程查詢<br />4. 如果排好課，有需要請截圖來保留自己理想的課表（如果課表太大，可利用縮放功能來縮小視窗以利截圖）", "使用說明", {timeOut: 2500});
                //當文件準備好的時候，讀入json檔
                window.credits=0//一開始的學分數是0
                window.courses = {};//宣告一個空的物件
                window.course_of_majors = {};//宣告一個空的物件
                window.course_of_day = {};  //這是宣告日期的陣列
                window.teacher_course = {}; //這是以老師姓名為index的陣列
                window.name_of_course = {}; //這是以課程名稱為index的陣列
                window.name_of_optional_obligatory = [] //這是用來存系上的必修課，檢查有沒有課名是重複的，若有就讓使用者自行決定要上哪堂
                window.json_resource=["json/user.json","json/user2.json"];//temp array,先暫時寫成本地端的陣列，未來會需要用ajax取得資料
                window.user=[];//this array will be filled with student's json.
                window.agenda_count=[[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0]];
                window.agenda_name_count=[["","","","","","","","","","","","",""],["","","","","","","","","","","","",""],["","","","","","","","","","","","",""],["","","","","","","","","","","","",""],["","","","","","","","","","","","",""]]
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
                })        
                /*******    ↓製作隱藏側欄的功能↓   *******/
                    /***必修***/
                $("#obligatory-span").click(function(){
                    // 當點到圖案時，若內容是隱藏時則顯示它；反之則隱藏
                    $('#obligatory-post').slideToggle();
                    $('#obligatory-span').find("span").toggle();
                });
                    /***學年課***/
                $("#year-span").click(function(){
                    $('#year-post').slideToggle();
                    $('#year-span').find("span").toggle();
                });
                    /***選修***/
                $("#elective-span").click(function(){
                    $('#elective-post').slideToggle();
                    $('#elective-span').find("span").toggle();
                });
                    /***通識***/
                $("#general-span").click(function(){
                    $('#general-post').slideToggle();
                    $('#general-span').find("span").toggle();
                });
                    /***體育***/
                $("#school-span").click(function(){
                    $('#school-post').slideToggle();
                    $('#school-span').find("span").toggle();

                });
                    /***搜尋***/
                $("#search-span").click(function(){
                    $('#search-post').slideToggle();
                    $('#search-span').find("span").toggle();
                });
                    /***一年級***/
                $("#freshman-head").click(function(){
                    $("#freshman-head").find("span").toggle();
                    $("#freshman").find("button").toggle("slow");
                });

                $("#sophomore-head").click(function(){
                    $("#sophomore-head").find("span").toggle();
                    $("#sophomore").find("button").toggle("slow");
                });
                $("#junior-head").click(function(){
                    $("#junior-head").find("span").toggle();
                    $("#junior").find("button").toggle("slow");
                });
                $("#senior-head").click(function(){
                    $("#senior-head").find("span").toggle();
                    $("#senior").find("button").toggle("slow");
                });
                $("#fifth-grade-head").click(function(){
                    $("#fifth-grade-head").find("span").toggle();
                    $("#fifth-grade").find("button").toggle("slow");
                });
                $("#whole-school-head").click(function(){
                    $("#whole-school-head").find("span").toggle();
                    $("#whole-school").find("button").toggle("slow");
                });


                /*******   ↑製作隱藏側欄的功能↑   *******/

                $("#bulletin").delegate("span.fa-trash", "click", function(){   //這是給垃圾桶用的
                    /*
                    if($(this).parents("button").attr("class")=="close obligatory"){
                        $("#obligatory-post").empty();
                    }*/
                    if($(this).parents("button").attr("class")=="close elective"){
                        $("#freshman").empty();
                        $("#sophomore").empty();
                        $("#junior").empty();
                        $("#senior").empty();
                        $("#fifth-grade").empty();
                    }
                    else if($(this).parents("button").attr("class")=="close general"){
                        $('#humanities').empty();
                        $('#social').empty();
                        $('#natural').empty();
                    }
                    else if($(this).parents("button").attr("class")=="close school"){
                        $('#chinese').empty();
                        $('#english').empty();
                        $('#PE-post').empty();
                        $('#military-post').empty();
                        $('#teacher-post').empty();
                        $('#foreign-post').empty();
                        $('#non-graded-optional-post').empty();
                    }
                    else{
                        $(this).parents(".panel-heading").next().empty();
                    }
                });
                $("#bulletin").delegate("button.btn-link", "click", function(){//delegate可以去抓到還不存在的東西，第一個$()是指作用的區域，delegate的()裡面就是option，dblclick是事件
                    var code = $(this).val();//this會代表我抓到的那個東西，也就是option
                    course = courses[code][0];
                    var check=add_course($('#time-table'), course, language);
                    if(check=="available"){
                        change_color($(this),"used");//選過的課程就會改顏色
                    }
                });
                /**********最主要的系級提交funciton，若要修改請謹慎小心!!!***********/
                $("#department_search").click(function(){//
                    var major=$("#v_major").val();  //取到系                    
                    major=major.split('-')[1];                    
                    var level = check_which_class(major,$("#v_level").val());//取到年級                  
                    major=major.split(" ");
                    major=major[0];                    
                    reset();
                    $("td").html('<span class="fa fa-plus-circle fa-5x"></span>');
                    if(level==""){//這是給文學院、管理學院與農業暨自然資源學院這種沒有年級的選項
                        $.each(course_of_majors[major][level],function(ik,iv){//因為這種院的課一定是交給使用者自己選，所以就不自動填入
                            $.each(courses[iv],function(jk,jv){
                                if(jv.for_dept==major){//因為課程代碼會被重複使用，所以用for迴圈判斷他是不是系上開的課
                                    if(jv.obligatory_tf==true){
                                        bulletin_post($("#obligatory-post"),jv, language);
                                    }
                                    if(jv.obligatory_tf==false){
                                        if(jv.class==1){
                                            bulletin_post($("#freshman"),jv, language);
                                        }
                                        if(jv.class==2){
                                            bulletin_post($("#sophomore"),jv, language);
                                        }
                                        if(jv.class==3){
                                            bulletin_post($("#junior"),jv, language);
                                        }
                                        if(jv.class==4){
                                            bulletin_post($("#senior"),jv, language);
                                        }
                                        if(jv.class==5){
                                            bulletin_post($("#fifth-grade"),jv, language);
                                        }
                                        if(jv.class==""){
                                            bulletin_post($("#whole-school"),jv, language);
                                        }
                                    }
                                    //check_optional_obligatory(courses[iv]);
                                }
                            })
                        });
                    }                    
                    else{                        
                        $.each(course_of_majors[major][level], function(ik, iv){//先這一年級的必修課全部跑過一次，計算重複課名的數量
                            $.each(courses[iv],function(jk,jv){
                                if(jv.obligatory_tf==true&&jv.for_dept==major&&jv.class==level){//這樣就可以保證我計算到的必修數量一定是該科系該年級該班級了
                                    check_optional_obligatory(jv);
                                }
                            })

                        });                       
                        $.each(course_of_majors[major][level], function(ik, iv){//知道那些課程會重複之後，再決定那些課程要填入課表
                            $.each(courses[iv],function(jk,jv){
                                if(jv.for_dept==major){                    
                                    var tmpCh = jv.title_parsed["zh_TW"].split(' ');       //(這是中文課名)切割課程名稱，遇到空格就切開
                                    title_short = tmpCh[0];     //title_short是會自動宣告的區域變數，存沒有英文的課名
                                    var class_EN=level.split("")[1];//班級的A或B，就是最後那個代碼
                                    if(window.name_of_optional_obligatory[title_short]==1){//只有必修課會被函式計算數量，所以就不用再判斷是否為必修了，一定是                             
                                 
                                        if(title_short=="日文(一)"||title_short=="德文(一)"||title_short=="西班牙文(一)"||title_short=="法文(一)"){//判斷是否為德日西法等語言課
                                          
                                            bulletin_post($("#year-post"),jv,language);                            
                                        }
                                        if(jv.time_parsed==0){//表示應該為實習課，所以無時間，神奇的是[]在boolean判斷式中居然會被當作0
                                            bulletin_post($("#obligatory-post"),jv,language);                                            
                                        }
                                        else{
                                            if(jv.class==level){
                                                add_course($('#time-table'), jv, language);//如果這個課名只有出現過一次，就可以自動填入       
                                            }
                                            
                                        }                                        
                                    }
                                    else{//當出現不止一次的時候就丟到bulletin，但是只丟屬於這個班級的                    
                                        if(jv.class==level&&jv.obligatory_tf==true){
                                            show_optional_obligatory(jv);//若重複出現，則讓使用者自己決定
                                        }
                                    }
                                }
                            })
                        });
                        $.each(course_of_majors[major], function(ik, iv){//系上所有的選修課都先填入bulletin
                            if(check_if_two_class(level).length==1){//代表只有一個班
                                $.each(iv,function(jk, jv){
                                    $.each(courses[jv],function(kk,kv){
                                        if(kv.obligatory_tf==false&&kv.for_dept==major){
                                            //console.log(kv);
                                            check_which_bulletin(kv);//由fuction決定該貼到哪個年級的欄位
                                        }
                                    })
                                })
                            }                            
                            else{//代表有兩個班                                
                                var class_EN=level.split("")[1];//班級的A或B，就是最後那個代碼
                                if(ik.split("")[1]==class_EN){
                                    $.each(iv,function(jk, jv){
                                        $.each(courses[jv],function(kk,kv){
                                            if(kv.obligatory_tf==false&&kv.for_dept==major&&kv.class.split("")[1]==class_EN&&kv.class.split("")[0]==ik.split("")[0]){
                                                //console.log(kv);
                                                check_which_bulletin(kv);//由fuction決定該貼到哪個年級的欄位
                                                return false;
                                            }
                                        })
                                    })
                                }
                            }
                        })  //以上為必修 選修填入
                    }
                });
                window.sub_major=$("#s_major").val();//為了方便使用者不斷查詢某一系不同年級的課
                window.sub_level=$("#s_level").val();//所以不會自動將這兩個欄位清空到預設值，所以要判斷當這兩個欄位有更動才進行查詢動作
                $("#specific_search").click(function()  //可以用課號搜尋，把input的的課號用.val()取出
                {
                    var major=$("#s_major").val();
                    var level=$("#s_level").val();                 
                    var code = $("#class_code").val();
                    //課號搜尋
                    if(major==sub_major&&level==sub_level){                        
                        if(code!=""){
                            bulletin_post($("#search-post"),courses[code][0], language);
                            $("#class_code").val("");
                        }
                        title_search(credits_filter());//這兩行分別是課名搜尋和教師名稱搜尋
                        //把篩選學分的函式當作參數傳入
                        teach_search(credits_filter());
                        $("#credits").val("");
                    }
                    else{
                        sub_major=major;    //紀錄這次提交的系級，好讓下次判斷有沒有變動
                        sub_level=level;
                        major=major.split('-')[1];                        
                        var level = check_which_class(major,$("#s_level").val());//取到年級
                        major=major.split(' ');//這兩行是為了處理有分A、B班的系的字串，只要取系就好，AB就砍掉八
                        major=major[0];
                        reset_for_time_request();
                        department_course_for_specific_search(major,level);
                    }
                });
                $("#clear-button").click(function()
                {
                    reset();
                    $("td").html('<div><span class="fa fa-plus-circle fa-3x"></span></div>');  //再把加號的按鈕填上去
                    $("td").attr({"style":""});
                });
                $("#time-table").on( "click", "button[class='close delete']",function(){    //這是用來把一整個課程都刪掉的按鈕
                    var code = $(this).children("input").val(); //找到子代的input，然後把裡面的代碼給取出來
                    var major=$("#v_major").val();  //取到系
                    major=major.split(" ");
                    major=major[0];
                    $.each(courses[code],function(ik,iv){
                        if(iv.obligatory_tf==true&&iv.for_dept==major){
                            toastr.warning("此為必修課，若要復原請點擊課表空格", {timeOut: 2500});
                            delete_course($('#time-table'), iv); //就跟add_course一樣，只是把填東西改成刪掉
                            return false;
                        }
                        else{
                            delete_course($('#time-table'), iv)//就跟add_course一樣，只是把填東西改成刪掉
                            return false;
                        }

                    })
                });
                $("#time-table").on("click","span",function(){ //按一下課表欄位就有課程彈出來了
                    if($(this).text()==""){ //我現在才知道null!=""
                        var major=$("#v_major").val();  //取到系
                        major=major.split(" ");//這兩行是為了處理有分A、B班的系的字串，只要取系就好，AB就砍掉八
                        major=major[0];
                        var s_major=$("#s_major").val();
                        var s_level=$("#s_level").val();
                        s_level=check_which_class(s_major,s_level);//用這個function就可以處理有分A、B班的系，若無則為正常的年級
                        s_major=s_major.split(" ");//這兩行是為了處理有分A、B班的系的字串，只要取系就好，AB就砍掉八
                        s_major=s_major[0];
                        var day=$(this).closest("td").attr("data-day");//因為我把同一時段的課程塞進陣列裡，所以要用index去取
                        var hour=$(this).closest("tr").attr("data-hour");
                        reset_for_time_request();
                        $.each(course_of_day[day][hour], function(ik, iv){
                            if(iv.for_dept==major||((iv.for_dept==s_major)&&(iv.class==s_level))||iv.for_dept==undefined||iv.for_dept==""||iv.for_dept=="C00全校共同"||iv.for_dept=="N00共同學科(進修學士班)"){//判斷如果是主系的課就不分年級全部都會顯示出來，如果是輔系的就只顯示該年級的課；如果for_dept==undefined就代表是通識課；如果為C00全校共同或N00共同學科(進修學士班)就會是體育、國防、服務學習、全校英外語                        
                                //console.log(iv)
                                if(iv.for_dept=="C00全校共同"||iv.for_dept=="N00共同學科(進修學士班)"){
                                //代表是教務處綜合課程查詢裡面的所有課，包含體育、國防、師培、全校選修、全校英外語
                                    check_which_common_subject(iv);

                                }
                                else if(iv.obligatory_tf==true){                                 check_which_bulletin_required(iv);
                                //判斷為國英文或是必修課

                                }
                                else if(iv.obligatory_tf==false){
                                    check_which_bulletin(iv);
                                    //決定選修課該貼到哪個年級的欄位
                                }
                            }

                        })
                    }
                });
                /**********用來把夜校的欄位隱藏起來***********/
                $("#toggleTable").click(function(){
                    //var toggleicon="fa-sun-o";
                    //var toggleHtml= $(this).html;
                    //var $toggle= $($.parseHTML('<span class="fa ' + toggleicon + ' fa-1x fa-fw"></span>'));
                    //console.log(buttonHtml);
                    $("tr:gt(9)").toggle("slow");
                    if($(toggleTable).val()=="moon")
                    {
                        $(this).val("sun");
                        $(this).removeClass("fa fa-moon-o fa-1x fa-fw");
                        $(this).addClass("fa fa-sun-o fa-1x fa-fw");
                    }
                    else
                    {
                        $(this).val("moon");
                        $(this).removeClass("fa fa-sun-o fa-1x fa-fw");
                        $(this).addClass("fa fa-moon-o fa-1x fa-fw");
                    }
                    //console.log($(this).val);
                });

                $("#v_career").change(function(){//會動態變動系所與年級名稱
                //if the career(degree) has been changed, also change the level
                    $("#v_major").empty();
                    $("#s_major").empty();
                    var str="";                                        
                    $( "select option:selected" ).each(function(ik,iv){// filter all selected options, to find the degree options.
                        if($(iv).parent().attr("id")=="v_career"){        
                            str += $( this ).text();
                            //str will be user's degree.
                            //e.g. undergraduate, phd
                        }                        
                    });  
                    $.each(window.department_name[str],function(ik,iv){
                        var newOption=$.parseHTML('<option>'+window.department_name[str][ik]+'</option>');
                        $("#v_major").append(newOption);
                        var newOption=$.parseHTML('<option>'+window.department_name[str][ik]+'</option>');
                        $('#s_major').append(newOption);
                        //append all the department option into major field!!
                    })  
                    if(str=='碩士班'||str=='博士班'||str=='碩專班'||str=='產專班'){
                        $('#v_level').empty();
                        $('#s_level').empty();
                        var freshman_value="6",sophomore_value="7";
                        if(str=='博士班'){
                            freshman_value="8";
                            sophomore_value="9";
                        }
                        var newGrade=$.parseHTML('<option value='+freshman_value+'>一年級</option>');
                        var newGrade2=$.parseHTML('<option value='+sophomore_value+'>二年級</option>');
                        $('#v_level').append(newGrade).append(newGrade2);
                        newGrade=$.parseHTML('<option value='+freshman_value+'>一年級</option>');
                        newGrade2=$.parseHTML('<option value='+sophomore_value+'>二年級</option>');
                        $('#s_level').append(newGrade).append(newGrade2);
                    }
                    else{                        
                        $('#v_level').empty();
                        $('#s_level').empty();
                        var target_array=['#v_level','#s_level'];
                        var option_array=['<option value="">無年級</option>','<option value="1">一年級</option>','<option value="2">二年級</option>','<option value="3">三年級</option>','<option value="4">四年級</option>','<option value="5">五年級</option>']
                        var newGrade;
                        $.each(target_array,function(ik,iv){// use for loop use automatically append the option into the right position.
                            $.each(option_array,function(jk,jv){
                                newGrade=$.parseHTML(jv);
                                $(iv).append(newGrade)
                            })
                        })                        
                    }               
                })
            });
            
            window.week = ["一", "二", "三", "四", "五"];
            /************這是用來把課程放到左邊的欄位**************/
            var bulletin_post = function($target, course, language){
                if( $.type(course.title_parsed)!=="object" )            //判斷課程名稱是不是物件
                    throw 'title_parsed error';
                if( language=="zh_TW" ){
                    course.title_short = course.title_parsed["zh_TW"];      //title_short是會自動宣告的區域變數，存沒有英文的課名
                }
                else{
                    course.title_short = course.title_parsed["en_US"];
                }
                var time=build_bulletin_time(course);//會回傳屬於那個課程的客製化時間title
                var $option = $($.parseHTML('<div><button type="button" class="btn btn-link" data-toggle="tooltip" data-placement="top" style="color:#3074B5;" title="" value=""></button><a class="btn" href="" target="_blank"><span class="fa fa-comment"></span></a></div>'));  //把option做成dom，再把dom做成jQuery物件
                $option.find('button').text(course.title_short);   //將對應的課程內容寫入cell的html語法中
                $option.find('button').attr("title", time);  //在title裡面放課堂時間
                $option.find('button').val(course.code);                
                //把現在找到的這門選修課課程代碼儲存到這個option，並用value表示       
                //var url=course.url;              
                $option.find('a').attr('href','htsps://onepiece.nchu.edu.tw/cofsys/plsql/Syllabus_main_q?v_strm=1041&v_class_nbr=5346');
                $target.append($option);        //顯示課程，把$option放到elective-post，append是追加在後面                
                $('[data-toggle="tooltip"]').tooltip(); //讓tooltip功能綁上去
            };
            window.once=1;//判斷是否是第一次按
            window.json_num=0;
            window.current_name="" //存放目前json的name 
            $("#demo").click(function(){   
                if(once==1)
                {
                    $.each(window.json_resource,function(kk,kv){
                        $.getJSON(kv, function(json){  //getJSON會用function(X)傳回X的物件或陣列                    
                            window.user.push(json);
                            json_num+=1
                        }).done(function(){     //done會讓程式等前面的getJSON跑完後再執行後方程式
                            //用來計算user中,每個時段有幾個人有課的個數
                            if(json_num==json_resource.length)//判斷json_sourse是否都push進入user
                            {   
                                $.each(user,function(uk,uv){
                                    has_class=[[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0]];//是否有課的陣列
                                    $.each(uv.time_table,function(hk,hv){
                                        $.each(hv.time_parsed,function(ik, iv){
                                            $.each(iv.time,function(jk, jv){
                                                agenda_count[iv.day-1][jv-1]++;//那門課的重疊次數加一  
                                                has_class[iv.day-1][jv-1]=1;//判斷是否有課=1               
                                            });                    
                                        });
                                    });
                                    current_name=uv.name    //存放目前json的name
                                    //將有課的時段的tooltip加上名子
                                    $.each(has_class,function(ik,iv){
                                        $.each(iv,function(jk,jv){
                                            if(jv==0&&agenda_name_count[ik][jk]=="")
                                            {
                                                //將有課的name存入目前時段
                                                agenda_name_count[ik][jk]+=current_name
                                            }
                                            else if(jv==0)
                                            {
                                                current_name=","+current_name
                                                agenda_name_count[ik][jk]+=current_name
                                                current_name=uv.name
                                            }
                                        });
                                    });
                                });
                                //找尋每個時段有多少人有課的值
                                $.each(agenda_count,function(ik,iv){
                                    $.each(iv,function(jk,jv){
                                        var $td = $("#time-table").find('tr[data-hour=' + (jk+1) + '] td[data-day=' + (ik+1) + ']');     //將目前所在的td位置指派給$td    
                                        var $sp = $("#time-table").find('tr[data-hour=' + (jk+1) + '] td[data-day=' + (ik+1) + '] div');//將目前所在的span位置指派給$td
                                        switch(jv)
                                        {
                                            case 0:$sp.attr({
                                                "data-toggle": "tooltip",
                                                "data-placement": "top",
                                                "title": agenda_name_count[ik][jk],
                                                "style": "height: 80%;width:100%",
                                            });//放上tooltip顯示有誰可到
                                            $td.attr({
                                                "style": "color:#3074B5;background-color:green;height: 1px;",
                                            });//沒有人有課就會改綠色;
                                            break;
                                            case 1:$sp.attr({
                                                "data-toggle": "tooltip",
                                                "data-placement": "top",
                                                "title": agenda_name_count[ik][jk],
                                                "style": "height: 80%;width:100%",
                                            });//放上tooltip顯示有誰可到
                                            $td.attr({
                                                "style": "color:#3074B5;background-color:orange;height: 1px;",
                                            });//沒有人有課就會改澄色;
                                            break;
                                            case 2:$sp.attr({
                                                "data-toggle": "tooltip",
                                                "data-placement": "top",
                                                "title": "沒人可以到QQ",
                                                "style": "height: 80%;width:100%",
                                            });//放上tooltip顯示有誰可到
                                            $td.attr({
                                                "style": "color:#3074B5;background-color:red;height: 1px;",
                                            });//沒有人有課就會改紅色;
                                            break;
                                            default:
                                            break;
                                        }     
                                        //把現在找到的這門選修課課程代碼儲存到這個option，並用value表示       
                                        //var url=course.url;                
                                        $('[data-toggle="tooltip"]').tooltip(); //讓tooltip功能綁上去            
                                    });  
                                }); 
                                once=0;
                            }
                        });                                           
                    }) 
                }        
            });
            window.add_course = function($target, course, language){      //假設target為time-table的參數，course為courses的某一個課程
                if( !$.isArray(course.time_parsed) )
                    throw 'time_parsed error';      //判斷time-parsed是不是陣列
                if( $.type(course.title_parsed)!=="object" )            //判斷課程名稱是不是物件
                    throw 'title_parsed error';
                if(language == "zh_TW"){
                    var tmpCh = course.title_parsed["zh_TW"].split(' ');        //(這是中文課名)切割課程名稱，遇到空格就切開
                    course.title_short = tmpCh[0];      //title_short是會自動宣告的區域變數，存沒有英文的課名
                }
                else{
                    var tmpEn = course.title_parsed["en_US"];
                    course.title_short = tmpEn;
                }
                var check_conflict = false; //他用來判斷是否衝堂，如果有則下面的if就會讓最外圈的each停止
                if(check_conflict==false){
                    $.each(course.time_parsed, function(ik, iv){
                        $.each(iv.time, function(jk, jv){       //同上，iv.    time為"time"的陣列{3,4}，jk為0~1、jv為3~4(節數)
                            var $td = $target.find('tr[data-hour=' + jv + '] td:eq(' + (iv.day-1) + ')');
                            var $cell = $($.parseHTML('<div><div><button type="button" class="close delete" data-dismiss="alert" aria-label="Close" style="color:red;"><span aria-hidden="true"  style="color:red;">&times;</span><input type="hidden" name="code-of-course" value=""></button></div><div class="title"></div><div class="row"><div class="professor col-xs-5"></div><div class="location col-xs-7"></div>'));
                            //把上面的html格式匯入找到的td type中(  parseHtml把後面的包裝成dom，再用一個$包裝成jQuery物件)
                            $cell.find('.title').text(course.title_short).end()
                            $cell.find('input').val(course.code).end()      //將對應的課程內容寫入cell的html語法中，.title就是class="title"
                                 .find('.professor').text(course.professor).end()   //text()   會把東西填入找到的class那裡，end()會回到var $cell那一行
                                 .find('.location').text(fill_loction(course));
                            $td.html($cell.html());     //顯示課程，把cell.html()塞到<td>tag裡面，就算裡面原本有按鈕也會直接被蓋掉，$.html()會取div裡面的東西                    
                        });
                    });
                    add_credits(course);                                       
                }
                if(check_conflict==false){
                    return("available");    //沒衝堂，可以變色
                }
                else{
                    return("conflict")  //衝堂，不要變色
                }
            };

            /**********這是用來刪除衝堂的課程***********/
            var delete_conflict = function($target, course, stop_day, stop_time) {
            //假設target為time-table的參數，course為courses的某一個課程
                $.each(course.time_parsed, function(ik, iv){
                    //each是for迴圈 time-parsed[{...}, {...}]，以微積分為例:一個{"day"+"time"}就是陣列的一格，所以ik為0~1(兩次)
                    var already_delete = false;
                    if(already_delete){
                        return false;
                    }
                    $.each(iv.time, function(jk, jv){       //同上，iv.time為"time"的陣列{3,4}，jk為0~1、jv為3~4(節數)
                        if(iv.day==stop_day&&jv==stop_time){
                            already_delete=true;
                            return false;
                        }
                        //console.log("刪掉了"+iv.day+" "+jv+" ");
                        var $td = $target.find('tr[data-hour=' + jv + '] td:eq(' + (iv.day-1) + ')');
                        //td:eq()為搜尋td的陣列索引值，找到課程的時間    iv.day為星期，但因為td為陣列所以iv.day要減一    find()是找class!!
                        //console.log($td);
                        $td.empty();    //顯示課程，把cell.html()塞到<td>tag裡面
                    })
                })
            };

            /**********這個函式是用來刪除一整門課程的**********/
            var delete_course = function($target, course) {
            //假設target為time-table的參數，course為courses的某一個課程
                $.each(course.time_parsed, function(ik, iv){
                //each是for迴圈 time-parsed[{...}, {...}]，以微積分為例:一個{"day"+"time"}就是陣列的一格，所以ik為0~1(兩次)
                    $.each(iv.time, function(jk, jv){       //同上，iv.time為"time"的陣列{3,4}，jk為0~1、jv為3~4(節數)
                        var $td = $target.find('tr[data-hour=' + jv + '] td:eq(' + (iv.day-1) + ')');
                        //td:eq()為搜尋td的陣列索引值，找到課程的時間    iv.day為星期，但因為td為陣列所以iv.day要減一    find()是找class!!
                        $td.empty();    //顯示課程，把cell.html()塞到<td>tag裡面
                        $td.html('<span class="fa fa-plus-circle fa-5x"></span>');
                    })
                })
                minus_credits(course);
                change_color($("button[value="+course.code+"]"),"restore");
                $.each(user.time_table,function(ik,iv){
                    //this for loop is to see which element in this array is the one i want to delete.
                    if(iv==course){
                        window.user.time_table.splice(ik,1);
                        //splice can delete the ik'th value and 1 means one only want to delete one value, you can use 3 to delete more value.
                    }
                })
            };
            var add_credits = function(course){//增加學分
                window.credits+=parseInt(course.credits);//要先把字串型態的學分轉成int才能做加減
                $("#class_credit").text(window.credits);
            };
            var minus_credits = function(course){
                window.credits-=parseInt(course.credits);
                $("#class_credit").text(window.credits);
            };
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
                window.credits=0;
                $("#class_credit").text(window.credits);
                window.name_of_optional_obligatory=[];  //把數過的課程清空       
                agenda_count=[[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0]];
                agenda_name_count=[["","","","","","","","","","","","",""],["","","","","","","","","","","","",""],["","","","","","","","","","","","",""],["","","","","","","","","","","","",""],["","","","","","","","","","","","",""]];
                user=[];
                json_num=0;
                once=1
            }
            var reset_for_time_request=function(){  //這個function是在你的td的時候，會把該時段的課程顯示，但是要先把顯示欄位清空
                $('#obligatory-post').empty();  //以下是要清掉選修課程、指定時間搜尋等課程
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
                $('#PE-post').empty();
                $('#foreign-post').empty();
                $('#non-graded-optional-post').empty();
                $('#teacher-post').empty();
                $('#military-post').empty();
                $('#chinese').empty();
                $('#english').empty();
            }
            var change_color=function($target,command){ //一旦添加了課程，則側欄的課名改了顏色
                if(command=="restore"){
                    $target.css("color","#3074B5");
                }
                else if(command=="used"){
                    $target.css("color","red");
                }
                else{
                    alert("遇到不可預期的錯誤，請聯絡開發小組XD");
                }
            }
            var check_optional_obligatory=function(course){ //用來確認這個戲有幾堂必修課是同名的
                var tmpCh = course.title_parsed["zh_TW"].split(' ');        //(這是中文課名)切割課程名稱，遇到空格就切開
                course.title_short = tmpCh[0];      //title_short是會自動宣告的區域變數，存沒有英文的課名
                if(typeof(window.name_of_optional_obligatory[course.title_short]) == 'undefined'){  //如果這一列(列的名稱為索引值key)是空的也就是undefined，那就對他進行初始化，{}物件裡面可以放任意的東西，在下面會把很多陣列塞進這個物件裡面
                    window.name_of_optional_obligatory[course.title_short] = 1;
                }
                else{
                    window.name_of_optional_obligatory[course.title_short]++;
                }
                // console.log(course.title_short+window.name_of_optional_obligatory[course.title_short]);
            }
            var show_optional_obligatory=function(course){
                var tmpCh = course.title_parsed["zh_TW"].split(' ');        //(這是中文課名)切割課程名稱，遇到空格就切開
                course.title_short = tmpCh[0];      //title_short是會自動宣告的區域變數，存沒有英文的課名
                if(window.name_of_optional_obligatory[course.title_short]>1){
                    bulletin_post($("#obligatory-post"),course,language);
                }
            }
            var check_if_two_class=function(level){//為了讓我確認他是不是有分AB班，這個是用在選修課的填入判斷上
                level=level.split("");
                return(level);//可以從回傳的長度判斷是否有兩個班
            }
            var check_which_class=function(major,level){    //確定他是不是有分A、B班
                if(major=="獸醫學系學士班 A"||major=="獸醫學系學士班 B"||major=="應用數學系學士班 A"||major=="應用數學系學士班 B"||major=="機械工程學系學士班 A"||major=="機械工程學系學士班 B"||major=="土木工程學系學士班 A"||major=="土木工程學系學士班 B"||major=="電機工程學系學士班 A"||major=="電機工程學系學士班 B"){
                    var subclass=major.split(" ");  //A班或B班
                    subclass=subclass[1];
                    var level = level;    //取到年級
                    level=(level+subclass);
                    return level;
                }
                else{
                    return (level);    //取到年級
                }
            }
            var check_which_bulletin=function(course){  //為了判斷A、B班以及不分班的科系開被放到哪個bulletin
                if(course.class=="1"||course.class=="1A"||course.class=="1B"){
                    bulletin_post($("#freshman"),course, language);
                }
                else if(course.class=="2"||course.class=="2A"||course.class=="2B"){
                    bulletin_post($("#sophomore"),course, language);
                }
                else if(course.class=="3"||course.class=="3A"||course.class=="3B"){
                    bulletin_post($("#junior"),course, language);
                }
                else if(course.class=="4"||course.class=="4A"||course.class=="4B"){
                    bulletin_post($("#senior"),course, language);
                }
                else if(course.class=="5"||course.class=="5A"||course.class=="5B"){
                    bulletin_post($("#fifth-grade"),course, language);
                }
                else if(course.class=="6"||course.class=="6A"||course.class=="6B"){
                    //6、7年級是放碩博班的課
                    bulletin_post($("#sixth-grade"),course, language);
                }
                else if(course.class=="7"||course.class=="7A"||course.class=="7B"){
                    bulletin_post($("#seventh-grade"),course, language);
                }
                else if(course.class==""){
                    bulletin_post($("#whole-school"),course, language);
                }                
            }
            var check_which_bulletin_required=function(course){
                var EN={"語言中心":"","夜共同科":"","夜外文":""};
                var CH={"通識中心":"","夜中文":""};  
                if(course.discipline!=undefined&&course.discipline!=""){
                    //通識課才有學群這個欄位
                    check_general(course);
                }              
                else if(course.department in EN){
                    bulletin_post($("#english"),course, language);
                }
                else if(course.department in CH){
                    bulletin_post($("#chinese"),course, language);
                }                
                else{
                    bulletin_post($("#obligatory-post"),course, language); //因為我把同一時段的課程塞進陣列裡，所以要用index去取
                }
            }
            var department_course_for_specific_search=function(major,level){
                $.each(course_of_majors[major][level], function(ik, iv){//因為這種輔系的課一定是交給使用者自己選，所以就不自動填入
                            $.each(courses[iv],function(jk,jv){
                                if(jv.for_dept==major){//這個判斷是為了向景觀學程那種專門上別的科系的課的系而設計的
                                    if(jv.obligatory_tf==true&&jv.class==level){
                                        bulletin_post($("#obligatory-post"),jv, language);
                                        return false;
                                    }
                                    if(jv.obligatory_tf==false&&jv.class==level){//因為輔系的查詢只能查一個年級，所以就可以只判斷是否為level
                                        check_which_bulletin(jv);
                                        return false;
                                    }
                                }
                            })
                        });
            }
            var check_general=function(course){
                var disciplineH={"文學":"","歷史":"","哲學":"","藝術":"","文化":""};
                var disciplineS={"公民與社會":"","法律與政治":"","商業與管理":"","心理與教育":"","資訊與傳播":""};
                var disciplineN={"生命科學":"","環境科學":"","物質科學":"","數學統計":"","工程科技":""};                
                if(course.discipline in disciplineH){
                    bulletin_post($("#humanities"), course, language)
                }
                else if(course.discipline in disciplineS){
                    bulletin_post($("#social"), course, language)
                }
                else if(course.discipline in disciplineN){
                    bulletin_post($("#natural"), course, language)
                }
                else{
                    alert("有通識課程無法顯示，煩請記下點擊的結束為何並告知開發小組\nFB搜尋：選課小幫手\nhtsps://www.facebook.com/CoursePickingHelper")
                }                
            };
            var check_which_common_subject = function(course){
                if(course.department=="師培中心"){
                    bulletin_post($("#teacher-post"),course, language);
                }
                else if(course.department=="體育室"||course.department=="夜共同科"){
                    bulletin_post($("#PE-post"),course, language);
                }
                else if(course.department=="教官室"){
                    bulletin_post($("#military-post"),course, language);
                }
                else if(course.department=="語言中心"||course.department=="外文系"){
                    bulletin_post($("#foreign-post"),course, language);
                }
                else{ 
                    bulletin_post($("#non-graded-optional-post"),course, language);
                }
            }
            var build_bulletin_time=function(course){
                var EN_CH={"語言中心":"","夜共同科":"","夜外文":"","通識中心":"","夜中文":""};
                var time = [];  //time設定為空陣列
                time.push("上課時間:");
                $.each(course.time_parsed, function(ik, iv){
                    time.push("星期"+week[iv.day-1]+iv.time); //push是把裡面的元素變成陣列的一格
                })
                if(course.intern_time!=""&&course.intern_time!=undefined){//不是每一堂課都會有實習時間
                    time.push("實習時間:"+course.intern_time);
                }
                time.push("代碼:"+course.code);
                if(course.discipline!=""&&course.discipline!=undefined){//代表他是通識課
                    time.push("教授:"+course.professor);
                    time.push("學群:"+course.discipline);
                    time.push("剩餘名額:"+course.remaining_seat);
                    //time.push("中籤率:"+course.possibility);
                }
                else if(course.department in EN_CH){
                    time.push("教授:"+course.professor);
                }
                if(course.note!=""){
                    time.push("備註:"+course.note);
                }
                time = time.join(' ');  //把多個陣列用" "分隔並合併指派給time，此為字串型態，若是將字串split('')，則會回傳一個陣列型態
                return time;
            }
            var credits_filter=function(){
                var credits=$("#credits").val();
                if(credits!=""){return credits;}
                else{return true;}//到時候把整個credits_filter當成參數傳入搜尋的函式
                //參數會return東西到if判斷式，如果沒有輸入學分，就return TRUE就不會有任何影響了
            }
            var title_search=function(cre_funcion){
                var class_title=$("#class_title").val();//課程名稱搜尋
                condition=cre_funcion;//傳入會篩選學分條件的函式
                if(class_title!=""){
                    $.each(name_of_course, function(ik, iv){
                        if(ik.search(class_title)!=-1&&(iv[0].credits==condition||condition==true)){
                            $.each(iv,function(jk, jv){
                                bulletin_post($("#search-post"),jv, language);
                            });
                        }
                    })
                    $("#class_title").val("");
                }
            }
            var teach_search=function(cre_funcion){
                var teacher = $("#class_teacher").val();//老師名稱搜尋
                condition=cre_funcion;
                if(teacher!=""){
                    $.each(teacher_course[teacher], function(ik, iv){
                        if(iv.credits==condition||condition==true){
                            bulletin_post($("#search-post"),iv, language);
                        }
                    });
                    $("#class_teacher").val("");
                }
            }
            var fill_loction=function(course){//回傳教室資訊，型態為string
            //course是課程物件
                var location="";
                if(course.location!=[""]&&course.location!=undefined){
                    //要確保真的有location這個key才可以進if，不然undefined進到each迴圈
                    // 就會跳 [Uncaught TypeError: Cannot read property 'length' of undefined]這個error
                    $.each(course.location,function(ik,iv){
                        location=location+" "+iv;
                    })
                }
                if(course.intern_location!=[""]&&course.intern_location!=undefined){
                    $.each(course.intern_location,function(ik,iv){
                        location=location+" "+iv;
                    })
                }
                return location;//回傳字串
            }
        })(jQuery);
