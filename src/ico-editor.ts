import { AlpineApp } from './alpine';
import { Ico, IcoEntry } from './structures/ico';
import { BitmapInfoCompression, BitmapInfoCompressionNames } from './structures/bitmap/bitmap-info-header';
import { toSuffixed } from './si-suffix';
import { IcoEntryBmp } from './structures/ico/ico-entry-bmp';
import { IcoEntryPng } from './structures/ico/ico-entry-png';
import { downloadBlob } from './images';

type BackgroundMode = 'check-dark' | 'check-light' | 'black' | 'white';

export class IcoEditor extends AlpineApp {

  error?: string = undefined

  images: IcoEntry[] = []

  originalFilename?: string;
  originalFilesize?: number;

  backgroundMode: BackgroundMode = 'check-dark';
  backgroundModes: BackgroundMode[] = [ 'check-dark', 'check-light', 'black', 'white' ];

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

    await Promise.all( ico.images.map( image => image.getBlobUrl() ) );

    this.images = ico.images;
  }

  async parseIco( file: File ) {
    const buffer = await file.arrayBuffer();
    return Ico.unserialize( new DataView( buffer ) );
  }

  deleteImage( index: number ) {
    this.images.splice( index, 1 );
  }

  async addImages( files: FileList | File[] ) {
    files = Array.from( files );

    const entries = await Promise.all( files.map( async file => {
      const entry = await IcoEntryPng.createFromFile( file );
      await entry.getBlobUrl();
      return entry;
    } ) );

    this.images.push( ...entries );
  }

  async saveIcon() {
    const ico = Ico.createFromImages( this.images );
    const bytes = await ico.serialize();
    const blob = new Blob( [ bytes ], { type: 'image/x-icon' } );

    downloadBlob( blob, this.originalFilename || 'icon.ico' );
  }

  get currentFilesize() {
    let filesize = 6 + Ico.HEADERSIZE;

    for ( const png of this.images ) {
      filesize += png.serializedLength;
    }

    return toSuffixed( filesize );
  }

  async simulatePngSize() {
    const pngs = await this.convertAllImagesToPng();

    let filesize = 6 + Ico.HEADERSIZE;

    for ( const png of pngs ) {
      filesize += png.serializedLength;
    }

    return toSuffixed( filesize );
  }

  async convertImageToPng( image: IcoEntry ) {
    if ( image instanceof IcoEntryPng ) {
      return image;
    }

    const blob = await image.getImageBlob();

    return await IcoEntryPng.createFromFile( new File( [ blob ], 'image.png', { type: blob.type } ) );
  }

  async convertAllImagesToPng(): Promise<IcoEntryPng[]> {
    return Promise.all(
      this.images.map( async image => this.convertImageToPng( image ) ),
    );
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

  bindDroparea = {
    '@dragover.window.prevent.stop': this.showDroparea,
    '@dragleave.window.prevent.stop': this.hideDroparea,
    '@drop.window.prevent.stop': this.onDrop,
    '@click.prevent.stop': this.hideDroparea,
  }

  get droparea() {
    return this.$refs.droparea as HTMLElement;
  }

  get hasBmp(): boolean {
    return this.images.some( i => i instanceof IcoEntryBmp );
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

    if ( !files.length ) return;

    const icoFiles = files.filter( file => file.type === 'image/x-icon' );
    const pngFiles = files.filter( file => file.type === 'image/png' );

    if ( icoFiles.length ) {
      this.loadIcon( icoFiles[ 0 ] );
    } else if ( pngFiles.length ) {
      this.addImages( pngFiles );
    } else {
      console.error( files );
      this.error = 'Unknown file type';
    }
  }

  imageMeta( image: IcoEntry ) {

    const meta: string[] = [];

    meta.push( toSuffixed( image.length ) );

    if ( image.type === 'bmp' ) {
      let bpp = `${image.bpp}-bit BMP`;

      if ( image.bpp === 32 ) {
        bpp += ' with alpha';
      } else {
        bpp += ' + mask';
      }

      meta.push( bpp );
    } else {
      meta.push( image.type.toUpperCase() );
    }

    if ( image instanceof IcoEntryBmp && image.bitmapInfo.compression !== BitmapInfoCompression.RGB ) {
      meta.push( BitmapInfoCompressionNames[ image.bitmapInfo.compression ] );
    }

    return meta.join( ' • ' );

  }

  imageError( image: IcoEntry ) {
    return image.error;
  }

  imageMessages( image: IcoEntry ): string[] {

    const messages: string[] = [];

    if ( image.width !== image.height ) {
      messages.push( 'Not a square' );
    }

    if ( image.width > 256 || image.height > 256 ) {
      messages.push( 'Larger than 265px' );
    }

    return messages;

  }

  downloadFile( image: IcoEntry ) {

    downloadBlob( image.getStandaloneBlob(), 'image.' + image.type );

  }

}
