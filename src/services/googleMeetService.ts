// Google Meet Integration Service
export class GoogleMeetService {
  private static readonly GOOGLE_MEET_API_KEY = import.meta.env.VITE_GOOGLE_MEET_API_KEY;
  
  static async createMeetingLink(
    title: string,
    startTime: string,
    duration: number,
    attendees: string[]
  ): Promise<string> {
    try {
      // In a real implementation, you would use Google Calendar API
      // For demo purposes, we'll generate a mock Google Meet link
      const meetingId = this.generateMeetingId();
      const meetLink = `https://meet.google.com/${meetingId}`;
      
      // Store meeting details for later reference
      const meetingDetails = {
        id: meetingId,
        title,
        startTime,
        duration,
        attendees,
        link: meetLink,
        createdAt: new Date().toISOString()
      };
      
      this.storeMeetingDetails(meetingDetails);
      
      return meetLink;
    } catch (error) {
      console.error('Failed to create Google Meet link:', error);
      // Return fallback link
      return `https://meet.google.com/${this.generateMeetingId()}`;
    }
  }

  static async scheduleMeeting(
    title: string,
    description: string,
    startTime: string,
    endTime: string,
    attendees: string[]
  ): Promise<{ meetLink: string; calendarEventId: string }> {
    try {
      // In production, this would integrate with Google Calendar API
      const meetingId = this.generateMeetingId();
      const meetLink = `https://meet.google.com/${meetingId}`;
      const calendarEventId = `event_${Date.now()}`;
      
      const eventDetails = {
        id: calendarEventId,
        title,
        description,
        startTime,
        endTime,
        attendees,
        meetLink,
        createdAt: new Date().toISOString()
      };
      
      this.storeMeetingDetails(eventDetails);
      
      return { meetLink, calendarEventId };
    } catch (error) {
      console.error('Failed to schedule meeting:', error);
      throw new Error('Failed to schedule Google Meet');
    }
  }

  static async getMeetingDetails(meetingId: string): Promise<any> {
    try {
      const meetings = this.getStoredMeetings();
      return meetings.find(meeting => meeting.id === meetingId);
    } catch (error) {
      console.error('Failed to get meeting details:', error);
      return null;
    }
  }

  static async endMeeting(meetingId: string): Promise<boolean> {
    try {
      const meetings = this.getStoredMeetings();
      const meetingIndex = meetings.findIndex(meeting => meeting.id === meetingId);
      
      if (meetingIndex !== -1) {
        meetings[meetingIndex].endedAt = new Date().toISOString();
        meetings[meetingIndex].status = 'completed';
        localStorage.setItem('google_meet_meetings', JSON.stringify(meetings));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to end meeting:', error);
      return false;
    }
  }

  private static generateMeetingId(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const segments = [];
    
    for (let i = 0; i < 3; i++) {
      let segment = '';
      for (let j = 0; j < 4; j++) {
        segment += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      segments.push(segment);
    }
    
    return segments.join('-');
  }

  private static storeMeetingDetails(details: any): void {
    const meetings = this.getStoredMeetings();
    meetings.push(details);
    localStorage.setItem('google_meet_meetings', JSON.stringify(meetings));
  }

  private static getStoredMeetings(): any[] {
    try {
      const stored = localStorage.getItem('google_meet_meetings');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
}