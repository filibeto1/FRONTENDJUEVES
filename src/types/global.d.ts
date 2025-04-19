declare module '@babel/core';
declare module '@babel/generator';
declare module '@babel/template'; 
declare module '@babel/traverse';
// Crea un archivo src/types/global.d.ts con:
declare namespace JSX {
    interface IntrinsicElements {
      strong: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>, 
        HTMLElement
      >;
    }
  }