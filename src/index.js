// import { revFormat } from 'flatpickr/dist/utils/formatting';
import debounce from 'lodash.debounce';
import {Notify} from 'notiflix';
import './css/styles.css';
const DEBOUNCE_DELAY = 300;
const KEY_URL = 'https://restcountries.com/v3.1'
const refs = {
    inputCountry: document.querySelector("#search-box"),
    countyList: document.querySelector(".country-list"),
}

console.log("done");

refs.inputCountry.addEventListener('input', debounce(fetchCountries, DEBOUNCE_DELAY));

function fetchCountries(e) {
    console.log(refs.inputCountry.value);
    fetch(`${KEY_URL}/name/${refs.inputCountry.value}?fields=name,capital,population,flags,languages`)
        .then(r => r.json())
        .then(response => {
            console.log("done");
            if (response.length > 10) {
                Notify.info('Too many matches found. Please enter a more specific name.');
            } else if (response.length > 1 && response.length < 10) {
                makeMarkupforCounties(response);
            }
        }).catch(error => console.log(error));
}

function makeMarkupforCounties(countries) {
    countiesMarkup = countries.map(({flags, name}) => {
        return `<li>
                    <img src="${flags.svg}" width="60" alt="${name.official}">
                    <p>${name.official}</p> 
                </li>`
    }).join("");
    console.log(countiesMarkup);
    refs.countyList.insertAdjacentHTML("afterbegin", countiesMarkup);
}