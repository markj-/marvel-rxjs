import { Observable } from 'rxjs';
import { prop, filter, compose, gt } from 'ramda';

const log = (value) => {
  console.log(value);
  return value;
};

const getResults = prop('results');
const getData = prop('data');
const getPageCount = prop('pageCount');
const lt100 = gt(100);

const apiKey = 'fc67721c305c84f50f7c6646c9b8d9d0';
const apiUrl = `http://gateway.marvel.com/v1/public/comics?apikey=${apiKey}`;

const request$ = Observable.of(apiUrl);

const response$ =
  request$
    .flatMap(() => Observable.fromPromise(fetch(apiUrl)))
    .flatMap((response) => Observable.fromPromise(response.json()));

const getComicsFromResponse = compose(getResults, getData);
const getLt100Pages = filter(compose(lt100, getPageCount));

const filteredComics$ =
  response$.map(getComicsFromResponse)
    .map(getLt100Pages);

filteredComics$.subscribe((comics) => console.log(comics));
