
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase';
import { ref, push, set, remove, update } from 'firebase/database';
import { Plus, Trash2, Edit2, X, Save, ShieldCheck, LogIn } from 'lucide-react';
import { FestEvent } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

interface AdminPageProps {
  events: FestEvent[];
}

const AdminPage: React.FC<AdminPageProps> = ({ events }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<FestEvent>>({
    name: '',
    category: 'Technical',
    description: '',
    longDescription: '',
    date: '',
    time: '',
    venue: '',
    image: '',
    icon: 'Code',
    gridSpan: 'small',
    registrationUrl: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin2026') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid Password');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Technical',
      description: '',
      longDescription: '',
      date: '',
      time: '',
      venue: '',
      image: '',
      icon: 'Code',
      gridSpan: 'small',
      registrationUrl: ''
    });
    setEditingId(null);
    setIsAdding(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const eventRef = ref(db, `events/${editingId}`);
        // Remove the ID from the object before saving as key is the ID in RTDB
        const { id, ...saveData } = formData as FestEvent;
        await update(eventRef, saveData);
        alert('Event updated successfully!');
      } else {
        const eventsRef = ref(db, 'events');
        const newEventRef = push(eventsRef);
        await set(newEventRef, formData);
        alert('Event added successfully!');
      }
      resetForm();
    } catch (error) {
      console.error("Error saving event:", error);
      alert('Error saving event. Check console.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const eventRef = ref(db, `events/${id}`);
      await remove(eventRef);
      alert('Event deleted.');
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const startEdit = (event: FestEvent) => {
    setFormData(event);
    setEditingId(event.id);
    setIsAdding(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full p-10 bg-white/5 border border-white/10 rounded-[48px] backdrop-blur-xl text-center"
        >
          <div className="w-16 h-16 bg-red-600/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-black mb-2 font-space uppercase">Admin Portal</h1>
          <p className="text-gray-400 mb-8">Restricted Access. Please enter the management key.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Admin Password" 
              className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white text-center"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="w-full py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-500 transition-all flex items-center justify-center gap-2">
              <LogIn size={20} /> Access Panel
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-12 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div>
          <h1 className="text-5xl md:text-7xl font-black font-space uppercase tracking-tighter">Event <span className="text-red-500">Manager</span></h1>
          <p className="text-gray-400 mt-2">Create, edit and manage Kaushalam 2026 events via Realtime Database.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-8 py-4 bg-white text-black font-black rounded-2xl hover:bg-red-600 hover:text-white transition-all flex items-center gap-2"
        >
          <Plus size={20} /> Add New Event
        </button>
      </div>

      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 p-8 md:p-12 bg-white/5 border border-white/10 rounded-[48px] backdrop-blur-3xl relative"
        >
          <button onClick={resetForm} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
          <h2 className="text-2xl font-black mb-8 font-space uppercase">{editingId ? 'Edit' : 'Add'} Event</h2>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Event Name</label>
              <input 
                required
                className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Category</label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({...formData, category: value as any})}
              >
                <SelectTrigger className="w-full px-6 py-4 h-auto bg-black/40 border border-white/10 rounded-2xl focus:ring-0 focus:border-red-500 transition-colors text-white">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border border-white/10 text-white backdrop-blur-xl">
                  <SelectItem value="Technical" className="focus:bg-red-600 focus:text-white cursor-pointer">Technical</SelectItem>
                  <SelectItem value="Cultural" className="focus:bg-red-600 focus:text-white cursor-pointer">Cultural</SelectItem>
                  <SelectItem value="Sports" className="focus:bg-red-600 focus:text-white cursor-pointer">Sports</SelectItem>
                  <SelectItem value="Workshops" className="focus:bg-red-600 focus:text-white cursor-pointer">Workshops</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Short Description</label>
              <input 
                required
                className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Long Description</label>
              <textarea 
                required
                rows={4}
                className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white resize-none"
                value={formData.longDescription}
                onChange={(e) => setFormData({...formData, longDescription: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Date</label>
              <input 
                required
                placeholder="e.g. March 12, 2026"
                className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Time</label>
              <input 
                required
                placeholder="e.g. 10:00 AM"
                className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Venue</label>
              <input 
                required
                className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white"
                value={formData.venue}
                onChange={(e) => setFormData({...formData, venue: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Image URL</label>
              <input 
                required
                className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Registration URL</label>
              <input 
                required
                placeholder="Google Form or Website Link"
                className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white"
                value={formData.registrationUrl}
                onChange={(e) => setFormData({...formData, registrationUrl: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Icon (Lucide Name)</label>
              <Select
                value={formData.icon}
                onValueChange={(value) => setFormData({...formData, icon: value})}
              >
                <SelectTrigger className="w-full px-6 py-4 h-auto bg-black/40 border border-white/10 rounded-2xl focus:ring-0 focus:border-red-500 transition-colors text-white">
                  <SelectValue placeholder="Select Icon" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border border-white/10 text-white backdrop-blur-xl">
                  <SelectItem value="Code" className="focus:bg-red-600 focus:text-white cursor-pointer">Code</SelectItem>
                  <SelectItem value="Music" className="focus:bg-red-600 focus:text-white cursor-pointer">Music</SelectItem>
                  <SelectItem value="Trophy" className="focus:bg-red-600 focus:text-white cursor-pointer">Trophy</SelectItem>
                  <SelectItem value="Cpu" className="focus:bg-red-600 focus:text-white cursor-pointer">Cpu</SelectItem>
                  <SelectItem value="Camera" className="focus:bg-red-600 focus:text-white cursor-pointer">Camera</SelectItem>
                  <SelectItem value="Palette" className="focus:bg-red-600 focus:text-white cursor-pointer">Palette</SelectItem>
                  <SelectItem value="Gamepad2" className="focus:bg-red-600 focus:text-white cursor-pointer">Gamepad2</SelectItem>
                  <SelectItem value="BrainCircuit" className="focus:bg-red-600 focus:text-white cursor-pointer">BrainCircuit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Grid Span</label>
              <Select
                value={formData.gridSpan}
                onValueChange={(value) => setFormData({...formData, gridSpan: value as any})}
              >
                <SelectTrigger className="w-full px-6 py-4 h-auto bg-black/40 border border-white/10 rounded-2xl focus:ring-0 focus:border-red-500 transition-colors text-white">
                  <SelectValue placeholder="Select Grid Span" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border border-white/10 text-white backdrop-blur-xl">
                  <SelectItem value="small" className="focus:bg-red-600 focus:text-white cursor-pointer">Small</SelectItem>
                  <SelectItem value="medium" className="focus:bg-red-600 focus:text-white cursor-pointer">Medium</SelectItem>
                  <SelectItem value="large" className="focus:bg-red-600 focus:text-white cursor-pointer">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 flex gap-4 pt-4">
              <button type="submit" className="flex-1 py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-500 transition-all flex items-center justify-center gap-2">
                <Save size={20} /> {editingId ? 'Update Event' : 'Create Event'}
              </button>
              <button type="button" onClick={resetForm} className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-gray-400 hover:text-white transition-all">
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Events List */}
      <div className="grid grid-cols-1 gap-4">
        {events.map((event) => (
          <div key={event.id} className="p-6 bg-white/5 border border-white/10 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6 hover:border-white/20 transition-all">
            <div className="flex items-center gap-6 w-full md:w-auto">
              <img src={event.image} alt={event.name} className="w-20 h-20 rounded-2xl object-cover border border-white/10" />
              <div>
                <h3 className="text-xl font-bold font-space uppercase leading-tight">{event.name}</h3>
                <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{event.category} • {event.gridSpan} Span</p>
                <p className="text-gray-500 text-sm mt-1">{event.date} • {event.venue}</p>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button 
                onClick={() => startEdit(event)}
                className="flex-1 md:flex-none p-4 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                <Edit2 size={18} /> Edit
              </button>
              <button 
                onClick={() => handleDelete(event.id)}
                className="flex-1 md:flex-none p-4 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={18} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
