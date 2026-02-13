
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
  teamMembers: any[];
  galleryItems: any[];
  scheduleItems: any[];
  userRole: 'admin' | 'student' | null;
}

type AdminTab = 'events' | 'team' | 'gallery' | 'schedule';

const AdminPage: React.FC<AdminPageProps> = ({ events, teamMembers, galleryItems, scheduleItems, userRole }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('events');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // ... rest of state
  const [eventFormData, setEventFormData] = useState<Partial<FestEvent>>({
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

  const [teamFormData, setTeamFormData] = useState<any>({
    name: '',
    role: '',
    category: 'Core',
    image: '',
    links: { linkedin: '', twitter: '', github: '', instagram: '' }
  });

  const [galleryFormData, setGalleryFormData] = useState<any>({
    type: 'image',
    category: 'Campus',
    title: '',
    url: '',
    link: ''
  });

  const [scheduleFormData, setScheduleFormData] = useState<any>({
    day: 'Day 1',
    time: '',
    title: '',
    venue: '',
    type: 'Technical'
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
    if (activeTab === 'events') {
      setEventFormData({
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
    } else if (activeTab === 'team') {
      setTeamFormData({
        name: '',
        role: '',
        category: 'Core',
        image: '',
        links: { linkedin: '', twitter: '', github: '', instagram: '' }
      });
    } else if (activeTab === 'gallery') {
      setGalleryFormData({
        type: 'image',
        category: 'Campus',
        title: '',
        url: '',
        link: ''
      });
    } else {
      setScheduleFormData({
        day: 'Day 1',
        time: '',
        title: '',
        venue: '',
        type: 'Technical'
      });
    }
    setEditingId(null);
    setIsAdding(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const path = activeTab;
      let data;
      if (activeTab === 'events') data = eventFormData;
      else if (activeTab === 'team') data = teamFormData;
      else if (activeTab === 'gallery') data = galleryFormData;
      else data = scheduleFormData;
      
      if (editingId) {
        const itemRef = ref(db, `${path}/${editingId}`);
        const { id, ...saveData } = data as any;
        await update(itemRef, saveData);
        alert(`${activeTab.slice(0, -1)} updated successfully!`);
      } else {
        const itemsRef = ref(db, path);
        const newItemRef = push(itemsRef);
        await set(newItemRef, data);
        alert(`${activeTab.slice(0, -1)} added successfully!`);
      }
      resetForm();
    } catch (error) {
      console.error(`Error saving ${activeTab}:`, error);
      alert('Error saving. Check console.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete this ${activeTab.slice(0, -1)}?`)) return;
    try {
      const itemRef = ref(db, `${activeTab}/${id}`);
      await remove(itemRef);
      alert('Deleted successfully.');
    } catch (error) {
      console.error(`Error deleting ${activeTab}:`, error);
    }
  };

  const startEdit = (item: any) => {
    if (activeTab === 'events') setEventFormData(item);
    else if (activeTab === 'team') setTeamFormData(item);
    else if (activeTab === 'gallery') setGalleryFormData(item);
    else setScheduleFormData(item);
    
    setEditingId(item.id);
    setIsAdding(true);
  };

  return (
    <div className="min-h-screen pt-12 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div>
          <h1 className="text-5xl md:text-7xl font-black font-space uppercase tracking-tighter">Fest <span className="text-red-500">Manager</span></h1>
          <p className="text-gray-400 mt-2">Manage Kaushalam 2026 content via Realtime Database.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-8 py-4 bg-white text-black font-black rounded-2xl hover:bg-red-600 hover:text-white transition-all flex items-center gap-2"
        >
          <Plus size={20} /> Add New {activeTab === 'events' ? 'Event' : activeTab === 'team' ? 'Member' : 'Item'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 mb-12 bg-white/5 p-2 rounded-3xl border border-white/5 w-fit">
        {(['events', 'team', 'gallery', 'schedule'] as AdminTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setIsAdding(false); setEditingId(null); }}
            className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${
              activeTab === tab ? 'bg-red-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
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
          <h2 className="text-2xl font-black mb-8 font-space uppercase">
            {editingId ? 'Edit' : 'Add'} {activeTab === 'events' ? 'Event' : activeTab === 'team' ? 'Member' : 'Gallery Item'}
          </h2>
          
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeTab === 'events' && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Event Name</label>
                  <input 
                    required
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white"
                    value={eventFormData.name}
                    onChange={(e) => setEventFormData({...eventFormData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Category</label>
                  <Select
                    value={eventFormData.category}
                    onValueChange={(value) => setEventFormData({...eventFormData, category: value as any})}
                  >
                    <SelectTrigger className="w-full px-6 py-4 h-auto bg-black/40 border border-white/10 rounded-2xl focus:ring-0 focus:border-red-500 transition-colors text-white">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border border-white/10 text-white backdrop-blur-xl">
                      <SelectItem value="Technical">Technical</SelectItem>
                      <SelectItem value="Cultural">Cultural</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                      <SelectItem value="Workshops">Workshops</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Short Description</label>
                  <input 
                    required
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white"
                    value={eventFormData.description}
                    onChange={(e) => setEventFormData({...eventFormData, description: e.target.value})}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Long Description</label>
                  <textarea 
                    required
                    rows={4}
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white resize-none"
                    value={eventFormData.longDescription}
                    onChange={(e) => setEventFormData({...eventFormData, longDescription: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Date</label>
                  <input 
                    required
                    placeholder="e.g. March 12, 2026"
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white"
                    value={eventFormData.date}
                    onChange={(e) => setEventFormData({...eventFormData, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Time</label>
                  <input 
                    required
                    placeholder="e.g. 10:00 AM"
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white"
                    value={eventFormData.time}
                    onChange={(e) => setEventFormData({...eventFormData, time: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Venue</label>
                  <input 
                    required
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white"
                    value={eventFormData.venue}
                    onChange={(e) => setEventFormData({...eventFormData, venue: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Image URL</label>
                  <input 
                    required
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white"
                    value={eventFormData.image}
                    onChange={(e) => setEventFormData({...eventFormData, image: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Registration URL</label>
                  <input 
                    required
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white"
                    value={eventFormData.registrationUrl}
                    onChange={(e) => setEventFormData({...eventFormData, registrationUrl: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Icon (Lucide Name)</label>
                  <Select
                    value={eventFormData.icon}
                    onValueChange={(value) => setEventFormData({...eventFormData, icon: value})}
                  >
                    <SelectTrigger className="w-full px-6 py-4 h-auto bg-black/40 border border-white/10 rounded-2xl focus:ring-0 focus:border-red-500 transition-colors text-white">
                      <SelectValue placeholder="Select Icon" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border border-white/10 text-white backdrop-blur-xl">
                      <SelectItem value="Code">Code</SelectItem>
                      <SelectItem value="Music">Music</SelectItem>
                      <SelectItem value="Trophy">Trophy</SelectItem>
                      <SelectItem value="Cpu">Cpu</SelectItem>
                      <SelectItem value="Camera">Camera</SelectItem>
                      <SelectItem value="Palette">Palette</SelectItem>
                      <SelectItem value="Gamepad2">Gamepad2</SelectItem>
                      <SelectItem value="BrainCircuit">BrainCircuit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {activeTab === 'team' && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Full Name</label>
                  <input 
                    required
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white"
                    value={teamFormData.name}
                    onChange={(e) => setTeamFormData({...teamFormData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Role</label>
                  <input 
                    required
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white"
                    value={teamFormData.role}
                    onChange={(e) => setTeamFormData({...teamFormData, role: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Category</label>
                  <Select
                    value={teamFormData.category}
                    onValueChange={(value) => setTeamFormData({...teamFormData, category: value as any})}
                  >
                    <SelectTrigger className="w-full px-6 py-4 h-auto bg-black/40 border border-white/10 rounded-2xl focus:ring-0 focus:border-red-500 transition-colors text-white">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border border-white/10 text-white backdrop-blur-xl">
                      <SelectItem value="Core">Core</SelectItem>
                      <SelectItem value="Technical">Technical</SelectItem>
                      <SelectItem value="Cultural">Cultural</SelectItem>
                      <SelectItem value="Creative">Creative</SelectItem>
                      <SelectItem value="Publicity">Publicity</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Image URL</label>
                  <input 
                    required
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white"
                    value={teamFormData.image}
                    onChange={(e) => setTeamFormData({...teamFormData, image: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">LinkedIn URL</label>
                  <input 
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white"
                    value={teamFormData.links.linkedin}
                    onChange={(e) => setTeamFormData({...teamFormData, links: {...teamFormData.links, linkedin: e.target.value}})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">GitHub URL</label>
                  <input 
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white"
                    value={teamFormData.links.github}
                    onChange={(e) => setTeamFormData({...teamFormData, links: {...teamFormData.links, github: e.target.value}})}
                  />
                </div>
              </>
            )}

            {activeTab === 'gallery' && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Title</label>
                  <input 
                    required
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white"
                    value={galleryFormData.title}
                    onChange={(e) => setGalleryFormData({...galleryFormData, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Media Type</label>
                  <Select
                    value={galleryFormData.type}
                    onValueChange={(value) => setGalleryFormData({...galleryFormData, type: value as any})}
                  >
                    <SelectTrigger className="w-full px-6 py-4 h-auto bg-black/40 border border-white/10 rounded-2xl focus:ring-0 focus:border-red-500 transition-colors text-white">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border border-white/10 text-white backdrop-blur-xl">
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Category</label>
                  <input 
                    required
                    placeholder="e.g. Aftermovie, Cultural, Tech"
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white"
                    value={galleryFormData.category}
                    onChange={(e) => setGalleryFormData({...galleryFormData, category: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Thumbnail/Image URL</label>
                  <input 
                    required
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white"
                    value={galleryFormData.url}
                    onChange={(e) => setGalleryFormData({...galleryFormData, url: e.target.value})}
                  />
                </div>
                {galleryFormData.type === 'video' && (
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Video Link (YouTube/Instagram)</label>
                    <input 
                      required
                      className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white"
                      value={galleryFormData.link}
                      onChange={(e) => setGalleryFormData({...galleryFormData, link: e.target.value})}
                    />
                  </div>
                )}
              </>
            )}

            {activeTab === 'schedule' && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Day</label>
                  <Select
                    value={scheduleFormData.day}
                    onValueChange={(value) => setScheduleFormData({...scheduleFormData, day: value})}
                  >
                    <SelectTrigger className="w-full px-6 py-4 h-auto bg-black/40 border border-white/10 rounded-2xl focus:ring-0 focus:border-red-500 transition-colors text-white">
                      <SelectValue placeholder="Select Day" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border border-white/10 text-white backdrop-blur-xl">
                      <SelectItem value="Day 1">Day 1</SelectItem>
                      <SelectItem value="Day 2">Day 2</SelectItem>
                      <SelectItem value="Day 3">Day 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Time</label>
                  <input 
                    required
                    placeholder="e.g. 09:00 AM"
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white"
                    value={scheduleFormData.time}
                    onChange={(e) => setScheduleFormData({...scheduleFormData, time: e.target.value})}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Event Title</label>
                  <input 
                    required
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white"
                    value={scheduleFormData.title}
                    onChange={(e) => setScheduleFormData({...scheduleFormData, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Venue</label>
                  <input 
                    required
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white"
                    value={scheduleFormData.venue}
                    onChange={(e) => setScheduleFormData({...scheduleFormData, venue: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Type</label>
                  <input 
                    required
                    placeholder="e.g. Technical, Cultural, Official"
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white"
                    value={scheduleFormData.type}
                    onChange={(e) => setScheduleFormData({...scheduleFormData, type: e.target.value})}
                  />
                </div>
              </>
            )}

            <div className="md:col-span-2 flex gap-4 pt-4">
              <button type="submit" className="flex-1 py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-500 transition-all flex items-center justify-center gap-2">
                <Save size={20} /> {editingId ? 'Update' : 'Create'} {activeTab.slice(0, -1)}
              </button>
              <button type="button" onClick={resetForm} className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-gray-400 hover:text-white transition-all">
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Items List */}
      <div className="grid grid-cols-1 gap-4">
        {activeTab === 'events' && events.map((event) => (
          <div key={event.id} className="p-6 bg-white/5 border border-white/10 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6 hover:border-white/20 transition-all">
            <div className="flex items-center gap-6 w-full md:w-auto">
              <img src={event.image} alt={event.name} className="w-20 h-20 rounded-2xl object-cover border border-white/10" />
              <div>
                <h3 className="text-xl font-bold font-space uppercase leading-tight">{event.name}</h3>
                <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{event.category} • {event.date}</p>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button onClick={() => startEdit(event)} className="flex-1 md:flex-none p-4 bg-white/5 text-gray-400 hover:text-white rounded-2xl transition-all flex items-center justify-center gap-2">
                <Edit2 size={18} /> Edit
              </button>
              <button onClick={() => handleDelete(event.id)} className="flex-1 md:flex-none p-4 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-2xl transition-all flex items-center justify-center gap-2">
                <Trash2 size={18} /> Delete
              </button>
            </div>
          </div>
        ))}

        {activeTab === 'team' && teamMembers.map((member) => (
          <div key={member.id} className="p-6 bg-white/5 border border-white/10 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6 hover:border-white/20 transition-all">
            <div className="flex items-center gap-6 w-full md:w-auto">
              <img src={member.image} alt={member.name} className="w-20 h-20 rounded-2xl object-cover border border-white/10" />
              <div>
                <h3 className="text-xl font-bold font-space uppercase leading-tight">{member.name}</h3>
                <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{member.category} • {member.role}</p>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button onClick={() => startEdit(member)} className="flex-1 md:flex-none p-4 bg-white/5 text-gray-400 hover:text-white rounded-2xl transition-all flex items-center justify-center gap-2">
                <Edit2 size={18} /> Edit
              </button>
              <button onClick={() => handleDelete(member.id)} className="flex-1 md:flex-none p-4 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-2xl transition-all flex items-center justify-center gap-2">
                <Trash2 size={18} /> Delete
              </button>
            </div>
          </div>
        ))}

        {activeTab === 'gallery' && galleryItems.map((item) => (
          <div key={item.id} className="p-6 bg-white/5 border border-white/10 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6 hover:border-white/20 transition-all">
            <div className="flex items-center gap-6 w-full md:w-auto">
              <img src={item.url} alt={item.title} className="w-20 h-20 rounded-2xl object-cover border border-white/10" />
              <div>
                <h3 className="text-xl font-bold font-space uppercase leading-tight">{item.title}</h3>
                <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{item.category} • {item.type}</p>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button onClick={() => startEdit(item)} className="flex-1 md:flex-none p-4 bg-white/5 text-gray-400 hover:text-white rounded-2xl transition-all flex items-center justify-center gap-2">
                <Edit2 size={18} /> Edit
              </button>
              <button onClick={() => handleDelete(item.id)} className="flex-1 md:flex-none p-4 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-2xl transition-all flex items-center justify-center gap-2">
                <Trash2 size={18} /> Delete
              </button>
            </div>
          </div>
        ))}

        {activeTab === 'schedule' && scheduleItems.map((item) => (
          <div key={item.id} className="p-6 bg-white/5 border border-white/10 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6 hover:border-white/20 transition-all">
            <div className="flex items-center gap-6 w-full md:w-auto">
              <div className="w-20 h-20 rounded-2xl bg-red-600/10 flex flex-col items-center justify-center border border-red-600/20">
                <span className="text-red-500 font-black text-xs uppercase">{item.day}</span>
                <span className="text-white font-bold text-[10px]">{item.time}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold font-space uppercase leading-tight">{item.title}</h3>
                <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{item.venue} • {item.type}</p>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button onClick={() => startEdit(item)} className="flex-1 md:flex-none p-4 bg-white/5 text-gray-400 hover:text-white rounded-2xl transition-all flex items-center justify-center gap-2">
                <Edit2 size={18} /> Edit
              </button>
              <button onClick={() => handleDelete(item.id)} className="flex-1 md:flex-none p-4 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-2xl transition-all flex items-center justify-center gap-2">
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
