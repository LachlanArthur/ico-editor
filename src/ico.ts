import { DataViewExtended } from './data-view-extended';
import { toSuffixed } from './si-suffix';

export class Ico {

  static readonly HEADERSIZE = 6

  error?: string;

  images: IcoEntry[] = [];

  constructor( public data: DataViewExtended ) { }

  static unserialize( data: DataViewExtended ) {

    const instance = new this( data );

    const magic = instance.data.getUint16leArray( 2 );

    if ( magic.join( '' ) !== '01' ) {
      instance.error = 'Not an ICO file';
      return instance;
    }

    const imageCount = instance.data.getUint16le();

    for ( let i = 0; i < imageCount; i++ ) {
      const image = IcoEntry.unserialize( instance.data );
      if ( !image ) continue;
      instance.images.push( image );
    }

    return instance;

  }

  static createFromImages( images: IcoEntry[] ): Ico {

    const instance = new Ico( new DataViewExtended( new ArrayBuffer( 0 ) ) );

    instance.images = [ ...images ];

    return instance;

  }

  async serialize(): Promise<ArrayBuffer> {

    let images = [ ...this.images ];

    for ( let i = images.length - 1; i >= 0; i-- ) {
      const image = images[ i ];
      if ( !( await image.convertToPng() ) ) {
        images.splice( i, 1 );
      }
    }

    const header = new DataViewExtended( new ArrayBuffer( Ico.HEADERSIZE ) );

    header.setUint16le( 0 );
    header.setUint16le( 1 );

    let fileSize = Ico.HEADERSIZE;
    for (const image of images) {
      fileSize += IcoEntry.HEADERSIZE + image.length;
    }

    header.setUint16le( images.length );

    const fileBuffer = new Uint8Array( new ArrayBuffer( fileSize ) );

    fileBuffer.set( new Uint8Array( header.buffer ), 0 );

    let imageHeaderCursor = header.byteLength;
    let imageDataCursor = Ico.HEADERSIZE + IcoEntry.HEADERSIZE * images.length;

    for ( const image of images ) {

      fileBuffer.set( new Uint8Array( image.serialize( imageDataCursor ) ), imageHeaderCursor );
      fileBuffer.set( new Uint8Array( image.getImageBytes() ), imageDataCursor );

      imageHeaderCursor += IcoEntry.HEADERSIZE;
      imageDataCursor += image.length;

    }

    return fileBuffer.buffer;

  }

}

export class IcoEntry {

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

  constructor( public data: DataViewExtended ) { }

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

    const img = new Image();
    await new Promise( ( resolve, reject ) => {
      img.addEventListener( 'load', resolve );
      img.addEventListener( 'error', reject );
      img.src = URL.createObjectURL( file );
    } );

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

  serialize( dataOffset: number ): ArrayBuffer {

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
    view.setUint32le( dataOffset );

    return buffer;

  }

  detectPng() {
    const magic = new Uint8Array( this.data.buffer.slice( this.offset, this.offset + 8 ) );
    return magic.join( ',' ) === '137,80,78,71,13,10,26,10';
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
    const img = new Image( this.width, this.height );
    const src = await this.createBlobUrl();
    if ( src ) img.src = src;
    return img;
  }

}

/**
 * The type of compression for a bitmap image.
 *
 * https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-wmf/4e588f70-bd92-4a6f-b77f-35d0feaf7a57
 */
export enum BitmapInfoCompression {

  /**
   * The bitmap is in uncompressed red green blue (RGB) format that is not compressed and does not use color masks.
   */
  RGB = 0x0000,

  /**
   * An RGB format that uses run-length encoding (RLE) compression for bitmaps with 8 bits per pixel.
   * The compression uses a 2-byte format consisting of a count byte followed by a byte containing a color index.
   */
  RLE8 = 0x0001,

  /**
   * An RGB format that uses RLE compression for bitmaps with 4 bits per pixel.
   * The compression uses a 2-byte format consisting of a count byte followed by two word-length color indexes.
   */
  RLE4 = 0x0002,

  /**
   * The bitmap is not compressed, and the color table consists of three DWORD color masks that specify the red, green, and blue components, respectively, of each pixel.
   * This is valid when used with 16 and 32-bits per pixel bitmaps.
   */
  BITFIELDS = 0x0003,

  /**
   * The image is a JPEG image.
   */
  JPEG = 0x0004,

  /**
   * The image is a PNG image.
   */
  PNG = 0x0005,

  /**
   * The image is an uncompressed CMYK format.
   */
  CMYK = 0x000B,

  /**
   * A CMYK format that uses RLE compression for bitmaps with 8 bits per pixel.
   * The compression uses a 2-byte format consisting of a count byte followed by a byte containing a color index.
   */
  CMYKRLE8 = 0x000C,

  /**
   * A CMYK format that uses RLE compression for bitmaps with 4 bits per pixel.
   * The compression uses a 2-byte format consisting of a count byte followed by two word-length color indexes.
   */
  CMYKRLE4 = 0x000D,
};

export const BitmapInfoCompressionNames: Record<BitmapInfoCompression, string> = {
  [ BitmapInfoCompression.RGB ]: 'Uncompressed RGB',
  [ BitmapInfoCompression.RLE8 ]: 'RLE-8 compressed RGB',
  [ BitmapInfoCompression.RLE4 ]: 'RLE-4 compressed RGB',
  [ BitmapInfoCompression.BITFIELDS ]: 'Uncompressed RGB bitfields',
  [ BitmapInfoCompression.JPEG ]: 'JPEG compressed',
  [ BitmapInfoCompression.PNG ]: 'PNG compressed',
  [ BitmapInfoCompression.CMYK ]: 'Uncompressed CMYK',
  [ BitmapInfoCompression.CMYKRLE8 ]: 'RLE-8 compressed CMYK',
  [ BitmapInfoCompression.CMYKRLE4 ]: 'RLE-4 compressed CMYK',
}

/**
 * https://docs.microsoft.com/en-us/windows/win32/api/wingdi/ns-wingdi-bitmapinfoheader
 */
class BitmapInfoHeader {

  /**
   * Specifies the number of bytes required by the structure.
   *
   * This value does not include the size of the color table or the size of the color masks, if they are appended to the end of structure.
   */
  size = 0;

  /**
   * Specifies the width of the bitmap, in pixels.
   */
  width = 0;

  /**
   * Specifies the height of the bitmap, in pixels.
   */
  height = 0;

  /**
   * Specifies the number of planes for the target device.
   *
   * This value must be set to 1.
   */
  planes = 1;

  /**
   * Specifies the number of bits per pixel.
   *
   * - For uncompressed formats, this value is the average number of bits per pixel.
   * - For compressed formats, this value is the implied bit depth of the uncompressed image, after the image has been decoded.
   */
  bpp = 0;

  compression: BitmapInfoCompression = 0;

  /**
   * Specifies the size, in bytes, of the image.
   *
   * This can be set to 0 for uncompressed RGB bitmaps.
   */
  imageLength = 0;

  imageOffset = 0;

  /**
   * Specifies the horizontal resolution, in pixels per meter, of the target device for the bitmap.
   */
  ppmX = 0;

  /**
   * Specifies the vertical resolution, in pixels per meter, of the target device for the bitmap.
   */
  ppmY = 0;

  /**
   * Specifies the number of color indices in the color table that are actually used by the bitmap.
   */
  colorsUsed = 0;

  /**
   * Specifies the number of color indices that are considered important for displaying the bitmap.
   *
   * If this value is zero, all colors are important.
   */
  colorsImportant = 0;

  constructor( public data: DataViewExtended ) { }

  static unserialize( dataView: DataViewExtended ) {

    const instance = new BitmapInfoHeader( dataView );

    instance.size = instance.data.getUint32le();
    instance.width = instance.data.getInt32le();
    instance.height = instance.data.getInt32le();
    instance.planes = instance.data.getUint16le();
    instance.bpp = instance.data.getUint16le();
    instance.compression = instance.data.getUint32le();
    instance.imageLength = instance.data.getUint32le();
    instance.ppmX = instance.data.getInt32le();
    instance.ppmY = instance.data.getInt32le();
    instance.colorsUsed = instance.data.getUint32le();
    instance.colorsImportant = instance.data.getUint32le();

    // The height represents the combined height of the XOR and AND masks.
    // Divide by two to get the true height of the image.
    instance.height /= 2;

    instance.imageOffset = instance.data.cursor;

    return instance;

  }

}

function renderRgbaBytesToCanvas( width: number, height: number, bytes: Uint8ClampedArray ) {

  const canvas = document.createElement( 'canvas' );
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext( '2d', { alpha: true } );

  ctx!.putImageData( new ImageData( bytes, width, height ), 0, 0 );

  return canvas;

}
