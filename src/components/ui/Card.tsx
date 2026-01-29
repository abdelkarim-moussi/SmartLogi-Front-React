import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
}

interface CardHeaderProps {
    children: ReactNode;
    className?: string;
    action?: ReactNode;
}

interface CardTitleProps {
    children: ReactNode;
    className?: string;
}

interface CardContentProps {
    children: ReactNode;
    className?: string;
}

export function Card({ children, className = '', padding = 'md', hover = false }: CardProps) {
    const paddingStyles = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    return (
        <div
            className={`
        bg-white dark:bg-slate-800 
        rounded-xl 
        border border-slate-200 dark:border-slate-700
        shadow-sm
        ${hover ? 'hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300' : ''}
        ${paddingStyles[padding]}
        ${className}
      `}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className = '', action }: CardHeaderProps) {
    return (
        <div className={`flex items-center justify-between mb-4 ${className}`}>
            <div>{children}</div>
            {action && <div>{action}</div>}
        </div>
    );
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
    return (
        <h3 className={`text-lg font-semibold text-slate-900 dark:text-white ${className}`}>
            {children}
        </h3>
    );
}

export function CardContent({ children, className = '' }: CardContentProps) {
    return <div className={className}>{children}</div>;
}

// Stats Card variant
interface StatsCardProps {
    title: string;
    value: string | number;
    icon?: ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: 'indigo' | 'green' | 'orange' | 'red' | 'purple';
}

export function StatsCard({ title, value, icon, trend, color = 'indigo' }: StatsCardProps) {
    const colorStyles = {
        indigo: 'from-indigo-500 to-purple-600',
        green: 'from-emerald-500 to-teal-600',
        orange: 'from-orange-500 to-amber-600',
        red: 'from-red-500 to-rose-600',
        purple: 'from-purple-500 to-pink-600',
    };

    return (
        <Card className="relative overflow-hidden" padding="md">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorStyles[color]} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`} />

            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
                    {trend && (
                        <p className={`mt-2 text-sm flex items-center gap-1 ${trend.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                            {trend.isPositive ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                </svg>
                            )}
                            {trend.value}%
                        </p>
                    )}
                </div>
                {icon && (
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${colorStyles[color]} text-white shadow-lg`}>
                        {icon}
                    </div>
                )}
            </div>
        </Card>
    );
}

export default Card;
