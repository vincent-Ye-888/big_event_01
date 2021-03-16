//window.onload 外部的文件和图片/音频/视频...全部加载完毕再执行
$(window).on('load',function(){
    // 1.1 获取裁剪区域的 DOM 元素
        var $image = $('#image')
    // 1.2 配置选项
        const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    };

    // 1.3 创建裁剪区域
        $image.cropper(options);

    //2.选择文件
    $('#btnChooseImage').on('click',function(){
        $('#file').click();
    });
    // 3.修改裁剪区域
    $('#file').on('change',function(e){
        //e.target 如果此事件为冒泡执行,e.target指向的就是目标阶段的事件源
        var file = e.target.files[0];
        //非空校验
        if(file == undefined){
            return layui.layer.msg('请选择图片!')
        };
        //根据选择的文件,创建一个对应的URL地址
        var newImgURL = URL.createObjectURL(file);
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });

    //修改头像
    $('#btnUpload').on('click',function(){
        //获取 base64 格式的头像
        var dataURL = $image
        .cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 100,
            height: 100
        })
        .toDataURL('image/png')   //将 Canvas 画布上的内容，转化为 `base64` 格式的字符串
        console.log(dataURL);
        console.log(typeof dataURL);
        // 发送ajax
        $.ajax({
            url:'/my/update/avatar',
            type:'POST',
            data:{ avatar:dataURL },
            dataType:'json',
            success:(res)=>{
                // console.log(res);
                //状态判断
                if (res.status != 0){
                    return layui.layer.msg(res.message);
                }
                //渲染成功
                layui.layer.msg(res.message);
                window.parent.getUserInfo();
            }
        })
    })

})

// document.onDOMContentLoaded: 只要DOM树加载完毕就可以了,不一定要渲染到页面
//$(function(){});