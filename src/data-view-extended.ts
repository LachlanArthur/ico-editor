export class DataViewExtended extends DataView {

  static get [ Symbol.species ]() { return DataView; }

  public cursor = 0;

  protected _getFloat32( littleEndian: boolean ) {
    const value = super.getFloat32( this.cursor, littleEndian );
    this.cursor += 4;
    return value;
  }

  protected _getFloat64( littleEndian: boolean ) {
    const value = super.getFloat64( this.cursor, littleEndian );
    this.cursor += 8;
    return value;
  }

  protected _getInt8() {
    const value = super.getInt8( this.cursor );
    this.cursor += 1;
    return value;
  }

  protected _getInt16( littleEndian: boolean ) {
    const value = super.getInt16( this.cursor, littleEndian );
    this.cursor += 2;
    return value;
  }

  protected _getInt32( littleEndian: boolean ) {
    const value = super.getInt32( this.cursor, littleEndian );
    this.cursor += 4;
    return value;
  }

  protected _getUint8() {
    const value = super.getUint8( this.cursor );
    this.cursor += 1;
    return value;
  }

  protected _getUint16( littleEndian: boolean ) {
    const value = super.getUint16( this.cursor, littleEndian );
    this.cursor += 2;
    return value;
  }

  protected _getUint32( littleEndian: boolean ) {
    const value = super.getUint32( this.cursor, littleEndian );
    this.cursor += 4;
    return value;
  }

  protected _getBigInt64( littleEndian: boolean ) {
    const value = super.getBigInt64( this.cursor, littleEndian );
    this.cursor += 8;
    return value;
  }

  protected _getBigUint64( littleEndian: boolean ) {
    const value = super.getBigUint64( this.cursor, littleEndian );
    this.cursor += 8;
    return value;
  }

  protected _getFloat32Array( count: number, littleEndian: boolean ) {
    const data = new Float32Array( count );
    for ( let i = 0; i < count; i++ ) {
      data.set( [ this._getFloat32( littleEndian ) ], i );
    }
    return data;
  }

  protected _getFloat64Array( count: number, littleEndian: boolean ) {
    const data = new Float64Array( count );
    for ( let i = 0; i < count; i++ ) {
      data.set( [ this._getFloat64( littleEndian ) ], i );
    }
    return data;
  }

  protected _getInt8Array( count: number ) {
    const data = new Int8Array( count );
    for ( let i = 0; i < count; i++ ) {
      data.set( [ this._getInt8() ], i );
    }
    return data;
  }

  protected _getInt16Array( count: number, littleEndian: boolean ) {
    const data = new Int16Array( count );
    for ( let i = 0; i < count; i++ ) {
      data.set( [ this._getInt16( littleEndian ) ], i );
    }
    return data;
  }

  protected _getInt32Array( count: number, littleEndian: boolean ) {
    const data = new Int32Array( count );
    for ( let i = 0; i < count; i++ ) {
      data.set( [ this._getInt32( littleEndian ) ], i );
    }
    return data;
  }

  protected _getUint8Array( count: number ) {
    const data = new Uint8Array( count );
    for ( let i = 0; i < count; i++ ) {
      data.set( [ this._getUint8() ], i );
    }
    return data;
  }

  protected _getUint16Array( count: number, littleEndian: boolean ) {
    const data = new Uint16Array( count );
    for ( let i = 0; i < count; i++ ) {
      data.set( [ this._getUint16( littleEndian ) ], i );
    }
    return data;
  }

  protected _getUint32Array( count: number, littleEndian: boolean ) {
    const data = new Uint32Array( count );
    for ( let i = 0; i < count; i++ ) {
      data.set( [ this._getUint32( littleEndian ) ], i );
    }
    return data;
  }

  protected _getBigInt64Array( count: number, littleEndian: boolean ) {
    const data = new BigInt64Array( count );
    for ( let i = 0; i < count; i++ ) {
      data.set( [ this._getBigInt64( littleEndian ) ], i );
    }
    return data;
  }

  protected _getBigUint64Array( count: number, littleEndian: boolean ) {
    const data = new BigUint64Array( count );
    for ( let i = 0; i < count; i++ ) {
      data.set( [ this._getBigUint64( littleEndian ) ], i );
    }
    return data;
  }

  protected advanceCursor( size: number, cursor?: number ) {
    if ( typeof cursor === 'undefined' ) {
      return this.cursor += size;
    }

    return cursor + size;
  }

  protected _setFloat32( value: number, littleEndian: boolean, cursor?: number ) {
    super.setFloat32( cursor ?? this.cursor, value, littleEndian );
    return this.advanceCursor( 4, cursor );
  }

  protected _setFloat64( value: number, littleEndian: boolean, cursor?: number ) {
    super.setFloat64( cursor ?? this.cursor, value, littleEndian );
    return this.advanceCursor( 8, cursor );
  }

  protected _setInt8( value: number, cursor?: number ) {
    super.setInt8( cursor ?? this.cursor, value );
    return this.advanceCursor( 1, cursor );
  }

  protected _setInt16( value: number, littleEndian: boolean, cursor?: number ) {
    super.setInt16( cursor ?? this.cursor, value, littleEndian );
    return this.advanceCursor( 2, cursor );
  }

  protected _setInt32( value: number, littleEndian: boolean, cursor?: number ) {
    super.setInt32( cursor ?? this.cursor, value, littleEndian );
    return this.advanceCursor( 4, cursor );
  }

  protected _setUint8( value: number, cursor?: number ) {
    super.setUint8( cursor ?? this.cursor, value );
    return this.advanceCursor( 1, cursor );
  }

  protected _setUint16( value: number, littleEndian: boolean, cursor?: number ) {
    super.setUint16( cursor ?? this.cursor, value, littleEndian );
    return this.advanceCursor( 2, cursor );
  }

  protected _setUint32( value: number, littleEndian: boolean, cursor?: number ) {
    super.setUint32( cursor ?? this.cursor, value, littleEndian );
    return this.advanceCursor( 4, cursor );
  }

  protected _setBigInt64( value: bigint, littleEndian: boolean, cursor?: number ) {
    super.setBigInt64( cursor ?? this.cursor, value, littleEndian );
    return this.advanceCursor( 8, cursor );
  }

  protected _setBigUint64( value: bigint, littleEndian: boolean, cursor?: number ) {
    super.setBigUint64( cursor ?? this.cursor, value, littleEndian );
    return this.advanceCursor( 8, cursor );
  }

  protected _setFloat32Array( values: number[] | Float32Array, littleEndian: boolean, cursor?: number ) {
    for ( let value of values ) {
      cursor = this._setFloat32( value, littleEndian, cursor );
    }
    return cursor ?? this.cursor;
  }

  protected _setFloat64Array( values: number[] | Float64Array, littleEndian: boolean, cursor?: number ) {
    for ( let value of values ) {
      cursor = this._setFloat64( value, littleEndian, cursor );
    }
    return cursor ?? this.cursor;
  }

  protected _setInt8Array( values: number[] | Int8Array, cursor?: number ) {
    for ( let value of values ) {
      cursor = this._setInt8( value, cursor );
    }
    return cursor ?? this.cursor;
  }

  protected _setInt16Array( values: number[] | Int16Array, littleEndian: boolean, cursor?: number ) {
    for ( let value of values ) {
      cursor = this._setInt16( value, littleEndian, cursor );
    }
    return cursor ?? this.cursor;
  }

  protected _setInt32Array( values: number[] | Int32Array, littleEndian: boolean, cursor?: number ) {
    for ( let value of values ) {
      cursor = this._setInt32( value, littleEndian, cursor );
    }
    return cursor ?? this.cursor;
  }

  protected _setUint8Array( values: number[] | Uint8Array, cursor?: number ) {
    for ( let value of values ) {
      cursor = this._setUint8( value, cursor );
    }
    return cursor ?? this.cursor;
  }

  protected _setUint16Array( values: number[] | Uint16Array, littleEndian: boolean, cursor?: number ) {
    for ( let value of values ) {
      cursor = this._setUint16( value, littleEndian, cursor );
    }
    return cursor ?? this.cursor;
  }

  protected _setUint32Array( values: number[] | Uint32Array, littleEndian: boolean, cursor?: number ) {
    for ( let value of values ) {
      cursor = this._setUint32( value, littleEndian, cursor );
    }
    return cursor ?? this.cursor;
  }

  protected _setBigInt64Array( values: bigint[] | BigInt64Array, littleEndian: boolean, cursor?: number ) {
    for ( let value of values ) {
      cursor = this._setBigInt64( value, littleEndian, cursor );
    }
    return cursor ?? this.cursor;
  }

  protected _setBigUint64Array( values: bigint[] | BigUint64Array, littleEndian: boolean, cursor?: number ) {
    for ( let value of values ) {
      cursor = this._setBigUint64( value, littleEndian, cursor );
    }
    return cursor ?? this.cursor;
  }

  getFloat32le() {
    return this._getFloat32( true );
  }

  getFloat32be() {
    return this._getFloat32( false );
  }

  getFloat64le() {
    return this._getFloat64( true );
  }

  getFloat64be() {
    return this._getFloat64( false );
  }

  getInt8() {
    return this._getInt8();
  }

  getInt16le() {
    return this._getInt16( true );
  }

  getInt16be() {
    return this._getInt16( false );
  }

  getInt32le() {
    return this._getInt32( true );
  }

  getInt32be() {
    return this._getInt32( false );
  }

  getUint8() {
    return this._getUint8();
  }

  getUint16le() {
    return this._getUint16( true );
  }

  getUint16be() {
    return this._getUint16( false );
  }

  getUint32le() {
    return this._getUint32( true );
  }

  getUint32be() {
    return this._getUint32( false );
  }

  getBigInt64le() {
    return this._getBigInt64( true );
  }

  getBigInt64be() {
    return this._getBigInt64( false );
  }

  getBigUint64le(): bigint {
    return this._getBigUint64( true );
  }

  getBigUint64be(): bigint {
    return this._getBigUint64( false );
  }

  getFloat32leArray( count: number ) {
    return this._getFloat32Array( count, true );
  }

  getFloat32beArray( count: number ) {
    return this._getFloat32Array( count, false );
  }

  getFloat64leArray( count: number ) {
    return this._getFloat64Array( count, true );
  }

  getFloat64beArray( count: number ) {
    return this._getFloat64Array( count, false );
  }

  getInt8Array( count: number ) {
    return this._getInt8Array( count );
  }

  getInt16leArray( count: number ) {
    return this._getInt16Array( count, true );
  }

  getInt16beArray( count: number ) {
    return this._getInt16Array( count, false );
  }

  getInt32leArray( count: number ) {
    return this._getInt32Array( count, true );
  }

  getInt32beArray( count: number ) {
    return this._getInt32Array( count, false );
  }

  getUint8Array( count: number ) {
    return this._getUint8Array( count );
  }

  getUint16leArray( count: number ) {
    return this._getUint16Array( count, true );
  }

  getUint16beArray( count: number ) {
    return this._getUint16Array( count, false );
  }

  getUint32leArray( count: number ) {
    return this._getUint32Array( count, true );
  }

  getUint32beArray( count: number ) {
    return this._getUint32Array( count, false );
  }

  getBigInt64leArray( count: number ) {
    return this._getBigInt64Array( count, true );
  }

  getBigInt64beArray( count: number ) {
    return this._getBigInt64Array( count, false );
  }

  getBigUint64leArray( count: number ) {
    return this._getBigUint64Array( count, true );
  }

  getBigUint64beArray( count: number ) {
    return this._getBigUint64Array( count, false );
  }

  setFloat32le( value: number, cursor?: number ) {
    return this._setFloat32( value, true, cursor );
  }

  setFloat32be( value: number, cursor?: number ) {
    return this._setFloat32( value, false, cursor );
  }

  setFloat64le( value: number, cursor?: number ) {
    return this._setFloat64( value, true, cursor );
  }

  setFloat64be( value: number, cursor?: number ) {
    return this._setFloat64( value, false, cursor );
  }

  setInt8( value: number, cursor?: number ) {
    return this._setInt8( value, cursor );
  }

  setInt16le( value: number, cursor?: number ) {
    return this._setInt16( value, true, cursor );
  }

  setInt16be( value: number, cursor?: number ) {
    return this._setInt16( value, false, cursor );
  }

  setInt32le( value: number, cursor?: number ) {
    return this._setInt32( value, true, cursor );
  }

  setInt32be( value: number, cursor?: number ) {
    return this._setInt32( value, false, cursor );
  }

  setUint8( value: number, cursor?: number ) {
    return this._setUint8( value, cursor );
  }

  setUint16le( value: number, cursor?: number ) {
    return this._setUint16( value, true, cursor );
  }

  setUint16be( value: number, cursor?: number ) {
    return this._setUint16( value, false, cursor );
  }

  setUint32le( value: number, cursor?: number ) {
    return this._setUint32( value, true, cursor );
  }

  setUint32be( value: number, cursor?: number ) {
    return this._setUint32( value, false, cursor );
  }

  setBigInt64le( value: bigint, cursor?: number ) {
    return this._setBigInt64( value, true, cursor );
  }

  setBigInt64be( value: bigint, cursor?: number ) {
    return this._setBigInt64( value, false, cursor );
  }

  setBigUint64le( value: bigint, cursor?: number ) {
    return this._setBigUint64( value, true, cursor );
  }

  setBigUint64be( value: bigint, cursor?: number ) {
    return this._setBigUint64( value, false, cursor );
  }

  setFloat32leArray( values: number[] | Float32Array, cursor?: number ) {
    return this._setFloat32Array( values, true, cursor );
  }

  setFloat32beArray( values: number[] | Float32Array, cursor?: number ) {
    return this._setFloat32Array( values, false, cursor );
  }

  setFloat64leArray( values: number[] | Float64Array, cursor?: number ) {
    return this._setFloat64Array( values, true, cursor );
  }

  setFloat64beArray( values: number[] | Float64Array, cursor?: number ) {
    return this._setFloat64Array( values, false, cursor );
  }

  setInt8Array( values: number[] | Int8Array, cursor?: number ) {
    return this._setInt8Array( values, cursor );
  }

  setInt16leArray( values: number[] | Int16Array, cursor?: number ) {
    return this._setInt16Array( values, true, cursor );
  }

  setInt16beArray( values: number[] | Int16Array, cursor?: number ) {
    return this._setInt16Array( values, false, cursor );
  }

  setInt32leArray( values: number[] | Int32Array, cursor?: number ) {
    return this._setInt32Array( values, true, cursor );
  }

  setInt32beArray( values: number[] | Int32Array, cursor?: number ) {
    return this._setInt32Array( values, false, cursor );
  }

  setUint8Array( values: number[] | Uint8Array, cursor?: number ) {
    return this._setUint8Array( values, cursor );
  }

  setUint16leArray( values: number[] | Uint16Array, cursor?: number ) {
    return this._setUint16Array( values, true, cursor );
  }

  setUint16beArray( values: number[] | Uint16Array, cursor?: number ) {
    return this._setUint16Array( values, false, cursor );
  }

  setUint32leArray( values: number[] | Uint32Array, cursor?: number ) {
    return this._setUint32Array( values, true, cursor );
  }

  setUint32beArray( values: number[] | Uint32Array, cursor?: number ) {
    return this._setUint32Array( values, false, cursor );
  }

  setBigInt64leArray( values: bigint[] | BigInt64Array, cursor?: number ) {
    return this._setBigInt64Array( values, true, cursor );
  }

  setBigInt64beArray( values: bigint[] | BigInt64Array, cursor?: number ) {
    return this._setBigInt64Array( values, false, cursor );
  }

  setBigUint64leArray( values: bigint[] | BigUint64Array, cursor?: number ) {
    return this._setBigUint64Array( values, true, cursor );
  }

  setBigUint64beArray( values: bigint[] | BigUint64Array, cursor?: number ) {
    return this._setBigUint64Array( values, false, cursor );
  }

}
