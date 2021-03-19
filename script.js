const requestURL = "http://webacademy.se/fakestore/";

window.onload = () => {
  let itemList = localStorage.getItem("items")
    ? JSON.parse(localStorage.getItem("items"))
    : [];

  printOutItemsInCart(itemList);
};

//Fetch API
async function fetchData(url) {
  return fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(new Error("ERROR"));
      }
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log(error);
    });
}

//Call fetch function and print out API data
function getData() {
  const productsdiv = document.querySelector("#products"); //Htmlの表示させたいタグのid名を指定

  fetchData(requestURL)
    .then((products) => {
      for (let product of products) {
        //   console.log(product);
        //html上に表示させる
        productsdiv.innerHTML += `
            <div class="product__box col card mx-1 my-2 py-2">
                <img class="product__box__img card-img" src="${
                  product.image
                }" alt=${product.title} ></img>
                <div class="card-body">
                <h2 class="card-title text-center text-capitalize ">${
                  product.title
                }</h2>
                <p　class="card-text">${product.description}</p>
                </div>
                <strong class="ml-4"><span class="price">${product.price.toFixed(
                  1
                )}</span> SEK</strong><br>
                <button class="btn btn-outline-secondary text-uppercase add-cart-btn" role="button">Lägg Till</button>
            </div>
           `;
      }
    })
    .then(() => ready());
}
getData();

// Show and close cart
//self invoke function
(() => {
  const cart = document.querySelector("#cart");
  const toggleBtn = document.querySelectorAll(".toggleBtn");

  toggleBtn.forEach((e) => {
    e.addEventListener("click", () => {
      cart.classList.toggle("show-cart");
    });
  });
})();

function ready() {
  //Add items to cart
  const addToCartBtn = document.querySelectorAll(".add-cart-btn");
  addToCartBtn.forEach((e) => {
    e.addEventListener("click", addToCart);
  });

  //Change quantity
  const increment = document.querySelectorAll(".cart-quantity-increment");
  increment.forEach((e) => {
    e.addEventListener("click", qtyChanged);
  });
  const decrement = document.querySelectorAll(".cart-quantity-decrement");
  decrement.forEach((e) => {
    e.addEventListener("click", qtyChanged);
  });

  //Remove item
  const removeItemBtn = document.querySelectorAll(".cart-item-remove");
  removeItemBtn.forEach((e) => {
    e.addEventListener("click", removeItem);
  });
}

function addToCart(e) {
  const productItem = e.target.parentElement;
  //Save selected item data in object
  const selectedItem = {
    title: productItem.getElementsByClassName("card-title")[0].innerHTML,
    image: productItem.getElementsByClassName("product__box__img")[0].src,
    price: productItem.getElementsByClassName("price")[0].innerHTML,
    qty: 1,
  };

  updateCart(selectedItem);
}

function updateCart(item) {
  let itemList = JSON.parse(localStorage.getItem("items"));
  !itemList ? (itemList = []) : null;

  //Check if item has already been added or not
  for (let product of itemList) {
    if (product.title === item.title) {
      alert("Item has already been added");
      return;
    }
  }
  localStorage.setItem("items", JSON.stringify([...itemList, item]));
  itemList = localStorage.getItem("items")
    ? JSON.parse(localStorage.getItem("items"))
    : [];

  printOutItemsInCart(itemList);
}

function qtyChanged(e) {
  let input = e.target.parentNode.querySelector(".cart-quantity-input");

  if (e.target.classList.contains("cart-quantity-increment")) {
    input.value = parseInt(input.value) + 1;
  } else if (
    e.target.classList.contains("cart-quantity-decrement") &&
    !(input.value <= 1)
  ) {
    input.value = parseInt(input.value) - 1;
  }

  //Update quantity
  const cartQtyNum = e.target.parentNode.querySelector(".cart-quantity-num");
  cartQtyNum.innerHTML = input.value;
}

function removeItem(e) {
  const removedItem = e.target.parentElement.parentElement;

  const selectedItem = {
    title: removedItem.getElementsByClassName("item-title")[0].innerHTML,
    image: removedItem.getElementsByClassName("cart-img")[0].src,
    price: removedItem.getElementsByClassName("cart-item-price")[0].innerHTML,
  };
  let itemList = JSON.parse(localStorage.getItem("items"));
  const newItemList = itemList.filter(
    (item) => JSON.stringify(item.title) !== JSON.stringify(selectedItem.title)
  );

  localStorage.clear();
  localStorage.setItem("items", JSON.stringify(newItemList));
  printOutItemsInCart(newItemList);
}

function printOutItemsInCart(itemList) {
  const cartItemsDiv = document.querySelector(".cart-items");
  cartItemsDiv.innerHTML = "";

  itemList.forEach((item) => {
    cartItemsDiv.innerHTML += `
        <div
        class=" d-flex align-items-center justify-content-around py-2"
        >
        <img src="${item.image}" class="cart-img" id="item-img" alt="${item.title}" />
        <span class="item-title">${item.title}</span>
        <span id="cart-item-price" class="cart-item-price" class=""
        >${item.price}</span><span>SEK</span
        >
        <div class="d-flex">
        <div class="cart-quantity-btn cart-quantity-decrement">-</div>
        <div class="cart-quantity-container position-relative">
        <input type="number" value="${item.qty}" class="cart-quantity-input" />
        <div class="cart-quantity-num">${item.qty}</div>
        </div>
        <div class="cart-quantity-btn cart-quantity-increment">+</div>
        </div>
        <button id="cart-item-remove" class="btn cart-item-remove my-auto">
        <i class="fas fa-trash"></i>
        </button>
        </div>
        `;

    ready();
  });
}
