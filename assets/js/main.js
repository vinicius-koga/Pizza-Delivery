import { pizzaJson } from "./pizzaJson.js";
let defaultQt;
let pizzaKey;
let cart = [];

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

/* BUTTON MORE/LESS PIZZA */
document.querySelector('.more').addEventListener('click', () => {
    defaultQt++;
    document.querySelector('.pizza-qt').innerText = defaultQt;

    let choosedSize = document.querySelector('.pizza-size.selected').getAttribute('data-key');
    let actualPrice = pizzaJson[pizzaKey].price[choosedSize];

    document.querySelector('.window-pizza-price span').innerText = (actualPrice * defaultQt).toFixed(2);
});
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

/* ADD TO CART BUTTON */
document.querySelector('.window-add-btn').addEventListener('click', () => {
    let choosedPizza = pizzaJson[pizzaKey];
    let choosedSize = Number(document.querySelector('.pizza-size.selected').getAttribute('data-key'));
    let choosedPrice = choosedPizza.price[choosedSize];
    let amount = Number(document.querySelector('.pizza-qt').innerText);
    let id = `${pizzaKey}-${choosedSize}`;
    for(let i in cart) {
        if(cart[i].id === id) {
            cart[i].amount += amount;
            updateCart();
            closeWindowArea();
            scrollTop();
            cartIconAnimation();
            return;
        }
    }
    cart.push({
        id: id,
        name: choosedPizza.name,
        size: choosedSize,
        amount: amount,
        img: choosedPizza.img,
        price: choosedPrice,
    })
    if(cart.length > 0) {
        updateCart();
        closeWindowArea();
        scrollTop();
        cartIconAnimation();
    }
})

function scrollTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
}

function cartIconAnimation() {
    document.querySelector('.cart-icon').classList.add('cart-icon-animation');
    setTimeout(() => {
        document.querySelector('.cart-icon').classList.remove('cart-icon-animation');
    }, 820)
}

/* UPDATE CART */
function updateCart() {
    let cartTooltip = document.querySelector('.cart-tooltip');
    let cartBody = document.querySelector('.cart-body');
    cartBody.innerHTML = '';

    if(cart.length > 0) {
        cartTooltip.style.display = 'block';
        cartTooltip.innerText = cart.length;
    }

    let subtotal = 0;
    let desconto = 0;
    let total = 0;

    for(let i in cart) {
        let cartItem = document.querySelector('.cart-item').cloneNode(true);
        cartBody.append(cartItem);
        cartItem.querySelector('img').src = cart[i].img;
        cartItem.querySelector('img').alt = cart[i].name;
        cartItem.querySelector('p').innerHTML = `${cart[i].name} (${renderCartSize(cart[i].size)})`;
        cartItem.querySelector('.cart-qt').innerText = cart[i].amount;

        cartItem.querySelector('.cart-less').addEventListener('click', () => {
            if(cart[i].amount > 0) {
                cart[i].amount--;
                updateCart();
            }
            if(cart[i].amount === 0) {
                cart.splice(i, 1);
                updateCart();
            }
            if(cart.length === 0) {
                closeCart();
                cartTooltip.style.display = 'none';
            }
        })

        cartItem.querySelector('.cart-more').addEventListener('click', () => {
            cart[i].amount++;
            updateCart();
        })

        subtotal += cart[i].price * cart[i].amount;
        desconto += subtotal * 0.1;
        total += subtotal - desconto;

        document.querySelector('.cart-subtotal span').innerText = `R$${subtotal.toFixed(2)}`;
        document.querySelector('.cart-descount span').innerText = `R$${desconto.toFixed(2)}`;
        document.querySelector('.cart-total span').innerText = `R$${total.toFixed(2)}`;
    }
}
function renderCartSize(size) {
    switch (size) {
        case 0:
            return 'Pequeno';
        break;
        case 1:
            return 'Médio';
        break;
        case 2:
            return 'Grande';
        break;
    }
}

/* CLOSE / OPEN FUNCTIONS */
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

document.querySelector('.window-cancel-btn').addEventListener('click', () => {
    closeWindowArea();
});

function closeCart() {
    document.querySelector('.cart').style.right = '-320px';
    document.querySelector('.cart-area').style.opacity = '1';
    setTimeout(() => {
        document.querySelector('.cart-area').style.opacity = '0';
    })
    setTimeout(() => {
        document.querySelector('.cart-area').style.display = 'none';
    }, 300)
}
document.querySelector('.close-btn').addEventListener('click', () => {
    closeCart()
})

function openCart() {
    if(cart.length > 0){
        document.querySelector('.cart-area').style.display = 'block';
        document.querySelector('.cart-area').style.opacity = '0';
        setTimeout(() => {
            document.querySelector('.cart-area').style.opacity = '1';
        })
        document.querySelector('.cart').style.right = '-320px';
        setTimeout(() => {
            document.querySelector('.cart').style.right = '0';
        })
    }
    if(cart.length === 0) {
        cartIconAnimation();
    }
}
document.querySelector('.cart-icon').addEventListener('click', () => {
    openCart()
})

document.addEventListener('click', (e) => {
    if(e.target.classList.contains('pizza-window-area')){
        closeWindowArea();
    }
    if(e.target.classList.contains('cart-area')){
        closeCart();
    }
});

/*  */
document.querySelector('.cart-btn').addEventListener('click', () => {
    alert('Agora é com o back-end :)')
})

