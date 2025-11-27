
export const numberWithSpaces = (x) => {


  if(String(x)?.at(-1) === '.') {

    const parts = x.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
  }
  
  const number = Number(x)

  if(!number) return 0
  if(isNaN(Number(number))) return 0

  const parts = number.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
}
