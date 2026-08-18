/** Forces light mode before paint and clears any saved dark preference. */
export const THEME_BOOTSTRAP_SCRIPT = `(function(){try{document.documentElement.classList.remove('dark');localStorage.setItem('theme','light')}catch(e){}})()`
