
export function formatNumber(locale, number) {
    return new Intl.NumberFormat(locale).format(number);
  }