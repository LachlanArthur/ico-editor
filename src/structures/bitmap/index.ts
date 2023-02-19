import { Structure } from "../structure";
import { BitmapInfoCompression, BitmapInfoCompressionNames, BitmapInfoHeader, BitmapInfoOrientation } from "./bitmap-info-header";

export class Bmp extends Structure {

  error?: string;

  bitmapInfo!: BitmapInfoHeader;

  imageData!: Uint8ClampedArray;

  static unserialize( dataView: DataView ): Bmp {

    const instance = new this();

    instance.bitmapInfo = BitmapInfoHeader.unserialize( dataView );

    const supportedCompression = [
      BitmapInfoCompression.RGB,
      BitmapInfoCompression.RLE4,
      BitmapInfoCompression.RLE8,
      BitmapInfoCompression.BITFIELDS,
    ];

    if ( !supportedCompression.includes( instance.bitmapInfo.compression ) ) {
      instance.error = `Unsupported compression type: ${BitmapInfoCompressionNames[ instance.bitmapInfo.compression ]}`;
    }

    // The height represents the combined height of the XOR and AND masks.
    // Divide by two to get the true height of the image.
    instance.bitmapInfo.height /= 2;

    instance.imageData = new Uint8ClampedArray(
      dataView.buffer,
      dataView.byteOffset + BitmapInfoHeader.HEADERSIZE,
      instance.bitmapInfo.imageLength,
    );

    return instance;

  }

  async serialize(): Promise<ArrayBuffer> {

    throw new Error( 'TODO' );

  }

  readRgba(): Uint8ClampedArray {

    switch ( this.bitmapInfo.compression ) {
      default: throw new Error( 'Unsupported compression method' );
      case BitmapInfoCompression.RGB: return this.decompressRgba();
      case BitmapInfoCompression.RLE4: return this.decompressRle( 4 );
      case BitmapInfoCompression.RLE8: return this.decompressRle( 8 );
      case BitmapInfoCompression.BITFIELDS: return this.decompressBitfields();
    }

  }

  protected decompressRgba(): Uint8ClampedArray {

    console.group( 'decompressRgba', this );

    const imageDataSize = this.bitmapInfo.imageLength;

    console.log( 'imageDataSize', imageDataSize );

    // Get the bytes in the correct order
    const bmpImageDataRgba = new Uint8ClampedArray( imageDataSize );
    for ( let i = 0; i < bmpImageDataRgba.byteLength; i += 4 ) {
      const [ b, g, r, a ] = this.imageData.slice( i, i + 4 );
      bmpImageDataRgba.set( [ r, g, b, a ], i );
    }

    if ( this.bitmapInfo.orientation === BitmapInfoOrientation.TopDown ) {
      return bmpImageDataRgba;
    }

    // Flip the image by reversing the rows
    const rowSize = this.bitmapInfo.width * this.bitmapInfo.bpp / 8;
    const bmpImageDataRgbaFlipped = new Uint8ClampedArray( imageDataSize );
    for ( let offset = 0; offset < bmpImageDataRgbaFlipped.byteLength; offset += rowSize ) {
      bmpImageDataRgbaFlipped.set( bmpImageDataRgba.slice( offset, offset + rowSize ), bmpImageDataRgba.byteLength - offset - rowSize );
    }

    console.log( 'bmpImageDataRgbaFlipped', bmpImageDataRgbaFlipped );

    console.groupEnd();

    return bmpImageDataRgbaFlipped;

  }

  protected decompressRle( size: number ): Uint8ClampedArray {

    throw new Error( 'Not implemented' );

    // // Calculate exactly how many uncompressed bytes there are
    // const imageDataSize = ( this.bitmapInfo.width * this.bitmapInfo.height * this.bitmapInfo.bpp ) / 8;

    // const encodedBytes = new Uint8ClampedArray( this.bitmapInfo.data.buffer, this.bitmapInfo.size, this.bitmapInfo.imageLength );

    // console.log( {
    //   imageDataSize,
    //   encodedBytes,
    // } );

  }

  protected decompressBitfields(): Uint8ClampedArray {

    throw new Error( 'Not implemented' );

  }

}
