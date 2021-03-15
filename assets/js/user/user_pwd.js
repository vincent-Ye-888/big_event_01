$(function(){
    var form = layui.form;
    //定义规则
    form.verify({
        pwd:[/^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'],
        samePwd:function(value){
            if(value === $('[name=oldPwd]').val()){
                return "新密码不能与原密码相同"
            }
        },
        rePwd:function(value){
            if(value !== $('[name=newPwd]').val()){
                return "两次输入的密码不一致"
            }
        },
    });

    //实现修改密码功能
    $('.layui-form').on('submit',function(e){
        //阻止表单的默认提交行为
        e.preventDefault();
        $.ajax({
            url:'/my/updatepwd',
            type:'POST',
            data:$(this).serialize(),   //表单序列化
            dataType:'json',
            success:(res)=>{
                // console.log(res);
                if(res.status != 0){
                    return layui.layer.msg(res.message);
                }
                layui.layer.msg(res.message);
                //重置表单
                // console.log($('.layui-form')[0]);
                $('.layui-form')[0].reset();
                // 重定向到登录页,修改父页面的location.href,否则跳转后再登录就会渲染到iframe中
                window.parent.location.href ="/login.html";
            }
        })
    })
})