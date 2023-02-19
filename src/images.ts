export async function loadImage( src: string ) {
  const img = new Image();

  await new Promise( ( resolve, reject ) => {
    img.addEventListener( 'load', resolve );
    img.addEventListener( 'error', reject );
    img.src = src;
  } );

  return img;
}

export async function canvasToBlob( canvas: HTMLCanvasElement, type?: string, quality?: any ): Promise<Blob> {
  return new Promise( ( resolve, reject ) => canvas.toBlob( ( blob ) => {
    if ( blob ) {
      resolve( blob )
    } else {
      reject();
    }
  }, type, quality ) );
}

export function renderRgbaBytesToCanvas( width: number, height: number, bytes: Uint8ClampedArray ) {

  const canvas = document.createElement( 'canvas' );
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext( '2d', { alpha: true } );

  ctx!.putImageData( new ImageData( bytes, width, height ), 0, 0 );

  return canvas;

}

export function downloadBlob( blob: Blob, filename: string ) {

  const url = URL.createObjectURL( blob );
  const link = document.createElement( 'a' );

  link.href = url;
  link.download = filename;

  link.click();

}
