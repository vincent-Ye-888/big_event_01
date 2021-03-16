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
                // console.log(res);
                if(res.status != 0){
                    return layer.msg (res.message);
                }
                layer.msg (res.message);
                //成功后用模板引擎渲染数据
                var htmlStr = template('tpl-table',res);
                $('tbody').html(htmlStr);
                //文章列表初始化完毕就做分页
                renderPage(res.total);
            }
        })
    }

    //2.初始化文章分类
    initCate();
    function initCate(){
        $.ajax({
            url:'/my/article/cates',
            type:'GET',
            data:{  },
            dataType:'json',
            success:(res)=>{
                // console.log(res);
                if (res.status != 0){
                    return layer.msg(res.message)
                }
                //赋值,渲染form
                var htmlStr = template('tpl-cate' , res);
                $('[name=cate_id]').html(htmlStr);
                layui.form.render();
            }
        })
    }

    // 3.筛选功能
    $('#form-search').on('submit',function(e){
        e.preventDefault();
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象 q 中对应的属性赋值
        query.cate_id = cate_id
        query.state = state
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })

    // 4.分页功能
    var laypage = layui.laypage;
    function renderPage(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox' ,//注意，这里的 test1 是 ID，不用加 # 号
            count: total ,     //数据总数，从服务端得到
            limit: query.pagesize,  //每页显示几条
            curr: query.pagenum ,   //设置默认被选中分页
            //自定义排版
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],// 每页展示多少条
            //分页发生切换时,触发 jump 回调
            jump:function(obj,first){
                // console.log(obj.curr);
                if(!first){
                    query.pagenum = obj.curr;
                    query.pagesize = obj.limit;
                    // 重新渲染页面
                    initTable();
                };
                
            }
        });
    }

    //5.删除功能
    $('tbody').on('click','.btn-delete',function(){
        //获取文章id
        var id = $(this).attr('data-id');
        //询问用户是否要删除数据
        layer.confirm('确认删除',{icon:3,title:'提示'},function(index){
            $.ajax({
                url:'/my/article/delete/' + id,
                type:'GET',
                data:{  },
                dataType:'json',
                success:(res)=>{
                    // console.log(res);
                    if(res.status != 0){
                        return layer.msg(res.message);
                    }
                    layer.msg(res.message)
                    //如果页面只剩下一个元素了,当前页码还要大于1,当前页码减一
                    if($('.btn-delete').length == 1 ||query.pagenum >1){
                        query.pagenum--;
                    }
                    //成功就重新渲染文章列表
                    initTable();
                }
            })
            layer.close(index);
        })

    })

    
})  