import 'alpinejs';

export interface AlpineGlobals {
  $el: HTMLElement
  $refs: Record<string, HTMLElement>
  $watch: ( property: string, callback: ( value: any ) => void ) => void | ( () => void )
  $nextTick: () => void
}
