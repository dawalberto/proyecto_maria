var marias;
var arrayMarias = new Array();
var arrayEffectsAll = new Array();
var arrayFlavorsAll = new Array();
var arrayMariasSearch = new Array();


function getAPIandFillMarias() {
    fetch('https://strainapi.evanbusse.com/OQSVRIt/strains/search/all')
        .then(response => response.json())
        .then(json => {
            marias = json;

            for (let maria in marias) {
                var id = marias[maria].id;
                var nom = maria;
                var race = marias[maria].race;
                var flavors = marias[maria].flavors;
                var effects = marias[maria].effects;

                var strain = new Maria(id, nom, race, flavors, effects);
                arrayMarias.push(strain);
            }

            generateDescMarias();

            effectsAll();
            flavorsAll();
            
            fillSelects();
        });
}

function Maria (id, nom, race, flavors, effects, desc) {
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
            if (!arrayEffectsAll.includes(effect))
                arrayEffectsAll.push(effect);
        })
    })
}

function flavorsAll() {
    arrayMarias.forEach(maria => {
        maria.flavors.forEach(flavor => {
            if (!arrayFlavorsAll.includes(flavor))
                arrayFlavorsAll.push(flavor);
        })
    })
}

function fillSelects() {
    var selectEfecto = document.getElementById('selectEfecto');
    var selectSabor = document.getElementById('selectSabor');

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
    var selectEfecto = document.getElementById('selectEfecto').value;
    var selectSabor = document.getElementById('selectSabor').value; 

    arrayMariasSearch = [];

    for (let i = 0; i < arrayMarias.length; i++) {
        if (arrayMarias[i].flavors.indexOf(selectSabor) >= 0 && arrayMarias[i].effectsSum.indexOf(selectEfecto) >= 0)
            arrayMariasSearch.push(arrayMarias[i]);
    }
}

function clickButtonSearch() {
    var selectEfecto = document.getElementById('selectEfecto').value;
    var selectSabor = document.getElementById('selectSabor').value; 

    if (selectEfecto == null || selectSabor == null)
        alert('SELECT ONE FLAVOR AND ONE EFFECT PLEASE');
    else {
        searchMarias();
        generateCardsMarias();
    }
}

/*function generateDescMarias() {
    var xhr = [], i;
    for(i = 0; i < arrayMarias.length; i++){
        (function(i){
            xhr[i] = new XMLHttpRequest();
            url = 'https://strainapi.evanbusse.com/OQSVRIt/strains/data/desc/' + arrayMarias[i].id;
            xhr[i].open("GET", url, true);
            xhr[i].onreadystatechange = function(){
                if (xhr[i].readyState === 4 && xhr[i].status === 200){
                    var descMaria = JSON.parse(xhr[i].response);
                    arrayMarias[i].description = descMaria.desc;
                }
            };
            xhr[i].send();
        })(i);
    }
}*/

function generateDescMarias() {
    for (let i = 0; i < arrayMarias.length; i++) {
        var id = arrayMarias[i].id;
        var url = 'https://strainapi.evanbusse.com/OQSVRIt/strains/data/desc/' + id;
        
        fetch(url)
        .then(response => response.json())
        .then(json => {
            //console.log(json.desc)
            arrayMarias[i].description = json.desc;
        })
    }
}

function generateCardsMarias() {
    console.log('generateCardsMarias function', arrayMariasSearch);
    document.getElementById('rowRes').textContent = '';

    for(let i = 0; i < arrayMariasSearch.length; i++) {
        var title = arrayMariasSearch[i].nom.toUpperCase();
        var race = arrayMariasSearch[i].race.toUpperCase();
        var desc = arrayMariasSearch[i].description;
        

        var col = document.createElement('div');
        col.classList.add('col-md-6');
        col.classList.add('col-lg-4');
        col.classList.add('my-2');
        
        var card = document.createElement('div');
        card.classList.add('card');
        card.classList.add('h-100');

        var cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        var h5 = document.createElement('h5');
        h5.classList.add('card-title');
        h5.textContent = title;

        var h6 = document.createElement('h6');
        h6.classList.add('card-subtitle');
        h6.classList.add('mb-2');
        h6.classList.add('text-muted');
        h6.textContent = race;

        var p = document.createElement('p');
        p.classList.add('card-text');
        p.textContent = desc;

        cardBody.appendChild(h5);
        cardBody.appendChild(h6);
        cardBody.appendChild(p);

        card.appendChild(cardBody);
        col.appendChild(card);

        document.getElementById('rowRes').appendChild(col);
    }
}