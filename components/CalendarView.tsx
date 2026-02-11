import React, { useMemo } from 'react';
import { CalendarIcon, WarningIcon, BriefcaseIcon, ClipboardDocumentListIcon, CalendarForwardIcon } from './icons';

interface CalendarDay {
    date: string;
    total: number;
    conflicts: number;
    lawyersCount: number;
}

interface CalendarViewProps {
    calendarData: CalendarDay[];
    onDateSelect: (date: string, showConflictsOnly: boolean) => void;
    selectedDate: string | null;
    onShowAllConflictsToggle: () => void;
    isShowingAllConflicts: boolean;
    showOnlyConflictsInDetails: boolean;
    showOnlyUpcomingDays: boolean;
    onShowOnlyUpcomingDaysToggle: () => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ 
    calendarData, 
    onDateSelect, 
    selectedDate, 
    onShowAllConflictsToggle, 
    isShowingAllConflicts, 
    showOnlyConflictsInDetails,
    showOnlyUpcomingDays,
    onShowOnlyUpcomingDaysToggle
}) => {
    const sortedData = [...calendarData].sort((a, b) => {
        const parseDate = (dateStr: string) => {
            if (!dateStr || typeof dateStr !== 'string') return { year: 0, month: 0, day: 0 };
            
            // App.tsx normalizes dates to DD-MM-YYYY format after cleaning.
            const parts = dateStr.split('-').map(Number);
            
            if (parts.length !== 3 || parts.some(isNaN)) {
                return { year: 0, month: 0, day: 0 };
            }
            
            const [day, month, year] = parts;
            return { year, month, day };
        };

        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);

        // Sort ascending: oldest date first
        if (dateA.year !== dateB.year) return dateA.year - dateB.year;
        if (dateA.month !== dateB.month) return dateA.month - dateB.month;
        return dateA.day - dateB.day;
    });

    const upcomingFilteredData = useMemo(() => {
        if (!showOnlyUpcomingDays) {
            return sortedData;
        }

        try {
            const formatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-nu-latn', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric'
            });
            const parts = formatter.formatToParts(new Date());

            const todayHijri = {
                year: parseInt(parts.find(p => p.type === 'year')?.value || '0', 10),
                month: parseInt(parts.find(p => p.type === 'month')?.value || '0', 10),
                day: parseInt(parts.find(p => p.type === 'day')?.value || '0', 10),
            };
            
            if (todayHijri.year === 0) {
                console.warn("Could not determine today's Hijri date.");
                return sortedData; // Fallback to all data
            }

            const todayNum = todayHijri.year * 10000 + todayHijri.month * 100 + todayHijri.day;

            const parseHijriDateToNum = (dateStr: string): number | null => {
                if (!dateStr || typeof dateStr !== 'string') return null;
                const dateParts = dateStr.split('-').map(Number);
                if (dateParts.length !== 3 || dateParts.some(isNaN)) {
                    return null;
                }
                const [day, month, year] = dateParts;
                // Basic sanity check
                if (year < 1400 || month < 1 || month > 12 || day < 1 || day > 31) {
                    return null;
                }
                return year * 10000 + month * 100 + day;
            };

            return sortedData.filter(day => {
                const sessionDateNum = parseHijriDateToNum(day.date);
                if (sessionDateNum === null) return false; // Exclude invalid dates
                return sessionDateNum >= todayNum;
            });
        } catch (error) {
            console.error("Error filtering upcoming dates:", error);
            return sortedData; // Fallback to all data on error
        }
    }, [sortedData, showOnlyUpcomingDays]);

    const dataToDisplay = selectedDate && !isShowingAllConflicts
        ? upcomingFilteredData.filter(day => day.date === selectedDate)
        : upcomingFilteredData;

    return (
        <div className="bg-white p-4 rounded-lg shadow-md h-full">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <CalendarIcon className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-bold mr-2 text-dark">أيام الجلسات</h2>
                </div>
                 <div className="flex items-center gap-2">
                    <button
                        onClick={onShowOnlyUpcomingDaysToggle}
                        title={showOnlyUpcomingDays ? "عرض كل الأيام" : "عرض الأيام المقبلة فقط"}
                        className={`flex items-center px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                            showOnlyUpcomingDays 
                            ? 'bg-primary text-white shadow-md' 
                            : 'bg-light text-text hover:bg-border'
                        }`}
                    >
                        <CalendarForwardIcon className="w-4 h-4 ml-1.5" />
                        <span>{showOnlyUpcomingDays ? 'المقبلة' : 'الكل'}</span>
                    </button>
                    <button 
                        onClick={onShowAllConflictsToggle}
                        className={`flex items-center px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                            isShowingAllConflicts 
                            ? 'bg-amber-500 text-white shadow-lg' 
                            : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        }`}
                    >
                        <WarningIcon className="w-4 h-4 ml-1.5" />
                        التعارضات
                    </button>
                </div>
            </div>
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                {dataToDisplay.length > 0 ? (
                    dataToDisplay.map(({ date, total, conflicts, lawyersCount }) => {
                        const isSelected = date === selectedDate && !isShowingAllConflicts;
                        const isAllSessionsSelected = isSelected && !showOnlyConflictsInDetails;
                        const isConflictsSelected = isSelected && showOnlyConflictsInDetails;

                        return (
                            <div
                                key={date}
                                onClick={() => onDateSelect(date, false)}
                                className={`w-full p-3 rounded-xl transition-all duration-300 flex flex-col gap-2 cursor-pointer border-2 ${
                                    isAllSessionsSelected 
                                    ? 'bg-primary border-primary text-white shadow-md' 
                                    : 'bg-light border-transparent hover:border-primary/30 text-dark'
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-base">{date}</span>
                                    <div className="flex items-center gap-1.5">
                                         <span className={`flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                                            isAllSessionsSelected ? 'bg-white/20 text-white' : 'bg-white text-dark shadow-sm'
                                        }`}>
                                            <ClipboardDocumentListIcon className="w-3 h-3 ml-1 opacity-70" />
                                            {total} جلسات
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    {conflicts > 0 && (
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDateSelect(date, true);
                                            }}
                                            className={`flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold transition-transform hover:scale-105 ${
                                                isConflictsSelected 
                                                ? 'bg-amber-400 text-amber-900 shadow-inner' 
                                                : isAllSessionsSelected ? 'bg-amber-300/30 text-white' : 'bg-amber-100 text-amber-700'
                                            }`}
                                        >
                                            <WarningIcon className="w-3 h-3 ml-1" />
                                            {conflicts} تعارض
                                        </button>
                                    )}
                                    
                                    {lawyersCount > 0 && (
                                        <span className={`flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                            isAllSessionsSelected ? 'bg-blue-400/30 text-white' : 'bg-blue-50 text-blue-700'
                                        }`}>
                                            <BriefcaseIcon className="w-3 h-3 ml-1" />
                                            {lawyersCount} محامي
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                     <div className="flex flex-col items-center justify-center text-center py-16 px-4 h-full">
                        <CalendarIcon className="w-16 h-16 text-border" />
                        <h4 className="mt-4 font-bold text-dark">
                            {showOnlyUpcomingDays ? "لا توجد جلسات مقبلة" : "لا توجد جلسات لعرضها"}
                        </h4>
                        <p className="mt-2 text-sm text-text max-w-xs">
                            {showOnlyUpcomingDays
                                ? "جميع الجلسات المسجلة في تواريخ سابقة. يمكنك عرضها بالضغط على زر 'الكل'."
                                : "لا توجد أي جلسات مسجلة في النظام حالياً."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalendarView;
