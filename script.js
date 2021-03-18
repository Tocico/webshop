const requestURL = "http://webacademy.se/fakestore/";

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
                <strong class="ml-4 price">${product.price.toFixed(
                  1
                )} SEK</strong><br>
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
  addToCartBtn.forEach(e => {
      e.addEventListener("click", addToCart);
  })

  //Change quantity
  const increment = document.querySelectorAll(".cart-quantity-increment");
   increment.forEach(e => {
       e.addEventListener("click", qtyChanged);
   })
  const decrement = document.querySelectorAll(".cart-quantity-decrement");
  decrement.forEach(e => {
      e.addEventListener("click", qtyChanged);
  })

  function addToCart(e) {
    const productItem = e.target.parentElement;
    //Save selected item data in object
    const selectedItem = {
      title: productItem.getElementsByClassName("card-title")[0].innerHTML,
      image: productItem.getElementsByClassName("product__box__img")[0].src,
      price: productItem.getElementsByClassName("price")[0].innerHTML,
    };

    updateCart(selectedItem);
  }

  function updateCart(item) {
    const itemTitle = document.querySelectorAll(".item-title");
    const cartItemsDiv = document.querySelector(".cart-items");
    const cartRow = document.createElement("div");

    //Check if item has already been added or not
    itemTitle.forEach((e) => {
      e.innerHTML == item.title ? alert("Item has already been added") : null;
    });

    cartRow.innerHTML = `
     <div
     class=" d-flex align-items-center justify-content-around py-2"
   >
     <img src="${item.image}" class="cart-img" id="item-img" alt="${item.title}" />
     <span class="item-title">${item.title}</span>
     <span id="cart-item-price" class="cart-item-price" class=""
       >${item.price}</span
     >
     <span>SEK</span>
     <div class="d-flex">
       <div class="cart-quantity-btn cart-quantity-decrement">-</div>
       <div class="cart-quantity-container position-relative">
         <input type="number" value="1" class="cart-quantity-input" />
         <div class="cart-quantity-num">1</div>
       </div>
       <div class="cart-quantity-btn cart-quantity-increment">+</div>
     </div>
     <button id="cart-item-remove" class="btn cart-item-remove my-auto">
       <i class="fas fa-trash"></i>
     </button>
   </div>
     `;

    cartItemsDiv.append(cartRow);
  }

  function qtyChanged(e) {
    const input = document.querySelector(".cart-quantity-input");
    if (e.target.classList.contains("cart-quantity-increment")) {
      input.value = parseInt(input.value) + 1;
    } else if (
      e.target.classList.contains("cart-quantity-decrement") &&
      !(input.value <= 1)
    ) {
      input.value = parseInt(input.value) - 1;
    }

    //Update quantity
    const cartQtyNum = document.querySelector(".cart-quantity-num");
    cartQtyNum.innerHTML = input.value;
  }
}
