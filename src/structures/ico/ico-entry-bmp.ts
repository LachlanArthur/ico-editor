import { chunks } from "../../iterable";
import { canvasToBlob, loadImage } from "../../images";
import { BitmapInfoHeader, BitmapInfoOrientation } from "../bitmap/bitmap-info-header";
import { IcoEntry } from "./ico-entry";
import { IcoEntryPng } from "./ico-entry-png";

type RGBQuad = [
  /** Red */
  number,
  /** Green */
  number,
  /** Blue */
  number,
  /** Reserved */
  0,
];

export class IcoEntryBmp extends IcoEntry {

  readonly type = 'bmp';

  bitmapInfo!: BitmapInfoHeader;

  bitmapFile!: Uint8ClampedArray;

  mask!: Uint8ClampedArray;

  alpha?: Uint8ClampedArray;

  static unserialize( dataView: DataView ): IcoEntryBmp {

    const instance = super.unserialize( dataView ) as IcoEntryBmp;

    instance.bitmapInfo = BitmapInfoHeader.unserialize( new DataView(
      instance.imageData.buffer,
      instance.imageData.byteOffset,
      instance.imageData.byteLength,
    ) );

    const colorTableSize = instance.bitmapInfo.colorsUsed * 4;
    const dibSize = BitmapInfoHeader.HEADERSIZE + colorTableSize + instance.bitmapInfo.imageLength;

    // The height represents the combined height of the XOR and AND masks.
    // Divide by two to get the true height of the image.
    instance.bitmapInfo.height /= 2;

    if ( instance.bpp === 32 ) {
      instance.alpha = ( () => {
        const alphaBytesFlipped = instance.imageData
          .slice( BitmapInfoHeader.HEADERSIZE + colorTableSize, dibSize )
          .slice( 0, ( instance.width * instance.height * instance.bpp ) / 8 )
          .filter( ( byte, index ) => ( index + 1 ) % 4 === 0 );

        if ( instance.bitmapInfo.orientation === BitmapInfoOrientation.TopDown ) {
          return alphaBytesFlipped;
        }

        const alphaBytes = new Uint8ClampedArray( alphaBytesFlipped.length );

        for ( let i = 0; i < alphaBytes.length; i += instance.width ) {
          const row = alphaBytesFlipped.slice( i, i + instance.width );
          alphaBytes.set( row, alphaBytes.length - i - instance.width );
        }

        return alphaBytes;
      } )();

      // Discard the alpha if it's entirely transparent
      if ( instance.alpha.every( x => x === 0 ) ) {
        instance.alpha = undefined;
      }
    }

    instance.mask = ( () => {
      // The mask width is a multiple of 32 bits padded with zeroes
      const maskWidth = Math.ceil( instance.width / 32 ) * 32;
      const maskSize = maskWidth * instance.height / 8;

      const maskBits = Array.from(
        chunks(
          Array.from(
            new Uint8ClampedArray(
              instance.imageData.buffer,
              instance.imageData.byteOffset + ( instance.length - maskSize ),
              maskSize,
            )
          )
            .flatMap( byte => {
              return [
                byte & 0b10000000,
                byte & 0b01000000,
                byte & 0b00100000,
                byte & 0b00010000,
                byte & 0b00001000,
                byte & 0b00000100,
                byte & 0b00000010,
                byte & 0b00000001,
              ];
            } ),
          maskWidth,
        ),
      )
        .flatMap( chunk => chunk.slice( 0, instance.width ) );

      // Leftover bytes are a mask
      const alphaBytesFlipped = new Uint8ClampedArray(
        maskBits.map( masked => ( masked > 0 ) ? 0 : 255 )
      );

      if ( instance.bitmapInfo.orientation === BitmapInfoOrientation.TopDown ) {
        return alphaBytesFlipped;
      }

      const alphaBytes = new Uint8ClampedArray( alphaBytesFlipped.length );

      for ( let i = 0; i < alphaBytes.length; i += instance.width ) {
        const row = alphaBytesFlipped.slice( i, i + instance.width );
        alphaBytes.set( row, alphaBytes.length - i - instance.width );
      }

      return alphaBytes;
    } )();

    // Create a full BMP file by prepending a BMP header to the data

    const bitmapFileHeaderLength = 14;

    const bitmapFileHeader = new DataView( new ArrayBuffer( bitmapFileHeaderLength ) );
    bitmapFileHeader.setUint8( 0, 0x42 ); // 'B'
    bitmapFileHeader.setUint8( 1, 0x4d ); // 'M'
    bitmapFileHeader.setUint32( 2, instance.length + bitmapFileHeaderLength, true );
    bitmapFileHeader.setUint32( 10, colorTableSize + bitmapFileHeaderLength + BitmapInfoHeader.HEADERSIZE, true );

    const bitmapWithHeader = new Uint8ClampedArray( dibSize + bitmapFileHeader.byteLength );
    const bitmapWithHeaderView = new DataView( bitmapWithHeader.buffer );
    bitmapWithHeader.set( new Uint8ClampedArray( bitmapFileHeader.buffer ), 0 );
    bitmapWithHeader.set( instance.imageData.slice( 0, dibSize ), bitmapFileHeader.byteLength );
    bitmapWithHeaderView.setInt32( bitmapFileHeader.byteLength + 8, instance.height, true );
    instance.bitmapFile = bitmapWithHeader;

    return instance;

  }

  protected blob?: Blob;

  async getImageBlob(): Promise<Blob> {

    if ( this.blob ) return this.blob;

    const bmpBlob = this.getStandaloneBlob();

    const bmpImage = await loadImage( URL.createObjectURL( bmpBlob ) );

    const canvas = document.createElement( 'canvas' );
    canvas.width = this.width;
    canvas.height = this.height;

    const ctx = canvas.getContext( '2d', { alpha: true } )!;

    if ( this.alpha && this.mask.length !== this.alpha.length ) {
      console.warn( 'Mask and alpha must be the same size' );
    }

    const alphaBytes: number[] = ( () => {
      if ( this.alpha ) {
        return new Array( Math.max( this.mask.length, this.alpha.length ) )
          .fill( undefined )
          .map( ( _, i ) => Math.min( this.mask![ i ], this.alpha![ i ] ) )
      }

      return Array.from( this.mask );
    } )();

    ctx.putImageData( new ImageData(
      new Uint8ClampedArray( alphaBytes.flatMap( alpha => [ 0, 0, 0, alpha ] ) ),
      this.width,
      this.height,
    ), 0, 0 );

    ctx.globalCompositeOperation = 'source-in';

    ctx.drawImage( bmpImage, 0, 0 );

    this.blob = await canvasToBlob( canvas, 'image/png' );

    return this.blob;

  }

  getStandaloneBlob() {

    return new Blob( [ this.bitmapFile.buffer ], { type: 'image/bmp' } );

  }

}
