import fetchCountries from './js/fetchCountries.js';
import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const searchBoxRef = document.querySelector('input#search-box');
const countryListRef = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');

function createList(data) {
  const markup = data
    .map(
      ({ name, flags }) =>
        `<div><img src=${flags.svg} alt="Flag of ${name}" width="30"> <span>${name}</span></div>`
    )
    .join(' ');
  countryListRef.innerHTML = markup;
}
function createCountryList(data) {
  const { name, capital, population, flags, languages } = data[0];
  const markup = `<div><img src="${
    flags.svg
  }" alt="flag of ${name}" width="50" /><span class="country-name">${name}</span></div>
  <div><span class="title">Capital: </span><span class="title-value">${capital}</span></div>
  <div><span class="title">Population: </span><span class="title-value">${population}</span></div>
  <div><span class="title">Languages: </span><span class="title-value">${languages.map(
    lang => lang.name
  )}</span</div>`;

  countryListRef.innerHTML = markup;
}

searchBoxRef.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(e) {
  const value = e.target.value.trim();
  if (!value) {
    countryListRef.innerHTML = ' ';
    return;
  }
  fetchCountries(value)
    .then(data => {
      console.log(data);
      if (data.length > 10) {
        countryListRef.innerHTML = ' ';
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length < 11 && data.length > 1) {
        createCountryList(data);
      } else {
        createCountry(data);
      }
    })
    .catch(error => console.log(error));
}
