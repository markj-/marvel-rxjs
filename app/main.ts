import { Observable } from 'rxjs';
import { prop, filter, map, compose, gt, nth, join } from 'ramda';
import h from 'hyperscript';
import hh from 'hyperscript-helpers';
import log from 'utility/log';

type Comic = {
  url: string,
  title: string,
  image: string
};

const {
  section,
  img,
  h1,
  ul,
  li,
  a
} = hh(h);

const getFirst = nth(0);

const lt100 = gt(100);
const lt4 = gt(4);

const getResults = prop('results');
const getData = prop('data');
const getPageCount = prop('pageCount');
const getPrice = prop('price');
const getPrices = prop('prices');
const getUrl = prop('url');
const getUrls = prop('urls');
const getPath = prop('path');
const getTitle = prop('title');
const getExtension = prop('extension');
const getImages = prop('images');

const getFirstImage = compose(getFirst, getImages);

const apiKey = 'fc67721c305c84f50f7c6646c9b8d9d0';
const apiUrl = `http://gateway.marvel.com/v1/public/comics?apikey=${apiKey}`;

const getComicsFromResponse = compose(getResults, getData);
const getComicPrice = compose(getPrice, getFirst, getPrices);
const getComicUrl = compose(getUrl, getFirst, getUrls);
const getComicPath = compose(getPath, getFirstImage);
const getComicExtension = compose(getExtension, getFirstImage);

const getLt100Pages = filter(compose(lt100, getPageCount));
const getLt4Dollars = filter(compose(lt4, getComicPrice));

const getComicData = (comic) => ({
  url: getComicUrl(comic),
  title: getTitle(comic),
  image: join('.', [
    getComicPath(comic),
    getComicExtension(comic)
  ])
});

const request$ = Observable.of(apiUrl);

const response$ =
  request$
    .flatMap((url) => Observable.fromPromise(fetch(url)))
    .flatMap((response) => Observable.fromPromise(response.json()));

const comics$ = response$.map(getComicsFromResponse)

const filteredComics$ =
  comics$
    .map(getLt100Pages)
    .map(getLt4Dollars);

const render = (comics: Array<Object>): void => {
  const comicListItems = map(getComicData, comics);

  document.querySelector('#app').appendChild(
    ul(map(({ title, image, url }) => li([
      section([
        a([
          h1(title, [
            img({ src: image })
          ])
        ], { href: url })
      ])
    ]), comicListItems)
  );
};

filteredComics$.subscribe(render);
