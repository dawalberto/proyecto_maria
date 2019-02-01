let marias;
let arrayMarias = new Array();
let arrayEffectsAll = new Array();
let arrayFlavorsAll = new Array();
let arrayMariasSearch = new Array();


let barProgress = document.getElementById('progress');
window.addEventListener("scroll", () => {

    let max = document.body.scrollHeight - innerHeight;
    barProgress.style.width = `${(pageYOffset / max) * 100}%`;

    showAndHiddenBackToTop();

});


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

        document.getElementById('loader').style.display = 'none';
        document.getElementById('buttonSearch').disabled = true;

        generateDescMarias();

        effectsAll();
        flavorsAll();

        fillSelects();

    });


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
        window.scrollTo(0, window.innerHeight);

    } else {

        document.getElementById('containerRes').style.display = 'none';
        alert('NO STRAIN FOUND');

    }

}


function generateDescMarias() {

    let lengtharrayMarias = arrayMarias.length;

    for (let i = 0; i < lengtharrayMarias; i++) {

        let id = arrayMarias[i].id;
        let url = 'https://strainapi.evanbusse.com/OQSVRIt/strains/data/desc/' + id;

        fetch(url)
            .then(response => response.json())
            .then(json => {

                arrayMarias[i].description = json.desc;

                document.getElementById('buttonSearch').textContent = 'GETTING STRAINS ' + i + '/' + lengtharrayMarias;

                if (i >= lengtharrayMarias - 5) {

                    document.getElementById('buttonSearch').disabled = false;
                    document.getElementById('buttonSearch').innerHTML = 'SEARCH <span class="fas fa-search"></span>';
                
                }

            })

    }

}


function generateCardsMarias() {

    document.getElementById('rowRes').textContent = '';

    let selectEfecto = document.getElementById('selectEfecto').value;

    for (let i = 0; i < arrayMariasSearch.length; i++) {

        let title = arrayMariasSearch[i].nom.toUpperCase();
        let race = arrayMariasSearch[i].race.toUpperCase();
        let desc;
        let effect;

        if (arrayMariasSearch[i].description != null) {

            desc = arrayMariasSearch[i].description;

        } else {

            desc = 'WITHOUT DESCRIPTION'

        }

        if (arrayMariasSearch[i].effectsM.includes(selectEfecto)) {

            effect = 'EFFECT - MEDICAL';

        } else if (arrayMariasSearch[i].effectsP.includes(selectEfecto)) {

            effect = 'EFFECT - POSITIVE';

        } else {

            effect = 'EFFECT - NEGATIVE';
        }


        let col = document.createElement('div');
        col.classList.add('col-md-6');
        col.classList.add('col-lg-4');
        col.classList.add('my-2');

        let card = document.createElement('div');
        card.classList.add('card');
        card.classList.add('h-100');

        let cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        let h5title = document.createElement('h5');
        h5title.classList.add('card-title');
        h5title.textContent = title;

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
        pdescription.textContent = desc;

        cardBody.appendChild(h5title);
        cardBody.appendChild(h6race);
        cardBody.appendChild(h6effect);
        cardBody.appendChild(pdescription);

        card.appendChild(cardBody);
        col.appendChild(card);

        document.getElementById('rowRes').appendChild(col);

    }

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

            spanNombre.textContent = 'THIS FIELD IS REQUIRED';
            spanNombre.style.visibility = 'visible';
            error = true;

        } else {

            if (regExpNom.test(inputNombre)) {

                spanNombre.style.visibility = 'hidden';
                error = false;

            } else {

                spanNombre.textContent = 'THIS FIELD ONLY ALLOWS LETTERS';
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

            spanEdad.textContent = 'THIS FIELD IS REQUIRED';
            spanEdad.style.visibility = 'visible';
            error = true;

        } else {

            if (regExpEdad.test(inputEdad)) {

                if (Number(inputEdad) >= 18) {

                    spanEdad.style.visibility = 'hidden';
                    error = false;

                } else {

                    spanEdad.textContent = 'SORRY THIS PAGE IS ONLY FOR ADULTS';
                    spanEdad.style.visibility = 'visible';
                    error = true;

                }
                
            } else {

                spanEdad.textContent = 'THIS FIELD ONLY ALLOWS NUMBERS';
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

            spanCorreo.textContent = 'THIS FIELD IS REQUIRED';
            spanCorreo.style.visibility = 'visible';
            error = true;

        } else {

            if (regExpEmail.test(inputCorreo)) {

                spanCorreo.style.visibility = 'hidden';
                error = false;

            } else {

                spanCorreo.textContent = 'NOT VALID EMAIL';
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

        setCookies(16);
        document.getElementById('formInicio').style.display = 'none';
        document.getElementById('divMain').style.display = 'flex';

    }
    
}


function backToTop() {

    window.scrollTo(0, 0);

}


function showAndHiddenBackToTop() {

    let spanDivBackToTop = document.getElementById('spanDivBackToTop');

    if (pageYOffset < 100) {
        spanDivBackToTop.style.visibility = 'hidden';
    } else {
        spanDivBackToTop.style.visibility = 'visible';
    }

};


function setCookies(expireDays) {

    let inputNombre = 'nombre=' + document.getElementById('inputNombre').value;
    let inputEdad = 'age=' + document.getElementById('inputEdad').value;
    let inputCorreo = 'email=' + document.getElementById('inputCorreo').value;

    let date = new Date();
    date.setDate(date.getDate() + expireDays);
    let expires = 'expires=' + date.toUTCString();

    document.cookie = `${ inputNombre };${ expires };path=/`;
    document.cookie = `${ inputEdad };${ expires };path=/`;
    document.cookie = `${ inputCorreo };${ expires };path=/`;

}