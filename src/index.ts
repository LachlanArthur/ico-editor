import { faviconColorScheme } from './favicon-dark';
import './alpine';
import type { AlpineGlobals } from './alpine';
import { DataViewExtended } from './data-view-extended';
import { Ico, IcoEntry } from './ico';

declare global {
  interface Window {
    IcoEditor: typeof IcoEditor,
  }
}

interface IcoEditor extends AlpineGlobals { }

class IcoEditor {

  error?: string = undefined

  images: IcoEntry[] = []

  static alpine() {
    return createFlatObjectFromClass( IcoEditor );
  }

  async loadIcon() {
    this.images = [];

    const filepicker = this.$refs.filepickerIcon as HTMLInputElement;
    if ( filepicker.files ) {

      const ico = await parseIco( filepicker.files.item( 0 )! );

      if ( ico.error ) {
        this.error = ico.error;
        return;
      } else {
        this.error = undefined;
      }

      await Promise.all( ico.images.map( image => image.createBlobUrl() ) );

      this.images = ico.images;
    }
  }

  deleteImage( index: number ) {
    delete this.images[ index ];
  }

  async addImages() {
    const filepicker = this.$refs.filepickerImage as HTMLInputElement;
    const files = Array.from( filepicker.files || [] );
    const entries = await Promise.all( files.map( async file => {
      const entry = await IcoEntry.createFromPng( file );
      await entry.createBlobUrl();
      return entry;
    } ) );
    this.images.push( ...entries );
  }

  async saveIcon() {
    const ico = Ico.createFromImages( this.images );
    const bytes = await ico.serialize();
    const blob = new Blob( [ bytes ], { type: 'image/x-icon' } );
    const url = URL.createObjectURL( blob );
    const link = document.createElement( 'a' );
    link.href = url;
    link.download = 'icon.ico'; // TODO
    link.click();
  }

}

window.IcoEditor = IcoEditor;

async function parseIco( file: File ) {
  const buffer = await file.arrayBuffer();
  return Ico.unserialize( new DataViewExtended( buffer ) );
}

function createFlatObjectFromClass<T>( classObject: ( new () => T ) ): object {
  const instance = classObject.prototype.__proto__ ? createFlatObjectFromClass( classObject.prototype.__proto__.constructor ) : {};

  Object.defineProperties( instance, Object.getOwnPropertyDescriptors( classObject.prototype ) );
  Object.defineProperties( instance, Object.getOwnPropertyDescriptors( new classObject() ) );

  return instance;
}

window.addEventListener( 'DOMContentLoaded', faviconColorScheme );
