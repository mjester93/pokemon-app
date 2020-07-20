const BASE_URL = "http://localhost:3000";
const TRAINERS_URL = `${BASE_URL}/trainers`;
const POKEMONS_URL = `${BASE_URL}/pokemons`;

document.addEventListener('DOMContentLoaded', () => {

    const getTrainersAPI = () => {
        fetch(TRAINERS_URL)
        .then(response => response.json())
        .then(trainers => renderTrainers(trainers))
    }

    const renderTrainers = (trainers) => {
        trainers.forEach(trainer => renderTrainer(trainer));
    }

    const renderTrainer = (trainer) => {
        const main = document.querySelector('#main');

        let div = document.createElement('div');
        div.classList += 'card';
        div.dataset.id = trainer.id;
        main.appendChild(div);

        let p = document.createElement('p');
        p.innerText = trainer.name;
        div.appendChild(p);

        let addPokemonButton = document.createElement('button');
        addPokemonButton.classList += "add"
        addPokemonButton.dataset.trainerId = trainer.id;
        addPokemonButton.innerText = 'Add Pokemon';
        div.appendChild(addPokemonButton);
        
        let ul = document.createElement('ul');
        ul.classList += "pokemon-list"
        div.appendChild(ul);

        trainer.pokemons.forEach(pokemon => addPokemonToList(pokemon, ul))
    }

    const addPokemonToList = (pokemon, ul) => {

        let li = document.createElement('li');
        li.dataset.pokemonId = pokemon.id;

        li.innerHTML = `${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id=${pokemon.id}>Release</button>`;
        ul.appendChild(li);
    }

    const generateNewPokmeon = (trainerId, ul) => {
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                trainer_id: trainerId
            })
        }

        fetch(POKEMONS_URL, options)
        .then(response => response.json())
        .then(pokemon => addPokemonToList(pokemon, ul))
        .catch(console.log)
    }

    const fetchDelete = (pokemonId, li) => {
        const options = {
            method: 'DELETE'
        }
        fetch(`${POKEMONS_URL}/${pokemonId}`, options)
        .then(response => response.json())
        .then(li.remove())
    }

    document.addEventListener('click', (e) => {
        if (e.target.className === 'add') {
            let trainerId = e.target.dataset.trainerId;
            let ul = e.target.parentNode.querySelector('ul');
            if (ul.querySelectorAll("li").length < 6) {
                generateNewPokmeon(trainerId, ul);
            }
        } else if (e.target.className === 'release') {
            let pokemonId = e.target.dataset.pokemonId;
            let li = e.target.parentNode;
            fetchDelete(pokemonId, li);
        }
    })

    getTrainersAPI();
})