import './index.css';

import { faviconColorScheme } from './favicon-dark';
import 'alpinejs';
import { IcoEditor } from './ico-editor';

declare global {
  interface Window {
    IcoEditor: typeof IcoEditor,
  }
}

window.IcoEditor = IcoEditor;

window.addEventListener( 'DOMContentLoaded', faviconColorScheme );
