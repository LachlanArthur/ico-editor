import { loadImage } from "../../images";
import { IcoEntry } from "./ico-entry";
import { toSuffixed } from "../../si-suffix";

export class IcoEntryPng extends IcoEntry {

  readonly type = 'png';

  static unserialize( dataView: DataView ): IcoEntryPng {
    return super.unserialize( dataView ) as IcoEntryPng;
  }

  static async createFromFile( file: File ) {

    const entry = new IcoEntryPng();

    if ( file.type !== 'image/png' ) {
      entry.error = 'Not a PNG file';
      return entry;
    }

    if ( file.size > 2 ** 32 ) {
      entry.error = `PNG is too large, max size is ${toSuffixed( 2 ** 32 )}`;
      return entry;
    }

    const blobUrl = URL.createObjectURL( file );
    const img = await loadImage( blobUrl );

    entry.width = img.width;
    entry.height = img.height;
    entry.colors = 0;
    entry.planes = 1;
    entry.bpp = 32;
    entry.length = file.size;
    entry.offset = 16;

    entry.imageData = new Uint8ClampedArray( await file.arrayBuffer() );
    entry.blobUrl = blobUrl;

    return entry;

  }

  protected blob?: Blob;

  async getImageBlob(): Promise<Blob> {

    if ( this.blob ) return this.blob;

    this.blob = this.getStandaloneBlob();

    return this.blob;

  }

  getStandaloneBlob() {

    return new Blob( [ this.getImageBytes() ], { type: 'image/png' } );

  }

  static detectPng( dataView: DataView ) {
    const offset = dataView.getUint32( 12, true );

    const magic = new Uint8Array( dataView.buffer.slice( offset, offset + 8 ) );

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

}
