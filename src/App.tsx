import { useState } from 'react';

interface InsuranceInput {
    age: number;
    annualIncome: number;
    totalDebt: number;
    dependents: number;
    yearsReplacement: number;
}

const DEPENDENT_FACTOR: Record<number, number> = { 0: 0.5, 1: 1.0, 2: 1.15, 3: 1.25, 4: 1.35 };
const getDependentFactor = (deps: number) => deps >= 4 ? 1.35 : (DEPENDENT_FACTOR[deps] || 1.0);

const COVERAGE_TIPS: string[] = [
    'Cover income replacement for dependents',
    'Include outstanding debts and mortgages',
    'Consider future education costs',
    'Review coverage as life circumstances change'
];

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

function App() {
    const [values, setValues] = useState<InsuranceInput>({ age: 35, annualIncome: 75000, totalDebt: 150000, dependents: 2, yearsReplacement: 10 });
    const handleChange = (field: keyof InsuranceInput, value: number) => setValues(prev => ({ ...prev, [field]: value }));

    const dependentFactor = getDependentFactor(values.dependents);
    const incomeReplacement = Math.round(values.annualIncome * values.yearsReplacement * dependentFactor);
    const debtCoverage = values.totalDebt;
    const totalCoverage = incomeReplacement + debtCoverage;

    const breakdownData = [
        { label: 'Income Replacement Need', value: fmt(incomeReplacement), isTotal: false },
        { label: 'Debt Coverage', value: fmt(debtCoverage), isTotal: false },
        { label: 'Total Estimated Coverage', value: fmt(totalCoverage), isTotal: true }
    ];

    return (
        <main style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <header style={{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>
                <h1 style={{ marginBottom: 'var(--space-2)' }}>Life Insurance Need Calculator (2026)</h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>Estimate how much life insurance coverage you may need</p>
            </header>

            <div className="card">
                <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <div>
                            <label htmlFor="age">Age</label>
                            <input id="age" type="number" min="18" max="80" value={values.age || ''} onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)} placeholder="35" />
                        </div>
                        <div>
                            <label htmlFor="annualIncome">Annual Income ($)</label>
                            <input id="annualIncome" type="number" min="0" max="1000000" step="5000" value={values.annualIncome || ''} onChange={(e) => handleChange('annualIncome', parseInt(e.target.value) || 0)} placeholder="75000" />
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <div>
                            <label htmlFor="totalDebt">Total Outstanding Debt ($)</label>
                            <input id="totalDebt" type="number" min="0" max="2000000" step="5000" value={values.totalDebt || ''} onChange={(e) => handleChange('totalDebt', parseInt(e.target.value) || 0)} placeholder="150000" />
                        </div>
                        <div>
                            <label htmlFor="dependents">Number of Dependents</label>
                            <select id="dependents" value={values.dependents} onChange={(e) => handleChange('dependents', parseInt(e.target.value))}>
                                <option value="0">0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4+</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="yearsReplacement">Years of Income Replacement</label>
                        <select id="yearsReplacement" value={values.yearsReplacement} onChange={(e) => handleChange('yearsReplacement', parseInt(e.target.value))}>
                            <option value="5">5 years</option>
                            <option value="10">10 years</option>
                            <option value="15">15 years</option>
                            <option value="20">20 years</option>
                            <option value="25">25 years</option>
                        </select>
                    </div>
                    <button className="btn-primary" type="button">Calculate Coverage</button>
                </div>
            </div>

            <div className="card" style={{ background: '#F0F9FF', borderColor: '#BAE6FD' }}>
                <div className="text-center">
                    <h2 style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Estimated Coverage Amount</h2>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>{fmt(totalCoverage)}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>recommended coverage</div>
                </div>
                <hr style={{ margin: 'var(--space-6) 0', border: 'none', borderTop: '1px solid #BAE6FD' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', textAlign: 'center' }}>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>INCOME REPLACEMENT</div>
                        <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>{fmt(incomeReplacement)}</div>
                    </div>
                    <div style={{ borderLeft: '1px solid #BAE6FD', paddingLeft: 'var(--space-4)' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>DEBT COVERAGE</div>
                        <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>{fmt(debtCoverage)}</div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-4)' }}>Coverage Considerations</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 'var(--space-3)' }}>
                    {COVERAGE_TIPS.map((item, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-primary)', flexShrink: 0 }} />{item}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="ad-container"><span>Advertisement</span></div>

            <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border)' }}>
                    <h3 style={{ fontSize: '1rem' }}>Coverage Breakdown</h3>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9375rem' }}>
                    <tbody>
                        {breakdownData.map((row, i) => (
                            <tr key={i} style={{ borderBottom: i === breakdownData.length - 1 ? 'none' : '1px solid var(--color-border)', backgroundColor: row.isTotal ? '#F0F9FF' : (i % 2 ? '#F8FAFC' : 'transparent') }}>
                                <td style={{ padding: 'var(--space-3) var(--space-6)', color: 'var(--color-text-secondary)', fontWeight: row.isTotal ? 600 : 400 }}>{row.label}</td>
                                <td style={{ padding: 'var(--space-3) var(--space-6)', textAlign: 'right', fontWeight: 600, color: row.isTotal ? 'var(--color-primary)' : 'var(--color-text-primary)' }}>{row.value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ maxWidth: 600, margin: '0 auto', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                <p>This tool provides informational estimates of life insurance coverage needs based on income, debts, and dependents. The figures shown are estimates only and do not constitute financial or insurance advice. Actual coverage needs vary based on individual circumstances, existing assets, and future obligations. Consult a licensed insurance professional or financial advisor for personalized guidance.</p>
            </div>

            <footer style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-4)', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', marginTop: 'var(--space-8)' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-4)', fontSize: '0.875rem' }}>
                    <li>• Estimates only</li><li>• Not financial advice</li><li>• Free to use</li>
                </ul>
                <nav style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
                    <a href="https://scenariocalculators.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8', fontSize: '0.75rem' }}>Privacy Policy</a>
                    <span style={{ color: '#64748B' }}>|</span>
                    <a href="https://scenariocalculators.com/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8', fontSize: '0.75rem' }}>Terms of Service</a>
                </nav>
                <p style={{ marginTop: 'var(--space-4)', fontSize: '0.75rem' }}>&copy; 2026 Life Insurance Need Calculator</p>
            </footer>

            <div className="ad-container ad-sticky"><span>Advertisement</span></div>
        </main>
    );
}

export default App;
