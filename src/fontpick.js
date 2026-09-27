/* v15.2: WHICH OF GOOGLE'S FONT FILES THIS BROWSER WOULD BE SENT.
   fonts.googleapis.com answers the same stylesheet URL with DIFFERENT font
   files per browser — hinted ones for Windows and Linux, unhinted for Apple
   and phones, a woff for three Cormorant italics on a Mac outside Chrome, a
   full TTF for anything it does not recognise — so self-hosting one set
   would change how the text is drawn on some screen. tools/fontsnap.mjs
   asked Google with 60 browsers' user-agent strings and found five answers
   that cover every browser a player is likely to hold; this picks which of
   the five THIS browser would get. The patterns are deliberately narrow —
   the exact shapes that were asked, with version floors — and anything else
   returns null, which keeps today's Google link: an unrecognised browser is
   treated exactly as it always was. build.py inlines this function into the
   hosted page; fontsnap.mjs runs the same source in Node and checks every
   answer against Google's.                                                  */
function fontClass(ua) {
  var m;
  if (typeof ua !== 'string' || ua.length > 512) return null;
  /* iPhone and iPad (mobile mode): every browser there is WebKit and Google
     answers them alike — Safari, Chrome, Edge, Firefox and the in-app views */
  m = /^Mozilla\/5\.0 \((?:iPhone|iPad); CPU (?:iPhone )?OS (\d+)_\d+(?:_\d+)? like Mac OS X\) AppleWebKit\/605\.1\.15 \(KHTML, like Gecko\)/.exec(ua);
  if (m) return +m[1] >= 15 ? 'mobile' : null;
  /* Android: Chrome, Samsung Internet, the system WebView, Opera — never Edge
     (Google answers Android Edge differently), never an in-app suffix */
  m = /^Mozilla\/5\.0 \(Linux; Android [\d.]+(?:; [^;()]+)*\) AppleWebKit\/537\.36 \(KHTML, like Gecko\) (?:Version\/4\.0 )?(?:SamsungBrowser\/[\d.]+ )?Chrome\/(\d+)\.[\d.]+ (?:Mobile )?Safari\/537\.36(?: OPR\/[\d.]+)?$/.exec(ua);
  if (m) return +m[1] >= 109 ? 'mobile' : null;
  m = /^Mozilla\/5\.0 \(Android [\d.]+; (?:Mobile|Tablet); rv:(\d+)\.\d+\) Gecko\/[\d.]+ Firefox\/[\d.]+$/.exec(ua);
  if (m) return +m[1] >= 115 ? 'mobile' : null;
  /* Windows, Linux and ChromeOS: Chrome and Edge (and the headless test
     browser, which Google answers the same) */
  m = /^Mozilla\/5\.0 \((?:Windows NT (?:10\.0|6\.1); Win64; x64|X11; Linux x86_64|X11; CrOS x86_64 [\d.]+)\) AppleWebKit\/537\.36 \(KHTML, like Gecko\) (?:Headless)?Chrome\/(\d+)\.[\d.]+ Safari\/537\.36(?: Edg\/[\d.]+)?$/.exec(ua);
  if (m) return +m[1] >= 109 ? 'winlinux' : null;
  m = /^Mozilla\/5\.0 \(X11; Linux x86_64; rv:(\d+)\.\d+\) Gecko\/20100101 Firefox\/[\d.]+$/.exec(ua);
  if (m) return +m[1] >= 115 ? 'winlinux' : null;
  m = /^Mozilla\/5\.0 \(Windows NT 10\.0; Win64; x64; rv:(\d+)\.\d+\) Gecko\/20100101 Firefox\/[\d.]+$/.exec(ua);
  if (m) return +m[1] >= 115 ? 'winff' : null;
  /* a Mac: Chrome has its own answer; Safari, Firefox, Edge and Opera share one */
  m = /^Mozilla\/5\.0 \(Macintosh; Intel Mac OS X 10_15_7\) AppleWebKit\/537\.36 \(KHTML, like Gecko\) Chrome\/(\d+)\.[\d.]+ Safari\/537\.36( (?:Edg|OPR)\/[\d.]+)?$/.exec(ua);
  if (m) return +m[1] >= 110 ? (m[2] ? 'mac' : 'macchrome') : null;
  m = /^Mozilla\/5\.0 \(Macintosh; Intel Mac OS X 10_15_7\) AppleWebKit\/605\.1\.15 \(KHTML, like Gecko\) Version\/(\d+)(?:\.\d+)* Safari\/605\.1\.15$/.exec(ua);
  if (m) return +m[1] >= 15 ? 'mac' : null;
  m = /^Mozilla\/5\.0 \(Macintosh; Intel Mac OS X 10\.15; rv:(\d+)\.\d+\) Gecko\/20100101 Firefox\/[\d.]+$/.exec(ua);
  if (m) return +m[1] >= 115 ? 'mac' : null;
  return null;
}
