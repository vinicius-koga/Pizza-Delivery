import { pizzaJson } from "./pizzaJson.js";
let defaultQt;
let pizzaKey;

/* MAP */
pizzaJson.map((item, index, array) => {
    let itemClone = document.querySelector('.nodes .menu-item').cloneNode(true);
    document.querySelector('.menu-container').append(itemClone);
    itemClone.setAttribute('key', index);

    /* LOAD JSON MENU ITENS */
    itemClone.querySelector('.menu-item-left img').src = item.img;
    itemClone.querySelector('.menu-item-left img').alt = item.name;
    itemClone.querySelector('.menu-item-title').innerText = item.name;
    itemClone.querySelector('.menu-item-price').innerText = `R$${item.price[0].toFixed(2)}`;
    itemClone.querySelector('.menu-item-desc').innerText = item.description;

    /* OPEN WINDOW AREA ON CLICK */
    itemClone.querySelectorAll('.open-modal').forEach(i => {
        i.addEventListener('click', (e) => {
            /* RESETING WINDOW BODY */
            defaultQt = 1;
            let key = e.target.closest('.menu-item').getAttribute('key');
            pizzaKey = key;
            document.querySelector('.pizza-size.selected').classList.remove('selected');
            document.querySelector('.pizza-size').classList.add('selected');

            /* SHOW WINDOW AREA ANIMATION */
            document.querySelector('.pizza-window-area').style.display = 'flex';
            document.querySelector('.pizza-window-area').style.opacity = '0';
            setTimeout(() => {
               document.querySelector('.pizza-window-area').style.opacity = '1';
            });
            document.querySelector('.pizza-window-body').style.transform = 'translateY(-40px)';
            setTimeout(() => {
               document.querySelector('.pizza-window-body').style.transform = 'translateY(0)';
            });

            /* SHOW WINDOW BODY INFO */
            document.querySelector('.window-body-left img').src = pizzaJson[key].img;
            document.querySelector('.window-body-title').innerText = pizzaJson[key].name;
            document.querySelector('.window-body-desc').innerText = pizzaJson[key].description;
            document.querySelectorAll('.pizza-size').forEach((item, index) => {
                item.querySelector('span').innerText = `(${pizzaJson[key].sizes[index]})`;
            });
            document.querySelector('.window-pizza-price span').innerText = pizzaJson[key].price[0].toFixed(2);
            document.querySelector('.pizza-qt').innerText = defaultQt;

            /* CHANGE PRICE BY CHOOSING SIZE */
            document.querySelectorAll('.pizza-size').forEach((item, index) => {
                item.addEventListener('click', () => {
                    document.querySelector('.pizza-size.selected').classList.remove('selected');
                    item.classList.add('selected');
                    document.querySelector('.window-pizza-price span').innerText = pizzaJson[key].price[index].toFixed(2);
                    defaultQt = 1;
                    document.querySelector('.pizza-qt').innerText = defaultQt;
                })
            });
        });
    });
});

/* CLOSE WINDOW AREA FUNCTION */
function closeWindowArea() {
    document.querySelector('.pizza-window-area').style.opacity = '1';
    setTimeout(() => {
       document.querySelector('.pizza-window-area').style.opacity = '0';
    });
    document.querySelector('.pizza-window-body').style.transform = 'translateY(0)';
    setTimeout(() => {
       document.querySelector('.pizza-window-body').style.transform = 'translateY(-40px)';
    });

    setTimeout(() => {
        document.querySelector('.pizza-window-area').style.display = 'none';
    }, 300);
}

/* CLOSE WINDOW AREA BY CLICKING OUT */
document.addEventListener('click', (e) => {
    if(e.target.classList.contains('pizza-window-area')){
        closeWindowArea();
    }
});

/* CLOSE WINDOW AREA BUTTON */
document.querySelector('.window-cancel-btn').addEventListener('click', () => {
    closeWindowArea();
});

/* BUTTON MORE PIZZA */
document.querySelector('.more').addEventListener('click', () => {
    defaultQt++;
    document.querySelector('.pizza-qt').innerText = defaultQt;

    let choosedSize = document.querySelector('.pizza-size.selected').getAttribute('data-key');
    let actualPrice = pizzaJson[pizzaKey].price[choosedSize];

    document.querySelector('.window-pizza-price span').innerText = (actualPrice * defaultQt).toFixed(2);
});

/* BUTTON LESS PIZZA */
document.querySelector('.less').addEventListener('click', () => {
    if(defaultQt > 0) {
        defaultQt--;
        document.querySelector('.pizza-qt').innerText = defaultQt;
        let choosedSize = document.querySelector('.pizza-size.selected').getAttribute('data-key');
        let actualPrice = pizzaJson[pizzaKey].price[choosedSize];
    
        document.querySelector('.window-pizza-price span').innerText = (actualPrice * defaultQt).toFixed(2);
    };

    if(defaultQt === 0) {
        closeWindowArea();
    };
});