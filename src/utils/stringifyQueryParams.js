



export default function stringifyQueryParams(obj) {
  return Object.entries(obj)
    .map((e) => e.join('='))
    .join('&');
}