import { loadImage } from "../../images";
import { DataViewExtended } from "../../data-view-extended";
import { BitmapInfoCompression, BitmapInfoHeader } from "../bitmap/bitmap-info-header";
import { Structure } from "../structure";

export function renderRgbaBytesToCanvas( width: number, height: number, bytes: Uint8ClampedArray ) {

  const canvas = document.createElement( 'canvas' );
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext( '2d', { alpha: true } );

  ctx!.putImageData( new ImageData( bytes, width, height ), 0, 0 );

  return canvas;

}

export class IcoEntry extends Structure {

  static readonly HEADERSIZE = 16

  error?: string;

  /**
   * Width of image, px
   */
  width: number = 0;

  /**
   * Height of image, px
   */
  height: number = 0;

  /**
   * Number of colors in palette of the image or 0 if image has no palette (i.e. RGB, RGBA, etc)
   */
  colors: number = 0;

  /**
   * Number of color planes
   */
  planes: number = 0;

  /**
   * Bits per pixel in the image
   */
  bpp: number = 0;

  /**
   * Size of the image data
   */
  length: number = 0;

  /**
   * Absolute offset of the image data start in the file
   */
  offset: number = 0;

  type: 'png' | 'bmp' = 'png';

  bitmapInfo?: BitmapInfoHeader;

  bitmapRgba?: Uint8ClampedArray;

  static unserialize( dataView: DataViewExtended ) {

    const instance = new IcoEntry( dataView );

    instance.width = instance.data.getUint8();
    instance.height = instance.data.getUint8();
    instance.colors = instance.data.getUint8();
    instance.data.getUint8(); // Skip reserved byte
    instance.planes = instance.data.getUint16le();
    instance.bpp = instance.data.getUint16le();
    instance.length = instance.data.getUint32le();
    instance.offset = instance.data.getUint32le();
    instance.type = instance.detectPng() ? 'png' : 'bmp';

    if ( instance.width === 0 ) instance.width = 256;
    if ( instance.height === 0 ) instance.height = 256;

    if ( instance.type === 'bmp' ) {

      instance.bitmapInfo = BitmapInfoHeader.unserialize( new DataViewExtended( instance.data.buffer.slice( instance.offset, instance.offset + instance.length ) ) );

      if ( instance.bpp !== 32 ) {
        instance.error = `Unsupported bit depth`;
      } else if ( instance.bitmapInfo.compression !== BitmapInfoCompression.RGB ) {
        instance.error = `Unsupported compression type`;
      }

    }

    return instance;

  }

  static async createFromPng( file: File ) {

    const bufferSize = file.size + this.HEADERSIZE;

    const data = new DataViewExtended( new ArrayBuffer( bufferSize ) );
    const dataArray = new Uint8Array( data.buffer );

    const instance = new IcoEntry( data );

    if ( file.type !== 'image/png' ) {
      instance.error = 'Not a PNG file';
      return instance;
    }

    if ( file.size > 2 ** 32 ) {
      instance.error = 'PNG is too large';
      return instance;
    }

    const img = await loadImage( URL.createObjectURL( file ) );

    instance.width = img.width;
    instance.height = img.height;
    instance.colors = 0;
    instance.planes = 1;
    instance.bpp = 32;
    instance.length = file.size;
    instance.offset = 16;
    instance.type = 'png';

    dataArray.set( new Uint8Array( await file.arrayBuffer() ), instance.offset );

    return instance;

  }

  readBitmap() {

    if ( this.bitmapRgba ) return;

    if ( this.error ) return;

    if ( !this.bitmapInfo ) return;

    // Calculate exactly how many uncompressed bytes there are
    const imageDataSize = ( this.width * this.height * this.bpp ) / 8;

    const bmpImageDataBgraFlipped = new Uint8ClampedArray( this.bitmapInfo.data.buffer.slice( this.bitmapInfo.size, this.bitmapInfo.size + imageDataSize ) );

    // Get the bytes in the correct order
    const bmpImageDataRgbaFlipped = new Uint8ClampedArray( bmpImageDataBgraFlipped.byteLength );
    for ( let i = 0; i < bmpImageDataRgbaFlipped.byteLength; i += 4 ) {
      const [ b, g, r, a ] = bmpImageDataBgraFlipped.slice( i, i + 4 );
      bmpImageDataRgbaFlipped.set( [ r, g, b, a ], i );
    }

    // Flip the image by reversing the rows
    const rowSize = this.width * this.bpp / 8;
    const bmpImageDataRgba = new Uint8ClampedArray( bmpImageDataBgraFlipped.byteLength );
    for ( let offset = 0; offset < bmpImageDataRgba.byteLength; offset += rowSize ) {
      bmpImageDataRgba.set( bmpImageDataRgbaFlipped.slice( offset, offset + rowSize ), bmpImageDataBgraFlipped.byteLength - offset - rowSize );
    }

    this.bitmapRgba = bmpImageDataRgba;

  }

  async serialize(): Promise<ArrayBuffer> {

    const buffer = new ArrayBuffer( IcoEntry.HEADERSIZE );
    const view = new DataViewExtended( buffer );

    let { width, height } = this;

    if ( width >= 256 ) width = 0;
    if ( height >= 256 ) height = 0;

    view.setUint8( width );
    view.setUint8( height );
    view.setUint8( 0 ); // Colors
    view.setUint8( 0 ); // Reserved byte
    view.setUint16le( 1 ); // Planes
    view.setUint16le( this.bpp );
    view.setUint32le( this.length );
    view.setUint32le( this.offset );

    return buffer;

  }

  detectPng() {
    const magic = new Uint8Array( this.data.buffer.slice( this.offset, this.offset + 8 ) );

    return (
      magic[ 0 ] === 137 &&
      magic[ 1 ] === 80 &&
      magic[ 2 ] === 78 &&
      magic[ 3 ] === 71 &&
      magic[ 4 ] === 13 &&
      magic[ 5 ] === 10 &&
      magic[ 6 ] === 26 &&
      magic[ 7 ] === 10
    )
  }

  async convertToPng() {

    if ( this.error ) return false;

    if ( this.type === 'png' ) return true;

    await this.getImageBlob();

    if ( !this.blob ) {
      return false;
    }

    const pngBytes = await this.blob.arrayBuffer();

    this.type = 'png';
    this.offset = IcoEntry.HEADERSIZE;
    this.length = pngBytes.byteLength;
    this.data = new DataViewExtended( new ArrayBuffer( IcoEntry.HEADERSIZE + this.length ) );

    const byteArray = new Uint8Array( this.data.buffer );

    byteArray.set( new Uint8Array( pngBytes ), this.offset );

    return true;

  }

  getImageBytes() {
    return this.data.buffer.slice( this.offset, this.offset + this.length );
  }

  public blob?: Blob;

  async getImageBlob(): Promise<Blob | undefined> {

    if ( this.blob ) return this.blob;

    if ( this.type === 'png' ) {

      const bytes = this.getImageBytes();

      this.blob = new Blob( [ bytes ], { type: 'image/png' } );

    } else {

      this.readBitmap();

      if ( !this.bitmapRgba ) {
        return;
      }

      const canvas = renderRgbaBytesToCanvas( this.width, this.height, this.bitmapRgba );

      this.blob = await new Promise( ( resolve, reject ) => canvas.toBlob( blob => {
        if ( blob ) {
          resolve( blob );
        } else {
          reject();
        }
      }, 'image/png' ) );

    }

    return this.blob;

  }

  protected blobUrl?: string;

  async createBlobUrl() {
    const blob = await this.getImageBlob();

    if ( blob ) {

      this.blobUrl = URL.createObjectURL( blob );

      if ( !this.blobUrl ) {
        this.blobUrl = ''; // TODO: Do something?
      }

    } else {

      this.blobUrl = ''; // TODO: Do something?

    }

    return this.blobUrl;
  }

  async getImg() {
    const img = await loadImage( await this.createBlobUrl() );

    img.width = this.width;
    img.height = this.height;

    return img;
  }

}
