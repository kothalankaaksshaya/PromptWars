import { EventPlan } from '../types/event';

export function downloadEventIcs(plan: EventPlan): void {
  const sanitize = (text: string) => text.replace(/\n/g, '\\n').replace(/,/g, '\\,');

  const now = new Date();
  const dtStamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  // Base event date
  const eventDateStr = plan.date || new Date().toISOString().split('T')[0];
  const dateFormatted = eventDateStr.replace(/-/g, '');

  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Celebrio//Event Planner Assistant//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${sanitize(plan.title)}`,
  ];

  // Add Day-of Schedule items as calendar events
  if (plan.dayOfSchedule && plan.dayOfSchedule.length > 0) {
    plan.dayOfSchedule.forEach((item, index) => {
      // Parse time if possible (e.g. "09:00 AM")
      const timeMatch = item.time.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      let hour = 12;
      let minute = 0;
      if (timeMatch) {
        hour = parseInt(timeMatch[1], 10);
        minute = parseInt(timeMatch[2], 10);
        const meridiem = (timeMatch[3] || '').toUpperCase();
        if (meridiem === 'PM' && hour < 12) hour += 12;
        if (meridiem === 'AM' && hour === 12) hour = 0;
      } else {
        hour = 9 + index;
      }

      const pad = (n: number) => n.toString().padStart(2, '0');
      const startIso = `${dateFormatted}T${pad(hour)}${pad(minute)}00`;
      const endHour = hour + 1 > 23 ? 23 : hour + 1;
      const endIso = `${dateFormatted}T${pad(endHour)}${pad(minute)}00`;

      icsContent.push(
        'BEGIN:VEVENT',
        `UID:celebrio-${plan.id}-${item.id}-${index}@celebrio.app`,
        `DTSTAMP:${dtStamp}`,
        `DTSTART:${startIso}`,
        `DTEND:${endIso}`,
        `SUMMARY:${sanitize(item.title)}`,
        `DESCRIPTION:${sanitize(`${item.description} (Lead: ${item.responsiblePerson})`)}`,
        `LOCATION:${sanitize(item.location || plan.location)}`,
        'STATUS:CONFIRMED',
        'END:VEVENT'
      );
    });
  } else {
    // Add single master event
    icsContent.push(
      'BEGIN:VEVENT',
      `UID:celebrio-master-${plan.id}@celebrio.app`,
      `DTSTAMP:${dtStamp}`,
      `DTSTART;VALUE=DATE:${dateFormatted}`,
      `SUMMARY:${sanitize(plan.title)}`,
      `DESCRIPTION:${sanitize(plan.visionSummary || 'Event planned with Celebrio GenAI')}`,
      `LOCATION:${sanitize(plan.location)}`,
      'STATUS:CONFIRMED',
      'END:VEVENT'
    );
  }

  icsContent.push('END:VCALENDAR');

  const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${plan.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_schedule.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
