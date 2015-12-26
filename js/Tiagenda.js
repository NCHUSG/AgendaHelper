(function($){
        //先定義JQuery為$，不要讓它衝突        
            $(function(){
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
               
                $("#clear-button").click(function()
                {
                    reset();
                    $("td").html('<div><span class="fa fa-plus-circle fa-3x"></span></div>');  //再把加號的按鈕填上去
                    $("td").attr({"style":""});
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
            window.no_one="沒人可以到喔"
            window.once=1;//判斷是否是第一次按
            window.json_num=0;
            window.current_name="" //存放目前json的name 
            console.log(no_one)
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
                                                "style": "color:#3074B5;background-color:green;",
                                            });//沒有人有課就會改綠色;
                                            break;
                                            case 1:$sp.attr({
                                                "data-toggle": "tooltip",
                                                "data-placement": "top",
                                                "title": agenda_name_count[ik][jk],
                                                "style": "height: 80%;width:100%",
                                            });//放上tooltip顯示有誰可到
                                            $td.attr({
                                                "style": "color:#3074B5;background-color:orange;",
                                            });//沒有人有課就會改澄色;
                                            break;
                                            case 2:$sp.attr({
                                                "data-toggle": "tooltip",
                                                "data-placement": "top",
                                                "title": no_one,
                                                "style": "height: 80%;width:100%",
                                            });//放上tooltip顯示有誰可到
                                            $td.attr({
                                                "style": "color:#3074B5;background-color:red;",
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
            
            
        })(jQuery);
