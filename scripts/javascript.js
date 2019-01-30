var marias;
var arrayMarias = new Array();
var arrayEffectsAll = new Array();
var arrayFlavorsAll = new Array();
var arrayMariasSearch = new Array();


let barProgress = document.getElementById('progress');
window.addEventListener("scroll", () => {
    let max = document.body.scrollHeight - innerHeight;
    barProgress.style.width = `${(pageYOffset / max) * 100}%`;
});

(function() {
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

            document.getElementById('loader').style.display = 'none';
            document.getElementById('buttonSearch').disabled = true;

            generateDescMarias();

            effectsAll();
            flavorsAll();

            fillSelects();
        });
})();

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

    var checkSativa = document.getElementById('checkSativa').checked;
    var checkIndica = document.getElementById('checkIndica').checked;
    var checkHybrid = document.getElementById('checkHybrid').checked;

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
    } else
        alert('NO STRAIN FOUND');
}

function generateDescMarias() {
    var lengtharrayMarias = arrayMarias.length;

    for (let i = 0; i < lengtharrayMarias; i++) {
        var id = arrayMarias[i].id;
        var url = 'https://strainapi.evanbusse.com/OQSVRIt/strains/data/desc/' + id;

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

    var selectEfecto = document.getElementById('selectEfecto').value;

    for (let i = 0; i < arrayMariasSearch.length; i++) {
        var title = arrayMariasSearch[i].nom.toUpperCase();
        var race = arrayMariasSearch[i].race.toUpperCase();
        var desc;
        var effect;

        if (arrayMariasSearch[i].description != null)
            desc = arrayMariasSearch[i].description;
        else
            desc = 'WITHOUT DESCRIPTION'

        if (arrayMariasSearch[i].effectsM.includes(selectEfecto))
            effect = 'EFFECT - MEDICAL';
        else if (arrayMariasSearch[i].effectsP.includes(selectEfecto))
            effect = 'EFFECT - POSITIVE';
        else
            effect = 'EFFECT - NEGATIVE';


        var col = document.createElement('div');
        col.classList.add('col-md-6');
        col.classList.add('col-lg-4');
        col.classList.add('my-2');

        var card = document.createElement('div');
        card.classList.add('card');
        card.classList.add('h-100');

        var cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        var h5title = document.createElement('h5');
        h5title.classList.add('card-title');
        h5title.textContent = title;

        var h6race = document.createElement('h6');
        h6race.classList.add('card-subtitle');
        h6race.classList.add('mb-2');
        h6race.classList.add('text-muted');
        h6race.textContent = race;

        var h6effect = document.createElement('h6');
        h6effect.classList.add('card-subtitle');
        h6effect.classList.add('mb-2');
        h6effect.classList.add('text-muted');
        h6effect.textContent = effect;

        var p = document.createElement('p');
        p.classList.add('card-text');
        p.textContent = desc;

        cardBody.appendChild(h5title);
        cardBody.appendChild(h6race);
        cardBody.appendChild(h6effect);
        cardBody.appendChild(p);

        card.appendChild(cardBody);
        col.appendChild(card);

        document.getElementById('rowRes').appendChild(col);
    }
}

function validateForm() {
    document.getElementById('formInicio').style.display = 'none';
    document.getElementById('divMain').style.display = 'flex';
}