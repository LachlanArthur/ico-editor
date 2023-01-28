import { DataViewExtended } from "../../data-view-extended";
import { Structure } from "../structure";

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
export class BitmapInfoHeader extends Structure {

  static readonly HEADERSIZE = 40;

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

  async serialize(): Promise<ArrayBuffer> {

    const buffer = new ArrayBuffer( BitmapInfoHeader.HEADERSIZE );
    const view = new DataViewExtended( buffer );

    view.setUint32le( this.size );
    view.setInt32le( this.width );
    view.setInt32le( this.height * 2 );
    view.setUint16le( this.planes );
    view.setUint16le( this.bpp );
    view.setUint32le( this.compression );
    view.setUint32le( this.imageLength );
    view.setInt32le( this.ppmX );
    view.setInt32le( this.ppmY );
    view.setUint32le( this.colorsUsed );
    view.setUint32le( this.colorsImportant );

    return buffer;
  }

}
