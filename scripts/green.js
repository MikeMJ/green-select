$(function () {
    $(document).mouseup(function (e) {
        var hideAble = $('.ma-select-options');
        var filterInput = $('.ma-select-box-filter');
        $(e.target).parent().next().attr('id', '_maSelectTmp');
        if (filterInput.is(e.target)) {
            if (e.which == 1) {
                $(e.target).parent().next().toggle();
                scrollToSelectedItem(e.target);
                $(hideAble).not('#_maSelectTmp').hide();
            }
        } else if (!hideAble.is(e.target) && hideAble.has(e.target).length === 0) 
            $(hideAble).hide();
        $('#_maSelectTmp').removeAttr('id');
    });

    $('.ma-select-li').click(function () {
        $('.ma-select-li').removeClass('ma-option-selected');
        $(this).addClass('ma-option-selected');
        var options = $(this).parent().parent();
        var filterInput = $(options).prev().find('input');
        var hiddenInput = $(options).next();
        $(filterInput).val($(this).html());
        $(hiddenInput).val($(this).attr('optvalue'));
        $(options).hide();
    });

    $('.ma-select-box-filter').keyup(function (e) {
        var filterInput = this;
        var optionsDiv = $(filterInput).parent().next();
        if (e.keyCode == 27)
            $(optionsDiv).hide();
        else if (e.keyCode == 38 || e.keyCode == 40) {
            navigateItems(e.keyCode, optionsDiv);
        }
        else if (e.keyCode == 13) {
            $(filterInput).val($(optionsDiv).find('.ma-option-selected').html());
            $(optionsDiv).hide();
        }
        else if (e.keyCode != 37 && e.keyCode != 39) {
            $(optionsDiv).show();
            var options = (optionsDiv).find('li');
            filter = $(filterInput).val();
            filter = filter.replace("i", "İ").replace("i", "İ").replace("ı", "I");
            for (var i = 0; i < options.length; i++) {
                var option = options[i];
                var optionText = $(option).html();
                if (optionText.substring(0, filter.length).toLowerCase() == filter.toLowerCase()) {
                    $(option).addClass('ma-visible-option').show();
                } else {
                    $(option).removeClass('ma-visible-option').hide();
                }
            }
        }
    });
});

function scrollToSelectedItem(filterInput) {
    /// <summary>
    /// Scrolls the list to the previously selected item
    /// </summary>
    /// <param name="filterInput" type="type"></param>
    var hiddenInput = $(filterInput).parent().next().next();
    if ($(hiddenInput).val() != '') {
        var li = $(filterInput).parent().next().find('li[value="{0}"]'.format($(hiddenInput).val()));
        if ($(li).length > 0) {
            var top = $(li).position().top;
            $(filterInput).parent().scrollTop($(li).position().top);
        }
    }
}

function navigateItems(keyCode, optionsDiv) {
    /// <summary>
    /// Provides navigation through items
    /// </summary>
    /// <param name="keyCode" type="type">Up or down key</param>
    /// <param name="optionsDiv" type="type">List items container</param>
    var items = $(optionsDiv).find('.ma-select-li.ma-visible-option ');
    var selectedItem;
    if ($(optionsDiv).find('.ma-option-selected').length == 0) {
        selectedItem = items[0];
        $(items[0]).addClass('ma-option-selected');
    }
    else {
        for (var i = 0; i < items.length; i++) {
            var prevOrNextIndex = keyCode == 38 ? i - 1 : i + 1;
            if ($(items[i]).hasClass('ma-option-selected') && items[prevOrNextIndex] != undefined && $(items[prevOrNextIndex]).hasClass('ma-visible-option')) {
                $(items[i]).removeClass('ma-option-selected');
                $(items[prevOrNextIndex]).addClass('ma-option-selected');
                selectedItem = items[prevOrNextIndex];
                break;
            }
        }
    }

    if (selectedItem) {
        setSelectedOption(optionsDiv, selectedItem);
        scrollByNavigation(optionsDiv, selectedItem);
    }
}


function setSelectedOption(optionsDiv, selectedItem) {
    /// <summary>
    /// As user navigates through list items, the current item is set as the selected on in select box
    /// </summary>
    /// <param name="optionsDiv" type="type">Options container in which to look for the list items </param>
    /// <param name="selectedItem" type="type">Current list item</param>
    //$(optionsDiv).prev().find('input').val($(selectedItem).html());
    $(optionsDiv).next('input').val($(selectedItem).attr('optvalue'));
}

function scrollByNavigation(optionsDiv, selectedItem) {
    /// <summary>
    /// Provides scroll as items are navigated through
    /// </summary>
    /// <param name="optionsDiv" type="type">Options container in which to look for the list items </param>
    /// <param name="selectedItem" type="type">Current list item</param>
    var itemTop = $(selectedItem).position().top;
    var itemHeight = $(selectedItem).height();
    var optionsCurrentScroll = $(optionsDiv).scrollTop();
    if (itemTop > $(optionsDiv).height())
        $(optionsDiv).scrollTop(optionsCurrentScroll + itemHeight);
    else if (itemTop < optionsCurrentScroll)
        $(optionsDiv).scrollTop(optionsCurrentScroll - itemHeight);
}

