export function generateImages() {

  const colorCycle = [
    [ 'red', 'white' ],
    [ 'lime', 'black' ],
    [ 'blue', 'white' ],
    [ 'fuchsia', 'black' ],
    [ 'yellow', 'black' ],
    [ 'cyan', 'black' ],
    [ 'black', 'white' ],
    [ 'white', 'black' ],
  ];

  for ( let i = 1; i <= 256; i++ ) {

    const [ bg, fg ] = colorCycle[ ( i - 1 ) % colorCycle.length ];

    const canvas = document.createElement( 'canvas' );

    canvas.width = canvas.height = i;

    const ctx = canvas.getContext( '2d' );

    if ( !ctx ) continue;

    ctx.fillStyle = bg;
    ctx.fillRect( 0, 0, i, i );

    ctx.fillStyle = fg;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let fontSize = i + 1;
    do {
      ctx.font = `${--fontSize}px "Segoe UI"`;
    } while ( ctx.measureText( i.toString() ).width > i );

    ctx.fillText( i.toString(), i / 2, i / 2 );

    canvas.toBlob( blob => {
      const url = URL.createObjectURL( blob );

      const link = document.createElement( 'a' );
      link.href = url;
      link.download = `${i}.png`;

      const img = new Image();
      img.src = url;

      link.appendChild( img );

      document.body.appendChild( link );
    } );

  }

  const downloadAll = document.createElement( 'button' );
  downloadAll.textContent = 'Download all images';
  downloadAll.addEventListener( 'click', () => {
    document.querySelectorAll( 'a' ).forEach( a => a.click() );
  } );
  document.body.appendChild( downloadAll );

}

document.addEventListener( 'DOMContentLoaded', generateImages );
