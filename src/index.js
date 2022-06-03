// import { revFormat } from 'flatpickr/dist/utils/formatting';
import debounce from 'lodash.debounce';
import {Notify} from 'notiflix';
import './css/styles.css';
const DEBOUNCE_DELAY = 300;
const KEY_URL = 'https://restcountries.com/v3.1'
const refs = {
    inputCountry: document.querySelector("#search-box"),
    countyList: document.querySelector(".country-list"),
    countryInfo: document.querySelector(".country-info"),
}

// console.log("done");

refs.inputCountry.addEventListener('input', debounce(fetchCountries, DEBOUNCE_DELAY));

function fetchCountries(e) {
    const country = refs.inputCountry.value.trim();
    console.log(country);
    clearMarkup();
    if (!country) {
        return;
    }
    fetch(`${KEY_URL}/name/${country}?fields=name,capital,population,flags,languages`)
        .then((response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        })).then(data => {
            console.log("done");
            if (data.length > 10) {
                Notify.info('Too many matches found. Please enter a more specific name.');
            } else if (data.length > 1 && data.length < 10) {
                makeMarkupforCounties(data);
            } else if (data.length === 1) {
                makeMarkupInfo(data);
            }
        }).catch(error => Notify.failure("Oops, there is no country with that name"));
}

function makeMarkupforCounties(countries) {
    const countriesMarkup = countries.map(({flags, name}) => {
        return `<li>
                    <img src="${flags.svg}" width="60" alt="${name.official}">
                    <p>${name.official}</p> 
                </li>`
    }).join("");
    console.log(countriesMarkup);
    refs.countyList.insertAdjacentHTML("afterbegin", countriesMarkup);
}

function makeMarkupInfo(country) {
    const countryMarkup = country.map(({flags, name, capital, population, languages}) => {
        return `<img src="${flags.svg}" width="60" alt="${name.official}">${name.official}
                    <p>Столиця: ${capital}</p>
                    <p>Населення: ${population}</p>
                    <p>Мови: ${Object.values(languages)}</p>`
        }).join("");
    console.log(countryMarkup);
    refs.countryInfo.insertAdjacentHTML("afterbegin", countryMarkup);
}

function clearMarkup() {
    refs.countyList.innerHTML = '';
    refs.countryInfo.innerHTML = '';

} 