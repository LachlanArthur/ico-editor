const suffixes = [
  'B',
  'KB',
  'MB',
  'GB',
  'TB',
];

export function toSuffixed( n: number ) {
  let i = 0, _n = n;
  while ( _n > 1024 && i++ < suffixes.length ) {
    _n >>= 10;
  }
  n /= 1024 ** i;
  return `${n.toFixed( 2 ).replace( /(\.0+|0+)$/, '' )}${suffixes[ i ]}`;
}
