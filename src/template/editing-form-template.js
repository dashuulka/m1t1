import { POINT_TYPE, /* OFFERS, */ ButtonLabels, EditingType } from '../const';
import { formatFullDate } from '../utils/day';
//import { getRandomValue } from '../utils/common';
import he from 'he';

function createPointType(pointId, currentType, isDisabled) {
  return POINT_TYPE.map((type) =>
    `<div class="event__type-item">
      <input id="event-type-${type.toLowerCase()}-${pointId}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.toLowerCase()}"${currentType === type ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
      <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-${pointId}" ${currentType === type ? 'checked' : ''}>${type}</label>
    </div>`).join('');
}

function createPointOffer(offers, point, isDisabled) {
  return offers.map((offer) => `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" data-offer-id="${offer.id}"
        id="event-offer-${offer.id}-1" type="checkbox" name="event-offer-${offer.id}" ${point.offers.includes(offer.id) ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
        <label class="event__offer-label" for="event-offer-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
       </label>
    </div>`).join('');
}

function createPointPictures(destination) {
  return (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${destination.pictures.map((picture) =>
      `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')}
      </div>
    </div>`
  );
}

function createDestination( destination ) {
  return destination.descriptions.length && destination.pictures.length ? `<section class="event__section  event__section--destination" >
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    ${destination.description.length ? `<p class="event__destination-description">${destination.description}</p>` : ''}
    ${destination.pictures.length ? createPointPictures(destination) : ''}
  </section>` : '';
}

function createPointDestinations(destinations) {
  return ( `${destinations.map((destination) => `<option value="${destination.name}"></option>`).join('')} `);
}

function createSaveButtonTemplate({ isSaving, isDisabled }) {
  const label = isSaving ? ButtonLabels.SAVE_IN_PROGRESS : ButtonLabels.SAVE_DEFAULT;
  return `<button class="event__save-btn  btn  btn--blue" type="submit"
    ${isDisabled ? 'disabled' : ''}>${label}</button>`;
}

function createResetButtonTemplate({ type, isDisabled, isDeleting }) {
  let label;

  if (type === EditingType.NEW) {
    label = ButtonLabels.CANCEL;
  } else {
    label = isDeleting ? ButtonLabels.DELETE_IN_PROGRESS : ButtonLabels.DELETE_DEFAULT;
  }
  return `<button class="event__reset-btn" type="reset"
    ${isDisabled ? 'disabled' : ''}>${label}</button>`;
}

function createRollupButton(isDisabled) {
  return `
    <button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>
      <span class="visually-hidden">Open event</span>
    </button>`;
}

function createControlsButtonsTemplate({ type, isSaving, isDeleting, isDisabled }) {
  return `${createResetButtonTemplate(type)}
         ${type === EditingType.UPDATE ? createRollupButton() : ''}
        ${createSaveButtonTemplate({ isSaving, isDisabled })}
        ${createResetButtonTemplate({ type, isDeleting, isDisabled })}
        ${type === EditingType.UPDATE ? createRollupButton(isDisabled) : ''}`;
}

function createEditPointTemplate({state, pointDestinations, /* pointOffers */}) {
  const { point, isDisabled, isSaving, isDeleting } = state;
  const { id, price, dateFrom, dateTo, offers, type } = point;
  const currentDestination = pointDestinations.find((destination) => destination.id === point.destinations);
  //const currentOffers = pointOffers.find((offer) => offer.type === type);
  const destinationName = (currentDestination) ? currentDestination.name : '';

  return (`
  <li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">
          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${createPointType(id, type, isDisabled)}
            </fieldset>
          </div>
        </div>
        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${id}">
            ${type[0].toUpperCase() + type.slice(1)}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${he.encode(destinationName)}" list="destination-list-${id}" ${isDisabled ? 'disabled' : ''}>
          <datalist id="destination-list-${id}"/>
            ${createPointDestinations(pointDestinations)}
          </datalist>
        </div>
        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${id}">From</label>
          <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" ${point.dateFrom ? formatFullDate(dateFrom) : ''} ${isDisabled ? 'disabled' : ''}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-${id}">To</label>
          <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" ${point.dateTo ? formatFullDate(dateTo) : ''} ${isDisabled ? 'disabled' : ''}>
        </div>
        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${id}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${id}" type="number" name="event-price" value="${he.encode(String(price))}" ${isDisabled ? 'disabled' : ''}>
        </div>
        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : '' }>${isSaving ? ButtonLabels.LOAD_SAVE : ButtonLabels.SAVE}</button>
        ${createControlsButtonsTemplate({ type, isSaving, isDeleting, isDisabled })}
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          ${createPointOffer(offers, point, isDisabled)}
        </section>
        ${currentDestination ? `<section class="event__section  event__section--destination">
          ${createDestination(currentDestination)}
        </section>` : ''}
      </section>
    </form>
  </li>`);
}

export {createEditPointTemplate};
