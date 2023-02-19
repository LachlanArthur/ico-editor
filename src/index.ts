import { faviconColorScheme } from './favicon-dark';
import Alpine from 'alpinejs';
import { IcoEditor } from './ico-editor';

declare global {
  interface Window {
    IcoEditor: typeof IcoEditor,
  }
}

window.IcoEditor = IcoEditor;

window.addEventListener( 'DOMContentLoaded', faviconColorScheme );

Alpine.start();
