import { Structure } from "../structure";

/**
 * The number of bits-per-pixel.
 */
export enum BitmapInfoBitCount {
  /**
   * The number of bits-per-pixel is specified or is implied by the JPEG or PNG format.
   */
  NON_BITMAP = 0,

  /**
   * The bitmap is monochrome, and the bmiColors member of BITMAPINFO contains two entries.
   * Each bit in the bitmap array represents a pixel.
   * If the bit is clear, the pixel is displayed with the color of the first entry in the bmiColors table;
   * if the bit is set, the pixel has the color of the second entry in the table.
   */
  MONOCHROME = 1,

  /**
   * The bitmap has a maximum of 16 colors, and the bmiColors member of BITMAPINFO contains up to 16 entries.
   * Each pixel in the bitmap is represented by a 4-bit index into the color table.
   * For example, if the first byte in the bitmap is 0x1F, the byte represents two pixels.
   * The first pixel contains the color in the second table entry, and the second pixel contains the color in the sixteenth table entry.
   */
  INDEXED_16 = 4,

  /**
   * The bitmap has a maximum of 256 colors, and the bmiColors member of BITMAPINFO contains up to 256 entries.
   * In this case, each byte in the array represents a single pixel.
   */
  INDEXED_256 = 8,

  /**
   * The bitmap has a maximum of 2^16 colors.
   *
   * If the biCompression member of the BITMAPINFOHEADER is BI_RGB, the bmiColors member of BITMAPINFO is NULL.
   * Each WORD in the bitmap array represents a single pixel.
   * The relative intensities of red, green, and blue are represented with five bits for each color component.
   * The value for blue is in the least significant five bits, followed by five bits each for green and red.
   * The most significant bit is not used. The bmiColors color table is used for optimizing colors used on palette-based devices,
   * and must contain the number of entries specified by the biClrUsed member of the BITMAPINFOHEADER.
   *
   * If the biCompression member of the BITMAPINFOHEADER is BI_BITFIELDS, the bmiColors member contains three DWORD color masks
   * that specify the red, green, and blue components, respectively, of each pixel. Each WORD in the bitmap array represents a single pixel.
   *
   * When the biCompression member is BI_BITFIELDS, bits set in each DWORD mask must be contiguous and should not overlap the bits of another mask.
   * All the bits in the pixel do not have to be used.
   */
  HIGH_COLOR_MASKED = 16,

  /**
   * The bitmap has a maximum of 2^24 colors, and the bmiColors member of BITMAPINFO is NULL.
   * Each 3-byte triplet in the bitmap array represents the relative intensities of blue, green, and red, respectively, for a pixel.
   * The bmiColors color table is used for optimizing colors used on palette-based devices,
   * and must contain the number of entries specified by the biClrUsed member of the BITMAPINFOHEADER.
   */
  TRUE_COLOR = 24,

  /**
   * The bitmap has a maximum of 2^32 colors.
   * If the biCompression member of the BITMAPINFOHEADER is BI_RGB, the bmiColors member of BITMAPINFO is NULL.
   * Each DWORD in the bitmap array represents the relative intensities of blue, green, and red for a pixel.
   * The value for blue is in the least significant 8 bits, followed by 8 bits each for green and red.
   * The high byte in each DWORD is not used. The bmiColors color table is used for optimizing colors used on palette-based devices,
   * and must contain the number of entries specified by the biClrUsed member of the BITMAPINFOHEADER.
   *
   * If the biCompression member of the BITMAPINFOHEADER is BI_BITFIELDS, the bmiColors member contains three DWORD color masks
   * that specify the red, green, and blue components, respectively, of each pixel. Each DWORD in the bitmap array represents a single pixel.
   *
   * When the biCompression member is BI_BITFIELDS, bits set in each DWORD mask must be contiguous and should not overlap the bits of another mask.
   * All the bits in the pixel do not need to be used.
   */
  TRUE_COLOR_MASKED = 32,
}

export const BitmapInfoBitCountNames: Record<BitmapInfoBitCount, string> = {
  [ BitmapInfoBitCount.NON_BITMAP ]: 'PNG',
  [ BitmapInfoBitCount.MONOCHROME ]: 'Monochrome',
  [ BitmapInfoBitCount.INDEXED_16 ]: '16 color palette',
  [ BitmapInfoBitCount.INDEXED_256 ]: '256 color palette',
  [ BitmapInfoBitCount.HIGH_COLOR_MASKED ]: 'High color',
  [ BitmapInfoBitCount.TRUE_COLOR ]: 'True color',
  [ BitmapInfoBitCount.TRUE_COLOR_MASKED ]: 'True color',
}

export enum BitmapInfoOrientation {
  BottomUp = 1,
  TopDown = -1,
};

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
   * Determines the number of bits that define each pixel and the maximum number of colors in the bitmap.
   *
   * - For uncompressed formats, this value is the average number of bits per pixel.
   * - For compressed formats, this value is the implied bit depth of the uncompressed image, after the image has been decoded.
   */
  bpp: BitmapInfoBitCount = BitmapInfoBitCount.NON_BITMAP;

  compression: BitmapInfoCompression = BitmapInfoCompression.PNG;

  /**
   * Specifies the size, in bytes, of the image.
   *
   * This can be set to 0 for uncompressed RGB bitmaps.
   */
  imageLength = 0;

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

  orientation = BitmapInfoOrientation.BottomUp;

  static unserialize( dataView: DataView ) {

    const instance = new BitmapInfoHeader();

    let cursor = 0;

    instance.size = dataView.getUint32( cursor, true ); cursor += 4;
    instance.width = dataView.getInt32( cursor, true ); cursor += 4;
    instance.height = dataView.getInt32( cursor, true ); cursor += 4;
    instance.planes = dataView.getUint16( cursor, true ); cursor += 2;
    instance.bpp = dataView.getUint16( cursor, true ); cursor += 2;
    instance.compression = dataView.getUint32( cursor, true ); cursor += 4;
    instance.imageLength = dataView.getUint32( cursor, true ); cursor += 4;
    instance.ppmX = dataView.getInt32( cursor, true ); cursor += 4;
    instance.ppmY = dataView.getInt32( cursor, true ); cursor += 4;
    instance.colorsUsed = dataView.getUint32( cursor, true ); cursor += 4;
    instance.colorsImportant = dataView.getUint32( cursor, true ); cursor += 4;

    instance.orientation = Math.sign( instance.height );

    if ( instance.colorsUsed === 0 && instance.bpp < 32 ) {
      const colors = 1 << ( instance.bpp * instance.planes );

      if ( colors < 256 ) {
        instance.colorsUsed = colors;
      }
    }

    if ( instance.compression === BitmapInfoCompression.RGB && instance.imageLength === 0 ) {
      // Calculate exactly how many uncompressed bytes there are
      instance.imageLength = ( instance.width * instance.height * instance.bpp ) / 8;
    }

    return instance;

  }

  async serialize(): Promise<ArrayBuffer> {

    const buffer = new ArrayBuffer( BitmapInfoHeader.HEADERSIZE );
    const dataView = new DataView( buffer );

    dataView.setUint32( 0, this.size, true );
    dataView.setInt32( 4, this.width, true );
    dataView.setInt32( 8, this.height, true );
    dataView.setUint16( 12, this.planes, true );
    dataView.setUint16( 14, this.bpp, true );
    dataView.setUint32( 16, this.compression, true );
    dataView.setUint32( 20, this.imageLength, true );
    dataView.setInt32( 24, this.ppmX, true );
    dataView.setInt32( 28, this.ppmY, true );
    dataView.setUint32( 32, this.colorsUsed, true );
    dataView.setUint32( 36, this.colorsImportant, true );

    return buffer;

  }

}
