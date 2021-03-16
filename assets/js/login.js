// 入口函数
$(function(){
    //1.需求:点击a链接,显示注册盒子,隐藏登陆
    $('#link_reg').on('click',function(){
        $('.reg-box').show();
        $('.login-box').hide();
    });
    //点击a链接,显示隐藏盒子,隐藏注册
    $('#link_login').on('click',function(){
        $('.login-box').show();
        $('.reg-box').hide();
    });

    // 2.需求:自定义 layui 校验规则
    // console.log(layui);
    var form = layui.form;
    //verify () 的参数是一个对象
    form.verify({
        //密码规则
        pwd:[
            /^[\S]{6,16}$/,
            "密码必须6-16位,且不能输入空格"
        ],
        //密码重复校验规则
        repwd:function(value,item){
            //console.log(value);      //能拿到重复密码框的值
            //console.log($('.reg-box input[name=password]').val());
            if (value != $('.reg-box input[name=password]').val() ){
                return '两次输入的密码不一致';
            }
        },
    });

    //3需求.注册用户
    // 获取到  `layer` 内置模块
    var layer = layui.layer;
    $('#form_reg').on('submit',function(e){
        // 1. 阻止默认的提交行为
        e.preventDefault();
        //发送ajax
        $.ajax({
            url:'/api/reguser',
            type:'post',
            data:{ 
                username:$('.reg-box input[name=username]').val(),
                password:$('.reg-box input[name=password]').val(),
            },
            dataType:'json',
            success:(res)=>{
                // console.log(res);
                //返回状态判定
                if (res.status != 0){
                    return layer.msg(res.message, {icon: 5});
                }
                layer.msg('注册成功,请登录', {icon: 6});

                //切换回登陆模块
                $('#link_login').click();
                //表单清空
                //一定要把$('#form_reg') 转为DOM元素 [?] ,才能操作重置事件
                $('#form_reg')[0].reset();
            }
        })
    });

    //4.登录功能
    $('#form_login').on('submit',function(e){
        // 1. 阻止默认的提交行为
        e.preventDefault();
        //发送ajax
        $.ajax({
            url:'/api/login',
            type:'post',
            data: $(this).serialize(),
            dataType:'json',
            success:(res)=>{
                console.log(res);
                //返回状态判定
                if (res.status != 0){
                    return layer.msg("用户名或密码错误", {icon: 5});
                }
                //成功后,跳转页面,保存token
                localStorage.setItem('token',res.token);
                //跳转
                location.href="/index.html";
            }
        });
    })


})