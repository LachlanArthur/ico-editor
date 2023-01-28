import { AlpineApp } from './alpine';
import { DataViewExtended } from './data-view-extended';
import { Ico, IcoEntry } from './structures/ico';
import { BitmapInfoCompression, BitmapInfoCompressionNames } from './structures/bitmap/bitmap-info-header';
import { toSuffixed } from './si-suffix';

export class IcoEditor extends AlpineApp {

  error?: string = undefined

  images: IcoEntry[] = []

  originalFilename?: string;
  originalFilesize?: number;

  async loadIcon( file: File ) {
    this.images = [];
    this.originalFilename = file.name;
    this.originalFilesize = file.size;

    const ico = await this.parseIco( file );

    if ( ico.error ) {
      this.error = ico.error;
      return;
    } else {
      this.error = undefined;
    }

    await Promise.all( ico.images.map( image => image.createBlobUrl() ) );

    this.images = ico.images;
  }

  async parseIco( file: File ) {
    const buffer = await file.arrayBuffer();
    return Ico.unserialize( new DataViewExtended( buffer ) );
  }

  deleteImage( index: number ) {
    this.images.splice( index, 1 );
  }

  async addImages( files: FileList | File[] ) {
    files = Array.from( files );
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
    if ( this.originalFilename ) {
      link.download = this.originalFilename;
    } else {
      link.download = 'icon.ico';
    }
    link.click();
  }

  filepickerIconChanged() {
    const filepicker = this.$refs.filepickerIcon as HTMLInputElement;
    if ( filepicker.files ) {
      this.loadIcon( filepicker.files.item( 0 )! );
    }
  }

  filepickerImageChanged() {
    const filepicker = this.$refs.filepickerImage as HTMLInputElement;
    this.addImages( filepicker.files || [] );
  }

  spreadDroparea = {
    '@dragover.window.prevent.stop': this.showDroparea,
    '@dragleave.window.prevent.stop': this.hideDroparea,
    '@drop.window.prevent.stop': this.onDrop,
    '@click.prevent.stop': this.hideDroparea,
  }

  get droparea() {
    return this.$refs.droparea as HTMLElement;
  }

  showDroparea() {
    this.droparea.classList.add( '--show' );
  }

  hideDroparea() {
    this.droparea.classList.remove( '--show' );
  }

  onDrop( e: DragEvent ) {
    this.hideDroparea();

    if ( !e.dataTransfer ) return;

    const files = Array.from( e.dataTransfer.files );
    const icoFiles = files.filter( file => file.type === 'image/x-icon' );
    const pngFiles = files.filter( file => file.type === 'image/png' );

    if ( icoFiles.length ) {
      this.loadIcon( icoFiles[ 0 ] );
    } else if ( pngFiles.length ) {
      this.addImages( pngFiles );
    } else {
      // TODO: Display error message
      throw new Error( 'Unknown file type' );
    }
  }

  imageMeta( image: IcoEntry ) {

    const meta: string[] = [];

    meta.push( toSuffixed( image.length ) );

    if ( image.type === 'bmp' && image.bpp !== 32 ) {
      meta.push( `${image.bpp}-bit` );
    }

    if ( image.bitmapInfo && image.bitmapInfo.compression !== BitmapInfoCompression.RGB ) {
      meta.push( BitmapInfoCompressionNames[ image.bitmapInfo.compression ] );
    }

    meta.push( image.type.toUpperCase() );

    return meta.join( ' • ' );

  }

  imageError( image: IcoEntry ) {
    return image.error;
  }

  imageMessage( image: IcoEntry ) {

    if ( image.type === 'bmp' && !image.error ) {
      return 'Converted to PNG';
    }

  }

}
