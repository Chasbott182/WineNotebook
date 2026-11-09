import React, { useState, useEffect } from 'react';
import { Wine, WineFormData } from './types';
import {
  DEFAULT_CELLAR_LOCATIONS,
  filterWines,
  getUniqueVarietals,
  getUniqueCellarLocations,
  addCellarLocationToList,
  calculateCellarStats,
} from './utils/wineUtils';
import { 
  Wine as WineIcon, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  DollarSign, 
  Percent, 
  Sparkles, 
  MapPin, 
  Filter, 
  X, 
  Code2, 
  Layers, 
  Eye, 
  AlertCircle,
  RefreshCw,
  Server,
  BookOpen,
  Cpu,
  Warehouse,
  Check
} from 'lucide-react';

const INITIAL_FORM: WineFormData = {
  name: '',
  varietal: '',
  brand: '',
  place: '',
  alcohol: 13.5,
  vintage: new Date().getFullYear().toString(),
  drysweet: 'Dry',
  imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80',
  palate: '',
  nose: '',
  body: 'Medium',
  tannin: 'Medium',
  acidity: 'Balanced',
  price: 25.0,
  priceRange: '$$',
  cellarLocation: 'Main Cellar - Rack A1',
};

export default function App() {
  const [wines, setWines] = useState<Wine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVarietal, setSelectedVarietal] = useState<string>('All');
  const [selectedCellar, setSelectedCellar] = useState<string>('All');

  // Custom cellar locations state
  const [cellarLocations, setCellarLocations] = useState<string[]>(DEFAULT_CELLAR_LOCATIONS);
  const [isAddCellarOpen, setIsAddCellarOpen] = useState(false);
  const [newCellarName, setNewCellarName] = useState('');
  const [inlineNewCellar, setInlineNewCellar] = useState('');
  const [showInlineNewCellar, setShowInlineNewCellar] = useState(false);
  
  // Backend connection URL (defaults to /wine, can switch to local Spring Boot 8080)
  const [apiBaseUrl, setApiBaseUrl] = useState<string>('/wine');
  
  // Modals & Panels
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWine, setEditingWine] = useState<Wine | null>(null);
  const [formData, setFormData] = useState<WineFormData>(INITIAL_FORM);
  const [activeWineDetails, setActiveWineDetails] = useState<Wine | null>(null);
  const [activeTab, setActiveTab] = useState<'cellar' | 'architecture' | 'api'>('cellar');

  // Fetch wines and saved cellar locations
  const fetchWines = async () => {
    setLoading(true);
    setError(null);
    try {
      const [winesRes, locRes] = await Promise.all([
        fetch(`${apiBaseUrl}/all`),
        fetch(`${apiBaseUrl}/cellar-locations`).catch(() => null),
      ]);
      if (!winesRes.ok) throw new Error(`HTTP error! status: ${winesRes.status}`);
      const data = await winesRes.json();
      setWines(data);

      if (locRes && locRes.ok) {
        const locs = await locRes.json();
        if (Array.isArray(locs) && locs.length > 0) {
          setCellarLocations(locs);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load wines');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWines();
  }, [apiBaseUrl]);

  const handleCreateCellarLocation = async (locationName: string) => {
    const trimmed = locationName.trim();
    if (!trimmed) return null;
    const updatedList = addCellarLocationToList(cellarLocations, trimmed);
    setCellarLocations(updatedList);
    try {
      const res = await fetch(`${apiBaseUrl}/cellar-locations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: trimmed }),
      });
      if (res.ok) {
        const serverList = await res.json();
        if (Array.isArray(serverList)) {
          setCellarLocations(serverList);
        }
      }
    } catch {
      // Fallback to local state if external backend doesn't expose /cellar-locations
    }
    return trimmed;
  };

  const handleAddCellarBarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await handleCreateCellarLocation(newCellarName);
    if (created) {
      setSelectedCellar(created);
      setNewCellarName('');
      setIsAddCellarOpen(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingWine(null);
    const defaultLoc =
      selectedCellar !== 'All'
        ? selectedCellar
        : cellarLocations[0] || 'Main Cellar - Rack A1';
    setFormData({
      ...INITIAL_FORM,
      cellarLocation: defaultLoc,
    });
    setShowInlineNewCellar(false);
    setInlineNewCellar('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (wine: Wine) => {
    setEditingWine(wine);
    setFormData({
      ...wine,
      cellarLocation: wine.cellarLocation || cellarLocations[0] || 'Main Cellar - Rack A1',
    });
    setShowInlineNewCellar(false);
    setInlineNewCellar('');
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${apiBaseUrl}/delete/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete wine');
      setWines(prev => prev.filter(w => w.id !== id));
      if (activeWineDetails?.id === id) setActiveWineDetails(null);
    } catch (err: any) {
      setError(`Error deleting wine: ${err.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let finalLocation = formData.cellarLocation;
      if (showInlineNewCellar && inlineNewCellar.trim()) {
        const created = await handleCreateCellarLocation(inlineNewCellar);
        if (created) finalLocation = created;
      }

      const payload = {
        ...formData,
        cellarLocation: finalLocation || 'Main Cellar - Rack A1',
      };

      if (editingWine) {
        // PUT /wine/update
        const res = await fetch(`${apiBaseUrl}/update`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, id: editingWine.id }),
        });
        if (!res.ok) throw new Error('Failed to update wine');
        const updated = await res.json();
        setWines(prev => prev.map(w => w.id === updated.id ? updated : w));
        if (activeWineDetails?.id === updated.id) setActiveWineDetails(updated);
      } else {
        // POST /wine/add
        const res = await fetch(`${apiBaseUrl}/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to add wine');
        const created = await res.json();
        setWines(prev => [created, ...prev]);
      }
      setIsFormOpen(false);
      setShowInlineNewCellar(false);
      setInlineNewCellar('');
    } catch (err: any) {
      setError(`Error saving wine: ${err.message}`);
    }
  };

  const varietals = getUniqueVarietals(wines);
  const allCellarFilterOptions = getUniqueCellarLocations(wines, cellarLocations);
  const selectableCellarOptions = allCellarFilterOptions.filter(loc => loc !== 'All');
  const filteredWines = filterWines(wines, searchTerm, selectedVarietal, selectedCellar);
  const { totalValue, avgAbv, varietalCount } = calculateCellarStats(filteredWines);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-rose-900 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-stone-900/90 backdrop-blur-md border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-700 to-rose-950 flex items-center justify-center shadow-lg shadow-rose-950/50 border border-rose-600/30">
              <WineIcon className="w-5 h-5 text-rose-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-stone-100 via-rose-100 to-rose-300 bg-clip-text text-transparent">
                  WineNotebook
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-800/60 flex items-center gap-1">
                  <Cpu className="w-3 h-3" />
                  Java 21 • Spring Boot 3
                </span>
              </div>
              <p className="text-xs text-stone-400">Clean Architecture • SOLID Principles • Sommelier Tasting Notes</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <nav className="flex bg-stone-950 p-1 rounded-xl border border-stone-800">
              <button
                onClick={() => setActiveTab('cellar')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === 'cellar' ? 'bg-rose-900/60 text-white shadow' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <WineIcon className="w-3.5 h-3.5" />
                Cellar
              </button>
              <button
                onClick={() => setActiveTab('architecture')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === 'architecture' ? 'bg-rose-900/60 text-white shadow' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Java 21 Architecture
              </button>
              <button
                onClick={() => setActiveTab('api')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === 'api' ? 'bg-rose-900/60 text-white shadow' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                Endpoints
              </button>
            </nav>

            <button
              onClick={fetchWines}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 border border-stone-800 transition-colors"
              title="Refresh Wines"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-rose-400' : ''}`} />
            </button>
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-rose-700 hover:bg-rose-600 text-white shadow-lg shadow-rose-900/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              Add Wine
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Tab 1: Cellar Management */}
        {activeTab === 'cellar' && (
          <>
            {/* Cellar Location Selector & Manager Bar */}
            <section className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 pr-2 border-r border-stone-800">
                  <Warehouse className="w-4 h-4" />
                  <span>Cellar Location</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {allCellarFilterOptions.map(loc => {
                    const countInLoc =
                      loc === 'All'
                        ? wines.length
                        : wines.filter(
                            w => (w.cellarLocation || 'Main Cellar - Rack A1') === loc
                          ).length;
                    return (
                      <button
                        key={loc}
                        onClick={() => setSelectedCellar(loc)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                          selectedCellar === loc
                            ? 'bg-amber-700 text-white shadow-md shadow-amber-950/50 border border-amber-500/40'
                            : 'bg-stone-950 text-stone-300 hover:text-white hover:bg-stone-800 border border-stone-800'
                        }`}
                      >
                        <span>{loc === 'All' ? 'All Cellars' : loc}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                            selectedCellar === loc
                              ? 'bg-amber-900/80 text-amber-100'
                              : 'bg-stone-800 text-stone-400'
                          }`}
                        >
                          {countInLoc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isAddCellarOpen ? (
                  <form onSubmit={handleAddCellarBarSubmit} className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      value={newCellarName}
                      onChange={e => setNewCellarName(e.target.value)}
                      placeholder="e.g. Basement Rack B2..."
                      aria-label="New Cellar Location Name"
                      autoFocus
                      className="bg-stone-950 border border-amber-700/60 rounded-xl px-3 py-1.5 text-xs text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Save Location
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddCellarOpen(false);
                        setNewCellarName('');
                      }}
                      aria-label="Cancel adding cellar location"
                      className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsAddCellarOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Cellar Location
                  </button>
                )}
              </div>
            </section>

            {/* Quick Cellar Stats */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-stone-900/60 border border-stone-800/80 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-stone-400 font-medium">
                    {selectedCellar === 'All' ? 'Total Bottles' : 'Bottles in Location'}
                  </p>
                  <p className="text-2xl font-bold text-stone-100 mt-1">{filteredWines.length}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-stone-800/60 flex items-center justify-center text-rose-400">
                  <WineIcon className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-stone-900/60 border border-stone-800/80 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-stone-400 font-medium">Cellar Value</p>
                  <p className="text-2xl font-bold text-stone-100 mt-1">${totalValue.toFixed(0)}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-stone-800/60 flex items-center justify-center text-emerald-400">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-stone-900/60 border border-stone-800/80 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-stone-400 font-medium">Avg ABV</p>
                  <p className="text-2xl font-bold text-stone-100 mt-1">{avgAbv}%</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-stone-800/60 flex items-center justify-center text-amber-400">
                  <Percent className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-stone-900/60 border border-stone-800/80 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-stone-400 font-medium">Varietals</p>
                  <p className="text-2xl font-bold text-stone-100 mt-1">{varietalCount}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-stone-800/60 flex items-center justify-center text-purple-400">
                  <Layers className="w-5 h-5" />
                </div>
              </div>
            </section>

            {/* Filter and Search Bar */}
            <section className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search wine, brand, place, cellar, or varietal..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-10 pr-4 py-2 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                <Filter className="w-4 h-4 text-stone-400 shrink-0 ml-1" />
                {varietals.map(varName => (
                  <button
                    key={varName}
                    onClick={() => setSelectedVarietal(varName)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      selectedVarietal === varName
                        ? 'bg-rose-800 text-white shadow-sm'
                        : 'bg-stone-900 text-stone-400 hover:text-stone-200 hover:bg-stone-800 border border-stone-800'
                    }`}
                  >
                    {varName}
                  </button>
                ))}
              </div>
            </section>

            {/* Wines Grid */}
            {loading ? (
              <div className="py-24 text-center">
                <RefreshCw className="w-8 h-8 mx-auto text-rose-500 animate-spin" />
                <p className="mt-3 text-stone-400 text-sm">Connecting to Spring Boot REST API...</p>
              </div>
            ) : error ? (
              <div className="p-6 bg-red-950/40 border border-red-900 rounded-2xl text-center">
                <AlertCircle className="w-8 h-8 mx-auto text-red-400" />
                <p className="text-red-200 font-semibold mt-2">Error connecting to wine service</p>
                <p className="text-stone-400 text-xs mt-1">{error}</p>
                <button
                  onClick={fetchWines}
                  className="mt-4 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-xs font-semibold rounded-lg text-white"
                >
                  Retry Connection
                </button>
              </div>
            ) : filteredWines.length === 0 ? (
              <div className="py-20 text-center bg-stone-900/30 rounded-2xl border border-stone-800/60 p-8">
                <WineIcon className="w-12 h-12 mx-auto text-stone-600" />
                <h3 className="text-lg font-semibold text-stone-200 mt-3">No wines found</h3>
                <p className="text-stone-400 text-sm mt-1 max-w-sm mx-auto">
                  {selectedCellar !== 'All'
                    ? `No bottles stored in "${selectedCellar}" matching your criteria.`
                    : 'No bottle matches your search criteria. Try a different search term or add a new wine to your cellar.'}
                </p>
                <div className="mt-5 flex items-center justify-center gap-3">
                  {selectedCellar !== 'All' && (
                    <button
                      onClick={() => setSelectedCellar('All')}
                      className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium text-sm transition-all"
                    >
                      Show All Cellars
                    </button>
                  )}
                  <button
                    onClick={handleOpenAdd}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-medium text-sm transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Add Wine to {selectedCellar !== 'All' ? selectedCellar : 'Cellar'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWines.map(wine => (
                  <div
                    key={wine.id}
                    className="group bg-stone-900/80 border border-stone-800 rounded-2xl overflow-hidden hover:border-stone-700 hover:shadow-2xl hover:shadow-rose-950/20 transition-all flex flex-col"
                  >
                    {/* Wine Image & Quick Badge */}
                    <div className="relative h-48 w-full bg-stone-950 overflow-hidden">
                      <img
                        src={wine.imageUrl || 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80'}
                        alt={wine.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/30 to-transparent"></div>
                      
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[75%]">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-900/80 text-rose-200 backdrop-blur-md border border-rose-700/40">
                          {wine.varietal}
                        </span>
                        {wine.vintage && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-stone-900/80 text-stone-200 backdrop-blur-md border border-stone-700">
                            {wine.vintage}
                          </span>
                        )}
                      </div>

                      <div className="absolute top-3 right-3 flex gap-1">
                        <button
                          onClick={() => handleOpenEdit(wine)}
                          className="p-1.5 rounded-lg bg-stone-900/80 hover:bg-rose-700 text-stone-300 hover:text-white backdrop-blur-md transition-colors"
                          title={`Edit ${wine.name}`}
                          aria-label={`Edit ${wine.name}`}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(wine.id)}
                          className="p-1.5 rounded-lg bg-stone-900/80 hover:bg-red-700 text-stone-300 hover:text-white backdrop-blur-md transition-colors"
                          title={`Delete ${wine.name}`}
                          aria-label={`Delete ${wine.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                        <div>
                          <p className="text-xs text-rose-300 font-medium tracking-wide uppercase">{wine.brand}</p>
                          <h3 className="text-lg font-bold text-white leading-tight truncate">{wine.name}</h3>
                        </div>
                        {wine.price > 0 && (
                          <span className="text-base font-bold text-emerald-400 bg-stone-950/80 px-2 py-0.5 rounded-md border border-stone-800">
                            ${wine.price}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          {wine.place && (
                            <div className="flex items-center gap-1.5 text-stone-400 truncate">
                              <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                              <span className="truncate">{wine.place}</span>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedCellar(wine.cellarLocation || 'Main Cellar - Rack A1')
                            }
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-950/70 hover:bg-amber-900/80 text-amber-300 border border-amber-800/50 text-[11px] font-medium shrink-0 transition-colors"
                            title="Filter by this cellar location"
                          >
                            <Warehouse className="w-3 h-3" />
                            <span>{wine.cellarLocation || 'Main Cellar - Rack A1'}</span>
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-stone-800/60 text-[11px]">
                          <div>
                            <span className="text-stone-500 block">ABV</span>
                            <span className="font-semibold text-stone-300">{wine.alcohol}%</span>
                          </div>
                          <div>
                            <span className="text-stone-500 block">Body</span>
                            <span className="font-semibold text-stone-300">{wine.body || 'Medium'}</span>
                          </div>
                          <div>
                            <span className="text-stone-500 block">Profile</span>
                            <span className="font-semibold text-stone-300">{wine.drysweet || 'Dry'}</span>
                          </div>
                        </div>

                        {/* Tasting preview notes */}
                        {(wine.nose || wine.palate) && (
                          <div className="pt-2 border-t border-stone-800/60 space-y-1">
                            {wine.nose && (
                              <p className="text-stone-300 line-clamp-1">
                                <span className="text-rose-400 font-medium">Aromas:</span> {wine.nose}
                              </p>
                            )}
                            {wine.palate && (
                              <p className="text-stone-300 line-clamp-1">
                                <span className="text-amber-400 font-medium">Palate:</span> {wine.palate}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => setActiveWineDetails(wine)}
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-stone-800/80 hover:bg-stone-800 text-stone-200 text-xs font-semibold border border-stone-700/60 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-rose-400" />
                        View Sommelier Notes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Tab 2: Java 21 Architecture & SOLID Principles */}
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-stone-900 to-stone-950 border border-stone-800 rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-amber-950/60 border border-amber-800/50 rounded-2xl text-amber-300">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Java 21 & Spring Boot 3.3.5 Backend Architecture</h2>
                  <p className="text-xs text-stone-400">Clean code, zero boilerplate with Java Records, and strict SOLID compliance</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-stone-900/70 border border-stone-800 p-4 rounded-2xl">
                  <span className="text-amber-400 text-xs font-bold uppercase tracking-wider block">1. Boilerplate Elimination</span>
                  <p className="text-sm text-stone-200 font-semibold mt-1">Java 21 Records for DTOs</p>
                  <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                    Instead of 200+ lines of handwritten getters, setters, constructors, <code className="text-rose-300">equals()</code>, and <code className="text-rose-300">hashCode()</code>, <code className="text-rose-300">WineRequest</code> and <code className="text-rose-300">WineResponse</code> are concise immutable records with Jakarta bean validation.
                  </p>
                </div>

                <div className="bg-stone-900/70 border border-stone-800 p-4 rounded-2xl">
                  <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider block">2. Dual Database Profiles</span>
                  <p className="text-sm text-stone-200 font-semibold mt-1">H2 In-Memory & Production MySQL</p>
                  <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                    Zero-configuration <code className="text-emerald-300">dev</code> profile boots immediately with embedded H2 + auto-seeded tasting notes. Switch to <code className="text-emerald-300">prod</code> profile with environment variables for MySQL.
                  </p>
                </div>
              </div>
            </div>

            {/* SOLID Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-stone-900/50 border border-stone-800/80 p-5 rounded-2xl">
                <div className="w-8 h-8 rounded-lg bg-rose-950 border border-rose-800/60 flex items-center justify-center font-bold text-rose-300 mb-3">
                  S
                </div>
                <h4 className="font-bold text-stone-200 text-sm">Single Responsibility</h4>
                <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
                  Each class has one sole reason to change: <code className="text-rose-300">WineController</code> (HTTP), <code className="text-rose-300">WineServiceImpl</code> (business logic), <code className="text-rose-300">WineMapper</code> (transformations), and <code className="text-rose-300">WineRepository</code> (persistence).
                </p>
              </div>

              <div className="bg-stone-900/50 border border-stone-800/80 p-5 rounded-2xl">
                <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800/60 flex items-center justify-center font-bold text-blue-300 mb-3">
                  O
                </div>
                <h4 className="font-bold text-stone-200 text-sm">Open / Closed</h4>
                <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
                  The <code className="text-blue-300">WineService</code> interface allows adding new behaviors (caching, external cellar sync, exports) by extending or implementing new services without modifying existing controllers.
                </p>
              </div>

              <div className="bg-stone-900/50 border border-stone-800/80 p-5 rounded-2xl">
                <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-800/60 flex items-center justify-center font-bold text-purple-300 mb-3">
                  L
                </div>
                <h4 className="font-bold text-stone-200 text-sm">Liskov Substitution</h4>
                <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
                  <code className="text-purple-300">WineServiceImpl</code> fully adheres to the behavioral contract specified by <code className="text-purple-300">WineService</code>. Alternative mock implementations can substitute seamlessly in tests.
                </p>
              </div>

              <div className="bg-stone-900/50 border border-stone-800/80 p-5 rounded-2xl">
                <div className="w-8 h-8 rounded-lg bg-amber-950 border border-amber-800/60 flex items-center justify-center font-bold text-amber-300 mb-3">
                  I
                </div>
                <h4 className="font-bold text-stone-200 text-sm">Interface Segregation</h4>
                <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
                  Interfaces are focused and tailored strictly to the domain operations of the Wine Notebook, avoiding bloated multi-purpose interfaces.
                </p>
              </div>

              <div className="bg-stone-900/50 border border-stone-800/80 p-5 rounded-2xl">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800/60 flex items-center justify-center font-bold text-emerald-300 mb-3">
                  D
                </div>
                <h4 className="font-bold text-stone-200 text-sm">Dependency Inversion</h4>
                <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
                  Controllers depend on the <code className="text-emerald-300">WineService</code> abstraction, not the concrete implementation, injected cleanly via constructor injection without reflection hacks.
                </p>
              </div>
            </div>

            {/* Code Directory Map */}
            <div className="bg-stone-900/70 border border-stone-800 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-stone-200 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-rose-400" />
                Backend Codebase Directory Structure (`backend/`)
              </h3>
              <pre className="bg-stone-950 p-4 rounded-xl text-xs font-mono text-stone-300 overflow-x-auto leading-relaxed border border-stone-800">
{`backend/
├── pom.xml                                      # Java 21, Spring Boot 3.3.5, Spring Data JPA, H2, MySQL
├── Dockerfile                                   # Multi-stage container build (Temurin 21)
├── README.md                                    # Documentation, SOLID specs & run guides
└── src/
    ├── main/
    │   ├── java/com/chasbott/winenotebook/
    │   │   ├── WineNotebookApplication.java     # Spring Boot main entry point
    │   │   ├── model/
    │   │   │   └── Wine.java                    # Clean JPA Entity (Jakarta EE) with cellarLocation
    │   │   ├── dto/
    │   │   │   ├── WineRequest.java             # Java 21 Record (Zero-boilerplate input DTO)
    │   │   │   └── WineResponse.java            # Java 21 Record (Zero-boilerplate output DTO)
    │   │   ├── mapper/
    │   │   │   └── WineMapper.java              # Entity <-> Record transformation (SRP)
    │   │   ├── repository/
    │   │   │   └── WineRepository.java          # Spring Data JPA Repository
    │   │   ├── service/
    │   │   │   ├── WineService.java             # Interface (DIP / ISP)
    │   │   │   └── impl/WineServiceImpl.java    # Implementation with Transactions & Validations
    │   │   ├── controller/
    │   │   │   └── WineController.java          # REST Controller (/wine/all, /add, /cellar/{loc})
    │   │   ├── exception/
    │   │   │   ├── WineNotFoundException.java   # Domain Exception
    │   │   │   └── GlobalExceptionHandler.java  # Centralized REST Error Handler
    │   │   └── config/
    │   │       └── DataInitializer.java         # Seed tasting notes & cellar locations for dev
    │   └── resources/
    │       └── application.yml                  # Configured with 'dev' (H2) and 'prod' (MySQL)
    └── test/java/com/chasbott/winenotebook/
        └── service/WineServiceTest.java         # Mockito unit tests validating business logic`}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 3: Endpoints & Connection Settings */}
        {activeTab === 'api' && (
          <div className="space-y-6">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
                <div>
                  <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
                    <Server className="w-4 h-4 text-rose-400" />
                    Target Backend URL
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Select where the frontend sends its HTTP REST requests:
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setApiBaseUrl('/wine')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                      apiBaseUrl === '/wine'
                        ? 'bg-rose-900 text-white border-rose-700'
                        : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                    }`}
                  >
                    Integrated Dev API (/wine)
                  </button>
                  <button
                    onClick={() => setApiBaseUrl('http://localhost:8080/wine')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                      apiBaseUrl === 'http://localhost:8080/wine'
                        ? 'bg-rose-900 text-white border-rose-700'
                        : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                    }`}
                  >
                    Local Spring Boot (8080)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono">
                <div className="bg-stone-950 p-3 rounded-lg border border-stone-800">
                  <span className="px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 font-bold mr-2">GET</span>
                  <code>/wine/all</code>
                  <p className="text-stone-400 mt-1 font-sans">Returns all wines in the notebook repository</p>
                </div>
                <div className="bg-stone-950 p-3 rounded-lg border border-stone-800">
                  <span className="px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 font-bold mr-2">GET</span>
                  <code>/wine/cellar/{`{location}`}</code>
                  <p className="text-stone-400 mt-1 font-sans">Returns wines stored in a specific cellar location</p>
                </div>
                <div className="bg-stone-950 p-3 rounded-lg border border-stone-800">
                  <span className="px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-bold mr-2">POST</span>
                  <code>/wine/add</code>
                  <p className="text-stone-400 mt-1 font-sans">Saves a new Wine record with cellar location</p>
                </div>
                <div className="bg-stone-950 p-3 rounded-lg border border-stone-800">
                  <span className="px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 font-bold mr-2">PUT</span>
                  <code>/wine/update</code>
                  <p className="text-stone-400 mt-1 font-sans">Updates existing wine metadata, location & notes</p>
                </div>
                <div className="bg-stone-950 p-3 rounded-lg border border-stone-800">
                  <span className="px-2 py-0.5 rounded bg-rose-900/60 text-rose-300 font-bold mr-2">DELETE</span>
                  <code>/wine/delete/{`{id}`}</code>
                  <p className="text-stone-400 mt-1 font-sans">Deletes the wine by id (HTTP 200 OK)</p>
                </div>
                <div className="bg-stone-950 p-3 rounded-lg border border-stone-800">
                  <span className="px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 font-bold mr-2">GET</span>
                  <code>/wine/brand/{`{brand}`}</code>
                  <p className="text-stone-400 mt-1 font-sans">Filters cellar entries by winery brand</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Sommelier Tasting Notes Details Modal */}
      {activeWineDetails && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div className="relative h-56 bg-stone-950">
              <img
                src={activeWineDetails.imageUrl || 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80'}
                alt={activeWineDetails.name}
                className="w-full h-full object-cover opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent"></div>
              
              <button
                onClick={() => setActiveWineDetails(null)}
                aria-label="Close tasting notes"
                className="absolute top-4 right-4 p-2 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-900 text-rose-200 border border-rose-700">
                    {activeWineDetails.varietal}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-950/90 text-amber-300 border border-amber-700/60 flex items-center gap-1">
                    <Warehouse className="w-3 h-3" />
                    {activeWineDetails.cellarLocation || 'Main Cellar - Rack A1'}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white mt-1.5">{activeWineDetails.name}</h2>
                <p className="text-sm text-rose-300">{activeWineDetails.brand} • {activeWineDetails.place || 'Unknown Origin'}</p>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Key Specs */}
              <div className="grid grid-cols-4 gap-2 text-center bg-stone-950 p-3 rounded-2xl border border-stone-800/80">
                <div>
                  <p className="text-[11px] text-stone-500 uppercase">Vintage</p>
                  <p className="text-sm font-bold text-stone-200">{activeWineDetails.vintage || 'NV'}</p>
                </div>
                <div>
                  <p className="text-[11px] text-stone-500 uppercase">ABV</p>
                  <p className="text-sm font-bold text-stone-200">{activeWineDetails.alcohol}%</p>
                </div>
                <div>
                  <p className="text-[11px] text-stone-500 uppercase">Price</p>
                  <p className="text-sm font-bold text-emerald-400">${activeWineDetails.price}</p>
                </div>
                <div>
                  <p className="text-[11px] text-stone-500 uppercase">Tier</p>
                  <p className="text-sm font-bold text-amber-300">{activeWineDetails.priceRange || '$$'}</p>
                </div>
              </div>

              {/* Sensory Tasting Profile */}
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-wider text-rose-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Sensory & Tasting Profile
                </h4>

                <div className="bg-stone-950/60 border border-stone-800 rounded-2xl p-4 space-y-3">
                  <div>
                    <span className="text-xs font-semibold text-rose-300 block">Nose & Aromas:</span>
                    <p className="text-sm text-stone-300 mt-0.5">
                      {activeWineDetails.nose || 'No aroma notes recorded yet.'}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-amber-300 block">Palate & Flavor Structure:</span>
                    <p className="text-sm text-stone-300 mt-0.5">
                      {activeWineDetails.palate || 'No palate notes recorded yet.'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-stone-950/60 border border-stone-800 rounded-xl p-3 text-center">
                    <span className="text-[11px] text-stone-500 block">Body</span>
                    <span className="text-sm font-semibold text-stone-200">{activeWineDetails.body || 'Medium'}</span>
                  </div>
                  <div className="bg-stone-950/60 border border-stone-800 rounded-xl p-3 text-center">
                    <span className="text-[11px] text-stone-500 block">Tannin</span>
                    <span className="text-sm font-semibold text-stone-200">{activeWineDetails.tannin || 'Moderate'}</span>
                  </div>
                  <div className="bg-stone-950/60 border border-stone-800 rounded-xl p-3 text-center">
                    <span className="text-[11px] text-stone-500 block">Acidity</span>
                    <span className="text-sm font-semibold text-stone-200">{activeWineDetails.acidity || 'Crisp'}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    handleOpenEdit(activeWineDetails);
                    setActiveWineDetails(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Details
                </button>
                <button
                  onClick={() => setActiveWineDetails(null)}
                  className="px-6 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-semibold text-sm transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Wine Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <WineIcon className="w-5 h-5 text-rose-500" />
                <h3 className="text-lg font-bold text-white">
                  {editingWine ? 'Edit Wine Entry' : 'Add New Wine to Cellar'}
                </h3>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                aria-label="Close wine form"
                className="text-stone-400 hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-stone-400">Wine Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Caymus Special Selection"
                    className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-rose-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-400">Brand / Winery *</label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Caymus Vineyards"
                    className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-rose-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-400">Varietal *</label>
                  <input
                    type="text"
                    required
                    value={formData.varietal}
                    onChange={e => setFormData({ ...formData, varietal: e.target.value })}
                    placeholder="e.g. Cabernet Sauvignon"
                    className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-rose-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-400">Origin / Region</label>
                  <input
                    type="text"
                    value={formData.place}
                    onChange={e => setFormData({ ...formData, place: e.target.value })}
                    placeholder="e.g. Napa Valley, California"
                    className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-rose-600"
                  />
                </div>

                {/* Cellar Location Selection & Inline Creation */}
                <div className="sm:col-span-2 bg-stone-950/70 border border-stone-800 rounded-2xl p-3.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="cellarLocationSelect"
                      className="text-xs font-semibold text-amber-300 flex items-center gap-1.5"
                    >
                      <Warehouse className="w-3.5 h-3.5" />
                      Cellar Storage Location *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowInlineNewCellar(!showInlineNewCellar)}
                      className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      {showInlineNewCellar ? 'Select Existing Location' : 'New Cellar Location'}
                    </button>
                  </div>

                  {showInlineNewCellar ? (
                    <input
                      type="text"
                      required
                      value={inlineNewCellar}
                      onChange={e => setInlineNewCellar(e.target.value)}
                      placeholder="Enter new cellar location (e.g. Underground Vault - Bin 4)..."
                      aria-label="Custom Cellar Location"
                      className="w-full bg-stone-900 border border-amber-700/60 rounded-xl px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  ) : (
                    <select
                      id="cellarLocationSelect"
                      aria-label="Cellar Storage Location"
                      value={formData.cellarLocation}
                      onChange={e => setFormData({ ...formData, cellarLocation: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-rose-600"
                    >
                      {selectableCellarOptions.map(loc => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-400">Vintage</label>
                  <input
                    type="text"
                    value={formData.vintage}
                    onChange={e => setFormData({ ...formData, vintage: e.target.value })}
                    placeholder="e.g. 2019"
                    className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-rose-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-400">Alcohol % (ABV)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.alcohol}
                    onChange={e => setFormData({ ...formData, alcohol: parseFloat(e.target.value) || 0 })}
                    placeholder="14.5"
                    className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-rose-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-400">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    placeholder="45.00"
                    className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-rose-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-400">Price Tier</label>
                  <select
                    value={formData.priceRange}
                    onChange={e => setFormData({ ...formData, priceRange: e.target.value })}
                    className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-rose-600"
                  >
                    <option value="$">$ (Value / Under $20)</option>
                    <option value="$$">$$ (Moderate / $20-$50)</option>
                    <option value="$$$">$$$ (Premium / $50-$100)</option>
                    <option value="$$$$">$$$$ (Cellar / $100+)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-400">Bottle Photo URL</label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-rose-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-stone-400">Sweetness Profile</label>
                  <input
                    type="text"
                    value={formData.drysweet}
                    onChange={e => setFormData({ ...formData, drysweet: e.target.value })}
                    placeholder="e.g. Dry, Semi-Dry"
                    className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-rose-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-400">Body</label>
                  <input
                    type="text"
                    value={formData.body}
                    onChange={e => setFormData({ ...formData, body: e.target.value })}
                    placeholder="e.g. Full, Medium"
                    className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-rose-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-400">Tannin Level</label>
                  <input
                    type="text"
                    value={formData.tannin}
                    onChange={e => setFormData({ ...formData, tannin: e.target.value })}
                    placeholder="e.g. High, Silky"
                    className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-rose-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-400">Nose (Aromas & Bouquet)</label>
                <textarea
                  rows={2}
                  value={formData.nose}
                  onChange={e => setFormData({ ...formData, nose: e.target.value })}
                  placeholder="e.g. Dark cherries, cedar, pipe tobacco, vanilla..."
                  className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-rose-600"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-400">Palate (Tasting & Flavor Notes)</label>
                <textarea
                  rows={2}
                  value={formData.palate}
                  onChange={e => setFormData({ ...formData, palate: e.target.value })}
                  placeholder="e.g. Velvety blackberry, structured acidity, long espresso finish..."
                  className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-rose-600"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-semibold text-sm shadow-lg shadow-rose-950/50 transition-colors"
                >
                  {editingWine ? 'Save Changes' : 'Add to Notebook'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-stone-900 bg-stone-950/80 py-6 text-center text-xs text-stone-500">
        <p>WineNotebook • Java 21 & Spring Boot 3.3 Backend • SOLID Architecture</p>
      </footer>
    </div>
  );
}
