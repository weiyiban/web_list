;
(function() {
    "use scrict"
    var $formAddTask = $(".add-task"),
        $deleteTask,
        $detailTask,
        $taskDetail = $(".task-detail"),
        $taskDetailMask = $(".task-detail-mask"),
        $updataForm,
        $taskDetailContent,
        $taskDetailContentInput,
        $checkboxComplete,
        currentIndex,
        taskList = {};

    init()

    $formAddTask.on('submit', onAddTaskFormSubmit)
    $taskDetailMask.on('click', fadeOutTaskDetail)

    function onAddTaskFormSubmit(e) {
        var newTask = {},
            $input;
        // 禁用默认行为
        e.preventDefault();
        // 获取新task的值
        $input = $(this).find('input[name="content"]');
        newTask.content = $input.val();
        // 如果task的值为空，直接返回。否则继续执行
        if (!newTask.content) return;

        // 存入新task
        if (addTask(newTask)) {
            renderTaskList();
            $input.val(null) // 添加完成后清空
        };

    }
    // 监听打开task事件
    function listenTaskDetail() {
        var index;
        $('.task-item').on('click', function() {
            index = $(this).data("index");
            fadeInTaskDetail(index)
        })
        $detailTask.on("click", function() {
            var $this = $(this),
                $Item = $this.parent();
            index = $Item.data("index");
            fadeInTaskDetail(index)
        })
    }

    function fadeInTaskDetail(i) {
        // 生成详情模板
        renderTaskDetail(i);
        currentIndex = i;
        // 显示详情模板（默认隐藏）
        $taskDetail.fadeIn();
        $taskDetailMask.fadeIn();
    }
    // 隐藏task详情
    function fadeOutTaskDetail() {
        $taskDetail.fadeOut();
        $taskDetailMask.fadeOut();
    }
    // 更新task详细信息
    function updataTask(i, data) {
        if (!i || !taskList[i]) return;
        taskList[i] = $.extend({}, taskList[i], data);
        renderTaskData()
    }
    // 渲染指定task的详细信息
    function renderTaskDetail(i) {
        if (!i === undefined || !taskList[i]) return;
        var item = taskList[i];
        var tpl =
            '<form>' +
            '<div class="content">' +
            item.content +
            '</div>' +
            '<div class="input-item">' +
            '<input type="text" name="content" value="' + (item.content || '') + '" style="display:none;" /></div>' +
            '<div class="desc input-item">' +
            '<textarea name="desc">' + (item.desc || '') + '</textarea>' +
            '</div>' +
            '<div class="remind input-item">' +
            '<input name="remind-date" type="date" value="' + (item.remindDate || '') + '">' +
            '</div>' +
            '<button type="submit">更新</button>' +
            '</form>';
        // 清空task模板
        $taskDetail.html(null);
        // 用新模板替换旧模板
        $taskDetail.html(tpl);
        // 选中form元素，因为之后会监听submit事件
        $updataForm = $taskDetail.find("form");
        // 选中显示task内容元素
        $taskDetailContent = $updataForm.find(".content");
        // 选中task input内容元素
        $taskDetailContentInput = $updataForm.find("[name=content]");
        // 双击内容元素显示input，隐藏自己
        $taskDetailContent.on("dblclick", function() {
            $taskDetailContentInput.show()
            $taskDetailContent.hide()
        })

        $updataForm.on('submit', function(e) {
            e.preventDefault();
            var data = {};
            // 获取表单中各个input的值
            data.content = $(this).find('[name=content]').val();
            data.desc = $(this).find('[name=desc]').val();
            data.remindDate = $(this).find('[name=remind-date]').val();
            updataTask(i, data);
            fadeOutTaskDetail();
        })


    }

    // 查找并监听所有删除按钮的点击事件
    function listenTaskDelete() {
        $deleteTask.on("click", function() {
            var $this = $(this),
                // 找到并删除按钮的task元素
                $Item = $this.parent(),
                index = $Item.data("index"),
                // 确认删除 
                tmp = confirm("确定删除？");
            tmp ? deleteTask(index) : null;

        })
    }

    // 监听完成task事件
    function listenCheckboxComplete() {
        $checkboxComplete.on('click', function(e) {
            e.preventDefault();
            var $this = $(this),
                isComplete = $this.is(':checked'),
                index = $this.parent().parent().data("index");
            var item = getStore(index);
            console.log(item)
            if (item.complete) {
                updataTask(index, { complete: false });
            } else {
                updataTask(index, { complete: true });
            }
        })
    }

    function getStore(index) {
        return store.get("taskList")[index];
    }

    function addTask(newTask) {
        // 将task push进 taskList
        taskList.push(newTask)
        renderTaskData()
        return true;
    }

    function renderTaskData() {
        // 更新localStorage,并更新渲染tpl
        store.set("taskList", taskList);
        renderTaskList();
    }

    // 删除一条task
    function deleteTask(index) {
        // 如果没有index，或者taskList的index不存在，则直接return
        if (index === undefined || !taskList[index]) return;

        delete taskList[index];

        renderTaskData();
    }

    function init() {
        taskList = store.get("taskList") || [];
        if (taskList.length) {
            renderTaskList()
        }
    }

    // 渲染全部的task模板
    function renderTaskList() {
        var $taskList = $('.task-list'),
            completeIetms = [];

        $taskList.html("");
        for (var i = 0; i < taskList.length; i++) {
            var Items = taskList[i];
            if (Items && Items.complete) {
                completeIetms[i] = Items
            } else {
                var $task = renderTaskItem(Items, i);
            }
                $taskList.prepend($task);
        };
        for (var j = 0; j < completeIetms.length; j++) {
            if (!completeIetms[j]) continue;
            $task = renderTaskItem(completeIetms[j], j);
            $task.addClass("completed")
            $taskList.append($task);
        };

        $deleteTask = $(".auchor.delete");
        $detailTask = $(".auchor.detail");
        $checkboxComplete = $(".task-list .complete");
        listenTaskDelete();
        listenTaskDetail();
        listenCheckboxComplete();
    }

    // 渲染单条task模板
    function renderTaskItem(data, index) {
        if (!data || !index === undefined) return;
        var listItemTpl =
            '<div class="task-item"  data-index="' + index + '">' +
            '<span><input class="complete" ' + (data.complete ? "checked" : "") + ' type="checkbox"></span>' +
            '<span class="task-content">' + data.content + '</span>' +
            '<span class="auchor detail"> 详细  </span>' +
            '<span class="auchor delete"> 删除 &nbsp;</span>' +
            '</div>';

        return $(listItemTpl);
    }
})()
