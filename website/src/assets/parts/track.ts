const _paq = (window as { _paq?: string[][] })._paq = (window as { _paq?: string[][] })._paq || [];
/* tracker methods like "setCustomDimension" should be called before "trackPageView" */
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
(function() {
  const u="https://tracking.doussaud.fr/";
  _paq.push(['setTrackerUrl', u+'matomo.php']);
  _paq.push(['setSiteId', '9']);
  const d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
  g.async=true; g.src=u+'matomo.js'; (s.parentNode as ParentNode).insertBefore(g,s);
})();