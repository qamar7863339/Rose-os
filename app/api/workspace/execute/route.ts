import { NextRequest, NextResponse } from 'next/server';

function encodeMimeMessage(to: string, subject: string, body: string): string {
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
  const messageParts = [
    `To: ${to}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    body,
  ];
  const message = messageParts.join('\n');
  return Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

    const body = await req.json();
    const { action, params = {} } = body;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          requiresAuth: true,
          error:
            'Google Workspace account is not connected in this session. Please click "Connect Google Workspace" in Integrations or the top bar to authorize Gmail, Calendar, and Drive.',
        },
        { status: 401 }
      );
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    switch (action) {
      case 'gmail_search_emails': {
        const query = encodeURIComponent(params.query || 'in:inbox');
        const maxResults = Math.min(Number(params.maxResults) || 5, 15);
        const listRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${query}&maxResults=${maxResults}`,
          { headers }
        );
        if (!listRes.ok) {
          const errText = await listRes.text();
          return NextResponse.json(
            { success: false, error: `Gmail API Error (${listRes.status}): ${errText}` },
            { status: listRes.status }
          );
        }
        const listData = await listRes.json();
        const messages = listData.messages || [];
        const details = await Promise.all(
          messages.slice(0, 5).map(async (m: { id: string }) => {
            const msgRes = await fetch(
              `https://gmail.googleapis.com/gmail/v1/users/me/messages/${m.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
              { headers }
            );
            if (!msgRes.ok) return { id: m.id };
            const msgData = await msgRes.json();
            const hdrs: Array<{ name: string; value: string }> = msgData.payload?.headers || [];
            const getHdr = (n: string) => hdrs.find((h) => h.name.toLowerCase() === n.toLowerCase())?.value || '';
            return {
              id: msgData.id,
              snippet: msgData.snippet,
              subject: getHdr('Subject'),
              from: getHdr('From'),
              date: getHdr('Date'),
            };
          })
        );
        return NextResponse.json({
          success: true,
          action,
          count: details.length,
          messages: details,
        });
      }

      case 'gmail_create_draft': {
        const { to, subject, body: emailBody } = params;
        if (!to || !subject || !emailBody) {
          return NextResponse.json(
            { success: false, error: 'Missing required parameters: to, subject, body' },
            { status: 400 }
          );
        }
        const raw = encodeMimeMessage(to, subject, emailBody);
        const draftRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/drafts', {
          method: 'POST',
          headers,
          body: JSON.stringify({ message: { raw } }),
        });
        if (!draftRes.ok) {
          const errText = await draftRes.text();
          return NextResponse.json(
            { success: false, error: `Gmail Draft Error (${draftRes.status}): ${errText}` },
            { status: draftRes.status }
          );
        }
        const draftData = await draftRes.json();
        return NextResponse.json({
          success: true,
          action,
          draftId: draftData.id,
          to,
          subject,
          message: `Gmail draft created for ${to} with subject "${subject}".`,
        });
      }

      case 'gmail_send_email': {
        const { to, subject, body: emailBody } = params;
        if (!to || !subject || !emailBody) {
          return NextResponse.json(
            { success: false, error: 'Missing required parameters: to, subject, body' },
            { status: 400 }
          );
        }
        const raw = encodeMimeMessage(to, subject, emailBody);
        const sendRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
          method: 'POST',
          headers,
          body: JSON.stringify({ raw }),
        });
        if (!sendRes.ok) {
          const errText = await sendRes.text();
          return NextResponse.json(
            { success: false, error: `Gmail Send Error (${sendRes.status}): ${errText}` },
            { status: sendRes.status }
          );
        }
        const sendData = await sendRes.json();
        return NextResponse.json({
          success: true,
          action,
          messageId: sendData.id,
          to,
          subject,
          message: `Email sent to ${to} with subject "${subject}".`,
        });
      }

      case 'calendar_list_events': {
        const timeMin = encodeURIComponent(params.timeMin || new Date().toISOString());
        const maxResults = Math.min(Number(params.maxResults) || 10, 25);
        const calRes = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&maxResults=${maxResults}&singleEvents=true&orderBy=startTime`,
          { headers }
        );
        if (!calRes.ok) {
          const errText = await calRes.text();
          return NextResponse.json(
            { success: false, error: `Calendar API Error (${calRes.status}): ${errText}` },
            { status: calRes.status }
          );
        }
        const calData = await calRes.json();
        const events = (calData.items || []).map((ev: Record<string, unknown>) => ({
          id: ev.id,
          summary: ev.summary,
          start: (ev.start as Record<string, unknown>)?.dateTime || (ev.start as Record<string, unknown>)?.date,
          end: (ev.end as Record<string, unknown>)?.dateTime || (ev.end as Record<string, unknown>)?.date,
          htmlLink: ev.htmlLink,
          status: ev.status,
        }));
        return NextResponse.json({
          success: true,
          action,
          count: events.length,
          events,
        });
      }

      case 'calendar_create_event': {
        const { summary, description, startTime, endTime, attendeeEmail } = params;
        if (!summary || !startTime || !endTime) {
          return NextResponse.json(
            { success: false, error: 'Missing required parameters: summary, startTime, endTime' },
            { status: 400 }
          );
        }
        const payload: Record<string, unknown> = {
          summary,
          description: description || 'Scheduled via ROSE AI OS',
          start: { dateTime: startTime },
          end: { dateTime: endTime },
        };
        if (attendeeEmail) {
          payload.attendees = [{ email: attendeeEmail }];
        }
        const createRes = await fetch(
          'https://www.googleapis.com/calendar/v3/calendars/primary/events',
          {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
          }
        );
        if (!createRes.ok) {
          const errText = await createRes.text();
          return NextResponse.json(
            { success: false, error: `Calendar Create Error (${createRes.status}): ${errText}` },
            { status: createRes.status }
          );
        }
        const eventData = await createRes.json();
        return NextResponse.json({
          success: true,
          action,
          eventId: eventData.id,
          htmlLink: eventData.htmlLink,
          summary: eventData.summary,
          start: eventData.start,
          message: `Calendar event "${summary}" created.`,
        });
      }

      case 'calendar_cancel_event': {
        const { eventId } = params;
        if (!eventId) {
          return NextResponse.json(
            { success: false, error: 'Missing required parameter: eventId' },
            { status: 400 }
          );
        }
        const delRes = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(eventId)}`,
          {
            method: 'DELETE',
            headers,
          }
        );
        if (!delRes.ok && delRes.status !== 204) {
          const errText = await delRes.text();
          return NextResponse.json(
            { success: false, error: `Calendar Delete Error (${delRes.status}): ${errText}` },
            { status: delRes.status }
          );
        }
        return NextResponse.json({
          success: true,
          action,
          eventId,
          message: `Calendar event ${eventId} cancelled.`,
        });
      }

      case 'drive_search_files': {
        const qTerm = (params.query || '').replace(/'/g, "\\'");
        const q = encodeURIComponent(
          qTerm ? `name contains '${qTerm}' and trashed = false` : 'trashed = false'
        );
        const pageSize = Math.min(Number(params.pageSize) || 10, 25);
        const driveRes = await fetch(
          `https://www.googleapis.com/drive/v3/files?q=${q}&pageSize=${pageSize}&fields=files(id,name,mimeType,webViewLink,modifiedTime)`,
          { headers }
        );
        if (!driveRes.ok) {
          const errText = await driveRes.text();
          return NextResponse.json(
            { success: false, error: `Drive API Error (${driveRes.status}): ${errText}` },
            { status: driveRes.status }
          );
        }
        const driveData = await driveRes.json();
        return NextResponse.json({
          success: true,
          action,
          count: (driveData.files || []).length,
          files: driveData.files || [],
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: `Unsupported Google Workspace action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Google Workspace execution error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Workspace execution failed',
      },
      { status: 500 }
    );
  }
}
