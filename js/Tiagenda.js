(function($){
        //�ȶ��xJQuery��$����Ҫ׌���nͻ        
            $(function(){
                /**һ�_ʼ�ĺ��װ�ʹ���f��**/
                //toastr.success("1. Ո���x��ϵ���_ʼ��δ�x��ϵ�����o��ʹ�����¹��ܣ�<br />2. �c���n���е�+��̖����߅��λ���@ʾ���ŵ��n�̣�Ո�Ƽ�����<br />3. �κ��n�̶�����ʹ���n�̲�ԃ����<br />�؄eС����(1)���n�̲�ԃ�Ը�λݔ��ėl���Y�x���l��Խ�٣��ҵ����ϵ��n�̾�Խ��<br />�؄eС����(2)���������Ҫ��ԃ����ϵ�ı��x�ޣ�Ҳ����ʹ���n�̲�ԃ<br />4. ����ź��n������ҪՈ�؈D�����Լ�������n������n��̫�󣬿����ÿs�Ź��܁�sСҕ�������؈D��", "ʹ���f��", {timeOut: 2500});
                //���ļ��ʂ�õĕr���x��json�n
                window.credits=0//һ�_ʼ�ČW�֔���0
                window.courses = {};//����һ���յ����
                window.course_of_majors = {};//����һ���յ����
                window.course_of_day = {};  //�@���������ڵ����
                window.teacher_course = {}; //�@�����ώ�������index�����
                window.name_of_course = {}; //�@�����n�����Q��index�����
                window.name_of_optional_obligatory = [] //�@���Á��ϵ�ϵı����n���z���Л]���n�������}�ģ����о�׌ʹ�������ЛQ��Ҫ������
                window.json_resource=["json/user.json","json/user2.json"];//temp array,�ȕ��r���ɱ��ض˵���У�δ�����Ҫ��ajaxȡ���Y��
                window.user=[];//this array will be filled with student's json.
                window.agenda_count=[[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0]];
                window.agenda_name_count=[["","","","","","","","","","","","",""],["","","","","","","","","","","","",""],["","","","","","","","","","","","",""],["","","","","","","","","","","","",""],["","","","","","","","","","","","",""]]
                //Tiagenda�ĳ�ʼֵ����ÿһ�Εr�g���]�б��دB��
                $.each(window.json_resource,function(kk,kv){
                    $.getJSON(kv, function(json){  //getJSON����function(X)����X����������                    
                        $("#class_credit").text(0);
                        window.language="zh_TW";//�̶��@ʾ�Z�Ԟ�����
                        $.each(json.time_table, function(ik, iv){
                            if(typeof(window.course_of_majors[iv.for_dept]) == 'undefined')//����@һ��(�е����Q������ֵkey)�ǿյ�Ҳ����undefined���Ǿ͌����M�г�ʼ����{}����e����Է�����Ė|������������Ѻܶ�������M�@������e��
                                window.course_of_majors[iv.for_dept] = {};
                            if(typeof(window.course_of_majors[iv.for_dept][iv.class]) == 'undefined'){
                                window.course_of_majors[iv.for_dept][iv.class] = [];//����@һ��(�е����Q������ֵkey)�ǿյ�Ҳ����undefined���Ǿ͌����M�г�ʼ����[]�e����Ƿ����
                            }
                            window.course_of_majors[iv.for_dept][iv.class].push(iv.code);//�і|�����M�@������e�������stackһ��
                            if(typeof(window.courses[iv.code])=='undefined'){
                                window.courses[iv.code]=[];
                            }
                            window.courses[iv.code].push(iv);//�@߅����ֱ�Ӱ��x�n̖��������ֵkey���e���ֵ��object
                            $.each(iv.time_parsed, function(jk, jv){//�������ڵ����
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
                            if(typeof(window.teacher_course[iv.professor])=='undefined'){//�����ώ����Q�����
                                window.teacher_course[iv.professor]=[];
                            }
                            window.teacher_course[iv.professor].push(iv);
                            if(typeof(window.name_of_course[iv.title_parsed.zh_TW])=='undefined'){//�����n�����
                                window.name_of_course[iv.title_parsed.zh_TW]=[];
                            }
                            window.name_of_course[iv.title_parsed.zh_TW].push(iv);
                            if(typeof(window.name_of_course[iv.title_parsed.en_US])=='undefined'){//Ӣ���n�����
                                window.name_of_course[iv.title_parsed.en_US]=[];
                            }
                            window.name_of_course[iv.title_parsed.en_US].push(iv);
                        });
                    });                                         
                })        
                
                    /***�ь�***/
                $("#search-span").click(function(){
                    $('#search-post').slideToggle();
                    $('#search-span').find("span").toggle();
                });
                    /***һ�꼉***/
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

                /**********����Ҫ��ϵ���ύfunciton����Ҫ�޸�Ո֔��С��!!!***********/
                $("#department_search").click(function(){//
                    var major=$("#v_major").val();  //ȡ��ϵ                    
                    major=major.split('-')[1];                    
                    var level = check_which_class(major,$("#v_level").val());//ȡ���꼉                  
                    major=major.split(" ");
                    major=major[0];                    
                    reset();
                    $("td").html('<span class="fa fa-plus-circle fa-5x"></span>');
                    if(level==""){//�@�ǽo�ČWԺ������WԺ�c�r�I����Ȼ�YԴ�WԺ�@�N�]���꼉���x�
                        $.each(course_of_majors[major][level],function(ik,iv){//����@�NԺ���nһ���ǽ��oʹ�����Լ��x�����ԾͲ��Ԅ�����
                            $.each(courses[iv],function(jk,jv){
                                if(jv.for_dept==major){//����n�̴��a�������}ʹ�ã�������forޒȦ�Д����ǲ���ϵ���_���n
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
                        $.each(course_of_majors[major][level], function(ik, iv){//���@һ�꼉�ı����nȫ�����^һ�Σ�Ӌ�����}�n���Ĕ���
                            $.each(courses[iv],function(jk,jv){
                                if(jv.obligatory_tf==true&&jv.for_dept==major&&jv.class==level){//�@�ӾͿ��Ա��C��Ӌ�㵽�ı��ޔ���һ����ԓ��ϵԓ�꼉ԓ�༉��
                                    check_optional_obligatory(jv);
                                }
                            })

                        });                       
                        $.each(course_of_majors[major][level], function(ik, iv){//֪����Щ�n�̕����}֮�ᣬ�ٛQ����Щ�n��Ҫ�����n��
                            $.each(courses[iv],function(jk,jv){
                                if(jv.for_dept==major){                    
                                    var tmpCh = jv.title_parsed["zh_TW"].split(' ');       //(�@�������n��)�и��n�����Q�������ո�����_
                                    title_short = tmpCh[0];     //title_short�Ǖ��Ԅ�����ą^��׃������]��Ӣ�ĵ��n��
                                    var class_EN=level.split("")[1];//�༉��A��B�����������ǂ����a
                                    if(window.name_of_optional_obligatory[title_short]==1){//ֻ�б����n������ʽӋ�㔵�������ԾͲ������Д��Ƿ������ˣ�һ����                             
                                 
                                        if(title_short=="����(һ)"||title_short=="����(һ)"||title_short=="��������(һ)"||title_short=="����(һ)"){//�Д��Ƿ������������Z���n
                                          
                                            bulletin_post($("#year-post"),jv,language);                            
                                        }
                                        if(jv.time_parsed==0){//��ʾ��ԓ�錍���n�����ԟo�r�g���������[]��boolean�Д�ʽ�о�Ȼ��������0
                                            bulletin_post($("#obligatory-post"),jv,language);                                            
                                        }
                                        else{
                                            if(jv.class==level){
                                                add_course($('#time-table'), jv, language);//����@���n��ֻ�г��F�^һ�Σ��Ϳ����Ԅ�����       
                                            }
                                            
                                        }                                        
                                    }
                                    else{//�����F��ֹһ�εĕr��́G��bulletin������ֻ�G����@���༉��                    
                                        if(jv.class==level&&jv.obligatory_tf==true){
                                            show_optional_obligatory(jv);//�����}���F���t׌ʹ�����Լ��Q��
                                        }
                                    }
                                }
                            })
                        });
                        $.each(course_of_majors[major], function(ik, iv){//ϵ�����е��x���n��������bulletin
                            if(check_if_two_class(level).length==1){//����ֻ��һ����
                                $.each(iv,function(jk, jv){
                                    $.each(courses[jv],function(kk,kv){
                                        if(kv.obligatory_tf==false&&kv.for_dept==major){
                                            //console.log(kv);
                                            check_which_bulletin(kv);//��fuction�Q��ԓ�N���Ă��꼉�ę�λ
                                        }
                                    })
                                })
                            }                            
                            else{//�����Ѓɂ���                                
                                var class_EN=level.split("")[1];//�༉��A��B�����������ǂ����a
                                if(ik.split("")[1]==class_EN){
                                    $.each(iv,function(jk, jv){
                                        $.each(courses[jv],function(kk,kv){
                                            if(kv.obligatory_tf==false&&kv.for_dept==major&&kv.class.split("")[1]==class_EN&&kv.class.split("")[0]==ik.split("")[0]){
                                                //console.log(kv);
                                                check_which_bulletin(kv);//��fuction�Q��ԓ�N���Ă��꼉�ę�λ
                                                return false;
                                            }
                                        })
                                    })
                                }
                            }
                        })  //���Ϟ���� �x������
                    }
                });
                window.sub_major=$("#s_major").val();//���˷���ʹ���߲����ԃĳһϵ��ͬ�꼉���n
                window.sub_level=$("#s_level").val();//���Բ����Ԅӌ��@�ɂ���λ��յ��A�Oֵ������Ҫ�Дஔ�@�ɂ���λ�и��Ӳ��M�в�ԃ����
               
                $("#clear-button").click(function()
                {
                    reset();
                    $("td").html('<div><span class="fa fa-plus-circle fa-3x"></span></div>');  //�ٰѼ�̖�İ��o����ȥ
                    $("td").attr({"style":""});
                });

                $("#v_career").change(function(){//���ӑB׃��ϵ���c�꼉���Q
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
                    if(str=='�Tʿ��'||str=='��ʿ��'||str=='�T����'||str=='�a����'){
                        $('#v_level').empty();
                        $('#s_level').empty();
                        var freshman_value="6",sophomore_value="7";
                        if(str=='��ʿ��'){
                            freshman_value="8";
                            sophomore_value="9";
                        }
                        var newGrade=$.parseHTML('<option value='+freshman_value+'>һ�꼉</option>');
                        var newGrade2=$.parseHTML('<option value='+sophomore_value+'>���꼉</option>');
                        $('#v_level').append(newGrade).append(newGrade2);
                        newGrade=$.parseHTML('<option value='+freshman_value+'>һ�꼉</option>');
                        newGrade2=$.parseHTML('<option value='+sophomore_value+'>���꼉</option>');
                        $('#s_level').append(newGrade).append(newGrade2);
                    }
                    else{                        
                        $('#v_level').empty();
                        $('#s_level').empty();
                        var target_array=['#v_level','#s_level'];
                        var option_array=['<option value="">�o�꼉</option>','<option value="1">һ�꼉</option>','<option value="2">���꼉</option>','<option value="3">���꼉</option>','<option value="4">���꼉</option>','<option value="5">���꼉</option>']
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
            
            window.week = ["һ", "��", "��", "��", "��"];
            window.no_one="�]�˿��Ե��"
            window.once=1;//�Д��Ƿ��ǵ�һ�ΰ�
            window.json_num=0;
            window.current_name="" //���Ŀǰjson��name 
            console.log(no_one)
            $("#demo").click(function(){   
                if(once==1)
                {
                    $.each(window.json_resource,function(kk,kv){
                        $.getJSON(kv, function(json){  //getJSON����function(X)����X����������                    
                            window.user.push(json);
                            json_num+=1
                        }).done(function(){     //done��׌��ʽ��ǰ���getJSON�������و����᷽��ʽ
                            //�Á�Ӌ��user��,ÿ���r���Ўׂ������n�Ă���
                            if(json_num==json_resource.length)//�Д�json_sourse�Ƿ�push�M��user
                            {   
                                $.each(user,function(uk,uv){
                                    has_class=[[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0]];//�Ƿ����n�����
                                    $.each(uv.time_table,function(hk,hv){
                                        $.each(hv.time_parsed,function(ik, iv){
                                            $.each(iv.time,function(jk, jv){
                                                agenda_count[iv.day-1][jv-1]++;//���T�n���دB�Δ���һ  
                                                has_class[iv.day-1][jv-1]=1;//�Д��Ƿ����n=1               
                                            });                    
                                        });
                                    });
                                    current_name=uv.name    //���Ŀǰjson��name
                                    //�����n�ĕr�ε�tooltip��������
                                    $.each(has_class,function(ik,iv){
                                        $.each(iv,function(jk,jv){
                                            if(jv==0&&agenda_name_count[ik][jk]=="")
                                            {
                                                //�����n��name����Ŀǰ�r��
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
                                //�Ҍ�ÿ���r���ж��������n��ֵ
                                $.each(agenda_count,function(ik,iv){
                                    $.each(iv,function(jk,jv){
                                        var $td = $("#time-table").find('tr[data-hour=' + (jk+1) + '] td[data-day=' + (ik+1) + ']');     //��Ŀǰ���ڵ�tdλ��ָ�ɽo$td    
                                        var $sp = $("#time-table").find('tr[data-hour=' + (jk+1) + '] td[data-day=' + (ik+1) + '] div');//��Ŀǰ���ڵ�spanλ��ָ�ɽo$td
                                        switch(jv)
                                        {
                                            case 0:$sp.attr({
                                                "data-toggle": "tooltip",
                                                "data-placement": "top",
                                                "title": agenda_name_count[ik][jk],
                                                "style": "height: 80%;width:100%",
                                            });//����tooltip�@ʾ���l�ɵ�
                                            $td.attr({
                                                "style": "color:#3074B5;background-color:green;",
                                            });//�]�������n�͕��ľGɫ;
                                            break;
                                            case 1:$sp.attr({
                                                "data-toggle": "tooltip",
                                                "data-placement": "top",
                                                "title": agenda_name_count[ik][jk],
                                                "style": "height: 80%;width:100%",
                                            });//����tooltip�@ʾ���l�ɵ�
                                            $td.attr({
                                                "style": "color:#3074B5;background-color:orange;",
                                            });//�]�������n�͕��ĳ�ɫ;
                                            break;
                                            case 2:$sp.attr({
                                                "data-toggle": "tooltip",
                                                "data-placement": "top",
                                                "title": no_one,
                                                "style": "height: 80%;width:100%",
                                            });//����tooltip�@ʾ���l�ɵ�
                                            $td.attr({
                                                "style": "color:#3074B5;background-color:red;",
                                            });//�]�������n�͕��ļtɫ;
                                            break;
                                            default:
                                            break;
                                        }     
                                        //�ѬF���ҵ����@�T�x���n�n�̴��a���浽�@��option���K��value��ʾ       
                                        //var url=course.url;                
                                        $('[data-toggle="tooltip"]').tooltip(); //׌tooltip���ܽ���ȥ            
                                    });  
                                }); 
                                once=0;
                            }
                        });                                           
                    }) 
                }        
            });
            window.add_course = function($target, course, language){      //���Otarget��time-table�ą�����course��courses��ĳһ���n��
                if( !$.isArray(course.time_parsed) )
                    throw 'time_parsed error';      //�Д�time-parsed�ǲ������
                if( $.type(course.title_parsed)!=="object" )            //�Д��n�����Q�ǲ������
                    throw 'title_parsed error';
                if(language == "zh_TW"){
                    var tmpCh = course.title_parsed["zh_TW"].split(' ');        //(�@�������n��)�и��n�����Q�������ո�����_
                    course.title_short = tmpCh[0];      //title_short�Ǖ��Ԅ�����ą^��׃������]��Ӣ�ĵ��n��
                }
                else{
                    var tmpEn = course.title_parsed["en_US"];
                    course.title_short = tmpEn;
                }
                var check_conflict = false; //���Á��Д��Ƿ��n�ã�����Єt�����if�͕�׌����Ȧ��eachֹͣ
                if(check_conflict==false){
                    $.each(course.time_parsed, function(ik, iv){
                        $.each(iv.time, function(jk, jv){       //ͬ�ϣ�iv.    time��"time"�����{3,4}��jk��0~1��jv��3~4(����)
                            var $td = $target.find('tr[data-hour=' + jv + '] td:eq(' + (iv.day-1) + ')');
                            var $cell = $($.parseHTML('<div><div><button type="button" class="close delete" data-dismiss="alert" aria-label="Close" style="color:red;"><span aria-hidden="true"  style="color:red;">&times;</span><input type="hidden" name="code-of-course" value=""></button></div><div class="title"></div><div class="row"><div class="professor col-xs-5"></div><div class="location col-xs-7"></div>'));
                            //�������html��ʽ�R���ҵ���td type��(  parseHtml������İ��b��dom������һ��$���b��jQuery���)
                            $cell.find('.title').text(course.title_short).end()
                            $cell.find('input').val(course.code).end()      //���������n�̃��݌���cell��html�Z���У�.title����class="title"
                                 .find('.professor').text(course.professor).end()   //text()   ���і|�������ҵ���class���e��end()���ص�var $cell��һ��
                                 .find('.location').text(fill_loction(course));
                            $td.html($cell.html());     //�@ʾ�n�̣���cell.html()����<td>tag�e�棬�����e��ԭ���а��oҲ��ֱ�ӱ��w����$.html()��ȡdiv�e��Ė|��                    
                        });
                    });
                    add_credits(course);                                       
                }
                if(check_conflict==false){
                    return("available");    //�]�n�ã�����׃ɫ
                }
                else{
                    return("conflict")  //�n�ã���Ҫ׃ɫ
                }
            };

            
            
            var minus_credits = function(course){
                window.credits-=parseInt(course.credits);
                $("#class_credit").text(window.credits);
            };
            var reset=function(){
                $('#time-table td').empty(); //��Ŀǰ��time-table��գ���׌���꼉���n���܉�Ǭ�Q���@ʾ
                $('#obligatory-post').empty();//������Ҫ����x���n�̡�ָ���r�g�ь����n��
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
                window.name_of_optional_obligatory=[];  //�є��^���n�����       
                agenda_count=[[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0]];
                agenda_name_count=[["","","","","","","","","","","","",""],["","","","","","","","","","","","",""],["","","","","","","","","","","","",""],["","","","","","","","","","","","",""],["","","","","","","","","","","","",""]];
                user=[];
                json_num=0;
                once=1
            }
            
            
        })(jQuery);
