import React, { useState, useRef } from 'react';
import { GoogleIcon } from './icons/GoogleIcon';
import { SendIcon } from './icons/ChevronRightIcon';
import { UploadIcon } from './icons/UploadIcon';

interface CommissionProps {
  isLoggedIn: boolean;
  onLogin: () => void;
}

export const Commission: React.FC<CommissionProps> = ({ isLoggedIn, onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [artType, setArtType] = useState('Digital Illustration');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [response, setResponse] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) {
      setResponse('Please fill out your name and description.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setResponse('');

    /*
    // SECURE BACKEND INTEGRATION:
    // The following code is configured to send form data to a secure backend endpoint.
    // This endpoint would be responsible for sending an email to hashantbhati76@gmail.com.
    // This is currently disabled to allow the form to function in this demo environment.
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('artType', artType);
    formData.append('message', message);
    if (file) {
      formData.append('referenceImage', file);
    }

    try {
      const response = await fetch('/api/send-commission-email', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Server error');
      }
      setStatus('success');
      setResponse('Your request has been sent successfully!');
    } catch (error) {
      setStatus('error');
      setResponse('There was an error sending your request. Please try again later.');
    }
    */

    // Simulating a successful API call for demo purposes.
    setTimeout(() => {
      setResponse(`Thank you, ${name}! Your creative request for a "${artType}" has been received. We're excited to review your idea and will be in touch via email shortly.`);
      setStatus('success');
    }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <section id="commission-section" className="py-24 px-6 md:px-12 lg:px-24 bg-brand-bg text-brand-text">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-display font-extrabold text-5xl md:text-6xl tracking-tighter mb-4">Custom Art Request</h2>
        <p className="text-lg text-brand-text-muted mb-12 max-w-2xl mx-auto">
          Have a unique idea? Let's collaborate. Please sign in to verify your request and begin the process.
        </p>

        <div className="relative p-8 rounded-2xl bg-brand-surface/70 backdrop-blur-xl border border-brand-glass-border text-left max-w-2xl mx-auto overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/subtle-grunge.png)' }}/>
          <div className="relative">
            {!isLoggedIn ? (
              <div className="flex flex-col items-center justify-center h-48">
                <p className="mb-4 text-brand-text-muted">Sign in with Google to continue.</p>
                <button
                  onClick={() => {
                    onLogin();
                    setEmail('example.user@gmail.com');
                    setName('Alex Doe');
                  }}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition-colors"
                >
                  <GoogleIcon className="w-6 h-6" />
                  Sign in with Google
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-brand-text-muted mb-2">Name</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" className="w-full bg-white/5 border border-brand-glass-border rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-primary" />
                  </div>
                   <div>
                    <label htmlFor="artType" className="block text-sm font-medium text-brand-text-muted mb-2">Type of Art</label>
                    <select id="artType" value={artType} onChange={(e) => setArtType(e.target.value)} className="w-full bg-white/5 border border-brand-glass-border rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-primary appearance-none">
                      <option>Digital Illustration</option>
                      <option>Handmade Collage</option>
                      <option>Mixed Media</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-brand-text-muted mb-2">Email</label>
                  <input type="email" id="email" value={email} readOnly className="w-full bg-black/20 border border-brand-glass-border rounded-lg py-3 px-4 text-brand-text-muted cursor-not-allowed" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-brand-text-muted mb-2">Description</label>
                  <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={5} placeholder="Describe the custom artwork you have in mind..." className="w-full bg-white/5 border border-brand-glass-border rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-primary"></textarea>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-brand-text-muted mb-2">Reference Image (Optional)</label>
                    <div onClick={() => fileInputRef.current?.click()} className="flex justify-center items-center w-full px-6 py-10 border-2 border-brand-glass-border border-dashed rounded-lg cursor-pointer hover:bg-white/5">
                        <div className="text-center">
                            <UploadIcon className="mx-auto h-10 w-10 text-brand-text-muted"/>
                            <p className="mt-2 text-sm text-brand-text-muted">{file ? file.name : 'Click to upload a file'}</p>
                            <p className="text-xs text-brand-text-muted/50">PNG, JPG, GIF up to 10MB</p>
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    </div>
                </div>
                <div className="text-center pt-4">
                  <button type="submit" disabled={status === 'loading'} className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-10 py-4 bg-brand-primary text-white font-bold rounded-full hover:bg-brand-primary-hover transition-transform hover:scale-105 shadow-lg disabled:bg-gray-500 disabled:cursor-wait">
                    {status === 'loading' ? 'Sending...' : 'Submit Request'}
                    {status !== 'loading' && <SendIcon className="w-5 h-5" />}
                  </button>
                </div>
                {response && (
                   <div className={`mt-6 p-4 rounded-lg text-center ${status === 'success' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-400'}`}>
                      <p>{response}</p>
                   </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};