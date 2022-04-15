const API = 'http://localhost:8000/products'

let inp = $('.inp')
let name = $('#name')
let surname = $('#surname')
let phone = $('#phone')
let kpi1 = $('#kpi1')
let kpi2 = $('#kpi2')
let btnAdd = $('#btn-add')

let list = $('#product-list')


let editName = $('#edit-name')
let editSurname = $('#edit-surname')
let editPhone = $('#edit-phone')
let editKpi1 = $('#edit-kpi1')
let editKpi2 = $('#edit-kpi2')
let editSaveBtn = $('#btn-save-edit')
let editFormModal =$('#exampleModal')


let search = $('#search')
let searchVal = ''



// ?ПАГИНАЦИЯ
let currentPage = 1;
let pageTotalCount =1
let prev=$('.prev')
let next = $('.next');
let paginationList=$('.pagination-list');


render()
btnAdd.on('click', function () {
    let obj = {
      name: name.val(),
      surname: surname.val(),
      phone: phone.val(),
      kpi1: kpi1.val(),
      kpi2: kpi2.val(),
    };
    setItemToJson(obj);
    inp.val('');

  });
  
  function setItemToJson(obj) {
    fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(obj),
    }).then(()=>{
      render()
    });
  }

  function render(){
      fetch(`${API}?q=${searchVal}&_limit=8&_page=${currentPage}`)
      .then((res)=>res.json())
      .then((data)=>{
          list.html('')
        data.forEach(element=>{
            let item = drawProductCard(element);
            list.append(item)
        });
        drawPaginationButtons()
      });
  };


  function drawProductCard(element) {
      return `
      <div class="card m-3" style="width: 18rem;">
  
  <div class="card-body bg-dark">
    <p class="card-title"><span id=descr>Имя:</span>${element.name}</p>
    <p class="card-text"><span id=descr>Фамилие:</span>${element.surname}</p>
    <p class="card-text"><span id=descr>Номер телефона:</span>${element.phone}</p>
    <p class="card-text"><span id=descr>Недельный KPI:</span>${element.kpi1}</p>
    <p class="card-text"><span id=descr>Месячный KPI:</span>${element.kpi2}</p>

    <a href="#" class="btn btn-dark btn-delete" id=${element.id}>Удалить</a>
    <a href="#" class="btn btn-dark btn-edit" id=${element.id} data-bs-toggle="modal" data-bs-target="#exampleModal">Редактировать</a>
    </div>
</div>
      `
  }

// DELETE
  $('body').on('click', '.btn-delete',(e)=>deleteProduct(e.target.id))
  async function deleteProduct(id) {
   await fetch(`${API}/${id}`,{
      method: 'DELETE',
    });
    render()
  }


    // EDIT
    $('body').on('click','.btn-edit',function(){
      fetch(`${API}/${this.id}`)
      .then((res)=>res.json())
      .then((data)=>{
     
        editName.val(data.name)
        editSurname.val(data.surname)
        editPhone.val(data.phone)
        editKpi1.val(data.kpi1)
        editKpi2.val(data.kpi2)
       
        editSaveBtn.attr("id", data.id)
      });
    })

editSaveBtn.on('click',function(){
  let id = this.id;
  let edittedProduct = {
    name: editName.val(),
    surname: editSurname.val(),
    phone: editPhone.val(),
    kpi1: editKpi1.val(),
    kpi2: editKpi2.val(),

  }

  saveEdit(edittedProduct, id)
})

// Функция для сохранения 

function saveEdit(edittedProduct,id) {
  
  fetch(`${API}/${id}`,{
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(edittedProduct)
  }).then(()=>{
    render()
    editFormModal.modal('hide')
  })
}



// SEARCH
search.on('input',()=>{
  searchVal = search.val()

  render();
})



// PAGINATION
function drawPaginationButtons() {
  fetch(`${API}?q=${searchVal}`)
  .then(res=> res.json())
  .then(data => {
    pageTotalCount=Math.ceil(data.length/8);
    paginationList.html('');


    for(let i =1; i <=pageTotalCount; i++){
      if(currentPage == i){
        paginationList.append(` <li class="page-item active"><button class="page-link page_number text-white bg-dark" href="#">${i}</button></li>  `)
      } else{
        paginationList.append(` <li class="page-item"><button class="page-link page_number  text-white bg-dark" href="#">${i}</button></li>  `)
      }
    }
  })
}

$('body').on('click','.page_number',function(){
  currentPage = this.innerText;
  render()
});

prev.on('click',()=>{
  if(currentPage<=1){
    return
  }
  currentPage--
  render()
})

next.on('click',()=>{
  if(currentPage>=pageTotalCount){
    return
  }
  currentPage++
  render()
})
