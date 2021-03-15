//$.ajaxPrefilter() 可以在调用$.get()  $.post()   $.ajax()
//   接收到 ajax 响应后,也会触动这个方法

//1.开发环境服务器地址
var baseURL = 'http://ajax.frontend.itheima.net';
//2.测试环境服务器地址
// var baseURL = 'http://ajax.frontend.itheima.net';
//3.生产环境服务器地址
// var baseURL = 'http://ajax.frontend.itheima.net';

//拦截所有ajax请求并处理参数
$.ajaxPrefilter(function(options){
    // console.log(options);
    //1.手动为 url 拼接对应的环境服务器地址
    options.url = baseURL + options.url;

    // 2.统一为有权限的接口，设置 headers 请求头
    if (options.url.indexOf('/my/') != -1){
        options.headers = {
            Authorization:localStorage.getItem('token') || ""
        }
    }

    //3.拦截所有响应,判断身份认证信息
    //无论请求成功与否,都会执行complete
    options.complete=function(res){
        // console.log(res.responseJSON);
        //判断如果状态码是1,或者信息提示"身份验证失败！"就会阻止访问
        if(res.responseJSON.status == 1 && res.responseJSON.message === "身份认证失败！"){
            //跳转到登录页面,摧毁token
            localStorage.removeItem('token');
            location.href = "/login.html";
            
        }
    }

});