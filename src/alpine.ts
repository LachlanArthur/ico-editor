export interface AlpineApp {
  $el: HTMLElement
  $refs: Record<string, HTMLElement>
  $watch: ( property: string, callback: ( value: any ) => void ) => void | ( () => void )
  $nextTick: () => void
}

export class AlpineApp {

  static alpine( ...constructorArgs: any ) {
    return createFlatObjectFromClass( this, ...constructorArgs );
  }

}

export function createFlatObjectFromClass<T>( classObject: ( new ( ...args: any ) => T ), ...constructorArgs: any ): object {
  const instance = classObject.prototype.__proto__ ? createFlatObjectFromClass( classObject.prototype.__proto__.constructor ) : {};

  Object.defineProperties( instance, Object.getOwnPropertyDescriptors( classObject.prototype ) );
  Object.defineProperties( instance, Object.getOwnPropertyDescriptors( new classObject( ...constructorArgs ) ) );

  return instance;
}
