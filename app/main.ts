import { Observable } from 'rxjs';

const log = (value) => {
  console.log(value);
  return value;
};

const apiKey = 'fc67721c305c84f50f7c6646c9b8d9d0';
const apiUrl = `http://gateway.marvel.com/v1/public/comics?apikey=${apiKey}`;

const request$ = Observable.of(apiUrl);

const response$ =
  request$
    .flatMap(() => Observable.fromPromise(fetch(apiUrl)))
    .flatMap((response) => Observable.fromPromise(response.json()));

response$.subscribe((response) => console.log(response));
