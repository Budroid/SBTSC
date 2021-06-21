const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.trim().toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
}

const getImageUrl = (url, small) => {
  // console.log(url)
  const urlParts = url.split('?alt')
  const urlWithoutExtention = urlParts[0].substring(0, url.lastIndexOf('.'))
  const fix = small ? "_200x200.jpeg?alt" : "_680x680.jpeg?alt"
  const postFix = urlParts[1]
  return urlWithoutExtention + fix + postFix
}

export { capitalize, getImageUrl }