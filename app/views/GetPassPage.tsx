import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Sparkles, CheckCircle2 } from 'lucide-react';

interface PassData {
  name: string;
  branch: string;
  year: string;
  interest: string;
  rollNo: string;
  enrollmentId: string;
}

type Stage = 'form' | 'generating' | 'complete';

const GetPassPage: React.FC = () => {
  const [formData, setFormData] = useState<PassData>({
    name: '',
    branch: '',
    year: '',
    interest: '',
    rollNo: '',
    enrollmentId: ''
  });
  const [errors, setErrors] = useState<Partial<PassData>>({});
  const [stage, setStage] = useState<Stage>('form');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const passImageRef = useRef<string | null>(null);

  const validate = () => {
    const newErrors: Partial<PassData> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.branch) newErrors.branch = 'Branch is required';
    if (!formData.year) newErrors.year = 'Year is required';
    if (!formData.interest) newErrors.interest = 'Area of Interest is required';
    if (!formData.rollNo) newErrors.rollNo = 'Roll Number is required';
    if (!formData.enrollmentId) newErrors.enrollmentId = 'Enrollment ID is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof PassData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const generatePass = async () => {
    if (!validate()) return;
    setStage('generating');

    // Simulate a brief delay for effect and ensure DOM update
    await new Promise(resolve => setTimeout(resolve, 1500));

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 16:9 Resolution (Full HD)
    const width = 1920;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;

    // --- Background ---
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#050505');
    gradient.addColorStop(0.5, '#121212');
    gradient.addColorStop(1, '#000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // --- Grid / Texture ---
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1;
    const gridSize = 60;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // --- Cyberpunk Frame ---
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#ef4444'; // Red-500
    ctx.strokeRect(50, 50, width - 100, height - 100);

    // Corner accents (Top-Left, Bottom-Right)
    const cornerSize = 150;
    ctx.fillStyle = '#ef4444';
    
    // Top-Left Fill
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(50 + cornerSize, 50);
    ctx.lineTo(50, 50 + cornerSize);
    ctx.fill();

    // Bottom-Right Fill
    ctx.beginPath();
    ctx.moveTo(width - 50, height - 50);
    ctx.lineTo(width - 50 - cornerSize, height - 50);
    ctx.lineTo(width - 50, height - 50 - cornerSize);
    ctx.fill();

    // --- Header Section (Left Side) ---
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 120px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('KAUSHALAM', 120, 200);
    
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 100px Arial';
    ctx.fillText('2026', 120, 310);

    ctx.fillStyle = '#ffffff';
    ctx.font = '30px Arial';
    ctx.letterSpacing = '8px';
    ctx.fillText('OFFICIAL ENTRY PASS', 120, 380);
    
    ctx.fillStyle = '#888';
    ctx.font = 'bold 24px Arial';
    ctx.letterSpacing = '4px';
    ctx.fillText('GEC BILASPUR', 120, 420);

    // --- Divider Vertical ---
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(900, 100);
    ctx.lineTo(900, height - 100);
    ctx.stroke();

    // --- User Details (Right Side) ---
    const startX = 980;
    const startY = 200;
    const lineHeight = 130;
    
    const drawField = (label: string, value: string, y: number) => {
      // Label
      ctx.fillStyle = '#888';
      ctx.font = 'bold 30px Arial';
      ctx.fillText(label.toUpperCase(), startX, y);

      // Value Box
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(startX, y + 20, 800, 80);
      
      // Value Text
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 50px Courier New';
      ctx.fillText(value.toUpperCase(), startX + 30, y + 75);

      // Accent Line
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(startX, y + 20, 10, 80);
    };

    drawField('Name', formData.name, startY);
    drawField('Branch / Year', `${formData.branch} / ${formData.year}`, startY + lineHeight);
    drawField('Roll No', formData.rollNo, startY + lineHeight * 2);
    drawField('Interest', formData.interest, startY + lineHeight * 3);
    drawField('Enrollment', formData.enrollmentId, startY + lineHeight * 4);

    // --- Bottom/Side Decoration ---
    // Barcode lines
    ctx.fillStyle = '#fff';
    const barcodeX = 120;
    const barcodeY = height - 200;
    for (let i = 0; i < 600; i += 20) {
      if (Math.random() > 0.3) {
        ctx.fillRect(barcodeX + i, barcodeY, 12, 80);
      }
    }

    // Pass Type Label
    ctx.save();
    ctx.translate(width - 150, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('ACCESS GRANTED', 0, 0);
    ctx.restore();

    // Logo (if available)
    const logoImg = new Image();
    logoImg.src = '/logo.webp';
    logoImg.onload = () => {
       // Watermark Logo
       ctx.globalAlpha = 0.1;
       ctx.drawImage(logoImg, 100, 450, 600, 600);
       ctx.globalAlpha = 1.0;
       
       finishGeneration(canvas);
    };
    
    logoImg.onerror = () => {
        finishGeneration(canvas);
    }
  };

  const finishGeneration = (canvas: HTMLCanvasElement) => {
     const dataUrl = canvas.toDataURL('image/png');
     passImageRef.current = dataUrl;
     setStage('complete');
  };

  const downloadPass = () => {
    if (passImageRef.current) {
      const link = document.createElement('a');
      link.download = `KAUSHALAM_PASS_${formData.rollNo}.png`;
      link.href = passImageRef.current;
      link.click();
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 max-w-5xl mx-auto flex flex-col items-center justify-center relative z-10">
      
      {/* Hidden Canvas always rendered but hidden until needed */}
      <div className="absolute opacity-0 pointer-events-none">
         <canvas ref={canvasRef} />
      </div>

      <AnimatePresence mode="wait">
        
        {/* STAGE 1: FORM */}
        {stage === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-3xl"
          >
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-6xl font-black font-space uppercase mb-4 tracking-tighter">
                GET YOUR <span className="text-red-500">PASS</span>
              </h1>
              <p className="text-gray-400 text-lg">
                Enter your details to generate your official Kaushalam 2026 entry pass.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm shadow-2xl">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full bg-black/40 border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-4 text-white focus:outline-none focus:border-red-500 transition-colors font-bold text-lg`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <span className="text-red-500 text-xs mt-1 font-bold">{errors.name}</span>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Branch</label>
                    <select
                      name="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                      className={`w-full bg-black/40 border ${errors.branch ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-4 text-white focus:outline-none focus:border-red-500 transition-colors font-bold`}
                    >
                      <option value="">Select Branch</option>
                      <option value="CSE">CSE</option>
                      <option value="IT">IT</option>
                      <option value="ET&T">ET&T</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Civil">Civil</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Mining">Mining</option>
                    </select>
                    {errors.branch && <span className="text-red-500 text-xs mt-1 font-bold">{errors.branch}</span>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Year</label>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      className={`w-full bg-black/40 border ${errors.year ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-4 text-white focus:outline-none focus:border-red-500 transition-colors font-bold`}
                    >
                      <option value="">Select Year</option>
                      <option value="1st">1st Year</option>
                      <option value="2nd">2nd Year</option>
                      <option value="3rd">3rd Year</option>
                      <option value="4th">4th Year</option>
                    </select>
                    {errors.year && <span className="text-red-500 text-xs mt-1 font-bold">{errors.year}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Roll Number</label>
                    <input
                      type="text"
                      name="rollNo"
                      value={formData.rollNo}
                      onChange={handleInputChange}
                      className={`w-full bg-black/40 border ${errors.rollNo ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-4 text-white focus:outline-none focus:border-red-500 transition-colors font-bold`}
                      placeholder="University Roll No."
                    />
                    {errors.rollNo && <span className="text-red-500 text-xs mt-1 font-bold">{errors.rollNo}</span>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Enrollment ID</label>
                    <input
                      type="text"
                      name="enrollmentId"
                      value={formData.enrollmentId}
                      onChange={handleInputChange}
                      className={`w-full bg-black/40 border ${errors.enrollmentId ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-4 text-white focus:outline-none focus:border-red-500 transition-colors font-bold`}
                      placeholder="Enrollment ID"
                    />
                    {errors.enrollmentId && <span className="text-red-500 text-xs mt-1 font-bold">{errors.enrollmentId}</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Area of Interest</label>
                  <input
                    type="text"
                    name="interest"
                    value={formData.interest}
                    onChange={handleInputChange}
                    className={`w-full bg-black/40 border ${errors.interest ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-4 text-white focus:outline-none focus:border-red-500 transition-colors font-bold`}
                    placeholder="e.g. Coding, Dance, Robotics"
                  />
                  {errors.interest && <span className="text-red-500 text-xs mt-1 font-bold">{errors.interest}</span>}
                </div>

                <button
                  onClick={generatePass}
                  className="w-full py-5 mt-6 bg-red-600 hover:bg-red-500 text-white font-black text-xl rounded-2xl uppercase tracking-widest transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-red-900/20"
                >
                  <Sparkles size={20} /> Get Passes
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STAGE 2: GENERATING (LOADING) */}
        {stage === 'generating' && (
          <motion.div
            key="generating"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-red-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-black font-space uppercase tracking-widest animate-pulse">Generating Your Pass...</h2>
            <p className="text-gray-500 mt-2 font-mono text-sm">Please wait while we secure your entry.</p>
          </motion.div>
        )}

        {/* STAGE 3: COMPLETE (RESULT) */}
        {stage === 'complete' && passImageRef.current && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-full flex flex-col items-center"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-500 text-sm font-bold uppercase tracking-widest mb-4">
                <CheckCircle2 size={16} /> Ready for Download
              </div>
              <h2 className="text-4xl font-black font-space uppercase">Here is your Pass</h2>
            </div>

            {/* Pass Preview (16:9 Aspect Ratio) */}
            <div className="relative w-full aspect-video bg-black border-4 border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-red-900/20 mb-8 group">
              <img 
                src={passImageRef.current} 
                alt="Generated Pass" 
                className="w-full h-full object-contain" 
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <button
                onClick={downloadPass}
                className="flex-1 py-4 bg-white text-black font-black text-lg rounded-xl uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95"
              >
                <Download size={20} /> Download Pass
              </button>
              {/* Optional: Reset to create another */}
              {/* <button
                onClick={() => setStage('form')}
                className="px-6 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                New
              </button> */}
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default GetPassPage;
