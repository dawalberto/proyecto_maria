let marias;
let arrayMarias = new Array();
let arrayEffectsAll = new Array();
let arrayFlavorsAll = new Array();
let arrayMariasSearch = new Array();
let arrayFavoritesCookies = new Array();



function getData() {

    fetch('https://strainapi.evanbusse.com/OQSVRIt/strains/search/all')
    .then(response => response.json())
    .then(json => {

        marias = json;

        for (let maria in marias) {

            let id = marias[maria].id;
            let nom = maria;
            let race = marias[maria].race;
            let flavors = marias[maria].flavors;
            let effects = marias[maria].effects;

            let strain = new Maria(id, nom, race, flavors, effects);
            arrayMarias.push(strain);

        }

        animar('#loader', 'fadeOut', 'stylenone');
        document.getElementById('buttonSearch').disabled = true; //Poner a true para produccion

        if (document.cookie !== '') {

            let cookieRestart = getCookie('restartcookies');
            console.log('cookieRestart', cookieRestart);

            if (cookieRestart === 'no') {

                fillTextContentTabsNav();
                filltextContentFooter();
                getFavorites();
                document.getElementById('formInicio').style.display = 'none';
                document.getElementById('divMain').style.display = 'flex';

            }

        } 

        generateDescMarias();

        effectsAll();
        flavorsAll();

        fillSelects();

    });
    
}


function Maria(id, nom, race, flavors, effects, desc) {

    this.id = id;
    this.nom = nom;
    this.race = race;
    this.flavors = flavors;
    this.effectsM = effects['medical'];
    this.effectsN = effects['negative'];
    this.effectsP = effects['positive'];
    this.effectsSum = this.effectsM.concat(this.effectsN.concat(this.effectsP));
    this.description = desc;

}


function effectsAll() {

    arrayMarias.forEach(maria => {

        maria.effectsSum.forEach(effect => {

            if (!arrayEffectsAll.includes(effect)) {

                arrayEffectsAll.push(effect);
            }

        })

    })

}


function flavorsAll() {

    arrayMarias.forEach(maria => {

        maria.flavors.forEach(flavor => {

            if (!arrayFlavorsAll.includes(flavor)) {

                arrayFlavorsAll.push(flavor);
            }

        })

    })

}


function fillSelects() {

    let selectEfecto = document.getElementById('selectEfecto');
    let selectSabor = document.getElementById('selectSabor');

    arrayEffectsAll.forEach(effect => {

        var opt = document.createElement('option');
        opt.value = effect;
        opt.text = effect.toUpperCase();

        selectEfecto.add(opt);

    });

    arrayFlavorsAll.forEach(flavor => {

        var opt = document.createElement('option');
        opt.value = flavor;
        opt.text = flavor.toUpperCase();

        selectSabor.add(opt);

    });

}


function searchMarias() {

    let selectEfecto = document.getElementById('selectEfecto').value;
    let selectSabor = document.getElementById('selectSabor').value;

    let checkSativa = document.getElementById('checkSativa').checked;
    let checkIndica = document.getElementById('checkIndica').checked;
    let checkHybrid = document.getElementById('checkHybrid').checked;

    arrayMariasSearch = [];

    for (let i = 0; i < arrayMarias.length; i++) {
        
        if (arrayMarias[i].flavors.indexOf(selectSabor) >= 0 && arrayMarias[i].effectsSum.indexOf(selectEfecto) >= 0) {

            if (checkSativa && arrayMarias[i].race.toUpperCase() === 'SATIVA') {
                arrayMariasSearch.push(arrayMarias[i]);
            }

            if (checkIndica && arrayMarias[i].race.toUpperCase() === 'INDICA') {
                arrayMariasSearch.push(arrayMarias[i]);
            }

            if (checkHybrid && arrayMarias[i].race.toUpperCase() === 'HYBRID') {
                arrayMariasSearch.push(arrayMarias[i]);
            }

        }

    }

}


function clickButtonSearch() {

    searchMarias();
    generateCardsMarias();

    if (arrayMariasSearch.length > 0) {

        document.getElementById('containerRes').style.display = 'block';
        document.getElementById('footer').style.display = 'block';
        window.scrollTo(0, window.innerHeight);

    } else {

        barProgress.style.width = '0';
        document.getElementById('containerRes').style.display = 'none';
        document.getElementById('footer').style.display = 'none';
        alert('NO STRAIN FOUND');

    }

}


function generateDescMarias() {

    let lengtharrayMarias = arrayMarias.length;
    let j = 0;

    for (let i = 0; i < lengtharrayMarias; i++) {

        let id = arrayMarias[i].id;
        let url = 'https://strainapi.evanbusse.com/OQSVRIt/strains/data/desc/' + id;

        fetch(url)
            .then(response => response.json())
            .then(json => {

                j++;
                arrayMarias[i].description = json.desc;

                document.getElementById('buttonSearch').textContent = 'GETTING STRAINS ' + i + '/' + lengtharrayMarias;

                if (j >= lengtharrayMarias - 1) {

                    document.getElementById('buttonSearch').disabled = false;
                    document.getElementById('buttonSearch').innerHTML = 'SEARCH <span class="spanSearch"><i class="fas fa-search"></i></span>';
                    addEventToShowFavorites();
                
                }

            });

    }

}


function generateCardsMarias(toFavorites) {

    let arrayToIterate;

    if (toFavorites) {
        arrayToIterate = generateArrayFavs();
    } else {
        arrayToIterate = arrayMariasSearch;
    }

    document.getElementById('rowRes').textContent = '';

    let selectEfecto = document.getElementById('selectEfecto').value;

    for (let i = 0; i < arrayToIterate.length; i++) {

        let title = arrayToIterate[i].nom.toUpperCase();
        let race = arrayToIterate[i].race.toUpperCase();
        let desc;
        let effect;

        if (arrayToIterate[i].description != null) {

            desc = arrayToIterate[i].description;

        } else {

            desc = 'WITHOUT DESCRIPTION'

        }

        if (arrayToIterate[i].effectsM.includes(selectEfecto)) {

            effect = 'EFFECT - MEDICAL';

        } else if (arrayToIterate[i].effectsP.includes(selectEfecto)) {

            effect = 'EFFECT - POSITIVE';

        } else {

            effect = 'EFFECT - NEGATIVE';
        }


        let col = document.createElement('div');
        col.classList.add('col-md-6');
        col.classList.add('col-lg-4');
        col.classList.add('my-2');

        let card = document.createElement('div');
        card.id = 'card' + arrayToIterate[i].id;
        card.classList.add('card');
        card.classList.add('h-100');
        card.classList.add('cursorPointer');

        let cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        let h5title = document.createElement('h5');
        h5title.classList.add('card-title');
        h5title.textContent = title;

        let h3icon = document.createElement('h3');
        h3icon.id = 'hicon' + arrayToIterate[i].id;
        
        let iicon = document.createElement('i');
        iicon.classList.add('fas');
        iicon.classList.add('fa-cannabis');

        let h6race = document.createElement('h6');
        h6race.classList.add('card-subtitle');
        h6race.classList.add('mb-2');
        h6race.classList.add('text-muted');
        h6race.textContent = race;

        let h6effect = document.createElement('h6');
        h6effect.classList.add('card-subtitle');
        h6effect.classList.add('mb-2');
        h6effect.classList.add('text-muted');
        h6effect.textContent = effect;

        let pdescription = document.createElement('p');
        pdescription.classList.add('card-text');
        pdescription.classList.add('text-justify');
        pdescription.textContent = desc;


        if (arrayFavoritesCookies.indexOf('hicon' + arrayToIterate[i].id) >= 0) {

            // h3icon.classList.add('favoritesColor');
            h3icon.style.color = 'green';
            console.log('favorita encontrada');

        }


        h3icon.appendChild(iicon);

        cardBody.appendChild(h3icon);
        cardBody.appendChild(h5title);
        cardBody.appendChild(h6race);
        cardBody.appendChild(h6effect);
        cardBody.appendChild(pdescription);

        card.appendChild(cardBody);
        col.appendChild(card);

        document.getElementById('rowRes').appendChild(col);

    }

    addEvents();

}


function validateForm() {

    let inputNombre = document.getElementById('inputNombre').value;
    let inputEdad = document.getElementById('inputEdad').value;
    let inputCorreo = document.getElementById('inputCorreo').value;

    let spanNombre = document.getElementById('spanNombre');
    let spanEdad = document.getElementById('spanEdad');
    let spanCorreo = document.getElementById('spanCorreo');

    function validateNom() {

        let error;
        let regExpNom = /^[A-Za-z]+$/;
        
        if (inputNombre === '' || inputNombre === null) {

            spanNombre.textContent = 'THIS FIELD IS REQUIRED*';
            animar(`#${spanNombre.id}`, 'fadeIn');
            spanNombre.style.visibility = 'visible';
            error = true;

        } else {

            if (regExpNom.test(inputNombre)) {

                spanNombre.style.visibility = 'hidden';
                error = false;

            } else {

                spanNombre.textContent = 'THIS FIELD ONLY ALLOWS LETTERS';
                animar(`#${spanNombre.id}`, 'fadeIn');
                spanNombre.style.visibility = 'visible';
                error = true;

            }

        }

        return error;

    }

    function validateEdad() {

        let error;
        let regExpEdad = /^\d{1,}$/;

        if (inputEdad === '' || inputEdad === null) {

            spanEdad.textContent = 'THIS FIELD IS REQUIRED*';
            animar(`#${spanEdad.id}`, 'fadeIn');
            spanEdad.style.visibility = 'visible';
            error = true;

        } else {

            if (regExpEdad.test(inputEdad)) {

                if (Number(inputEdad) >= 18) {

                    spanEdad.style.visibility = 'hidden';
                    error = false;

                } else {

                    spanEdad.textContent = 'SORRY THIS PAGE IS ONLY FOR ADULTS';
                    animar(`#${spanEdad.id}`, 'fadeIn');
                    spanEdad.style.visibility = 'visible';
                    error = true;

                }
                
            } else {

                spanEdad.textContent = 'THIS FIELD ONLY ALLOWS NUMBERS';
                animar(`#${spanEdad.id}`, 'fadeIn');
                spanEdad.style.visibility = 'visible';
                error = true;

            }

        }

        return error;

    } 

    function validateEmail() {

        let error;
        let regExpEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (inputCorreo === '' || inputCorreo === null) {

            spanCorreo.textContent = 'THIS FIELD IS REQUIRED*';
            animar(`#${spanCorreo.id}`, 'fadeIn');
            spanCorreo.style.visibility = 'visible';
            error = true;

        } else {

            if (regExpEmail.test(inputCorreo)) {

                spanCorreo.style.visibility = 'hidden';
                error = false;

            } else {

                spanCorreo.textContent = 'NOT VALID EMAIL';
                animar(`#${spanCorreo.id}`, 'fadeIn');
                spanCorreo.style.visibility = 'visible';
                error = true;

            }

        }

        return error;

    } 


    let nom = validateNom();
    let edad = validateEdad();
    let email = validateEmail();
    
    if (!nom && !edad && !email) {

        let daysToExpire = 16;
        setCookies(daysToExpire);
        setCookies(daysToExpire, 'favorites=[]');

        fillTextContentTabsNav();
        filltextContentFooter();

        animar('#formInicio', 'fadeOut', 'stylenone');
        document.getElementById('divMain').style.display = 'flex';

    }
    
}


function validateFormWithKeyEnter(event) {

    if (event.keyCode == 13) {
        validateForm();
    }

}


function backToTop() {

    window.scrollTo(0, 0);

}


// Cookies
function setCookies(expireDays, cookie) {

    let date = new Date();
    date.setDate(date.getDate() + expireDays);
    let expires = 'expires=' + date.toUTCString();
    console.log(expires);

    if (cookie) {

        document.cookie = `${ cookie };${ expires };path=/`;

    } else {

        let inputNombre = 'nombre=' + document.getElementById('inputNombre').value;
        let inputEdad = 'age=' + document.getElementById('inputEdad').value;
        let inputCorreo = 'email=' + document.getElementById('inputCorreo').value;
        
        document.cookie = `${ inputNombre };${ expires };path=/`;
        document.cookie = `${ inputEdad };${ expires };path=/`;
        document.cookie = `${ inputCorreo };${ expires };path=/`;
        setCookieRestartCookies(expireDays, 'no');

    }

}


function setCookieRestartCookies(expireDays, siono) {

    let date = new Date();
    date.setDate(date.getDate() + expireDays);
    let expires = 'expires=' + date.toUTCString();

    document.cookie = `restartcookies=${ siono };${ expires };path=/`;

}


function getCookie(cname) {

    let name = cname + '=';
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');

    for(let i = 0; i <ca.length; i++) {

        let c = ca[i];

        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }

        if (c.indexOf(name) == 0) {

        return c.substring(name.length, c.length);

        }

    }

    return '';
}


// function deleteCookies() {

//     let expires = 'expires=Thu, 01 Jan 1970 00:00:00 UTC;'
//     document.cookie = 'nombre=' + ';' + expires + 'domain=dawalberto.github.io;' + 'path=/';
//     document.cookie = 'age=' + ';' + expires + 'domain=dawalberto.github.io;' + 'path=/';
//     document.cookie = 'email=' + ';' + expires + 'domain=dawalberto.github.io;' + 'path=/';
//     document.cookie = 'favorites=' + ';' + expires + 'domain=dawalberto.github.io;' + 'path=/';
    
// }


// Evento de raton usado para agrandar o disminuir la barra de progreso según nuestra navegación por la página.
let barProgress = document.getElementById('progress');
window.addEventListener('scroll', () => {

    let max = document.body.scrollHeight - innerHeight;
    barProgress.style.width = `${(pageYOffset / max) * 100}%`;

    showAndHiddenElements();

});


function showAndHiddenElements() {

    let nav = document.getElementById('nav');
    let navtabContent = document.getElementById('nav-tabContent'); 
    let spanDivBackToTop = document.getElementById('spanDivBackToTop');
    let footer = document.getElementById('footer');

    if (pageYOffset < 100) {

        spanDivBackToTop.style.visibility = 'hidden';
        nav.style.display = 'block';
        navtabContent.style.display = 'block';

    } else {

        spanDivBackToTop.style.visibility = 'visible';
        nav.style.display = 'none';
        navtabContent.style.display = 'none';

    }

};


// A partir de esta linea empiezan las funciones para añadir y eliminar marias a favoritos usando las cookies para ello.
function addEvents() {

    let classname = document.getElementsByClassName("card");

    Array.from(classname).forEach(function(element) {

        element.addEventListener('dblclick',  addAndremoveFavorite);

    });

}


function addAndremoveFavorite() {

    let id = this.childNodes[0].childNodes[0].id;
    let h3icon = document.getElementById(id);

    if (h3icon.style.color === 'green') {

        // REMOVE FAVORITE
        h3icon.style.color = 'gray';
        addAndremoveFavoritesCookies(id);

    } else {

        // ADD FAVORITE
        h3icon.style.color = 'green';
        animar(`#${id}`, 'heartBeat');
        addAndremoveFavoritesCookies(id, 'add');

    }

    console.log(arrayFavoritesCookies);

}


function addAndremoveFavoritesCookies(id, add) {

    if (add) {

        arrayFavoritesCookies.push(id);

    } else {

        let pos = arrayFavoritesCookies.indexOf(id);
        arrayFavoritesCookies.splice(pos, 1);

    }

    let arrayStringify = JSON.stringify(arrayFavoritesCookies);
    let cookie = 'favorites=' + arrayStringify;
    setCookies(16, cookie);

    console.log('document.cookie', document.cookie)
}


function getFavorites() {

    let cokkiesFav = getCookie('favorites');
    console.log('cokkiesFav', cokkiesFav);

    let favorites = JSON.parse(cokkiesFav);
    arrayFavoritesCookies = favorites;
    console.log('arrayFavoritesCookies', arrayFavoritesCookies);

}
// Aquí terminan las funciones para añadir y eliminar marias a favoritos usando las cookies


function animar(elem, effect, stylenone) {
            
    const element =  document.querySelector(elem);
    element.classList.add('animated', effect);
    element.addEventListener('animationend', function() { 

        element.classList.remove('animated', effect);

        if (stylenone) {
            element.style.display = 'none';
        }

    });
    
}


function fillTextContentTabsNav() {

    let user = getCookie('nombre');
    let date = new Date();
    let hour = date.getHours();
    let welcome;

    if (hour >= 0 && hour <= 14) {
        welcome = 'Good morning';
    } else if (hour >= 15 && hour <= 20) {
        welcome = 'Good afternoon';
    } else {
        welcome = 'Good evening';
    }

    let message = `<p><strong>${ welcome } ${ user }!</strong></p>
        <p>In this page you can search for type of marijuana selecting the effect and flavor that you want</p>
        <p>Don't worry if you don't know what is Sativa, Indica or Hibryd. This page is oriented to people that never smoke weed and don't know nathing about the world of the marijuana</p>
        <p>In the tab 'RACES' you can find the explanation of the marijuana types if you want know</p>
        <p>Fine, the functioning is simple</p> 
        <p>1. Select the effect and flawor that you want and check the races that you want</p>
        <p>2. Then click the button 'SEARCH'</p> 
        <p>3. Wow! now you can see all weed with the effect and flawor that you have chosen</p>
        <p>4. And finally you can add weed to favorites by double clicking</p>`;

    document.getElementById('nav-howitworks').innerHTML = message;

    document.getElementById('nav-user').innerHTML = `If you are not ${ user }, click <a style="color: rgb(30, 197, 0); cursor: pointer;" onclick="signOut()">here</a>`;
    document.getElementById('nav-user-tab').textContent = user.toUpperCase();


}


function filltextContentFooter() {

    let date = new Date();
    date = date.getFullYear();

    let textcontent = `© ${ date } Alberto García Sola, hosted with <span class="text-danger">❤</span> by GitHub`;

    document.getElementById('textContentFooter').innerHTML = textcontent;

}


function showAndHiddenTab(idTab, idContentTab, url) {

    location.href = url;

    let clasesTab = document.getElementById(idTab).className;
    let clasesTabContent = document.getElementById(idContentTab).className;

    clasesTab = clasesTab.split(' ');
    clasesTabContent = clasesTabContent.split(' ');


    if (clasesTab.filter(elem => ['active', 'show'].includes(elem)).length === 2 && clasesTabContent.filter(elem => ['active', 'show'].includes(elem)).length === 2) {

        setTimeout( () => {

            document.getElementById(idTab).classList.remove('active');
            document.getElementById(idTab).classList.remove('show');
            document.getElementById(idContentTab).classList.remove('active');
            document.getElementById(idContentTab).classList.remove('show');

        }, 100);

    }

}


function signOut() {

    document.getElementById('inputNombre').value = '';
    document.getElementById('inputEdad').value = '';
    document.getElementById('inputCorreo').value = '';

    setCookieRestartCookies(16, 'si',);
    location.reload();

}


function generateArrayFavs() {

    let arrayIdFavorites = new Array();
    let arrayFavorites = new Array();
    let id = '';

    for (let i = 0; i < arrayFavoritesCookies.length; i++) {

        id = '';

        for (let j = 0; j < arrayFavoritesCookies[i].length; j++) {

            if ( !isNaN(arrayFavoritesCookies[i][j]) )
                id += arrayFavoritesCookies[i][j];

        }

        arrayIdFavorites.push(id)

    }


    for (let i = 0; i < arrayMarias.length; i++) {

        if ( arrayIdFavorites.includes( String(arrayMarias[i].id)) )
            arrayFavorites.push(arrayMarias[i]);

    }

    return arrayFavorites;
        
}


function addEventToShowFavorites() {

    window.addEventListener('keydown', function(event) {

        if (event.ctrlKey && (event.code === 'Keyl' || event.code === 'KeyL')) {

            console.log('Control + l')
            event.preventDefault();

            if (arrayFavoritesCookies.length > 0) {

                document.getElementById('containerRes').style.display = 'block';
                document.getElementById('footer').style.display = 'block';
                generateCardsMarias('toFavorites');
                window.scrollTo(0, window.innerHeight);

            } else {

                barProgress.style.width = '0';
                document.getElementById('containerRes').style.display = 'none';
                document.getElementById('footer').style.display = 'none';
                alert("YOU DON'T HAVE WEED FAVORITES");

            }

        }

    });

}