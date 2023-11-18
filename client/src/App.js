import './App.css';
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import ResponsiveDateTimePickers from './DateTimePicker.js';
import { useState } from 'react';

function App() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const { isLoading } = useSessionContext();
  
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(new Date());
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  if (isLoading) {
    return <></>;
  }

  async function googleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar',
      },
    });
    if (error) {
      alert('Error logging in to Google provider with Supabase');
      console.log(error);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function createCalendarEvent() {
    console.log("Creating Calendar Event");
    const event = {
      'summary': eventName,
      'description': eventDescription,
      'start': {
        'dateTime': startDateTime.toISOString(),
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      'end': {
        'dateTime': endDateTime.toISOString(),
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    }
      await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
        method: 'POST',
        headers: {
          'Authorization':'Bearer ' + session.provider_token
        },
        body: JSON.stringify(event)
      }).then((data) => {
        return data.json();
      }).then((data) => {
        console.log(data);
        alert("Event created, check your Google Calendar!");
      });
    }

console.log(session);
console.log(startDateTime);
console.log(eventName);
console.log(eventDescription);


  return (
    <div className="App">
      <div style={{ width: '90%', margin: '30px auto' }}>
        {session ? (
          <>
            <h2> Hey there {session.user.email}</h2>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center', // Center vertically
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: '50px',
                  marginBottom: '10px',
                  justifyContent: 'center',
                }}
              >
                <div>
                  <p style={{ marginBottom: '5px', fontWeight: 'bold' }}>Start of your event</p>
                  <ResponsiveDateTimePickers onChange={(value) => setStartDateTime(value)} />
                </div>
                <div>
                  <p style={{ marginBottom: '5px', fontWeight: 'bold' }}>End of your event</p>
                  <ResponsiveDateTimePickers onChange={(value) => setEndDateTime(value)} />
                </div>
              </div>
              <p>Event name</p>
              <input type='text' onChange={(e) => setEventName(e.target.value)} />
              <p>Event description</p>
              <input type='text' onChange={(e) => setEventDescription(e.target.value)} />
              <hr />
              <button onClick={() => createCalendarEvent()}>Create Calendar Event</button>
              <p></p>

              <button onClick={() => signOut()}> Sign Out</button>
            </div>
          </>
        ) : (
          <button onClick={() => googleSignIn()}> Sign In With Google</button>
        )}
      </div>
    </div>
  );
}

export default App;
