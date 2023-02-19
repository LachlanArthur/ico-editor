import { loadImage } from "../../images";
import { Structure } from "../structure";
import type { IcoEntryPng } from "./ico-entry-png";

export abstract class IcoEntry extends Structure {

  static readonly HEADERSIZE = 16

  abstract readonly type: 'png' | 'bmp';

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

  /**
   * Image data
   */
  imageData!: Uint8ClampedArray;

  static unserialize( dataView: DataView ) {

    const instance = new ( this as unknown as { new(): IcoEntry } )();

    let cursor = 0;

    instance.width = dataView.getUint8( cursor ); cursor += 1;
    instance.height = dataView.getUint8( cursor ); cursor += 1;
    instance.colors = dataView.getUint8( cursor ); cursor += 1;
    cursor += 1; // Skip reserved byte
    instance.planes = dataView.getUint16( cursor, true ); cursor += 2;
    instance.bpp = dataView.getUint16( cursor, true ); cursor += 2;
    instance.length = dataView.getUint32( cursor, true ); cursor += 4;
    instance.offset = dataView.getUint32( cursor, true ); cursor += 4;

    if ( instance.width === 0 ) instance.width = 256;
    if ( instance.height === 0 ) instance.height = 256;

    instance.imageData = new Uint8ClampedArray( dataView.buffer, instance.offset, instance.length );

    return instance;

  }

  async serialize(): Promise<ArrayBuffer> {

    const buffer = new ArrayBuffer( IcoEntry.HEADERSIZE );
    const view = new DataView( buffer );

    let cursor = 0;

    view.setUint8( cursor, this.width >= 256 ? 0 : this.width ); cursor += 1;
    view.setUint8( cursor, this.height >= 256 ? 0 : this.height ); cursor += 1;
    view.setUint8( cursor, this.colors ); cursor += 1;
    cursor += 1; // Skip reserved byte
    view.setUint16( cursor, 1, true ); cursor += 2; // Planes
    view.setUint16( cursor, this.bpp, true ); cursor += 2;
    view.setUint32( cursor, this.length, true ); cursor += 4;
    view.setUint32( cursor, this.offset, true ); cursor += 4;

    return buffer;

  }

  get serializedLength(): number {
    return IcoEntry.HEADERSIZE + this.length;
  }

  getImageBytes() {
    return this.imageData;
  }

  abstract getStandaloneBlob(): Blob;

  abstract getImageBlob(): Promise<Blob>;

  blobUrl?: string;

  async getBlobUrl(): Promise<string> {
    if ( this.blobUrl ) return this.blobUrl;

    const blob = await this.getImageBlob();

    this.blobUrl = URL.createObjectURL( blob );

    return this.blobUrl;
  }

}
