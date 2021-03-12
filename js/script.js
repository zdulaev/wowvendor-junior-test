document.addEventListener("DOMContentLoaded", () => { 

    // Выбираем целевой элемент
    var target = document.getElementById('app');
    var player = document.getElementsByClassName('donut')[0];
    var player_distance = false;
    var player_max_distance = 1020;
    var rock = document.getElementsByClassName('rock')[0];
    var is_jump = true;
    var start_time;

    var jump_position = 0;

    // Конфигурация observer (за какими изменениями наблюдать)
    var config = {
        attributes: true,
        // childList: true,
        subtree: true,
        attributeOldValue: true
    };

    // Создаем экземпляр наблюдателя с указанной функцией обратного вызова
    var observer = new MutationObserver(function(mutationsList) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'attributes') {

                // player
                if (mutation.target === player) {
                    if ((130 + window.character.characterPosition) > window.terrain.rockPosition) {
                        jump(mutation.target);
                        is_jump = false;
                        player_distance = getNumber(player.style.left);
                    }

                //rock
                } else if (mutation.target === rock) {
                    window.character.run();
                    is_jump = true;
                    observer.disconnect();
                    end(mutation);
                    return;
                }
            }
        }
    });

    start();

    function jump(e) {
        if (is_jump) {
            if (e.style.left !== undefined) {
                jump_position = e.style.left;
            }
            window.character.jump();
        }
    }
    function end(e) {
        window.character.stop();
        var end_time = new Date();
        console.log('---');
        console.log('Позиция препятствия', e.target.style.left);
        console.log('Время забега, ms', end_time - start_time);
        console.log('Дистанция на которой персонаж совершил прыжок', jump_position);
        console.log('Размер препятствия', window.terrain.rockSize);
        console.log('Результат забега (Успех или Провал)', player_distance >= player_max_distance, player_distance, player_max_distance)

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", 'controller.php', true);

        //Передает правильный заголовок в запросе
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send('rockPosition='+getNumber(e.target.style.left)+'&time='+(end_time - start_time) / 1000+'&jumpPosition='+getNumber(jump_position)+'&terrainSize='+window.terrain.rockSize+'&result='+(player_distance >= player_max_distance)+'&is_ajax=true');
        xmlhttp.onreadystatechange = function() {
            console.log(xmlhttp);
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    alert(xmlhttp.response);
                    xmlhttp.response == 'succeful' ? start() : void 0;
                }
            }
        };

    }
    function start() {
        start_time = new Date();
        is_jump = true;
        observer.observe(target, config);
        window.character.run();
    }
    function getNumber(e) {
        return +e.replace(/\D+/g,'');
    }

});