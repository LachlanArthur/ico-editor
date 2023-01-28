export async function loadImage( src: string ) {
  const img = new Image();

  await new Promise( ( resolve, reject ) => {
    img.addEventListener( 'load', resolve );
    img.addEventListener( 'error', reject );
    img.src = src;
  } );

  return img;
}
