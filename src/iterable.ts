export function* chunks<T>( input: Iterable<T>, size: number, leftovers = true ): Generator<T[], void, unknown> {

  let chunk = [];

  for ( const item of input ) {

    chunk.push( item );

    if ( chunk.length === size ) {
      yield chunk;
      chunk = [];
    }

  }

  if ( leftovers && chunk.length ) {
    yield chunk;
  }

}
