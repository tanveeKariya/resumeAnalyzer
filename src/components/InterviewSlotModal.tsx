import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, CheckCircle, AlertCircle, Video, Building } from 'lucide-react';
import { JobService, InterviewService, InterviewSlot } from '../services/api';
import Modal from './ui/Modal';
import Button from './ui/Button';

interface InterviewSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  company: string;
  resumeId: string;
  onSlotRequested: () => void;
}

export default function InterviewSlotModal({ 
  isOpen, 
  onClose, 
  jobId, 
  jobTitle, 
  company, 
  resumeId,
  onSlotRequested 
}: InterviewSlotModalProps) {
  const [slots, setSlots] = useState<InterviewSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadAvailableSlots();
    }
  }, [isOpen, jobId]);

  const loadAvailableSlots = async () => {
    try {
      setLoading(true);
      const response = await JobService.getAvailableSlots(jobId);
      if (response.success) {
        setSlots(response.data);
      }
    } catch (error) {
      console.error('Failed to load slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestSlot = async () => {
    if (!selectedSlot) return;

    try {
      setRequesting(true);
      const response = await InterviewService.requestInterviewSlot(jobId, selectedSlot, resumeId);
      
      if (response.success) {
        onSlotRequested();
        onClose();
      }
    } catch (error: any) {
      console.error('Failed to request slot:', error);
    } finally {
      setRequesting(false);
    }
  };

  const formatSlotDate = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatSlotTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const groupSlotsByDate = (slots: InterviewSlot[]) => {
    const grouped: { [key: string]: InterviewSlot[] } = {};
    
    slots.forEach(slot => {
      const date = new Date(slot.dateTime).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(slot);
    });
    
    return grouped;
  };

  const groupedSlots = groupSlotsByDate(slots);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule Interview" size="lg">
      <div className="space-y-6">
        {/* Interview Details */}
        <div className="glass rounded-2xl p-6 border border-blue-200/60 bg-blue-50/30">
          <h4 className="font-bold text-slate-900 mb-4 flex items-center space-x-2">
            <Building className="h-5 w-5 text-blue-600" />
            <span>Interview Details</span>
          </h4>
          <div className="grid md:grid-cols-2 gap-4 text-slate-700">
            <div>
              <p className="font-semibold">Position: <span className="text-blue-600">{jobTitle}</span></p>
              <p className="font-semibold">Company: <span className="text-slate-900">{company}</span></p>
            </div>
            <div>
              <p className="font-semibold">Duration: <span className="text-slate-900">60 minutes</span></p>
              <p className="font-semibold">Type: <span className="text-slate-900">Technical Interview</span></p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-pulse shadow-xl">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <p className="text-slate-600 font-medium">Loading available slots...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <h4 className="font-bold text-slate-900 text-lg flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>Available Time Slots</span>
            </h4>
            
            {Object.keys(groupedSlots).length === 0 ? (
              <div className="text-center py-12 glass rounded-2xl border border-slate-200/60">
                <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">No available slots at the moment</p>
                <p className="text-slate-500 text-sm">Please check back later or contact the recruiter</p>
              </div>
            ) : (
              <div className="space-y-6 max-h-96 overflow-y-auto">
                {Object.entries(groupedSlots).map(([date, dateSlots]) => (
                  <div key={date} className="space-y-3">
                    <h5 className="font-bold text-slate-800 text-lg border-b border-slate-200 pb-2">
                      {formatSlotDate(dateSlots[0].dateTime)}
                    </h5>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {dateSlots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => setSelectedSlot(slot.id)}
                          disabled={!slot.isAvailable}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                            selectedSlot === slot.id
                              ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-lg scale-105'
                              : slot.isAvailable
                              ? 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md'
                              : 'border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex items-center justify-center space-x-2 mb-2">
                            <Clock className="h-4 w-4" />
                            <span className="font-bold">{formatSlotTime(slot.dateTime)}</span>
                          </div>
                          <p className="text-xs font-medium">
                            {slot.isAvailable ? 'Available' : 'Booked'}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Selected Slot Confirmation */}
        {selectedSlot && (
          <div className="glass rounded-2xl p-6 border border-emerald-200/60 bg-emerald-50/50">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
              <h4 className="font-bold text-emerald-900">Selected Time Slot</h4>
            </div>
            <div className="text-emerald-800">
              <p className="font-semibold text-lg">
                {formatSlotDate(slots.find(s => s.id === selectedSlot)?.dateTime || '')} at{' '}
                {formatSlotTime(slots.find(s => s.id === selectedSlot)?.dateTime || '')}
              </p>
              <p className="text-sm mt-2">
                The recruiter will receive your request and confirm the interview within 24 hours.
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-4 border-t border-slate-200/60">
          <Button
            onClick={requestSlot}
            disabled={!selectedSlot || requesting}
            loading={requesting}
            className="flex-1"
            icon={Video}
            size="lg"
          >
            {requesting ? 'Requesting Slot...' : 'Request Interview Slot'}
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1" size="lg">
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}