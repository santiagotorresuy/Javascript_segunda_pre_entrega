//ELEMENTOS DEL DOM
const containerCartas = document.querySelector("#containerCartas");
const btnFiltroCategoria = document.querySelectorAll(".nav-tienda-ul-li");
const inputNavBar = document.getElementById("navBarPokedex");
const formTienda = document.getElementById("formPokedex");
const tbody = document.querySelector("tbody");
const btnVaciarCarrito = document.querySelector(".vaciar-carrito");
const btnCarrito = document.querySelector("#btnCarrito");
const containerCarrito = document.querySelector("#containerCarrito");
const unidades = document.querySelector(".unidades");
const btnComprar = document.querySelector("#comprar")


//CARRITO
let carritoCompras = [];


//FUNCIONES CARRITO
cargarObjetoCarrito = (e) => {
    if(e.target.classList.contains("btn-agregar-carrito")){
        e.preventDefault();
        const cartaObjeto = e.target.parentElement.parentElement;
        agregarObjetoCarrito(cartaObjeto);

        Toastify({
            text: "Objeto agregado!",
            duration: 2000,
            gravity: "top",
            position: "right", 
            style: {
                background: "linear-gradient(rgba(206, 85, 85, 0.795), rgba(145, 31, 31, 0.747))",
                marginTop: "6rem"
            },
          }).showToast();
    }
}

agregarObjetoCarrito = (elemento) =>{   
    let nuevoObjeto = new objetoPokemon (elemento.querySelector("h4").textContent, elemento.querySelector(".carta-precio").textContent, elemento.querySelector("#objetoTiendaCantidad").value);

    let indexObjeto = carritoCompras.findIndex(objeto => objeto.nombre == nuevoObjeto.nombre);

    if(indexObjeto != -1){
        carritoCompras[indexObjeto].cantidad = parseInt(carritoCompras[indexObjeto].cantidad) + parseInt(nuevoObjeto.cantidad);
    }else{
        carritoCompras.push(nuevoObjeto);
    }
    localStorage.setItem("carrito", JSON.stringify(carritoCompras));
    mostrarCarrito()
};

mostrarCarrito = () => {
    tbody.innerHTML = ``

    carritoCompras.forEach((objeto) => {
        const tr = document.createElement("tr");
        
        tr.innerHTML= `
        <td id="nombre">${objeto.nombre}</td>
        <td>
            <div class="cantidad-unidades  ">
                <button class="restar" id="${objeto.nombre}">&#8722;</button>
                <span class="unidades">${objeto.cantidad}</span>
                <button class="sumar" id="${objeto.nombre}">&#43;</button>
            </div>
        </td>
        <td id="precio">¥${(objeto.precio)*(objeto.cantidad)}</td>
        <td><button type="button" class="eliminar btm" id="${objeto.nombre}">Eliminar</button></td>
        `;tbody.appendChild(tr);
        
        //ELIMINAR UN ELEMENTO DEL CARRITO
        let btnEliminar = tr.querySelector(".eliminar");
        btnEliminar.addEventListener("click", eliminarObjeto)

        //RESTAR UNIDADES EN EL CARRITO
        let btnRestar = tr.querySelector(".restar");
        btnRestar.addEventListener("click", (e) =>{
            let restar = e.target;
            let index = carritoCompras.find(objeto => objeto.nombre == restar.id)
            
            if(index.cantidad > 1 && index.cantidad <= 99){
                index.cantidad--
                mostrarCarrito()
            }
        });

        //SUMAR UNIDADES EN EL CARRITO
        let btnSumar = tr.querySelector(".sumar");
        btnSumar.addEventListener("click", (e) =>{
            let sumar = e.target;
            let index = carritoCompras.find(objeto => objeto.nombre == sumar.id)
            
            if(index.cantidad >= 1 && index.cantidad < 99){
                index.cantidad++
                localStorage.setItem("carrito", JSON.stringify(carritoCompras))
                mostrarCarrito()
            }
        });
    });
    //SUMAR TOTAL
    let index = carritoCompras.findIndex(objeto => objeto.nombre == tbody.querySelector("#nombre").textContent);
    let precioTotal = carritoCompras.reduce((acumulador, objeto) => acumulador + parseInt(objeto.precio)*parseInt(objeto.cantidad), 0)

    if(index != -1){
        let total = containerCarrito.querySelector("#totalPrecio");
        total.textContent = "¥" + precioTotal;
    }

    comprarObjetos = () =>{
        Swal.fire({
            icon: 'question',
            title: 'Desea comprar estos objetos?',
            text: "Precio total: ¥" + precioTotal,
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            denyButtonText: `Cancelar`,
          }).then((result) => {
            if (result.isConfirmed) {    
                Swal.fire({
                    icon: 'success',
                    title: "Compra realizada!",
                });
            }
          })
    }
}


eliminarObjeto = (e) => {
    Swal.fire({
        icon: 'question',
        title: 'Desea eliminar este item?',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        denyButtonText: `Cancelar`,
      }).then((result) => {
        if (result.isConfirmed) {
            let eliminar = e.target;
            eliminar.parentElement.parentElement.innerHTML = ``;
            carritoCompras = carritoCompras.filter (objeto => objeto.nombre != eliminar.id)
            localStorage.setItem("carrito", JSON.stringify(carritoCompras))
            mostrarCarrito()

            Swal.fire({
                icon: 'success',
                title: "Objeto eliminado!",
            });
        }
      })
    
}

vaciarCarrito = () =>{
    Swal.fire({
        icon: 'question',
        title: 'Desea vaciar el carrito?',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        denyButtonText: `Cancelar`,
      }).then((result) => {
        if (result.isConfirmed) {
            carritoCompras = [];
            tbody.innerHTML=``
            localStorage.setItem("carrito", JSON.stringify(carritoCompras))
            mostrarCarrito()

            Swal.fire({
                icon: 'success',
                title: "Carrito vaciado!",
            });
        }
      })
}


//FUNCION PARA ALTERNAR ENTRE TIENDA Y CARRITO
displayNone = () =>{
    let display = containerCarrito.classList.contains("d-none");
    
    if(display === true){
        containerCarrito.classList.remove("d-none");
        containerCartas.classList.replace("d-grid", "d-none");
    }else{
        containerCarrito.classList.add("d-none");
        containerCartas.classList.replace("d-none", "d-grid");
    }
}




//FUNCIONES PARA BUSCAR OBJETO CON LA NAVBAR

cargarNombreObjeto = () => {
    let nombreObjeto = inputNavBar.value.toUpperCase();
    return nombreObjeto
};

filtrarObjetosPorNombre = () => {
    cargarNombreObjeto();
    nombreObjeto = cargarNombreObjeto();  
    let objetosFiltradosNombre = objetosPokemon.filter(objeto => objeto.nombre.toUpperCase() == nombreObjeto);

    cuerpoCarta(objetosFiltradosNombre);
}




//FUNCIONES PARA LA LISTA COMPLETA

function cuerpoCarta(lista){
    containerCartas.innerHTML = ``;

    lista.forEach(obj =>{
        const div = document.createElement("div");
        div.classList.add("carta-producto");
    
        div.innerHTML = `
            <h4 class="titulo-carta">${obj.nombre}</h4>
            <img src="${obj.img}" alt="">
            <p class="carta-precio">${obj.precio}</p>
            <form action="" class="form-agregar-carrito" id="formAgregarAlCarrito">
                <input type="text" class="input-agregar-carrito" id="objetoTiendaCantidad" value="1">
                <button class="btn-agregar-carrito" id="btnAgregarAlCarrito">Agregar al carrito</button>
            </form>
        `;containerCartas.appendChild(div);
    })
}

async function mostrarObjetos(){
    objetosPokemon = await fetch("../objetosPokemon.json")
        .then((response) => {
            if (response.ok){
                return response.json();
            }
        });
        cuerpoCarta(objetosPokemon);

    //EVENTOS PARA FILTROS Y NAVBAR
    inputNavBar.addEventListener("change", cargarNombreObjeto); 
    formTienda.addEventListener("submit", (e) => {
        e.preventDefault();
        filtrarObjetosPorNombre();
    });
};


//CODIGO

document.addEventListener("DOMContentLoaded", () =>{
    mostrarObjetos();

    btnFiltroCategoria.forEach((btn) => btn.addEventListener("click", (e) =>{    
        const btnId = e.currentTarget.id;
        let objetosFiltradosCategoria = objetosPokemon.filter(objeto => objeto.categoria == btnId)

        if(btnId === "todos"){
            mostrarObjetos()
        }else{
            cuerpoCarta(objetosFiltradosCategoria);
        }
    }));

    carritoCompras = JSON.parse(localStorage.getItem("carrito")) || [];
    mostrarCarrito();

    containerCartas.addEventListener("click", cargarObjetoCarrito);
    btnVaciarCarrito.addEventListener("click", vaciarCarrito);
    btnCarrito.addEventListener("click", displayNone);
    btnComprar.addEventListener("click", comprarObjetos);
});
















