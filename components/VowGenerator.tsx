import { useState, useCallback, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { VowTone, VowLength } from '../types.ts';
import { generateVow } from '../services/geminiService.ts';
import Loader from './Loader.tsx';

// Moved component definitions outside of VowGenerator to prevent re-creation on every render.
type InputFieldProps = {
  label: string;
  id: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
  required?: boolean;
  type?: 'text' | 'textarea';
};

const InputField = ({ label, id, value, onChange, placeholder, required = false, type = 'text' }: InputFieldProps) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-brand-text/90 mb-1">{label}</label>
    {type === 'textarea' ? (
      <textarea id={id} value={value} onChange={onChange} placeholder={placeholder} required={required} rows={3} className="w-full px-3 py-2 bg-white border border-brand-accent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-shadow" />
    ) : (
      <input type="text" id={id} value={value} onChange={onChange} placeholder={placeholder} required={required} className="w-full px-3 py-2 bg-white border border-brand-accent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-shadow" />
    )}
  </div>
);

type SelectFieldProps = {
  label: string;
  id: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
};

const SelectField = ({ label, id, value, onChange, options }: SelectFieldProps) => (
  <div>
      <label htmlFor={id} className="block text-sm font-medium text-brand-text/90 mb-1">{label}</label>
      <select id={id} value={value} onChange={onChange} className="w-full px-3 py-2 bg-white border border-brand-accent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-shadow appearance-none bg-no-repeat bg-right pr-8" style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23C08497' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`}}>
        {options.map(option => <option key={option} value={option}>{option}</option>)}
      </select>
  </div>
);

const presetApiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim();

const VowGenerator = () => {
  const [apiKey, setApiKey] = useState<string | null>(() => (presetApiKey && presetApiKey.length > 0 ? presetApiKey : null));
  const [partnerName, setPartnerName] = useState('');
  const [yearsTogether, setYearsTogether] = useState('');
  const [specialMemory, setSpecialMemory] = useState('');
  const [tone, setTone] = useState<VowTone>(VowTone.ROMANTIC);
  const [length, setLength] = useState<VowLength>(VowLength.MEDIUM);
  const [generatedVow, setGeneratedVow] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (presetApiKey && presetApiKey.length > 0) {
      setApiKey(presetApiKey);
      return;
    }

    if (apiKey) {
      return;
    }

    if (typeof window === 'undefined') {
      return;
    }

    // Check for API key in session storage or prompt the user
    let key = sessionStorage.getItem('gemini-api-key');
    if (!key) {
      key = prompt("Please enter your Google Gemini API Key:");
      if (key) {
        sessionStorage.setItem('gemini-api-key', key);
      }
    }

    if (key) {
      setApiKey(key);
    }
  }, [apiKey, presetApiKey]);

  const handleGenerateVow = useCallback(async (e: FormEvent) => {
    e.preventDefault();

    if (!apiKey) {
      setError('API Key is missing. Please refresh and enter your API key.');
      return;
    }

    if (!partnerName || !specialMemory) {
        setError('Please fill in your partner\'s name and a special memory.');
        return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedVow('');
    setCopied(false);

    try {
      const vow = await generateVow({
        apiKey,
        partnerName,
        yearsTogether,
        specialMemory,
        tone,
        length,
      });
      setGeneratedVow(vow);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, partnerName, yearsTogether, specialMemory, tone, length]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedVow);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  if (!apiKey) {
    return (
       <div className="w-full max-w-2xl bg-white/60 backdrop-blur-sm p-6 md:p-10 rounded-2xl shadow-2xl shadow-brand-accent border border-white text-center">
         <h2 className="text-xl font-serif text-brand-primary mb-4">API Key Required</h2>
         <p className="text-brand-text">Please refresh the page to enter your Google Gemini API Key. This application cannot function without it.</p>
       </div>
    )
  }

  return (
    <div className="w-full max-w-2xl bg-white/60 backdrop-blur-sm p-6 md:p-10 rounded-2xl shadow-2xl shadow-brand-accent border border-white">
      <form onSubmit={handleGenerateVow} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Partner's Name" id="partnerName" value={partnerName} onChange={(e) => setPartnerName(e.target.value)} placeholder="e.g., Alex" required />
          <InputField label="Years Together (Optional)" id="yearsTogether" value={yearsTogether} onChange={(e) => setYearsTogether(e.target.value)} placeholder="e.g., 5 years" />
        </div>
        
        <InputField 
          label="A Special Memory, Quality, or Feeling" 
          id="specialMemory" 
          value={specialMemory} 
          onChange={(e) => setSpecialMemory(e.target.value)} 
          placeholder="e.g., The way they smile, our trip to the coast..." 
          required 
          type="textarea"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField label="Tone of Vow" id="tone" value={tone} onChange={(e) => setTone(e.target.value as VowTone)} options={Object.values(VowTone)} />
            <SelectField label="Length of Vow" id="length" value={length} onChange={(e) => setLength(e.target.value as VowLength)} options={Object.values(VowLength)} />
        </div>

        <button type="submit" disabled={isLoading} className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-4 focus:ring-brand-primary/50 disabled:bg-brand-primary/50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
          {isLoading ? 'Generating...' : '✨ Generate My Vow'}
        </button>
      </form>
      
      {error && <div className="mt-6 p-4 bg-red-100 text-red-700 border border-red-200 rounded-lg">{error}</div>}

      <div className="mt-8">
        {isLoading && <Loader />}
        {generatedVow && (
          <div className="p-6 bg-brand-accent/50 border border-brand-accent rounded-lg relative animate-fade-in">
            <h3 className="font-serif text-xl text-brand-primary mb-4">Your Vow:</h3>
            <p className="whitespace-pre-wrap text-brand-text leading-relaxed font-sans">{generatedVow}</p>
            <button onClick={handleCopy} className="absolute top-4 right-4 bg-white text-brand-primary px-3 py-1 rounded-full text-sm hover:bg-brand-accent transition-colors shadow-sm">
                {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VowGenerator;
