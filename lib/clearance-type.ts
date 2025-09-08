export function clearanceTypeArabic(clearanceType: string): string {
    const typeMap: { [key: string]: string } = {
        'Temporary': 'مؤقت',
        'Permanent': 'دائم',
        'Urgent': 'طارئ',
    };
    
    return typeMap[clearanceType] || clearanceType;
}