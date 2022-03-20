function slugify(name) {
  const a =
    'àáäâãåăæąçćčđďèéěėëêęğǵḧìíïîįłḿǹńňñòóöôœøṕŕřßşśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;';
  const b =
    'aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrsssssttuuuuuuuuuwxyyzzz------';
  const p = new RegExp(a.split('').join('|'), 'g');

  return name
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w-]+/g, '') // Remove all non-word characters
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text}
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase().concat(str.slice(1, str.length));
}

function formatPriceToVND(price) {
  const str = price.toString().split('').reverse().join('');
  const N = str.length;

  let res = '';

  for (var i = 0; i < N; i += 3) {
    res = res.concat(str.slice(i, i + 3));

    if (i + 3 < N) {
      res = res.concat('.');
    }
  }

  return res.split('').reverse().join('').concat(' VND');
}

function getDiscountPercent(oldPrice, price) {
  return (((oldPrice - price) / oldPrice) * 100).toFixed(0);
}

function checkImageExistence(imageUrl) {
  const img = new Image();
  img.src = imageUrl;

  if (img.complete) return true;
  // else {
  //   img.onload = () => {
  //     return true;
  //   };

  //   img.onerror = () => {
  //     return false;
  //   };
  return false;
}
// var request = new XMLHttpRequest();
// request.open('GET', imageUrl, true);
// request.send();
// request.onload = () => {
//   var status = request.status;
//   if (status === 200) {
//     return true;
//   } else {
//     return false;
//   }
// };

export {
  slugify,
  randomInteger,
  capitalize,
  checkImageExistence,
  formatPriceToVND,
  getDiscountPercent,
};
