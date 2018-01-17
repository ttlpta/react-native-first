export const priceFormat = (text) => {
  const amount = parseFloat(text).toFixed(2);
  let splitAmount = amount.split('.')[0];
  let idx = splitAmount.length - 4;
  
  while (idx >= 0) {
    splitAmount = splitAmount.slice(0, idx + 1) + ',' + splitAmount.slice(idx + 1);
    idx = idx - 3;
  }

  return splitAmount;
};

export const getToday = (format = 'ymd') => {
  const today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1; //January is 0!
  const yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }

  if (mm < 10) {
    mm = '0' + mm;
  }
  
  switch (format) {
    case 'd/m/y':
      return dd + '/' + mm + '/' + yyyy;

      break;
    case 'y-m-d': 
      return yyyy + '-' + mm + '-' + dd;

      break;
    default : 
      return yyyy + mm + dd;

      break;
  }
};
    
