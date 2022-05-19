$(function() {
    let layer = layui.layer;
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    //为上传按钮绑定事件
    $('#btn_file').on('click', function() {
        $('#file').click();
    })

    //监听上传文件的状态
    $('#file').on('change', function(e) {
        // console.log(e)
        let filelist = e.target.files;
        //console.log(filelist)
        if (filelist.length === 0) {
            return layer.msg('取消了上传头像')
        }
        //拿到用户选择的第一个文件
        let file = e.target.files[0];
        //根据选择的文件创建一个对应的url地址
        let newImgURL = URL.createObjectURL(file);
        //重新初始化裁剪区
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    //绑定提交事件
    $('#btn_upload').on('click', function() {
        let dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        //调用接口，上传头像
        $.ajax({
            method: "PATCH",
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success(res) {
                console.log(res)
                if (res.code !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);

                //更新用户信息
                window.parent.getUserInfo();
            }
        })
    })
})