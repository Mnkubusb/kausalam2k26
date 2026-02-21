import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { ref, push, set, remove, update } from "firebase/database";
import { useUploadThing } from "@/lib/uploadthing";
import {
  Plus,
  Trash2,
  Edit2,
  X,
  Save,
  ShieldCheck,
  LogIn,
  Calendar,
  Users,
  Image as ImageIcon,
  LayoutDashboard,
  Search,
  ExternalLink,
  MoreVertical,
  CheckCircle2,
} from "lucide-react";
import {
  FestEvent,
  EventPointOfContact,
  TeamMember,
  GalleryItem,
  ScheduleItem,
} from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { TEAM_MEMBERS as STATIC_TEAM } from "@/constants";

interface AdminPageProps {
  events: FestEvent[];
  team: TeamMember[];
  gallery: GalleryItem[];
  schedule: ScheduleItem[];
}

type AdminTab = "events" | "team" | "gallery" | "schedule";

const normalizeHomeGridSize = (size?: FestEvent["homeGridSize"]) => {
  if (size === "bigger") return "large";
  if (size === "smaller") return "auto";
  return size || "auto";
};

const getYouTubeEmbedUrl = (url?: string) => {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace("www.", "");
    let videoId = "";

    if (host === "youtu.be") {
      videoId = parsed.pathname.slice(1);
    } else if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname === "/watch") {
        videoId = parsed.searchParams.get("v") || "";
      } else if (parsed.pathname.startsWith("/embed/")) {
        videoId = parsed.pathname.split("/embed/")[1] || "";
      } else if (parsed.pathname.startsWith("/shorts/")) {
        videoId = parsed.pathname.split("/shorts/")[1] || "";
      }
    }

    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return null;
  }
};

const createEmptyContact = (): EventPointOfContact => ({
  name: "",
  phone: "",
  image: "",
});

const AdminPage: React.FC<AdminPageProps> = ({
  events,
  team,
  gallery,
  schedule,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("events");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEventImageDragOver, setIsEventImageDragOver] = useState(false);
  const [eventImageUploadError, setEventImageUploadError] = useState("");
  const [contactImageUploadError, setContactImageUploadError] = useState("");
  const { startUpload, isUploading: eventImageUploading } = useUploadThing(
    "eventImageUploader",
  );

  // Form States
  const [eventForm, setEventForm] = useState<Partial<FestEvent>>({
    name: "",
    category: "Technical",
    description: "",
    longDescription: "",
    eventType: "",
    prizePool: "",
    teamSize: "",
    pointOfContact: "",
    pointOfContacts: [],
    date: "",
    time: "",
    venue: "",
    image: "",
    icon: "Code",
    gridSpan: "small",
    homeGridSize: "auto",
    homeApproved: false,
    registrationUrl: "",
  });

  const [teamForm, setTeamForm] = useState<Partial<TeamMember>>({
    name: "",
    role: "",
    category: "Core",
    image: "",
    links: { linkedin: "", twitter: "", github: "", instagram: "" },
  });

  const [galleryForm, setGalleryForm] = useState<Partial<GalleryItem>>({
    title: "",
    type: "image",
    category: "General",
    url: "",
    link: "",
  });

  const [scheduleForm, setScheduleForm] = useState<Partial<ScheduleItem>>({
    day: "Day 1",
    time: "",
    title: "",
    venue: "",
    type: "Technical",
  });
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin2026") setIsAuthenticated(true);
    else alert("Invalid Password");
  };

  const resetForms = () => {
    setEditingId(null);
    setIsAdding(false);
    setEventForm({
      name: "",
      category: "Technical",
      description: "",
      longDescription: "",
      eventType: "",
      prizePool: "",
      teamSize: "",
      pointOfContact: "",
      pointOfContacts: [],
      date: "",
      time: "",
      venue: "",
      image: "",
      icon: "Code",
      gridSpan: "small",
      homeGridSize: "auto",
      homeApproved: false,
      registrationUrl: "",
    });
    setTeamForm({
      name: "",
      role: "",
      category: "Core",
      image: "",
      links: { linkedin: "", twitter: "", github: "", instagram: "" },
    });
    setGalleryForm({
      title: "",
      type: "image",
      category: "General",
      url: "",
      link: "",
    });
    setScheduleForm({
      day: "Day 1",
      time: "",
      title: "",
      venue: "",
      type: "Technical",
    });
    setEventImageUploadError("");
    setContactImageUploadError("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataRef = ref(db, activeTab + (editingId ? `/${editingId}` : ""));
      let data: any;

      if (activeTab === "events") {
        const cleanedContacts = (eventForm.pointOfContacts || [])
          .map((contact) => ({
            name: contact.name?.trim() || "",
            phone: contact.phone?.trim() || "",
            image: contact.image?.trim() || "",
          }))
          .filter((contact) => contact.name);

        data = {
          ...eventForm,
          pointOfContacts: cleanedContacts,
          pointOfContact:
            cleanedContacts[0]
              ? `${cleanedContacts[0].name}${cleanedContacts[0].phone ? ` (${cleanedContacts[0].phone})` : ""}`
              : eventForm.pointOfContact || "",
        };
      }
      else if (activeTab === "team") data = teamForm;
      else if (activeTab === "gallery") data = galleryForm;
      else if (activeTab === "schedule") data = scheduleForm;

      if (editingId) {
        const { id, ...saveData } = data;
        await update(dataRef, saveData);
      } else {
        const newRef = push(ref(db, activeTab));
        await set(newRef, data);
      }

      alert(`${activeTab.slice(0, -1)} saved successfully!`);
      resetForms();
    } catch (error) {
      console.error("Error saving:", error);
      alert("Error saving. Check console.");
    }
  };

  const handleEventImageUpload = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setEventImageUploadError("Please upload a valid image file.");
      return;
    }
    setEventImageUploadError("");
    try {
      const result = await startUpload([file]);
      const uploadedUrl = result?.[0]?.ufsUrl || result?.[0]?.url;
      if (!uploadedUrl) {
        setEventImageUploadError("Upload failed. No file URL returned.");
        return;
      }
      setEventForm((prev) => ({ ...prev, image: uploadedUrl }));
    } catch (error) {
      console.error("Error uploading event image:", error);
      setEventImageUploadError("Upload failed. Check UploadThing config.");
    }
  };

  const setPointOfContacts = (
    updater: (contacts: EventPointOfContact[]) => EventPointOfContact[],
  ) => {
    setEventForm((prev) => {
      const contacts = Array.isArray(prev.pointOfContacts)
        ? prev.pointOfContacts
        : [];
      return { ...prev, pointOfContacts: updater(contacts) };
    });
  };

  const addPointOfContact = () => {
    setPointOfContacts((contacts) => [...contacts, createEmptyContact()]);
  };

  const updatePointOfContact = (
    index: number,
    field: keyof EventPointOfContact,
    value: string,
  ) => {
    setPointOfContacts((contacts) =>
      contacts.map((contact, i) =>
        i === index ? { ...contact, [field]: value } : contact,
      ),
    );
  };

  const removePointOfContact = (index: number) => {
    setPointOfContacts((contacts) => contacts.filter((_, i) => i !== index));
  };

  const handlePointOfContactImageUpload = async (index: number, file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setContactImageUploadError("Please upload a valid image file.");
      return;
    }
    setContactImageUploadError("");
    try {
      const result = await startUpload([file]);
      const uploadedUrl = result?.[0]?.ufsUrl || result?.[0]?.url;
      if (!uploadedUrl) {
        setContactImageUploadError("Upload failed. No file URL returned.");
        return;
      }
      updatePointOfContact(index, "image", uploadedUrl);
    } catch (error) {
      console.error("Error uploading contact image:", error);
      setContactImageUploadError("Upload failed. Check UploadThing config.");
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        `Are you sure you want to delete this ${activeTab.slice(0, -1)}?`,
      )
    )
      return;
    try {
      await remove(ref(db, `${activeTab}/${id}`));
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    if (activeTab === "events") {
      const normalizedContacts: EventPointOfContact[] = Array.isArray(
        item.pointOfContacts,
      )
        ? item.pointOfContacts.map((contact: EventPointOfContact) => ({
            name: contact.name || "",
            phone: contact.phone || "",
            image: contact.image || "",
          }))
        : item.pointOfContact
          ? [{ name: item.pointOfContact, phone: "", image: "" }]
          : [];

      setEventForm({
        ...item,
        homeGridSize: normalizeHomeGridSize(item.homeGridSize),
        homeApproved: Boolean(item.homeApproved),
        pointOfContacts: normalizedContacts,
      });
    }
    else if (activeTab === "team") setTeamForm(item);
    else if (activeTab === "gallery") setGalleryForm(item);
    else if (activeTab === "schedule") setScheduleForm(item);
    setIsAdding(true);
  };

  const handleToggleHomeApproval = async (eventId: string, approved: boolean) => {
    try {
      await update(ref(db, `events/${eventId}`), { homeApproved: !approved });
    } catch (error) {
      console.error("Error updating home approval:", error);
      alert("Error updating home approval. Check console.");
    }
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
          <h1 className="text-3xl font-black mb-2 font-space uppercase">
            Admin Portal
          </h1>
          <p className="text-gray-400 mb-8">
            Restricted Access. Please enter the management key.
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Admin Password"
              className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white text-center"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="w-full py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-500 transition-all flex items-center justify-center gap-2"
            >
              <LogIn size={20} /> Access Panel
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const filteredItems = () => {
    let items: any[] = [];
    if (activeTab === "events") items = events;
    else if (activeTab === "team") items = team;
    else if (activeTab === "gallery") items = gallery;
    else if (activeTab === "schedule") items = schedule;

    return items.filter((item) =>
      (item.name || item.title || item.day)
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()),
    );
  };

  return (
    <div className="min-h-screen pt-8 pb-24 px-4 md:px-12 max-w-7xl mx-auto">
      {/* Sidebar/Top Navigation */}
      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        <div className="lg:w-64 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
          {[
            { id: "events", label: "Events", icon: Calendar },
            { id: "team", label: "Team", icon: Users },
            { id: "gallery", label: "Gallery", icon: ImageIcon },
            { id: "schedule", label: "Schedule", icon: LayoutDashboard },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as AdminTab);
                setIsAdding(false);
                setEditingId(null);
              }}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-red-600 text-white shadow-lg"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <tab.icon size={20} /> {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black font-space uppercase tracking-tighter">
                {activeTab} <span className="text-red-500">Manager</span>
              </h1>
              <p className="text-gray-400 mt-1">
                Manage {activeTab} in Realtime Database.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white w-full md:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                onClick={() => setIsAdding(true)}
                className="px-6 py-4 bg-white text-black font-black rounded-2xl hover:bg-red-600 hover:text-white transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <Plus size={20} /> Add New
              </button>
            </div>
          </div>

          {isAdding && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 p-8 bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-3xl relative"
            >
              <button
                onClick={resetForms}
                className="absolute top-6 right-6 text-gray-500 hover:text-white"
              >
                <X size={24} />
              </button>
              <h2 className="text-xl font-black mb-8 font-space uppercase">
                {editingId ? "Edit" : "Add"} {activeTab}
              </h2>

              <form
                onSubmit={handleSave}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {activeTab === "events" && (
                  <>
                    <FormInput
                      label="Event Name"
                      value={eventForm.name}
                      onChange={(v: string) =>
                        setEventForm({ ...eventForm, name: v })
                      }
                    />
                    <FormSelect
                      label="Category"
                      value={eventForm.category}
                      options={[
                        "Technical",
                        "Cultural",
                        "Sports",
                        "Workshops",
                        "Fun Events",
                      ]}
                      onChange={(v: string) =>
                        setEventForm({ ...eventForm, category: v as any })
                      }
                    />
                    <FormInput
                      label="Short Description"
                      value={eventForm.description}
                      onChange={(v: string) =>
                        setEventForm({ ...eventForm, description: v })
                      }
                      className="md:col-span-2"
                    />
                    <FormTextarea
                      label="Long Description"
                      value={eventForm.longDescription}
                      onChange={(v: string) =>
                        setEventForm({ ...eventForm, longDescription: v })
                      }
                      className="md:col-span-2"
                    />
                    <FormInput
                      label="Event Type"
                      value={eventForm.eventType}
                      onChange={(v: string) =>
                        setEventForm({ ...eventForm, eventType: v })
                      }
                      placeholder="e.g. Fun Events Competition"
                      required={false}
                    />
                    <FormInput
                      label="Prize Pool"
                      value={eventForm.prizePool}
                      onChange={(v: string) =>
                        setEventForm({ ...eventForm, prizePool: v })
                      }
                      placeholder="e.g. ₹25,000 + Goodies"
                      required={false}
                    />
                    <FormInput
                      label="Team Size"
                      value={eventForm.teamSize}
                      onChange={(v: string) =>
                        setEventForm({ ...eventForm, teamSize: v })
                      }
                      placeholder="e.g. 1 - 4 Members"
                      required={false}
                    />
                    <div className="md:col-span-2 space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">
                          Points of Contact
                        </label>
                        <button
                          type="button"
                          onClick={addPointOfContact}
                          className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-black uppercase tracking-widest text-white"
                        >
                          Add Contact
                        </button>
                      </div>

                      {(eventForm.pointOfContacts || []).length === 0 && (
                        <p className="text-xs text-gray-400 ml-2">
                          No contact added yet.
                        </p>
                      )}

                      {(eventForm.pointOfContacts || []).map((contact, index) => (
                        <div
                          key={`contact-${index}`}
                          className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-black/30 border border-white/10 rounded-2xl"
                        >
                          <FormInput
                            label={`Contact ${index + 1} Name`}
                            value={contact.name}
                            onChange={(v: string) =>
                              updatePointOfContact(index, "name", v)
                            }
                            required={false}
                          />
                          <FormInput
                            label="Phone"
                            value={contact.phone}
                            onChange={(v: string) =>
                              updatePointOfContact(index, "phone", v)
                            }
                            placeholder="+91 98765..."
                            required={false}
                          />
                          <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">
                              Contact Photo
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-sm text-white file:mr-3 file:rounded-lg file:border-0 file:bg-red-600 file:px-3 file:py-1 file:text-xs file:font-bold file:text-white hover:file:bg-red-500"
                              onChange={(e) =>
                                handlePointOfContactImageUpload(
                                  index,
                                  e.target.files?.[0],
                                )
                              }
                              disabled={eventImageUploading}
                            />
                            {contact.image && (
                              <img
                                src={contact.image}
                                alt={`Contact ${index + 1}`}
                                className="w-20 h-20 rounded-xl object-cover border border-white/10"
                              />
                            )}
                          </div>
                          <div className="flex items-end justify-end">
                            <button
                              type="button"
                              onClick={() => removePointOfContact(index)}
                              className="px-3 py-2 rounded-xl bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white border border-red-500/20 text-xs font-black uppercase tracking-widest"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}

                      {contactImageUploadError && (
                        <p className="text-xs text-red-500 ml-2">
                          {contactImageUploadError}
                        </p>
                      )}
                    </div>
                    <FormInput
                      label="Date"
                      value={eventForm.date}
                      onChange={(v: string) =>
                        setEventForm({ ...eventForm, date: v })
                      }
                      placeholder="March 12, 2026"
                    />
                    <FormInput
                      label="Time"
                      value={eventForm.time}
                      onChange={(v: string) =>
                        setEventForm({ ...eventForm, time: v })
                      }
                      placeholder="10:00 AM"
                    />
                    <FormInput
                      label="Venue"
                      value={eventForm.venue}
                      onChange={(v: string) =>
                        setEventForm({ ...eventForm, venue: v })
                      }
                    />
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">
                        Upload Event Image
                      </label>
                      <label
                        htmlFor="event-image-upload"
                        className={`block w-full p-6 border-2 border-dashed rounded-2xl transition-colors cursor-pointer ${
                          isEventImageDragOver
                            ? "border-red-500 bg-red-600/10"
                            : "border-white/10 bg-black/40 hover:border-white/20"
                        } ${eventImageUploading ? "opacity-70 cursor-not-allowed" : ""}`}
                        onDragOver={(e) => {
                          e.preventDefault();
                          if (!eventImageUploading) setIsEventImageDragOver(true);
                        }}
                        onDragLeave={() => setIsEventImageDragOver(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsEventImageDragOver(false);
                          if (eventImageUploading) return;
                          handleEventImageUpload(e.dataTransfer.files?.[0]);
                        }}
                      >
                        <input
                          id="event-image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleEventImageUpload(e.target.files?.[0])
                          }
                          disabled={eventImageUploading}
                        />
                        <p className="text-sm text-white font-semibold">
                          Drag and drop image here
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          or click to browse files
                        </p>
                      </label>
                      {eventImageUploading && (
                        <p className="text-xs text-gray-400 ml-2">
                          Uploading image...
                        </p>
                      )}
                      {eventImageUploadError && (
                        <p className="text-xs text-red-500 ml-2">
                          {eventImageUploadError}
                        </p>
                      )}
                      {eventForm.image && (
                        <div className="pt-2">
                          <p className="text-xs text-gray-400 ml-2 mb-2">
                            Current Thumbnail
                          </p>
                          <img
                            src={eventForm.image}
                            alt="Event thumbnail preview"
                            className="w-40 h-28 object-cover rounded-xl border border-white/10"
                          />
                        </div>
                      )}
                    </div>
                    <FormInput
                      label="Registration URL"
                      value={eventForm.registrationUrl}
                      onChange={(v: string) =>
                        setEventForm({ ...eventForm, registrationUrl: v })
                      }
                    />
                    <FormSelect
                      label="Icon"
                      value={eventForm.icon}
                      options={[
                        "Code",
                        "Music",
                        "Trophy",
                        "Cpu",
                        "Camera",
                        "Palette",
                        "Gamepad2",
                        "BrainCircuit",
                      ]}
                      onChange={(v: string) =>
                        setEventForm({ ...eventForm, icon: v })
                      }
                    />
                    <FormSelect
                      label="Home Grid Size"
                      value={normalizeHomeGridSize(eventForm.homeGridSize)}
                      options={["auto", "small", "wide", "tall", "large"]}
                      onChange={(v: string) =>
                        setEventForm({
                          ...eventForm,
                          homeGridSize: normalizeHomeGridSize(v as FestEvent["homeGridSize"]),
                        })
                      }
                    />
                    <FormSelect
                      label="Show On Homescreen"
                      value={eventForm.homeApproved ? "yes" : "no"}
                      options={["yes", "no"]}
                      onChange={(v: string) =>
                        setEventForm({ ...eventForm, homeApproved: v === "yes" })
                      }
                    />
                  </>
                )}

                {activeTab === "team" && (
                  <>
                    <FormInput
                      label="Name"
                      value={teamForm.name}
                      onChange={(v: string) =>
                        setTeamForm({ ...teamForm, name: v })
                      }
                      required={true}
                    />
                    <FormInput
                      label="Role"
                      value={teamForm.role}
                      onChange={(v: string) =>
                        setTeamForm({ ...teamForm, role: v })
                      }
                      required={false}
                    />
                    <FormSelect
                      label="Category"
                      value={teamForm.category}
                      options={[
                        "Core",
                        "Technical",
                        "Cultural",
                        "Creative",
                        "Publicity",
                        "Operations",
                      ]}
                      onChange={(v: string) =>
                        setTeamForm({ ...teamForm, category: v })
                      }
                    />
                    <FormInput
                      label="Image URL"
                      value={teamForm.image}
                      onChange={(v: string) =>
                        setTeamForm({ ...teamForm, image: v })
                      }
                      required={false}
                    />
                    <FormInput
                      label="LinkedIn"
                      value={teamForm.links?.linkedin}
                      onChange={(v: string) =>
                        setTeamForm({
                          ...teamForm,
                          links: { ...teamForm.links, linkedin: v },
                        })
                      }
                      required={false}
                    />
                    <FormInput
                      label="Twitter/X"
                      value={teamForm.links?.twitter}
                      onChange={(v: string) =>
                        setTeamForm({
                          ...teamForm,
                          links: { ...teamForm.links, twitter: v },
                        })
                      }
                      required={false}
                    />
                    <FormInput
                      label="GitHub"
                      value={teamForm.links?.github}
                      onChange={(v: string) =>
                        setTeamForm({
                          ...teamForm,
                          links: { ...teamForm.links, github: v },
                        })
                      }
                      required={false}
                    />
                    <FormInput
                      label="Instagram"
                      value={teamForm.links?.instagram}
                      onChange={(v: string) =>
                        setTeamForm({
                          ...teamForm,
                          links: { ...teamForm.links, instagram: v },
                        })
                      }
                      required={false}
                    />
                  </>
                )}

                {activeTab === "gallery" && (
                  <>
                    <FormInput
                      label="Title"
                      value={galleryForm.title}
                      onChange={(v: string) =>
                        setGalleryForm({ ...galleryForm, title: v })
                      }
                    />
                    <FormSelect
                      label="Type"
                      value={galleryForm.type}
                      options={["image", "video"]}
                      onChange={(v: string) =>
                        setGalleryForm({ ...galleryForm, type: v as any })
                      }
                    />
                    <FormInput
                      label="Category"
                      value={galleryForm.category}
                      onChange={(v: string) =>
                        setGalleryForm({ ...galleryForm, category: v })
                      }
                      placeholder="e.g. Cultural, Technical"
                    />
                    {galleryForm.type === "image" && (
                      <FormInput
                        label="Media URL"
                        value={galleryForm.url}
                        onChange={(v: string) =>
                          setGalleryForm({ ...galleryForm, url: v })
                        }
                      />
                    )}
                    {galleryForm.type === "video" && (
                      <>
                        <FormInput
                          label="YouTube Link"
                          value={galleryForm.link}
                          onChange={(v: string) =>
                            setGalleryForm({ ...galleryForm, link: v })
                          }
                        />
                        {galleryForm.link && (
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">
                              Video Preview
                            </label>
                            <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/40">
                              {getYouTubeEmbedUrl(galleryForm.link) ? (
                                <div className="aspect-video">
                                  <iframe
                                    src={
                                      getYouTubeEmbedUrl(galleryForm.link) || ""
                                    }
                                    title="YouTube preview"
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                                  />
                                </div>
                              ) : (
                                <p className="px-6 py-5 text-sm text-gray-400">
                                  Invalid YouTube link. Use a `youtube.com` or
                                  `youtu.be` URL.
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}

                {activeTab === "schedule" && (
                  <>
                    <FormSelect
                      label="Day"
                      value={scheduleForm.day}
                      options={["Day 1", "Day 2", "Day 3"]}
                      onChange={(v: string) =>
                        setScheduleForm({ ...scheduleForm, day: v })
                      }
                    />
                    <FormInput
                      label="Time"
                      value={scheduleForm.time}
                      onChange={(v: string) =>
                        setScheduleForm({ ...scheduleForm, time: v })
                      }
                      placeholder="e.g. 09:00 AM"
                    />
                    <FormInput
                      label="Title"
                      value={scheduleForm.title}
                      onChange={(v: string) =>
                        setScheduleForm({ ...scheduleForm, title: v })
                      }
                    />
                    <FormInput
                      label="Venue"
                      value={scheduleForm.venue}
                      onChange={(v: string) =>
                        setScheduleForm({ ...scheduleForm, venue: v })
                      }
                    />
                    <FormSelect
                      label="Type"
                      value={scheduleForm.type}
                      options={[
                        "Official",
                        "Technical",
                        "Social",
                        "Sports",
                        "Cultural",
                        "Workshops",
                      ]}
                      onChange={(v: string) =>
                        setScheduleForm({ ...scheduleForm, type: v })
                      }
                    />
                  </>
                )}

                <div className="md:col-span-2 flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-500 transition-all flex items-center justify-center gap-2"
                  >
                    <Save size={20} /> {editingId ? "Update" : "Create"}{" "}
                    {activeTab}
                  </button>
                  <button
                    type="button"
                    onClick={resetForms}
                    className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-gray-400 hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* List Display */}
          <div className="space-y-4">
            {filteredItems().map((item) => (
              <div
                key={item.id}
                className="p-4 md:p-6 bg-white/5 border border-white/10 rounded-[24px] flex flex-col md:flex-row items-center justify-between gap-6 hover:border-white/20 transition-all"
              >
                <div className="flex items-center gap-6 w-full md:w-auto">
                  {(item.image || item.url) && activeTab !== "schedule" ? (
                    <img
                      src={item.image || item.url}
                      alt=""
                      className="w-16 h-16 rounded-xl object-cover border border-white/10"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-red-600/10 flex items-center justify-center text-red-500 font-bold">
                      {activeTab === "schedule"
                        ? item.time.split(":")[0]
                        : activeTab[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold font-space uppercase leading-tight">
                      {item.name || item.title || item.day}
                    </h3>
                    <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">
                      {item.category || item.role || item.type}{" "}
                      {item.day && `• ${item.time}`}
                    </p>
                    {activeTab === "events" && (
                      <p className="text-[10px] text-gray-400 mt-1 font-bold uppercase tracking-widest">
                        Home: {item.homeApproved ? "Approved" : "Not Approved"} • Grid: {normalizeHomeGridSize(item.homeGridSize)}
                      </p>
                    )}
                    <p className="text-gray-500 text-xs mt-1 truncate max-w-xs">
                      {item.venue || item.description || item.url}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  {activeTab === "events" && (
                    <button
                      onClick={() =>
                        handleToggleHomeApproval(item.id, Boolean(item.homeApproved))
                      }
                      className={`flex-1 md:flex-none px-4 py-3 rounded-xl transition-all text-xs font-black uppercase tracking-widest ${
                        item.homeApproved
                          ? "bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white"
                          : "bg-white/5 text-gray-300 hover:bg-white hover:text-black"
                      }`}
                    >
                      {item.homeApproved ? "Remove Home" : "Add Home"}
                    </button>
                  )}
                  <button
                    onClick={() => startEdit(item)}
                    className="flex-1 md:flex-none p-3 bg-white/5 text-gray-400 hover:text-white rounded-xl transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 md:flex-none p-3 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            {filteredItems().length === 0 && (
              <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[48px]">
                <p className="text-gray-500 font-space uppercase tracking-widest">
                  No items found
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const FormInput = ({
  label,
  value,
  onChange,
  className = "",
  placeholder = "",
  required = true,
}: {
  label: string;
  value: string | undefined;
  onChange: (v: string) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
}) => (
  <div className={`space-y-2 ${className}`}>
    <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">
      {label}
    </label>
    <input
      required={required}
      placeholder={placeholder}
      className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const FormTextarea = ({
  label,
  value,
  onChange,
  className = "",
  rows = 4,
}: {
  label: string;
  value: string | undefined;
  onChange: (v: string) => void;
  className?: string;
  rows?: number;
}) => (
  <div className={`space-y-2 ${className}`}>
    <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">
      {label}
    </label>
    <textarea
      rows={rows}
      className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white resize-none"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const FormSelect = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string | undefined;
  options: string[];
  onChange: (v: string) => void;
}) => (
  <div className="space-y-2">
    <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">
      {label}
    </label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full px-6 py-4 h-auto bg-black/40 border border-white/10 rounded-2xl focus:ring-0 focus:border-red-500 transition-colors text-white">
        <SelectValue placeholder={`Select ${label}`} />
      </SelectTrigger>
      <SelectContent className="bg-black/90 border border-white/10 text-white backdrop-blur-xl">
        {options.map((opt: string) => (
          <SelectItem
            key={opt}
            value={opt}
            className="focus:bg-red-600 focus:text-white cursor-pointer uppercase text-xs font-bold"
          >
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default AdminPage;
