export function faviconColorScheme() {

  const favicon = document.documentElement.querySelector( 'head link[rel="icon"][data-light][data-dark]' ) as HTMLLinkElement;

  if ( !favicon || !window.matchMedia ) return;

  function updateFavicon( isDark: boolean ) {
    favicon.setAttribute( 'href', favicon.dataset[ isDark ? 'dark' : 'light' ] as string );
  }

  const listener = ( e: MediaQueryList | MediaQueryListEvent ) => updateFavicon( e.matches );

  const mq = window.matchMedia( '(prefers-color-scheme: dark)' );

  listener( mq );

  mq.addListener( listener );

}
