import './style.css';

import { Pokedex as pokedex } from './pokedex';

const cardColors = {
    'S': 'card-s',
    'A': 'card-a',
    'B': 'card-b',
    'C': 'card-c',
    'D': 'card-d',
};

const stampColors = {
    'S': 'stamp-s',
    'A': 'stamp-a',
    'B': 'stamp-b',
    'C': 'stamp-c',
    'D': 'stamp-d',
};

const pokemonSlugs = shuffleArray(Object.keys(pokedex));
const standardPokedex = pokemonSlugs.reduce((acc, pokemon) => {
    if (!pokedex[pokemon].forme && pokedex[pokemon].name.indexOf(' ') === -1 && pokedex[pokemon].num > 0) {
        acc[pokedex[pokemon].name.toLowerCase()] = pokedex[pokemon];
    }

    return acc;
}, {} as { [id: string]: SpeciesData });

function shuffleArray<T>(array: Array<T>): Array<T> {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}

function toGradeLetter(grade: number): "S" | "A" | "B" | "C" | "D" {
    if (grade >= 520) {
        return 'S';
    } else if (grade >= 495) {
        return 'A';
    } else if (grade >= 445) {
        return 'B';
    } else if (grade >= 390) {
        return 'C';
    } else {
        return 'D';
    }
}

function gradeSpecies(name: string): number {
    let species = standardPokedex[name];
    if (!species) {
        return 0;
    }

    if (species.evos) {
        let evos = species.evos;
        return evos.reduce((acc, evo) => {
            return Math.max(acc, gradeSpecies(evo.toLowerCase()));
        }, 0);
    } else {
        return gradePokemon(name);
    }
}

function gradePokemon(name: string): number {
    let validStats: Array<keyof Stats> = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
    let sumOfStats = validStats.reduce((acc, stat) => {
        return acc + standardPokedex[name].baseStats[stat];
    }, 0);

    return sumOfStats;
}

document.addEventListener('DOMContentLoaded', () => {
    // Insert the standard Pokedex into the DOM
    const container = document.getElementById('list');
    const dataList = document.getElementById('pokemon-data-list');

    for (const key of Object.keys(standardPokedex)) {

        // Construct the data-list item
        let listItem = document.createElement('option') as HTMLOptionElement;
        listItem.value = standardPokedex[key].name;
        listItem.textContent = `#${standardPokedex[key].num}`;
        dataList.appendChild(listItem);

        // Construct the card

        let pokemon = standardPokedex[key];
        let domNode = (document.getElementById("template-pokemon-item") as HTMLTemplateElement).content.cloneNode(true) as HTMLElement;

        let nameNode = domNode.querySelector("[data-tag-name]") as HTMLHeadingElement;
        nameNode.innerText = pokemon.name;

        let noNode = domNode.querySelector("[data-tag-no]") as HTMLAnchorElement;
        noNode.innerText = '#' + `${pokemon.num}`.padStart(3, '0');
        noNode.href = `https://www.serebii.net/pokedex-swsh/${key}/`

        let imgNode = domNode.querySelector("[data-tag-image]") as HTMLImageElement;
        let imgSource = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.num}.png`;
        imgNode.src = imgSource;
        imgNode.alt = pokemon.name;

        let gradeLetter = toGradeLetter(gradeSpecies(pokemon.name.toLowerCase()));

        let gradeNode = domNode.querySelector("[data-tag-grade]") as HTMLSpanElement;
        gradeNode.innerText = gradeLetter;

        let gradeStamp = domNode.querySelector("[data-tag-stamp]") as HTMLDivElement;
        gradeStamp.classList.add(stampColors[gradeLetter]);

        let cardNode = domNode.querySelector("[data-tag-card]") as HTMLDivElement;
        cardNode.classList.add(cardColors[gradeLetter]);
        cardNode.id = `${pokemon.name}`;

        container.appendChild(domNode);
    }

    let searchInput = document.getElementById('pokemon-search') as HTMLInputElement;
    searchInput.addEventListener('change', (event) => {
        let value = (event.target as HTMLInputElement).value;
        let species = standardPokedex[value.toLowerCase()];
        if (species) {
            let element = document.getElementById(species.name);
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            element.classList.add('animate-pulse');
            setTimeout(() => {
                element.classList.remove('animate-pulse');
            }, 3600);
        }
    });
});
