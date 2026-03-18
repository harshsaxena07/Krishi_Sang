import { useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import LoanCard from '../components/loans/LoanCard';

const loans = [
  {
    id: '1',
    name: 'SBI Agriculture Loan',
    bank: 'SBI',
    purpose: 'For purchasing seeds, fertilizers, pesticides, and farming equipment',
    eligibility: 'Farmers with valid land documents, Age 18-65 years',
    documents: ['Land ownership documents', 'Aadhaar card', 'PAN card', 'Income proof', 'Passport size photos'],
    officialWebsite: 'https://sbi.co.in/',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&h=650&fit=crop',
  },
  {
    id: '2',
    name: 'SBI Tractor Loan',
    bank: 'SBI',
    purpose: 'Finance for purchasing tractors and farm machinery',
    eligibility: 'Farmers, Agricultural laborers, Age 21-65 years',
    documents: ['KYC documents', 'Land records', 'Income proof', 'Quotation from dealer'],
    officialWebsite: 'https://sbi.co.in/',
    image: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0d2d1f?w=900&h=650&fit=crop',
  },
  {
    id: '3',
    name: 'SBI Irrigation Loan',
    bank: 'SBI',
    purpose: 'For installing pumps, drip irrigation, and water management systems',
    eligibility: 'Land-owning farmers with irrigation plan',
    documents: ['Land documents', 'Project report', 'Aadhaar & PAN', 'Bank statements'],
    officialWebsite: 'https://sbi.co.in/',
    image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=900&h=650&fit=crop',
  },
  {
    id: '4',
    name: 'HDFC Kisan Dhan Loan',
    bank: 'HDFC',
    purpose: 'Short-term loan for crop cultivation and agricultural expenses',
    eligibility: 'Farmers with minimum 1 acre land, Age 21-60 years',
    documents: ['Land papers', 'Identity proof', 'Address proof', 'Income certificate'],
    officialWebsite: 'https://hdfcbank.com/',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=900&h=650&fit=crop',
  },
  {
    id: '5',
    name: 'HDFC Farm Equipment Loan',
    bank: 'HDFC',
    purpose: 'Finance for tractors, harvesters, tillers, and other farm equipment',
    eligibility: 'Farmers and agricultural workers',
    documents: ['KYC documents', 'Land ownership proof', 'Quotation', '3 months bank statement'],
    officialWebsite: 'https://hdfcbank.com/',
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=900&h=650&fit=crop',
  },
  {
    id: '6',
    name: 'HDFC Agri-Business Loan',
    bank: 'HDFC',
    purpose: 'For setting up cold storage, food processing, or agri-business ventures',
    eligibility: 'Entrepreneurs with business plan in agriculture sector',
    documents: ['Business plan', 'Project cost estimate', 'Land documents', 'Financial statements'],
    officialWebsite: 'https://hdfcbank.com/',
    image: 'https://images.unsplash.com/photo-1559884743-74a57598c4c7?w=900&h=650&fit=crop',
  },
  {
    id: '7',
    name: 'ICICI Crop Loan',
    bank: 'ICICI',
    purpose: 'Seasonal financing for crop production activities',
    eligibility: 'Farmers owning agricultural land',
    documents: ['Land records', 'Aadhaar card', 'PAN card', 'Farming license if applicable'],
    officialWebsite: 'https://icicibank.com/',
    image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=900&h=650&fit=crop',
  },
  {
    id: '8',
    name: 'ICICI Dairy Development Loan',
    bank: 'ICICI',
    purpose: 'For purchasing cattle and setting up dairy farms',
    eligibility: 'Individuals or groups interested in dairy farming',
    documents: ['Identity & address proof', 'Cattle purchase quotation', 'Shed/land documents', 'Training certificate'],
    officialWebsite: 'https://icicibank.com/',
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=900&h=650&fit=crop',
  },
  {
    id: '9',
    name: 'ICICI Warehouse Receipt Loan',
    bank: 'ICICI',
    purpose: 'Loan against stored agricultural produce in warehouses',
    eligibility: 'Farmers with produce stored in accredited warehouses',
    documents: ['Warehouse receipt', 'Land ownership proof', 'KYC documents', 'Quality certificate'],
    officialWebsite: 'https://icicibank.com/',
    image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=900&h=650&fit=crop',
  },
  {
    id: '10',
    name: 'PNB Kisan Credit Card',
    bank: 'PNB',
    purpose: 'Easy credit facility for agricultural inputs and expenses',
    eligibility: 'All farmers owning agricultural land',
    documents: ['Land documents', 'Identity proof', 'Application form', 'Passport photos'],
    officialWebsite: 'https://pnb.co.in/',
    image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=900&h=650&fit=crop',
  },
  {
    id: '11',
    name: 'PNB Tractor Loan Scheme',
    bank: 'PNB',
    purpose: 'Finance for buying new tractors from authorized dealers',
    eligibility: 'Farmers, contractors, transporters with valid documents',
    documents: ['KYC documents', 'Income proof', 'Dealer quotation', 'Land papers'],
    officialWebsite: 'https://pnb.co.in/',
    image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=900&h=650&fit=crop',
  },
  {
    id: '12',
    name: 'PNB Horticulture Loan',
    bank: 'PNB',
    purpose: 'For developing orchards, gardens, and horticulture projects',
    eligibility: 'Farmers with suitable land for horticulture',
    documents: ['Land ownership certificate', 'Project report', 'Aadhaar & PAN', 'Technical approval'],
    officialWebsite: 'https://pnb.co.in/',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=900&h=650&fit=crop',
  },
];

const FILTERS = ['All Banks', 'SBI', 'HDFC', 'ICICI', 'PNB'];

export default function Loans() {
  const { language } = useLanguage();
  const [filter, setFilter] = useState('All Banks');

  const copy = language === 'hi'
    ? {
        title: '\u092c\u0948\u0902\u0915 \u090b\u0923 \u092f\u094b\u091c\u0928\u093e\u090f\u0902',
        description:
          '\u0915\u093f\u0938\u093e\u0928\u094b\u0902 \u0915\u0947 \u0932\u093f\u090f \u0935\u093f\u0936\u0947\u0937 \u0930\u0942\u092a \u0938\u0947 \u0921\u093f\u091c\u093c\u093e\u0907\u0928 \u0915\u0940 \u0917\u0908 \u0935\u093f\u0935\u093f\u0927 \u092c\u0948\u0902\u0915 \u090b\u0923 \u092f\u094b\u091c\u0928\u093e\u090f\u0902 \u0926\u0947\u0916\u0947\u0902 \u0914\u0930 \u0905\u092a\u0928\u0940 \u0915\u0943\u0937\u093f \u0906\u0935\u0936\u094d\u092f\u0915\u0924\u093e\u0913\u0902 \u0915\u0947 \u0932\u093f\u090f \u0935\u093f\u0924\u094d\u0924 \u092a\u094d\u0930\u093e\u092a\u094d\u0924 \u0915\u0930\u0947\u0902\u0964',
        filters: {
          'All Banks': '\u0938\u092d\u0940 \u092c\u0948\u0902\u0915',
          SBI: '\u090f\u0938\u092c\u0940\u0906\u0908',
          HDFC: '\u090f\u091a\u0921\u0940\u090f\u092b\u0938\u0940',
          ICICI: '\u0906\u0908\u0938\u0940\u0906\u0908\u0938\u0940\u0906\u0908',
          PNB: '\u092a\u0940\u090f\u0928\u092c\u0940',
        },
        footer: 'KrishiSangh \u0915\u093f\u0938\u093e\u0928 \u0935\u093f\u0924\u094d\u0924 \u0938\u0939\u093e\u092f\u0924\u093e',
      }
    : {
        title: 'Bank Loan Schemes',
        description:
          'Explore various bank loan schemes designed specifically for farmers. Get easy financing for your agricultural needs.',
        filters: {
          'All Banks': 'All Banks',
          SBI: 'SBI',
          HDFC: 'HDFC',
          ICICI: 'ICICI',
          PNB: 'PNB',
        },
        footer: 'KrishiSangh Farmer Finance Support',
      };

  const filteredLoans = useMemo(() => {
    if (filter === 'All Banks') return loans;
    return loans.filter((loan) => loan.bank === filter);
  }, [filter]);

  return (
    <div className="page loans-page schemes-page loans-page-wide">
      <header className="schemes-page-header">
        <h1 className="schemes-page-title">{copy.title}</h1>
        <p className="schemes-page-subtitle">{copy.description}</p>
      </header>

      <div className="schemes-filters loans-filters" role="group" aria-label="Loan bank filters">
        {FILTERS.map((bank) => (
          <button
            key={bank}
            type="button"
            className={`schemes-filter-btn loan-filter-btn ${filter === bank ? 'active' : ''}`}
            onClick={() => setFilter(bank)}
          >
            {copy.filters[bank]}
          </button>
        ))}
      </div>

      <div className="schemes-detail-grid loans-detail-grid">
        {filteredLoans.map((loan) => (
          <LoanCard key={loan.id} loan={loan} />
        ))}
      </div>

      <footer className="loans-page-footer">
        <p>{copy.footer}</p>
      </footer>
    </div>
  );
}
