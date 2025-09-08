// Utility functions to convert numbers to text in Arabic and English

export function numberToEnglishText(num: number): string {
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  if (num === 0) return 'zero';
  if (num < 10) return ones[num];
  if (num < 20) return teens[num - 10];
  if (num < 100) {
    const ten = Math.floor(num / 10);
    const one = num % 10;
    return tens[ten] + (one ? '-' + ones[one] : '');
  }
  if (num < 1000) {
    const hundred = Math.floor(num / 100);
    const remainder = num % 100;
    return ones[hundred] + ' hundred' + (remainder ? ' ' + numberToEnglishText(remainder) : '');
  }
  return num.toString();
}

export function numberToArabicText(num: number): string {
  const ones = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
  const tens = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
  const teens = ['عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];

  if (num === 0) return 'صفر';
  if (num < 10) return ones[num];
  if (num < 20) return teens[num - 10];
  if (num < 100) {
    const ten = Math.floor(num / 10);
    const one = num % 10;
    if (one === 0) return tens[ten];
    return ones[one] + ' و ' + tens[ten];
  }
  if (num < 1000) {
    const hundred = Math.floor(num / 100);
    const remainder = num % 100;
    const hundredText = hundred === 1 ? 'مئة' : ones[hundred] + ' مئة';
    return hundredText + (remainder ? ' و ' + numberToArabicText(remainder) : '');
  }
  return num.toString();
}

export function convertDurationToText(duration: string, language: 'english' | 'arabic'): string {
  const num = parseInt(duration);
  if (isNaN(num)) return duration;
  
  const text = language === 'english' ? numberToEnglishText(num) : numberToArabicText(num);
  const unit = language === 'english' ? 'day' + (num > 1 ? 's' : '') : 'يوم' + (num > 1 ? '' : '');
  
  return `${text} ${unit}`;
}
