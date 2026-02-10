
import type { CaseSession } from './types';

const API_URL = 'https://script.google.com/macros/s/AKfycbwLvFO4AGizxFWOWJVnZXr4qRebJdqTqKW5a1GBLeMcv13G3R_O-i47uLX9rsF-FpjnXw/exec';

// المدعون المعتمدون في المنصة
const ALLOWED_PLAINTIFFS = [
    "شركة محمد راشد بالحارث وشركاه للتجارة والمقاولات",
    "عبدالله سعود مطلق ال سعد القحطاني"
];

// Helper function to clean object keys from leading/trailing spaces
const cleanObjectKeys = <T extends object,>(obj: T): T => {
    const newObj: Partial<T> = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const trimmedKey = key.trim() as keyof T;
            newObj[trimmedKey] = obj[key];
        }
    }
    return newObj as T;
};

export const fetchSessions = async (): Promise<CaseSession[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const result = await response.json();
    if (!result.success) {
        throw new Error('API returned an error');
    }
    
    const allSessions = result.data.map((item: CaseSession) => cleanObjectKeys(item));
    
    // تصفية الجلسات بناءً على قائمة المدعين المعتمدة
    return allSessions.filter(session => {
        const plaintiff = (session['المدعي'] || '').trim();
        return ALLOWED_PLAINTIFFS.includes(plaintiff);
    });
};

export const updateSessionAssignment = async (id: number, assignment: string): Promise<any> => {
    const payload = {
        id: String(id),
        patch: {
            "التكليف": assignment
        }
    };

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        mode: 'no-cors',
    });

    return { success: true, id: String(id), updated: { "التكليف": assignment } };
};
