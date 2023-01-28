import { DataViewExtended } from "../../data-view-extended";
import { Structure } from "../structure";
import { IcoEntry } from "./ico-entry";

export class Ico extends Structure {

  static readonly HEADERSIZE = 6

  error?: string;

  images: IcoEntry[] = [];

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
    for ( const image of images ) {
      fileSize += IcoEntry.HEADERSIZE + image.length;
    }

    header.setUint16le( images.length );

    const fileView = new DataViewExtended( new ArrayBuffer( fileSize ) );

    let imageHeaderCursor = fileView.setUint8Array( new Uint8Array( header.buffer ), 0 );

    let imageDataCursor = imageHeaderCursor + IcoEntry.HEADERSIZE * images.length;

    for ( const image of images ) {

      image.offset = imageDataCursor;

      imageHeaderCursor = fileView.setUint8Array( new Uint8Array( await image.serialize() ), imageHeaderCursor );
      imageDataCursor = fileView.setUint8Array( new Uint8Array( image.getImageBytes() ), imageDataCursor );

    }

    return fileView.buffer;

  }

}

export {
  IcoEntry,
};
