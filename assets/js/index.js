$(function(){
    //1.需求:ajax获取用户信息,渲染到页面
    //  这个功能,后面其他的页面/模块还要用,所以必须设置为全局函数
    getUserInfo();


    // 2.退出功能
    $('#btnLogout').on('click',function(){
        // 1.弹窗
        layui.layer.confirm('是否确认退出?', {icon:3,title:'提示'},function(index){
            // 2.摧毁token
            localStorage.removeItem('token');
            // 3.路径跳转
            location.href = "/login.html";
            // 4.关闭询问框
            layui.layer.colse(index);
        });
        
    })

});

function getUserInfo(){
    $.ajax({
        url:'/my/userinfo',
        type:'GET',
        data:{  },
        //配置头信息,设置token,身份识别认证!
        /* headers:{
            Authorization:localStorage.getItem('tokken') || ""
        }, */
        dataType:'json',
        success:(res)=>{
            // console.log(res);
            if (res.status != 0){
                return layui.layer.msg(res.message,{icon:5})
            }
            //头像和文字渲染
            renderAvatar(res.data)
        },
        
    })
};
//头像和文字渲染封装
function renderAvatar(user){
    // console.log(user);
    //1.渲染用户名,如果有昵称,以昵称为准
    let name = user.nickname || user.username;
    $('#welcome').html("欢迎&nbsp;&nbsp;" + name);
    if (user.user_pic == null){
        //渲染文字头像,隐藏图片头像
        $('.text-avatar').show().html(name[0].toUpperCase());
        $(".layui-nav-img").hide();
    }else{
        //渲染图片头像,隐藏文字头像
        $('.layui-nav-img').show().attr('src',user.user_pic);
        $('.text-avatar').hide()
    }
}