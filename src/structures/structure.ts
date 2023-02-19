export abstract class Structure {
  static unserialize( dataView: DataView ) {
    throw new Error( 'Not implemented' );
  }

  abstract serialize(): Promise<ArrayBuffer>;
}
