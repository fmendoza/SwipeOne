import { Injectable } from '@angular/core';
import * as Parse from 'parse';

@Injectable({
  providedIn: 'root'
})
export class Post extends Parse.Object {

  constructor() {
    super('Post');
  }

  async loadAll() {
    const query = new Parse.Query(Post)
    query.fromLocalDatastore()
    const local = await query.find()

    if (local.length) return local

    const query1 = new Parse.Query(Post)
    const remote = await query1.find()

    Parse.Object.pinAll(remote)

    return remote
  }

  get title(): string {
    return this.get('title');
  }

  get url(): string {
    return this.get('url');
  }

  get source(): string {
    return this.get('source');
  }
}

Parse.Object.registerSubclass('Post', Post);
