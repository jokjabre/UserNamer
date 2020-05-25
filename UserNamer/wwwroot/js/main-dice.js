"use strict";

function dice_initialize() {
    var container = document.getElementById("dice-container");
    var screen = document.getElementById("dice-screen");
    $t.remove($t.id('loading_text'));

    var canvas = $t.id('canvas');

    //container.style.width = window.innerWidth * 0.8 + 'px';
    //container.style.height = window.innerHeight * 0.8 + 'px';
    //canvas.style.width = "100%";
    //canvas.style.height = "100%";
    //var label = $t.id('label');
    var set = $t.id('set');
    // var selector_div = $t.id('selector_div');
    //var info_div = $t.id('info_div');
    on_set_change();

    $t.dice.use_true_random = false;

    function on_set_change(ev) { set.style.width = set.value.length + 3 + 'ex'; }
    $t.bind(set, 'keyup', on_set_change);
    $t.bind(set, 'mousedown', function(ev) { ev.stopPropagation(); });
    $t.bind(set, 'mouseup', function(ev) { ev.stopPropagation(); });
    $t.bind(set, 'focus', function(ev) { $t.set(container, { class: '' }); });
    $t.bind(set, 'blur', function(ev) { $t.set(container, { class: 'noselect' }); });

    $t.bind($t.id('clear'), ['mouseup', 'touchend'], function(ev) {
        ev.stopPropagation();
        set.value = '0';
        on_set_change();
    });

    var params = $t.get_url_params();

    if (params.chromakey) {
        $t.dice.desk_color = 0x00ff00;
        $t.id('control_panel').style.display = 'none';
    }
    if (params.shadows == 0) {
        $t.dice.use_shadows = false;
    }
    if (params.color == 'white') {
        $t.dice.dice_color = '#808080';
        $t.dice.label_color = '#202020';
    }

    var box = new $t.dice.dice_box(canvas, { w: 500, h: 300 });
    box.animate_selector = true;

    $t.bind(window, 'resize', function() {

        //container.style.width = window.innerWidth * 0.8 + 'px';
        //container.style.height = window.innerHeight * 0.8 + 'px';
        //canvas.style.width =  "100%";
        //canvas.style.height = "100%";
        box.reinit(canvas, { w: 500, h: 300 });
    });

    function before_roll(vectors, notation, callback) {
        //info_div.style.display = 'none';
        // selector_div.style.display = 'none';
        // do here rpc call or whatever to get your own result of throw.
        // then callback with array of your result, example:
        // callback([2, 2, 2, 2]); // for 4d6 where all dice values are 2.
        callback();
    }

    function notation_getter() {
        return $t.dice.parse_notation(set.value);
    }

    function after_roll(notation, result) {
        if (params.chromakey || params.noresult) return;
        // var res = result.join(' ');
        // if (notation.constant) {
        //     if (notation.constant > 0) res += ' +' + notation.constant;
        //     else res += ' -' + Math.abs(notation.constant);
        // }
        // if (result.length > 1) res += ' = ' + 
        //         (result.reduce(function(s, a) { return s + a; }) + notation.constant);
        // label.innerHTML = res;
        // info_div.style.display = 'inline-block';
    }

    box.bind_mouse(canvas, notation_getter, before_roll, after_roll);
    box.bind_throw($t.id('throw'), notation_getter, before_roll, after_roll);

    $t.bind(canvas, ['mouseup', 'touchend'], function(ev) {
        ev.stopPropagation();
        // if (selector_div.style.display == 'none') {
        //     if (!box.rolling) show_selector();
        //     box.rolling = false;
        //     return;
        // }
        //var name = box.search_dice_by_mouse(ev);
        //if (name != undefined) {
        //    var notation = $t.dice.parse_notation(set.value);
        //    notation.set.push(name);
        //    set.value = $t.dice.stringify_notation(notation);
        //    on_set_change();
        //}

        var selected = box.search_dice_by_mouse(ev);
        if (selected) {
            selected.visible = false;
            box.re_render();

            window.interop_functions.dice_selected(box.get_dice_value(selected));
        }
    });

    if (params.notation) {
        set.value = params.notation;
    }
    //if (params.roll) {
        $t.raise_event($t.id('throw'), 'mouseup');
    //}
    // else {
    //     show_selector();
    // }
}
