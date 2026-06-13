document.querySelectorAll('.project-gallery-auto').forEach(function (gallery) {
  var imgs = Array.from(gallery.querySelectorAll('img'));
  gallery.innerHTML = '';

  var i = 0;
  while (i < imgs.length) {
    var img = imgs[i];
    var isPortrait = img.dataset.orient === 'portrait';
    var row = document.createElement('div');

    if (!isPortrait) {
      row.className = 'gallery-row--full';
      var wrap = document.createElement('div');
      wrap.className = 'gallery-img-wrap';
      wrap.appendChild(img);
      row.appendChild(wrap);
    } else {
      var next = imgs[i + 1];
      var nextIsPortrait = next && next.dataset.orient === 'portrait';
      if (nextIsPortrait) {
        row.className = 'gallery-row--pair';
        var wrapA = document.createElement('div');
        wrapA.className = 'gallery-img-wrap';
        wrapA.appendChild(img);
        var wrapB = document.createElement('div');
        wrapB.className = 'gallery-img-wrap';
        wrapB.appendChild(next);
        row.appendChild(wrapA);
        row.appendChild(wrapB);
        i++;
      } else {
        // portrait dispari → piena
        row.className = 'gallery-row--full';
        var wrap = document.createElement('div');
        wrap.className = 'gallery-img-wrap';
        wrap.appendChild(img);
        row.appendChild(wrap);
      }
    }

    gallery.appendChild(row);
    i++;
  }
});
