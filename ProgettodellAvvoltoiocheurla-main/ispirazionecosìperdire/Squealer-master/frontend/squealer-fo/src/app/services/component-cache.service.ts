import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComponentCacheService {

  private cache: Map<string, any> = new Map();

  constructor() { }

  public set(key: string, value: any): void {
    this.cache.set(key, value);
  }

  public get(key: string): any {
    return this.cache.get(key);
  }

  public delete(key: string): any {
    return this.cache.delete(key);
  }

  public has(key: string): any {
    return this.cache.has(key);
  }

}
