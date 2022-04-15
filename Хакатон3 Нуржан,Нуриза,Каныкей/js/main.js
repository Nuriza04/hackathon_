const API = ' http://localhost:8000/movies';


//переменные для инпутов(для добавления товаров)
let inp = $('.inp');
let title = $('#title');
let price = $('#price');
let descr = $('#descr');
let image = $('#image');
let btnAdd = $('#btn-add');

//переменнын для инпутов(для изменения товаров)

let editTitle = $('#edit-title');
let editPrice = $('#edit-price');
let editDescr = $('#edit-descr');
let editImage = $('#edit-image');
let editSaveBtn = $('#btn-save-edit');
let editFormModal = $('#exampleModal');

 console.log(editTitle, editPrice, editDescr, editImage, editSaveBtn, editFormModal)

//блок, куда добавляются товары

let list = $('#product-list');

//для поиска

let search = $('#search');
let searchVal = '';

//Пагинация
 
let currentPage = 1;
let pageTotalCount = 1;
let prev = $('.prev');
let next = $('.next');
let paginationList = $('.pagination-list');
console.log(prev, next, paginationList);

//CRUD
//CREATE
//READ
//UPDATE
//DELETE


render();

btnAdd.on('click', function(){
    let obj = {
        title: title.val(),
        price: price.val(),
        descr: descr.val(),
        image: image.val(),
    }
    setItemToJson(obj)
   
    inp.val('');
})

function setItemToJson(obj){
    fetch(API, {
        method: "POST",
        headers: {
    "Content-Type": "application/json;charset=utf-8",      
        },
        body: JSON.stringify(obj),

    }).then(()=>{
        render()
    })
}
 

function render(){
    fetch(`${API}?q=${searchVal}&_limit=6&_page=${currentPage}`)
    .then((res)=> res.json())
    .then((data)=>{
        list.html('');
        data.forEach((element)=> {
        let item = drawProductCard(element);
        list.append(item);
        });
        drawPaginationButtons();
    })
}

function drawProductCard(element){
    return `
    <div class="card ms-5 my-5 " style="width: 14rem; height:10rem;">
  <img src="${element.image}" class="card-img-top" alt=${element.title}">
  <div class="card-body">
    <h5 class="card-title">${element.title}</h5>
    <p class="card-text">${element.descr}</p>
    <p class="card-text">${element.price}</p>
    <a href="#" class="btn btn-dark btn-delete" id=${element.id}>DELETE</a>
    <a href="#" class="btn btn-warning btn-edit" id=${element.id} data-bs-toggle="modal" data-bs-target="#exampleModal">EDIT</a>
  </div>
</div>
    `;
}


//DELETE
$('body').on('click', '.btn-delete', (e)=>deleteProduct(e.target.id));
 async function deleteProduct(id){
     await fetch(`${API}/${id}`,{
         method: 'DELETE'
     });
     render();
 }

 //EDIT
 $('body').on('click', '.btn-edit', function(){
    //  console.log(this);
    fetch(`${API}/${this.id}`)
    .then((res)=>res.json())
    .then((data)=>{
        //заполняем поля данными
        editTitle.val(data.title);
        editPrice.val(data.price);
        editDescr.val(data.descr);
        editImage.val(data.image);
        editSaveBtn.attr('id', data.id);//записываем id продукта к кнопке
    });
 });

 editSaveBtn.on('click', function(){
     let id = this.id;
     let title = editTitle.val();
     let price = editPrice.val();
     let descr = editDescr.val();
     let image = editImage.val();

     let edittedProduct = {
         title: title,
         price: price,
         descr: descr,
         image: image,
     };
     saveEdit(edittedProduct, id);
 });

 //функция для сохранения

 function saveEdit(edittedProduct, id){
     fetch(`${API}/${id}`, {
         method: 'PATCH',
         headers:{
             'Content-Type': 'application/json',
             },
    body: JSON.stringify(edittedProduct)
     }).then(()=> {
         render();
         editFormModal.modal('hide');
     });
 }

//SEARCH

search.on('input', () => {
    searchVal = search.val();
    console.log(searchVal);
    render();
});

//PAGINATION
function drawPaginationButtons(){
  fetch(`${API}?q=${searchVal}`)
  .then((res) => res.json())
  .then((data) => {
      pageTotalCount = Math.ceil(data.length / 6);//общее количество страниц
          paginationList.html('');
      for(let i = 1; i<=pageTotalCount; i++){
          if(currentPage===1){
              paginationList.append(`<li class="page-item active"><a class="page-link page_number" href="#">${i}</a>
              </li>`
              );
          }else{
              paginationList.append(`<li class="page-item"><a class="page-link page_number" href="#">${i}</a>
              </li>`

              )
          }
      }

  });
  
}


$('body').on('click', '.page_number', function(){
  currentPage = this.innerText;
  render();
});

prev.on('click', ()=> {
  if(currentPage <= 1){
      return;
  }
  currentPage--;
  render();
})

next.on('click', () => {
  if(currentPage >= pageTotalCount){
      return;
  }
  currentPage++;
  render();
});