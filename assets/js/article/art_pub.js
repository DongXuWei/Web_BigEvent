$(function() {
    initCate();
    initEditor();

    //1、动态渲染文章类别
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/cate/list',
            success(res) {
                if (res.code !== 0) {
                    return layui.layer.msg(res.message)
                }
                let strHtml = template('tpl-pub', res);
                $('[name=cate_id]').html(strHtml);
                //记得调用form.render()方法
                layui.form.render();
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')
        // 2. 裁剪选项
    var options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }
        // 3. 初始化裁剪区域
    $image.cropper(options)

    //为选择封面的按钮添加点击事件
    $('#btn_choose').on('click', function() {
        $('#coverFile').click(); //模拟点击上传文件按钮
    })

    $('#coverFile').on('change', function(e) {
        //1. 拿到用户选择的文件
        let files = e.target.files;
        if (files.length === 0) {
            return
        }
        //2. 根据选择的文件， 创建一个对应的 URL 地址：
        let newImgURL = URL.createObjectURL(files[0]);
        //3. 先销毁旧的裁剪区域， 再重新设置图片路径， 之后再创建新的裁剪区域：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    //发布文章
    let art_state = '已发布';
    //点击存草稿的时候  将状态改为草稿
    $('#btn_save2').on('click', function() {
        art_state = '草稿';
    })

    //监听表单的提交事件
    $('#pubart').on('submit', function(e) {
        e.preventDefault();
        //基于form表单快速创建一个form对象
        let fd = new FormData($(this)[0]);
        fd.append('state', art_state);
        // fd.forEach(item => {
        //     console.log(item)
        // })

        //将封面裁剪后的图片转化为文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                //将文件对象存储到fd中
                fd.append('cover_img', blob);
                //发起请求
                publishArticle(fd);
            })
    });
    //定义发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            //如果向服务器提交formData数据
            //必须添加以下两个配置项
            data: fd,
            contentType: false,
            processData: false,
            success(res) {
                if (res.code !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message);
                //跳转到文章列表页面
                location.href = '../article/art_list.html'
            }

        })
    }
})