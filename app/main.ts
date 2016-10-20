import { Observable } from 'rxjs';
import { prop, filter, compose, gt, nth } from 'ramda';

const log = (value) => {
  console.log(value);
  return value;
};

const getResults = prop('results');
const getData = prop('data');
const getPageCount = prop('pageCount');
const getPrice = prop('price');
const getPrices = prop('prices');

const getFirst = nth(0);

const lt100 = gt(100);
const lt4 = gt(4);

const apiKey = 'fc67721c305c84f50f7c6646c9b8d9d0';
const apiUrl = `http://gateway.marvel.com/v1/public/comics?apikey=${apiKey}`;

const request$ = Observable.of(apiUrl);

const response$ =
  request$
    .flatMap(() => Observable.fromPromise(fetch(apiUrl)))
    .flatMap((response) => Observable.fromPromise(response.json()));

const getComicsFromResponse = compose(getResults, getData);
const getComicPrice = compose(getPrice, getFirst, getPrices);
const getLt100Pages = filter(compose(lt100, getPageCount));
const getLt4Dollars = filter(compose(lt4, getComicPrice));

const comics$ = response$.map(getComicsFromResponse)

const filteredComics$ =
  comics$
    .map(getLt100Pages)
    .map(getLt4Dollars);

filteredComics$.subscribe((comics) => console.log(comics));
