$(function(){
    // 1.检验规则定义
    var form = layui.form;
    form.verify ({
        //属性是规则名称, 值是规则
        nickname:function(value){
            if (value.trim().length > 6){
                return "昵称长度为1 ~ 6个字符之间!"
            }
        }
    });

    // 2.初始化用户基本信息
    initUserInfo();
    //定义函数,不能提升全局,不然找不到form
    var layer = layui.layer;
    function initUserInfo(){
        $.ajax({
            url:'/my/userinfo',
            type:'GET',
            data:{  },
            dataType:'json',
            success:(res)=>{
                // console.log(res);
                // 非空校验
                if (res.status != 0){
                    return layer.msg(res.message);
                }
                //成功后渲染数据
                form.val('formUserInfo',res.data);
            }
        })
    };

    // 3.实现表单的重置效果
    // $('#btnReset').on('click',function(e){}
    $('form').on('reset',function(e){
        //阻止表单的默认重置行为
        e.preventDefault();
        initUserInfo();
        // console.log(1);
    })

    //4.监听表单的提交事件
    $('form').on('submit',function(e){
        //阻止表单的默认提交行为
        e.preventDefault();
        //发起ajax数据请求
        $.ajax({
            url:'/my/userinfo',
            type:'POST',
            data:$(this).serialize(),
            dataType:'json',
            success:(res)=>{
                console.log(res);
                if (res.status != 0){
                    return layer.msg(res.message,{icon:5});
                }
                layer.msg(res.message,{icon:6});
                //调用父页面中的方法,重新渲染用户的头像和用户信息
                window.parent.getUserInfo();
            }
        })
    })
})


