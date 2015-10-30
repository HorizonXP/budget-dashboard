
function base64urldecode(arg) {
  var s = arg;
  s = s.replace(/-/g, '+'); // 62nd char of encoding
  s = s.replace(/_/g, '/'); // 63rd char of encoding
  switch (s.length % 4) // Pad with trailing '='s
  {
    case 0: break; // No pad chars in this case
    case 2: s += "=="; break; // Two pad chars
    case 3: s += "="; break; // One pad char
    default: throw new InputException("Illegal base64url string!");
  }
  if (__SERVER__) {
    return (new Buffer(s, 'base64'));
  } else if (__CLIENT__) {
    return window.atob(s); // Standard base64 decoder
  }
}

export default function parseToken(token) {
  if (token === null || token === undefined) return token;
  const parts = token.split('.');
  const header = JSON.parse(base64urldecode(parts[0]));
  const payload = JSON.parse(base64urldecode(parts[1]));
  return {
    token: token,
    orig_iat: payload.orig_iat,
    exp: payload.exp
  }
}
