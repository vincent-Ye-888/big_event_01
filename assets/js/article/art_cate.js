$(function(){
    //1.渲染文章分类列表(后面添加,删除,修改都要用到,所以封装函数)
    initArtCateList();
    //封装函数
    function initArtCateList(){
        $.ajax({
            url:'/my/article/cates',
            type:'GET',
            data:{  },
            dataType:'json',
            success:(res)=>{
                // console.log(res);
                //状态刷新
                if (res.status != 0){
                    return layui.layer.msg(res.message);
                }
                //获取成功不需要弹窗,直接展示
                let htmlStr = template('tpl-art-cate',{data:res.data});
                $('tbody').html(htmlStr)
            }
        })
    };
    
    //2.实现添加文章类别
    var layer = layui.layer;
    var indexAdd = null;
    $('#btnAddCate').on('click',function(){
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html(),
        });
    })

    // 3.给弹出框绑定submit事件,注意,弹出框是动态生成的,所以要通过事件委托来实现
    $('body').on('submit','#form-add',function(e){
        //阻止表单的默认提交行为
        e.preventDefault();
        $.ajax({
            url:'/my/article/addcates',
            type:'POST',
            data:$(this).serialize(),
            dataType:'json',
            success:(res)=>{
                // console.log(res);
                if(res.status != 0){
                    return layer.msg(res.message);
                };
                //成功就重新渲染分类列表
                initArtCateList();
                layer.msg(res.message);
                //关闭对应索引值的弹出层
                layer.close(indexAdd);
            }
        })
    })
    // let form = layui.form;
    //4.1-给编辑按钮也添加弹出层(事件委托-点击事件)
    var indexEdit = null;
    $('tbody').on('click','.btn-edit',function(){
        indexEdit=layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html(),
        });
        //需要将对应的数据从服务器响应到弹出层中
        var id = $(this).attr('data-id');
        //发送请求获取对应的数据
        $.ajax({
            url:'/my/article/cates/' + id,
            type:'GET',
            data:{  },
            dataType:'json',
            success:(res)=>{
                // console.log(res);
                if(res.status != 0){
                    return layui.layer.msg(res.message)
                }
                layui.form.val('form-edit', res.data);
            }
        })
        
    })
    // 4.2-给弹出框绑定submit事件,注意,弹出框是动态生成的,所以要通过事件委托来实现
    $('body').on('submit','#form-edit',function(e){
        //阻止表单的默认提交行为
        e.preventDefault();
        $.ajax({
            url:'/my/article/updatecate',
            type:'POST',
            data:$(this).serialize(),
            dataType:'json',
            success:(res)=>{
                // console.log(res);
                if (res.status != 0){
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                //成功就重新渲染分类列表
                initArtCateList();
                //关闭对应索引值的弹出层
                layer.close(indexEdit);
            }
        })
    })

    // 5.删除文章分类(事件代理-点击事件)
    $('tbody').on('click','.btn-delete',function(){
        var id = $(this).attr('data-id');
        //提示用户是否要删除
        layer.confirm('是否确定删除?', {icon: 3, title:'提示'}, function(index){
            //发送ajax
            $.ajax({
                url:'/my/article/deletecate/' + id,
                type:'GET',
                data:{  },
                dataType:'json',
                success:(res)=>{
                    // console.log(res);
                    if(res.status != 0){
                        return layer.msg(res.message);
                    }
                    layer.msg(res.message)
                    //成功就重新渲染分类列表
                    initArtCateList();
                    layer.close(index);
                }
            })
        });
    })
})