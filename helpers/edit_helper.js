module.exports = {
  textDiff: textDiff,
  applyTextDiff: applyTextDiff
}

function charsAreEqual(a, b) {
	if (a == b) return true;
	a = a.charCodeAt(0);
	b = b.charCodeAt(0);
	return (a == 32 || b == 32) && (a == 160 || b == 160);
}


function condenseTextDiff(diff) {
  let index;
  for (let i = 0; i < diff.length; i++) {
    let change = diff[i];
    if (change.i == index) {
      let last = diff[i-1];
      if (typeof last.val == typeof change.val && typeof last.val == "string") {
        diff[i-1].val += change.val;
        diff.splice(i, 1);
        i--;
      }
    }
    if (change.i == index + 1) {
      let last = diff[i-1];
      if (typeof last.val == typeof change.val && typeof last.val == "number") {
        diff[i-1].val += change.val;
        diff.splice(i, 1);
        i--;
      }
    }
    index = change.i;
  }
  return diff;
}

function textDiff(text1, text2) {
  var M = text1.length, N = text2.length;
  var MAX = M + N;


  var v = new Array(Math.max( 2*MAX - 1, 1) );
  var paths = new Array(Math.max( 2*MAX - 1, 1) );

  v[N] = 0;
  while (v[N] < M && v[N] < N && charsAreEqual(text1.charAt(v[N]), text2.charAt(v[N]))) {
    v[N]++;
  }

  paths[N] = [];

  if (v[N] == M && v[N] == N) {
    return [];
  }


  for (var d = 1; d <= MAX; d++) {
    for (var k = -d; k <= d; k += 2) {
      var path = k+N;

      var x, y;

      /*if (k == -d) {
        x = v[k + N + 1];
      }
      else if (k == d) {
        x = v[k + N - 1] + 1;
      }
      else {
        if (v[k + N -1 ] + 1 > v[k + N + 1]) {
          x = v[k + N - 1] + 1;
        }
        else {
          x = v[k + N + 1];
        }
      }*/


      if ((k == -d || v[path - 1] < v[path + 1]) && k != d) { // compact version of above if else statements
        x = v[path + 1];
        var cpy = paths[path + 1].slice();
        cpy.push({i:x, val:text2.charAt(x-k-1)});
        paths[path] = cpy;
      }
      else {
        x = v[path - 1] + 1;

        var cpy = paths[path - 1].slice();
        cpy.push({i:x-1, val:1});
        paths[path] = cpy;
      }

      y = x-k;

      while (x < M && y < N && charsAreEqual(text1.charAt(x), text2.charAt(y))) {
        x++; y++;
      }

      if (x >= M && y >= N) {
        return condenseTextDiff(paths[path]);
      }

      v[path] = x;
    }
  }
}

function applyTextDiff(text, diff) {
  diff.forEach(change => {
    let type = typeof change.val;
    if (type == "string") {
      text = text.substring(0, change.i) + change.val + text.substring(change.i);
    }
    else if (type == "number"){
      text = text.substring(0, change.i) + text.substring(change.i + change.val);
    }
    else {
      throw new Error(`typeof diff[i].val must be 'string' or 'number', not '${type}'`);
    }
  });
  return text;
}
