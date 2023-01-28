import type { DataViewExtended } from "../data-view-extended";

export abstract class Structure {
  constructor( public data: DataViewExtended ) { }

  static unserialize( dataView: DataViewExtended ): Structure {
    throw new Error( 'Not implemented' );
  }

  abstract serialize(): Promise<ArrayBuffer>;
}
