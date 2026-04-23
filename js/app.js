// app.js - Data fetching and UI rendering
import { collection, getDocs, addDoc, query, where, doc, getDoc } from 'https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js';
import { db } from './firebase.js';

// Fetch volunteer data
export async function fetchVolunteerData(uid) {
  try {
    // Get user data
    const userDoc = await getDoc(doc(db, 'users', uid));
    const userData = userDoc.data();

    // Get assignments
    const assignmentsQuery = query(collection(db, 'assignments'), where('userId', '==', uid));
    const assignmentsSnapshot = await getDocs(assignmentsQuery);
    const assignments = [];
    for (const assignmentDoc of assignmentsSnapshot.docs) {
      const assignment = assignmentDoc.data();
      // Get event data
      const eventDoc = await getDoc(doc(db, 'events', assignment.eventId));
      if (eventDoc.exists()) {
        assignments.push({
          ...assignment,
          event: eventDoc.data()
        });
      }
    }

    return { user: userData, assignments };
  } catch (error) {
    console.error('Error fetching volunteer data:', error);
    return null;
  }
}

// Render volunteer dashboard
export function renderVolunteerDashboard(data) {
  if (!data) return;

  const { user, assignments } = data;

  // Personal info
  document.getElementById('userName').textContent = `Name: ${user.name}`;
  document.getElementById('userEmail').textContent = `Email: ${user.email}`;
  document.getElementById('userSkills').textContent = `Skills: ${user.skills.join(', ')}`;
  document.getElementById('userAvailability').textContent = `Availability: ${user.availability.join(', ')}`;

  // Reliability score
  document.getElementById('reliabilityScore').textContent = user.reliabilityScore;

  // Reliability chart (simple bar)
  const ctx = document.getElementById('reliabilityChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Reliability'],
      datasets: [{
        label: 'Score',
        data: [user.reliabilityScore],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });

  // Assigned events
  const eventsList = document.getElementById('assignedEvents');
  eventsList.innerHTML = '';
  assignments.forEach(assignment => {
    const li = document.createElement('li');
    li.className = 'p-2 bg-gray-50 rounded';
    li.textContent = `${assignment.event.title} - Status: ${assignment.status}`;
    eventsList.appendChild(li);
  });

  // Skills chart (pie)
  const skillsCtx = document.getElementById('skillsChart').getContext('2d');
  const skillCounts = {};
  user.skills.forEach(skill => {
    skillCounts[skill] = (skillCounts[skill] || 0) + 1;
  });
  new Chart(skillsCtx, {
    type: 'pie',
    data: {
      labels: Object.keys(skillCounts),
      datasets: [{
        data: Object.values(skillCounts),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
      }]
    }
  });
}

// Fetch manager data
export async function fetchManagerData() {
  try {
    // Get all events
    const eventsSnapshot = await getDocs(collection(db, 'events'));
    const events = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Get all volunteers
    const volunteersQuery = query(collection(db, 'users'), where('role', '==', 'volunteer'));
    const volunteersSnapshot = await getDocs(volunteersQuery);
    const volunteers = volunteersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return { events, volunteers };
  } catch (error) {
    console.error('Error fetching manager data:', error);
    return null;
  }
}

// Render manager dashboard
export function renderManagerDashboard(data) {
  if (!data) return;

  const { events, volunteers } = data;

  // Events list
  const eventsList = document.getElementById('eventsList');
  eventsList.innerHTML = '';
  events.forEach(event => {
    const li = document.createElement('li');
    li.className = `p-4 border rounded ${event.assignedVolunteers.length < event.volunteersNeeded ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`;
    li.innerHTML = `
      <h3 class="font-semibold">${event.title}</h3>
      <p>Location: ${event.location}</p>
      <p>Time: ${new Date(event.time).toLocaleString()}</p>
      <p>Volunteers: ${event.assignedVolunteers.length}/${event.volunteersNeeded}</p>
      <p>Skills: ${event.requiredSkills.join(', ')}</p>
    `;
    eventsList.appendChild(li);
  });

  // Volunteers list
  const volunteersList = document.getElementById('volunteersList');
  volunteersList.innerHTML = '';
  volunteers.forEach(volunteer => {
    const li = document.createElement('li');
    li.className = 'p-2 bg-gray-50 rounded';
    li.textContent = `${volunteer.name} - Skills: ${volunteer.skills.join(', ')} - Reliability: ${volunteer.reliabilityScore}`;
    volunteersList.appendChild(li);
  });

  // Volunteers per event chart
  const eventCtx = document.getElementById('volunteersPerEventChart').getContext('2d');
  new Chart(eventCtx, {
    type: 'bar',
    data: {
      labels: events.map(e => e.title),
      datasets: [{
        label: 'Assigned Volunteers',
        data: events.map(e => e.assignedVolunteers.length),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }, {
        label: 'Needed',
        data: events.map(e => e.volunteersNeeded),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  // Skill distribution chart
  const skillCtx = document.getElementById('skillDistributionChart').getContext('2d');
  const allSkills = volunteers.flatMap(v => v.skills);
  const skillCounts = {};
  allSkills.forEach(skill => {
    skillCounts[skill] = (skillCounts[skill] || 0) + 1;
  });
  new Chart(skillCtx, {
    type: 'pie',
    data: {
      labels: Object.keys(skillCounts),
      datasets: [{
        data: Object.values(skillCounts),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
      }]
    }
  });
}

// Create new event
export async function createEvent(eventData) {
  try {
    await addDoc(collection(db, 'events'), {
      ...eventData,
      assignedVolunteers: []
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}