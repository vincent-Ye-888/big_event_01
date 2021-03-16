$(function(){
    var layer = layui.layer;
    var form = layui.form;

    initCate();
    //1.定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
            if (res.status !== 0) {
                return layer.msg('初始化文章分类失败！')
            }
            // 调用模板引擎，渲染分类的下拉菜单
            var htmlStr = template('tpl-cate', res)
            $('[name=cate_id]').html(htmlStr)
            // 一定要记得调用 form.render() 方法
            form.render()
            }
        })
    }

    // 2.富文本编辑器初始化
    initEditor();

    //3.实现裁剪效果
    // 3.1. 初始化图片裁剪器
        var $image = $('#image')

    // 3.2. 裁剪选项
        var options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }
    
    // 3.3. 初始化裁剪区域
        $image.cropper(options)
    
    //4.为选择封面的按钮,绑定点击事件处理函数
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click()
    })

    //5.获取用户上传的图片
    $('#coverFile').on('change', function(e) {
        // 获取到文件的列表数组
        var files = e.target.files[0];
        // 判断用户是否选择了文件
        if (files == undefined) {
            //如果选择了又取消,可以清除路径
            $image
                .cropper('destroy')
                .attr('src', "")
            return "您可以选择一张图片作为文章的封面"
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files)
        // 为裁剪区域重新设置图片
        $image
          .cropper('destroy') // 销毁旧的裁剪区域
          .attr('src', newImgURL) // 重新设置图片路径
          .cropper(options) // 重新初始化裁剪区域
    })

    // 6.发布文章的实现步骤
    //6.1定义文章的发布状态
    var art_state ='已发布';
    $('#btnSave2').on('click',function(){
        art_state ='草稿';
    })

    //7 基于`Form`表单创建`FormData`对象
    $('#form-pub').on('submit', function(e) {
        // 1. 阻止表单的默认提交行为
        e.preventDefault()
        // 2. 基于 form 表单，快速创建一个 FormData 对象
        var fd = new FormData($(this)[0])
        // 3. 将文章的发布状态，存到 fd 中
        fd.append('state', art_state)
        //4.将裁剪后的图片输出成一个文件,把文件追加到 `formData` 中即可
            $image.cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求(封装函数)
                publishArticle(fd);
            })
        
    })
    //封装
    function publishArticle(fd){
        $.ajax({
            url:'/my/article/add',
            type:'POST',
            data:fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            dataType:'json',
            success:(res)=>{
                // console.log(res);
                if(res.status !== 0){
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // 成功后页面跳转
                // location.href = "/article/art_list.html"
                setTimeout(function(){
                    window.parent.document.getElementById('art_list').click();
                },1500);
            }
        })
    }
})