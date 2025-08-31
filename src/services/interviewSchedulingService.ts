// Interview Scheduling Service
import { BUSINESS_HOURS } from '../config/constants';

export interface Interview {
  id: number;
  candidateName: string;
  position: string;
  date: string;
  time: string;
  duration: string;
  status: 'confirmed' | 'pending' | 'completed';
  meetingLink?: string;
  notes?: string;
  interviewer?: string;
}

export class InterviewSchedulingService {
  static generateInterviewSlots(startDate: Date, daysAhead: number = 7): Date[] {
    const slots: Date[] = [];
    const currentDate = new Date(startDate);
    
    for (let day = 0; day < daysAhead; day++) {
      // Morning slots
      for (let hour = BUSINESS_HOURS.start; hour < BUSINESS_HOURS.lunchBreak.start; hour++) {
        const slot = new Date(currentDate);
        slot.setHours(hour, 0, 0, 0);
        slots.push(slot);
      }
      
      // Afternoon slots
      for (let hour = BUSINESS_HOURS.lunchBreak.end; hour < BUSINESS_HOURS.end; hour++) {
        const slot = new Date(currentDate);
        slot.setHours(hour, 0, 0, 0);
        slots.push(slot);
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return slots;
  }

  static generateInvite(
    candidateName: string,
    jobTitle: string,
    interviewDate: Date,
    interviewer: string,
    meetingLink?: string,
    additionalNotes?: string
  ) {
    const formattedDate = interviewDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const formattedTime = interviewDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const message = `Dear ${candidateName},

Thank you for your interest in the ${jobTitle} position. We are pleased to invite you for an interview.

Interview Details:
- Date: ${formattedDate}
- Time: ${formattedTime}
- Interviewer: ${interviewer}
${meetingLink ? `- Meeting Link: ${meetingLink}` : ''}

${additionalNotes ? `Additional Notes: ${additionalNotes}` : ''}

Please confirm your availability for this interview slot. If this time doesn't work for you, please let us know your preferred time slots.

Best regards,
${interviewer}`.trim();

    return {
      candidateName,
      jobTitle,
      interviewDate,
      interviewer,
      meetingLink,
      additionalNotes,
      message,
      status: 'pending'
    };
  }
}