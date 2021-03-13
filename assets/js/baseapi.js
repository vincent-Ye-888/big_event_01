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
    console.log(options);
    //手动为 url 拼接对应的环境服务器地址
    options.url = baseURL + options.url;
});