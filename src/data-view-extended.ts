export class DataViewExtended extends DataView {

  static get [ Symbol.species ]() { return DataView; }

  public cursor = 0;

  protected _getFloat32( littleEndian?: boolean ) {
    const value = super.getFloat32( this.cursor, littleEndian );
    this.cursor += 4;
    return value;
  }

  protected _getFloat64( littleEndian?: boolean ) {
    const value = super.getFloat64( this.cursor, littleEndian );
    this.cursor += 8;
    return value;
  }

  protected _getInt8() {
    const value = super.getInt8( this.cursor );
    this.cursor += 1;
    return value;
  }

  protected _getInt16( littleEndian?: boolean ) {
    const value = super.getInt16( this.cursor, littleEndian );
    this.cursor += 2;
    return value;
  }

  protected _getInt32( littleEndian?: boolean ) {
    const value = super.getInt32( this.cursor, littleEndian );
    this.cursor += 4;
    return value;
  }

  protected _getUint8() {
    const value = super.getUint8( this.cursor );
    this.cursor += 1;
    return value;
  }

  protected _getUint16( littleEndian?: boolean ) {
    const value = super.getUint16( this.cursor, littleEndian );
    this.cursor += 2;
    return value;
  }

  protected _getUint32( littleEndian?: boolean ) {
    const value = super.getUint32( this.cursor, littleEndian );
    this.cursor += 4;
    return value;
  }

  protected _getBigInt64( littleEndian?: boolean ) {
    const value = super.getBigInt64( this.cursor, littleEndian );
    this.cursor += 8;
    return value;
  }

  protected _getBigUint64( littleEndian?: boolean ) {
    const value = super.getBigUint64( this.cursor, littleEndian );
    this.cursor += 8;
    return value;
  }

  protected _getFloat32Array( count: number, littleEndian?: boolean ) {
    const data = new Float32Array( count );
    for ( let i = 0; i < count; i++ ) {
      data.set( [ this._getFloat32( littleEndian ) ], i );
    }
    return data;
  }

  protected _getFloat64Array( count: number, littleEndian?: boolean ) {
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

  protected _getInt16Array( count: number, littleEndian?: boolean ) {
    const data = new Int16Array( count );
    for ( let i = 0; i < count; i++ ) {
      data.set( [ this._getInt16( littleEndian ) ], i );
    }
    return data;
  }

  protected _getInt32Array( count: number, littleEndian?: boolean ) {
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

  protected _getUint16Array( count: number, littleEndian?: boolean ) {
    const data = new Uint16Array( count );
    for ( let i = 0; i < count; i++ ) {
      data.set( [ this._getUint16( littleEndian ) ], i );
    }
    return data;
  }

  protected _getUint32Array( count: number, littleEndian?: boolean ) {
    const data = new Uint32Array( count );
    for ( let i = 0; i < count; i++ ) {
      data.set( [ this._getUint32( littleEndian ) ], i );
    }
    return data;
  }

  protected _getBigInt64Array( count: number, littleEndian?: boolean ) {
    const data = new BigInt64Array( count );
    for ( let i = 0; i < count; i++ ) {
      data.set( [ this._getBigInt64( littleEndian ) ], i );
    }
    return data;
  }

  protected _getBigUint64Array( count: number, littleEndian?: boolean ) {
    const data = new BigUint64Array( count );
    for ( let i = 0; i < count; i++ ) {
      data.set( [ this._getBigUint64( littleEndian ) ], i );
    }
    return data;
  }

  protected _setFloat32( value: number, littleEndian?: boolean ) {
    super.setFloat32( this.cursor, value, littleEndian );
    this.cursor += 4;
  }

  protected _setFloat64( value: number, littleEndian?: boolean ) {
    super.setFloat64( this.cursor, value, littleEndian );
    this.cursor += 8;
  }

  protected _setInt8( value: number ) {
    super.setInt8( this.cursor, value );
    this.cursor += 1;
  }

  protected _setInt16( value: number, littleEndian?: boolean ) {
    super.setInt16( this.cursor, value, littleEndian );
    this.cursor += 2;
  }

  protected _setInt32( value: number, littleEndian?: boolean ) {
    super.setInt32( this.cursor, value, littleEndian );
    this.cursor += 4;
  }

  protected _setUint8( value: number ) {
    super.setUint8( this.cursor, value );
    this.cursor += 1;
  }

  protected _setUint16( value: number, littleEndian?: boolean ) {
    super.setUint16( this.cursor, value, littleEndian );
    this.cursor += 2;
  }

  protected _setUint32( value: number, littleEndian?: boolean ) {
    super.setUint32( this.cursor, value, littleEndian );
    this.cursor += 4;
  }

  protected _setBigInt64( value: bigint, littleEndian?: boolean ) {
    super.setBigInt64( this.cursor, value, littleEndian );
    this.cursor += 8;
  }

  protected _setBigUint64( value: bigint, littleEndian?: boolean ) {
    super.setBigUint64( this.cursor, value, littleEndian );
    this.cursor += 8;
  }

  protected _setFloat32Array( values: number[] | Float32Array, littleEndian?: boolean ) {
    for ( let value of values ) {
      this._setFloat32( value, littleEndian );
    }
  }

  protected _setFloat64Array( values: number[] | Float64Array, littleEndian?: boolean ) {
    for ( let value of values ) {
      this._setFloat64( value, littleEndian );
    }
  }

  protected _setInt8Array( values: number[] | Int8Array ) {
    for ( let value of values ) {
      this._setInt8( value );
    }
  }

  protected _setInt16Array( values: number[] | Int16Array, littleEndian?: boolean ) {
    for ( let value of values ) {
      this._setInt16( value, littleEndian );
    }
  }

  protected _setInt32Array( values: number[] | Int32Array, littleEndian?: boolean ) {
    for ( let value of values ) {
      this._setInt32( value, littleEndian );
    }
  }

  protected _setUint8Array( values: number[] | Uint8Array ) {
    for ( let value of values ) {
      this._setUint8( value );
    }
  }

  protected _setUint16Array( values: number[] | Uint16Array, littleEndian?: boolean ) {
    for ( let value of values ) {
      this._setUint16( value, littleEndian );
    }
  }

  protected _setUint32Array( values: number[] | Uint32Array, littleEndian?: boolean ) {
    for ( let value of values ) {
      this._setUint32( value, littleEndian );
    }
  }

  protected _setBigInt64Array( values: bigint[] | BigInt64Array, littleEndian?: boolean ) {
    for ( let value of values ) {
      this._setBigInt64( value, littleEndian );
    }
  }

  protected _setBigUint64Array( values: bigint[] | BigUint64Array, littleEndian?: boolean ) {
    for ( let value of values ) {
      this._setBigUint64( value, littleEndian );
    }
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

  setFloat32le( value: number ) {
    this._setFloat32( value, true );
  }

  setFloat32be( value: number ) {
    this._setFloat32( value, false );
  }

  setFloat64le( value: number ) {
    this._setFloat64( value, true );
  }

  setFloat64be( value: number ) {
    this._setFloat64( value, false );
  }

  setInt8( value: number ) {
    this._setInt8( value );
  }

  setInt16le( value: number ) {
    this._setInt16( value, true );
  }

  setInt16be( value: number ) {
    this._setInt16( value, false );
  }

  setInt32le( value: number ) {
    this._setInt32( value, true );
  }

  setInt32be( value: number ) {
    this._setInt32( value, false );
  }

  setUint8( value: number ) {
    this._setUint8( value );
  }

  setUint16le( value: number ) {
    this._setUint16( value, true );
  }

  setUint16be( value: number ) {
    this._setUint16( value, false );
  }

  setUint32le( value: number ) {
    this._setUint32( value, true );
  }

  setUint32be( value: number ) {
    this._setUint32( value, false );
  }

  setBigInt64le( value: bigint ) {
    this._setBigInt64( value, true );
  }

  setBigInt64be( value: bigint ) {
    this._setBigInt64( value, false );
  }

  setBigUint64le( value: bigint ) {
    this._setBigUint64( value, true );
  }

  setBigUint64be( value: bigint ) {
    this._setBigUint64( value, false );
  }

  setFloat32leArray( values: number[] | Float32Array ) {
    this._setFloat32Array( values, true );
  }

  setFloat32beArray( values: number[] | Float32Array ) {
    this._setFloat32Array( values, false );
  }

  setFloat64leArray( values: number[] | Float64Array ) {
    this._setFloat64Array( values, true );
  }

  setFloat64beArray( values: number[] | Float64Array ) {
    this._setFloat64Array( values, false );
  }

  setInt8Array( values: number[] | Int8Array ) {
    this._setInt8Array( values );
  }

  setInt16leArray( values: number[] | Int16Array ) {
    this._setInt16Array( values, true );
  }

  setInt16beArray( values: number[] | Int16Array ) {
    this._setInt16Array( values, false );
  }

  setInt32leArray( values: number[] | Int32Array ) {
    this._setInt32Array( values, true );
  }

  setInt32beArray( values: number[] | Int32Array ) {
    this._setInt32Array( values, false );
  }

  setUint8Array( values: number[] | Uint8Array ) {
    this._setUint8Array( values );
  }

  setUint16leArray( values: number[] | Uint16Array ) {
    this._setUint16Array( values, true );
  }

  setUint16beArray( values: number[] | Uint16Array ) {
    this._setUint16Array( values, false );
  }

  setUint32leArray( values: number[] | Uint32Array ) {
    this._setUint32Array( values, true );
  }

  setUint32beArray( values: number[] | Uint32Array ) {
    this._setUint32Array( values, false );
  }

  setBigInt64leArray( values: bigint[] | BigInt64Array ) {
    this._setBigInt64Array( values, true );
  }

  setBigInt64beArray( values: bigint[] | BigInt64Array ) {
    this._setBigInt64Array( values, false );
  }

  setBigUint64leArray( values: bigint[] | BigUint64Array ) {
    this._setBigUint64Array( values, true );
  }

  setBigUint64beArray( values: bigint[] | BigUint64Array ) {
    this._setBigUint64Array( values, false );
  }

}
