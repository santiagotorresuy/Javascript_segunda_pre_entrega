//ELEMENTOS DEL DOM
const containerCartas = document.querySelector("#containerCartas");
const btnFiltroCategoria = document.querySelectorAll(".nav-tienda-ul-li");


//ARRAYS
let  objetosPokemonCartas = [];

//FUNCIONES

function cuerpoCarta(lista){
    containerCartas.innerHTML = ``;

    for(let i=0; i <= lista.length; i++){
        const div = document.createElement("div");
        div.classList.add("carta-producto");
    
        div.innerHTML = `
            <p class="titulo-carta">${lista[i].nombre}</p>
            <img src="${lista[i].img}" alt="">
            <p class="carta-precio">${lista[i].precio} ¥</p>
            <form action="" class="form-agregar-carrito">
                <input type="text" class="input-agregar-carrito">
                <button class="btn-agregar-carrito">Agregar al carrito</button>
            </form>
        `;containerCartas.appendChild(div);
    }
}

function crearCartasObjetos(data){
    data.forEach((objeto) => objetosPokemonCartas.push(objeto))
    cuerpoCarta(objetosPokemonCartas)
    /*containerCartas.innerHTML = ``;

    for(let i=0; i <= objetosPokemonCartas.length; i++){
        const div = document.createElement("div");
        div.classList.add("carta-producto");
    
        div.innerHTML = `
            <p class="titulo-carta">${objetosPokemonCartas[i].nombre}</p>
            <img src="${objetosPokemonCartas[i].img}" alt="">
            <p class="carta-precio">${objetosPokemonCartas[i].precio} ¥</p>
            <form action="" class="form-agregar-carrito">
                <input type="text" class="input-agregar-carrito">
                <button class="btn-agregar-carrito">Agregar al carrito</button>
            </form>
        `;containerCartas.appendChild(div);
    }*/
};

async function mostrarObjetos(){
    objetosPokemonCartas = await fetch("../objetosPokemon.json")
        .then((response) => {
            if (response.ok){
                return response.json();
            }
        })
        .then((objetos) => crearCartasObjetos(objetos))  
};

function filtrarObjetos (){
    btnFiltroCategoria.forEach((btn) => btn.addEventListener("click", (e) =>{
        const btnId = e.currentTarget.id;
        containerCartas.innerHTML = ``
        
        if(btnId === "todos"){
            mostrarObjetos()
        }else{
            const objetosFiltrados = objetosPokemonCartas.filter((objeto) => objeto.categoria === btnId)
            cuerpoCarta(objetosFiltrados);
        }
    }));
}

//CODIGO

document.addEventListener("DOMContentLoaded", () =>{
    mostrarObjetos();
    filtrarObjetos();
})


