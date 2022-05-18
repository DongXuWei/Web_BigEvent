$(function() {

    //定义美化事件的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date);

        let yy = dt.getFullYear();
        let mm = padZero(dt.getMonth() + 1);
        let dd = padZero(dt.getDate());

        let h = padZero(dt.getHours());
        let m = padZero(dt.getMinutes());
        let s = padZero(dt.getSeconds());

        return `${yy}-${mm}-${dd}\t${h}:${m}:${s}`;
    }

    //定义补零的函数
    function padZero(num) {
        return num > 10 ? num : '0' + num
    }

    //定义一个查询的参数对象 将来请求数据的时候 
    //需要将请求参数对象提交到服务器
    let data = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示几条数据
        cate_id: '', //文章分类的id
        state: '' //文章的发布状态
    }


    initTable();
    initCate();

    //获取文章列表数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data,
            success(res) {
                if (res.code !== 0) {
                    return layui.larer.msg(res.message);
                }
                //console.log(res)
                //成功了就使用模板引擎渲染页面数据
                let strHtml = template('tpl-table', res)
                $('tbody').html(strHtml);

                //调用渲染分页的方法
                renderPage(res.total);
            }
        })
    }

    //初始化获取文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/cate/list',
            success(res) {
                if (res.code !== 0) {
                    return layui.layer.msg(res.message);
                }
                let strHtml = template('tpl-cate', res)
                $('[name=cate_id]').html(strHtml);
                // console.log(strHtml)
                //通知layui重新渲染表单区域的UI结构
                layui.form.render();
            }
        })
    }

    //为筛选表单绑定提交事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        //获取下拉列表中选中的值
        let cate_id = $('[name=cate_id]').val();
        let state = $('[name=state]').val();

        // console.log(cate_id)

        //为查询参数对象data中对应的属性赋值
        data.cate_id = cate_id;
        data.state = state;
        //根据最新的删选条件重新渲染数据
        initTable();
    })


    //定义渲染分页的方法
    function renderPage(total) {
        //获取文章的个数
        // console.log(total)
        let laypage = layui.laypage;

        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: data.pagesize, //每页显示几个
            curr: data.pagenum, //默认显示那一页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [1, 3, 5, 10],
            //1、分页发生切换的时候触发jump回调
            //2、只要调用了laypage.render()方法就会触发jump回调
            jump: function(obj, first) {
                // console.log(obj.curr)
                //将最新的页码值赋值到查询参数data上
                data.pagenum = obj.curr;
                data.pagesize = obj.limit;
                //可以通过first的值来判断是通过哪种方式触发的jump回调
                //如果first的值为true 证明是方式2触发的
                //如果first的值为undefined  证明是方式1触发的
                if (!first) {
                    //根据最新的数据
                    initTable();
                }
            }
        });
    }

    //通过事件委托为删除按钮绑定事件
    $('tbody').on('click', '#btn_del', function() {
        //询问用户是否要删除数据

        let id = $(this).attr('data-id');
        // console.log(id)
        let len = $("#btn_del").length;
        console.log(len)
        layui.layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            //发起请求
            $.ajax({
                method: 'DELETE',
                url: '/my/article/info?id=' + id,
                success(res) {
                    if (res.code !== 0) {
                        return layui.layer.msg(res.message)
                    }
                    layui.layer.msg(res.message);
                    if (len <= 1) {
                        data.pagenum = data.pagenum === 1 ? 1 : data.pagenum - 1
                    }
                    //删除成功之后需要重新渲染数据
                    initTable();
                }
            })
            layui.layer.close(index);
        })
    });
})