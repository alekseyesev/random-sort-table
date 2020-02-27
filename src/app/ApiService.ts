import { Injectable } from '@angular/core';
import { range, random, shuffle } from 'lodash';

function randomString(length, chars) {
  let result = '';
  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}
const MAX = 5;
const TIMEOUT = 5;
const ITEMS = range(1, MAX).map(id => ({
  id,
  name: randomString(4, 'qwertyuiop123asdfghjkl'),
  rate: random(1, 100)
}));

@Injectable()
export class ApiService {
  handleChanges(handler) {
    setInterval(() => {
      handler(shuffle(ITEMS));
    }, TIMEOUT * 1000);
  }
}
