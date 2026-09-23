import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Radio, AlertTriangle, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react';
import { formatCoordinates } from '../../utils/formatters';

const AUDIENCE_OPTIONS = [
  'All Designated Authorities (NDRF + SDMA + BRO + Police)',
  'State Disaster Management Authority (SDMA)',
  'District Magistrate & DDMA Operations',
  'Border Roads Organisation (BRO) Task Force',
  'Field Emergency Teams & Quick Response Teams (QRT)',
  'Public Broadcast & Community Radio Channels',
];

const TEMPLATES: Record<string, string> = {
  evacuation:
    'IMMEDIATE RED ALERT & EVACUATION: Critical slope failure imminent due to extreme rainfall saturation. Communities situated below natural drainage paths and steep cuts must immediately relocate to designated higher relief camps.',
  highway_closure:
    'HIGHWAY CLOSURE ADVISORY: Significant rockfall and debris slides reported along active transport corridor. All civilian and heavy vehicular traffic suspended until slope stabilization teams inspect and clear the route.',
  field_standby:
    'ORANGE LEVEL FIELD STANDBY: InSAR telemetry indicates active slope displacement creep exceeding 25mm. Heavy earthmoving equipment and response squads must stage at forward points immediately.',
  monitoring_notice:
    'YELLOW WATCH BULLETIN: Continuous rainfall recorded over the past 48 hours. Soil moisture levels approaching saturation threshold. Field coordinators to inspect culverts and toe retaining walls.',
};

export const BroadcastModal: React.FC = () => {
  const { broadcastModal, closeBroadcastModal, triggerBroadcast } = useApp();

  const [state, setState] = useState('Meghalaya');
  const [district, setDistrict] = useState('');
  const [lat, setLat] = useState(25.289);
  const [lon, setLon] = useState(91.734);
  const [riskClass, setRiskClass] = useState('CRITICAL');
  const [riskScore, setRiskScore] = useState(91.5);
  const [audience, setAudience] = useState(AUDIENCE_OPTIONS[0]);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (broadcastModal.isOpen && broadcastModal.prefill) {
      const p = broadcastModal.prefill;
      if (p.state) setState(p.state);
      if (p.district) setDistrict(p.district);
      if (p.latitude !== undefined) setLat(p.latitude);
      if (p.longitude !== undefined) setLon(p.longitude);
      if (p.risk_class) setRiskClass(p.risk_class);
      if (p.risk_score !== undefined) setRiskScore(p.risk_score);
      if (p.message) setMessage(p.message);
      else setMessage(TEMPLATES.evacuation);
    } else if (broadcastModal.isOpen) {
      setMessage(TEMPLATES.highway_closure);
    }
  }, [broadcastModal.isOpen, broadcastModal.prefill]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    const success = await triggerBroadcast({
      state,
      district: district || `${state} Corridor`,
      latitude: lat,
      longitude: lon,
      risk_score: riskScore,
      risk_class: riskClass,
      audience,
      message,
      severity: riskClass === 'CRITICAL' ? 'Critical Hazard' : 'High Alert',
    });
    setSubmitting(false);

    if (success) {
      closeBroadcastModal();
    }
  };

  return (
    <Modal
      isOpen={broadcastModal.isOpen}
      onClose={closeBroadcastModal}
      title="Dispatch Emergency Early Warning Advisory"
      subtitle="Transmit authenticated hazard telemetry to disaster response authorities"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Target Region & Severity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
              Target State / Sector
            </label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 font-medium focus:ring-2 focus:ring-mountain-600 focus:outline-none"
            >
              <option value="Meghalaya">Meghalaya</option>
              <option value="Assam">Assam</option>
              <option value="Sikkim">Sikkim</option>
              <option value="Arunachal Pradesh">Arunachal Pradesh</option>
              <option value="Mizoram">Mizoram</option>
              <option value="Nagaland">Nagaland</option>
              <option value="Manipur">Manipur</option>
              <option value="Tripura">Tripura</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
              Advisory Severity Level
            </label>
            <select
              value={riskClass}
              onChange={(e) => {
                setRiskClass(e.target.value);
                if (e.target.value === 'CRITICAL') setRiskScore(92.0);
                else if (e.target.value === 'HIGH') setRiskScore(72.0);
                else setRiskScore(48.0);
              }}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 font-bold focus:ring-2 focus:ring-mountain-600 focus:outline-none text-rose-700"
            >
              <option value="CRITICAL">RED — CRITICAL HAZARD</option>
              <option value="HIGH">ORANGE — HIGH VIGILANCE</option>
              <option value="MODERATE">YELLOW — MODERATE WATCH</option>
            </select>
          </div>
        </div>

        {/* Location & Coordinates */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-1">
            <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
              Specific District / Route
            </label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="e.g. NH-27 Corridor"
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 font-medium focus:ring-2 focus:ring-mountain-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
              Latitude
            </label>
            <input
              type="number"
              step="0.001"
              value={lat}
              onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 font-mono text-stone-800 focus:ring-2 focus:ring-mountain-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
              Longitude
            </label>
            <input
              type="number"
              step="0.001"
              value={lon}
              onChange={(e) => setLon(parseFloat(e.target.value) || 0)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 font-mono text-stone-800 focus:ring-2 focus:ring-mountain-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Audience */}
        <div>
          <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
            Recipient Operational Network
          </label>
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 font-medium focus:ring-2 focus:ring-mountain-600 focus:outline-none"
          >
            {AUDIENCE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Advisory Template Shortcuts */}
        <div>
          <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
            Load Pre-Engineered Advisory Template
          </label>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setMessage(TEMPLATES.evacuation)}
              className="px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100 font-medium transition-colors text-[11px]"
            >
              Evacuation Alert
            </button>
            <button
              type="button"
              onClick={() => setMessage(TEMPLATES.highway_closure)}
              className="px-2.5 py-1 rounded-md bg-orange-50 border border-orange-200 text-orange-800 hover:bg-orange-100 font-medium transition-colors text-[11px]"
            >
              Highway Closure
            </button>
            <button
              type="button"
              onClick={() => setMessage(TEMPLATES.field_standby)}
              className="px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 font-medium transition-colors text-[11px]"
            >
              Field Squad Standby
            </button>
            <button
              type="button"
              onClick={() => setMessage(TEMPLATES.monitoring_notice)}
              className="px-2.5 py-1 rounded-md bg-stone-100 border border-stone-200 text-stone-700 hover:bg-stone-200 font-medium transition-colors text-[11px]"
            >
              Heightened Watch
            </button>
          </div>
        </div>

        {/* Message Content */}
        <div>
          <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
            Official Advisory Bulletin Text
          </label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-stone-800 font-mono text-xs focus:ring-2 focus:ring-mountain-600 focus:outline-none"
            placeholder="Enter mandatory advisory directions and action directives..."
          />
        </div>

        {/* Dispatch Controls */}
        <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={closeBroadcastModal} type="button">
            Cancel
          </Button>

          <Button
            variant="danger"
            type="submit"
            loading={submitting}
            icon={<Radio size={16} />}
          >
            Authorize & Transmit Advisory
          </Button>
        </div>
      </form>
    </Modal>
  );
};
