import { Structure } from "../structure";
import { IcoEntry } from "./ico-entry";
import { IcoEntryBmp } from "./ico-entry-bmp";
import { IcoEntryPng } from "./ico-entry-png";

export class Ico extends Structure {

  static readonly HEADERSIZE = 6

  error?: string;

  images: IcoEntry[] = [];

  static unserialize( dataView: DataView ) {

    const instance = new this();

    if ( !this.detectIco( dataView ) ) {
      instance.error = 'Not an ICO file';
      return instance;
    }

    let cursor = 4;

    const imageCount = dataView.getUint16( cursor, true ); cursor += 2;

    for ( let i = 0; i < imageCount; i++, cursor += IcoEntry.HEADERSIZE ) {
      const imageBuffer = new DataView( dataView.buffer, cursor );

      const image = IcoEntryPng.detectPng( imageBuffer )
        ? IcoEntryPng.unserialize( imageBuffer )
        : IcoEntryBmp.unserialize( imageBuffer )

      instance.images.push( image );
    }

    console.log( 'Ico', instance );

    return instance;

  }

  static createFromImages( images: IcoEntry[] ): Ico {

    const instance = new Ico();

    instance.images = [ ...images ];

    return instance;

  }

  async serialize(): Promise<ArrayBuffer> {

    const bytes = new Uint8Array( this.serializedLength );
    const dataView = new DataView( bytes.buffer );

    let cursor = 0;

    // Magic bytes
    dataView.setUint16( cursor, 0, true ); cursor += 2;
    dataView.setUint16( cursor, 1, true ); cursor += 2;
    dataView.setUint16( cursor, this.images.length, true ); cursor += 2;

    let imageDataCursor = Ico.HEADERSIZE + this.images.length * IcoEntry.HEADERSIZE;

    for ( const image of this.images ) {

      image.offset = imageDataCursor;

      const imageHeaderBytes = new Uint8Array( await image.serialize() );
      const imageDataBytes = new Uint8Array( image.getImageBytes() );

      bytes.set( imageHeaderBytes, cursor );
      bytes.set( imageDataBytes, imageDataCursor );

      cursor += imageHeaderBytes.length;
      imageDataCursor += imageDataBytes.length;

    }

    return bytes.buffer;

  }

  get serializedLength(): number {

    let size = Ico.HEADERSIZE;

    for ( const image of this.images ) {
      size += image.serializedLength;
    }

    return size;

  }

  static detectIco( dataView: DataView ) {
    const magic = new Uint16Array( dataView.buffer, dataView.byteOffset, 4 );

    return (
      magic[ 0 ] === 0 &&
      magic[ 1 ] === 1
    )
  }

}

export {
  IcoEntry,
};
