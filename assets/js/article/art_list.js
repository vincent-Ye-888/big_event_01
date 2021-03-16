$(function(){
    // 2.定义美化时间格式的过滤器
    // 向模板引擎中导入 变量/函数
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)
        
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());
;
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    //定义一个查询参数对象
    var query = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }
    
    //1.初始化文章列表(后面会还用,封装起来)
    var layer = layui.layer;
    initTable();
    function initTable(){
        //发送ajax获取文章列表数据
        $.ajax({
            url:'/my/article/list',
            type:'GET',
            data: query,
            dataType:'json',
            success:(res)=>{
                console.log(res);
                if(res.status != 0){
                    return layer.msg (res.message);
                }
                layer.msg (res.message);
                //成功后用模板引擎渲染数据
                var htmlStr = template('tpl-table',res);
                $('tbody').html(htmlStr);
            }
        })
    }

    

})