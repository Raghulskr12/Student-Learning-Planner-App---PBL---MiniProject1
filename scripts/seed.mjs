/**
 * Seed Script – The 1% Club
 * Run: node scripts/seed.mjs
 *
 * Creates a demo user + realistic 60-day history of analytics,
 * a master routine template, today's daily log, a journal entry,
 * and a weekly plan.
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
// No dotenv needed – URI is hardcoded as fallback below

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://kalairaghul70:raghul12@raghul-dev.ee3a8t4.mongodb.net/the_1_percent_club';

// ── Schemas ─────────────────────────────────────────────────────────────────

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, select: false },
  college:  { type: String, default: '' },
  preferences: {
    theme:        { type: String, default: 'System Default' },
    autoAdvance:  { type: Boolean, default: true }
  },
  notifications: {
    dailyReminder:  { type: Boolean, default: true },
    weeklyReview:   { type: Boolean, default: true },
    deepWorkChime:  { type: Boolean, default: true }
  },
  weeklyPlan: { type: Object, default: {} }
}, { timestamps: true });

const SubtaskSchema = new mongoose.Schema({ title: String });
const RoutineTaskSchema = new mongoose.Schema({
  title: String, startTime: String, endTime: String,
  isDeepWork: Boolean, subtasks: [SubtaskSchema]
});
const RoutineTemplateSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  name:   String,
  morning: [RoutineTaskSchema], afternoon: [RoutineTaskSchema],
  evening: [RoutineTaskSchema], night:    [RoutineTaskSchema]
}, { timestamps: true });

const DailySubtaskSchema = new mongoose.Schema({ title: String, checked: Boolean });
const DailyTaskSchema = new mongoose.Schema({
  title: String, startTime: String, endTime: String,
  isDeepWork: Boolean, checked: Boolean, subtasks: [DailySubtaskSchema]
});
const DailyLogSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  date:   Date,
  morning: [DailyTaskSchema], afternoon: [DailyTaskSchema],
  evening: [DailyTaskSchema], night:     [DailyTaskSchema]
}, { timestamps: true });

const JournalSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  date:   Date,
  ratings: { workout: Number, studies: Number, diet: Number, sleep: Number },
  wins:    String,
  lessons: String
}, { timestamps: true });

const AnalyticsSchema = new mongoose.Schema({
  userId:          mongoose.Schema.Types.ObjectId,
  date:            Date,
  deepWorkMinutes: { type: Number, default: 0 },
  tasksCompleted:  { type: Number, default: 0 },
  habitScore:      { type: Number, default: 0 }
}, { timestamps: true });

// ── Models ──────────────────────────────────────────────────────────────────

const User             = mongoose.models.User             || mongoose.model('User',             UserSchema);
const RoutineTemplate  = mongoose.models.RoutineTemplate  || mongoose.model('RoutineTemplate',  RoutineTemplateSchema);
const DailyLog         = mongoose.models.DailyLog         || mongoose.model('DailyLog',         DailyLogSchema);
const Journal          = mongoose.models.Journal          || mongoose.model('Journal',          JournalSchema);
const AnalyticsActivity= mongoose.models.AnalyticsActivity|| mongoose.model('AnalyticsActivity',AnalyticsSchema);

// ── Seed ────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('🌱  Connecting to MongoDB…');
  await mongoose.connect(MONGODB_URI);
  console.log('✅  Connected.\n');

  // ── 1. User ────────────────────────────────────────────────────────────────
  const email = 'demo@the1percentclub.app';
  const hashedPw = await bcrypt.hash('Demo@123', 12);

  let user = await User.findOne({ email });
  if (user) {
    console.log(`👤  User '${email}' already exists – reusing ID.`);
  } else {
    user = await User.create({
      name:    'Arjun Sharma',
      email,
      password: hashedPw,
      college: 'Computer Science & Engineering, NIT Trichy',
      preferences:   { theme: 'System Default', autoAdvance: true },
      notifications: { dailyReminder: true, weeklyReview: true, deepWorkChime: true },
      weeklyPlan: {
        Monday:    'College Day Template',
        Tuesday:   'College Day Template',
        Wednesday: 'Deep Work Only',
        Thursday:  'College Day Template',
        Friday:    'Project Day',
        Saturday:  'Weekend Grind',
        Sunday:    'Rest & Reset',
      }
    });
    console.log(`👤  Created user: ${user.name} (${email})`);
  }
  const userId = user._id;

  // ── 2. Master Routine Template ─────────────────────────────────────────────
  const existingRoutine = await RoutineTemplate.findOne({ userId });
  if (existingRoutine) {
    await RoutineTemplate.deleteOne({ _id: existingRoutine._id });
    console.log('🗑   Replaced old routine template.');
  }

  const routine = await RoutineTemplate.create({
    userId,
    name: 'Elite Protocol Baseline',
    morning: [
      { title: 'Hydrate + Cold Shower',       startTime: '06:00', endTime: '06:30', isDeepWork: false, subtasks: [] },
      { title: 'Zone 2 Cardio / Gym Session', startTime: '06:30', endTime: '07:45', isDeepWork: false, subtasks: [
          { title: 'Warm-up 10 min' }, { title: 'Main lift 35 min' }, { title: 'Cool-down 10 min' }
      ]},
      { title: 'Deep Work Session 1 – DSA',   startTime: '08:00', endTime: '10:00', isDeepWork: true, subtasks: [
          { title: 'Solve 2 medium LeetCode problems' },
          { title: 'Review yesterday\'s solutions' },
          { title: 'Read CLRS Chapter 7' }
      ]},
      { title: 'College Lectures',             startTime: '10:30', endTime: '13:30', isDeepWork: false, subtasks: [] },
    ],
    afternoon: [
      { title: 'Lunch + Short Walk',           startTime: '13:30', endTime: '14:00', isDeepWork: false, subtasks: [] },
      { title: 'Deep Work Session 2 – Project',startTime: '14:30', endTime: '16:30', isDeepWork: true, subtasks: [
          { title: 'Work on final-year project report' },
          { title: 'Push code to GitHub' },
          { title: 'Team sync call' }
      ]},
      { title: 'Admin / Assignments',          startTime: '16:30', endTime: '17:30', isDeepWork: false, subtasks: [] },
    ],
    evening: [
      { title: 'Evening Walk / Sport',         startTime: '18:00', endTime: '19:00', isDeepWork: false, subtasks: [] },
      { title: 'Deep Work Session 3 – Reading',startTime: '19:30', endTime: '20:30', isDeepWork: true, subtasks: [
          { title: 'Read non-fiction 30 min' },
          { title: 'Write 3 key insights in Notion' }
      ]},
    ],
    night: [
      { title: 'Journal + Review Day',         startTime: '21:00', endTime: '21:30', isDeepWork: false, subtasks: [] },
      { title: 'Plan Tomorrow',                startTime: '21:30', endTime: '21:45', isDeepWork: false, subtasks: [] },
      { title: 'Wind Down / Skincare',         startTime: '21:45', endTime: '22:15', isDeepWork: false, subtasks: [] },
    ],
  });
  console.log('📋  Created routine template:', routine.name);

  // ── 3. Today's Daily Log ────────────────────────────────────────────────────
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  await DailyLog.deleteOne({ userId, date: { $gte: today, $lt: tomorrow } });

  const now = new Date();
  const currentHHMM = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;

  // Mark tasks before current time as checked to simulate real progress
  const autoCheck = (startTime) => startTime && startTime < currentHHMM;

  const dailyLog = await DailyLog.create({
    userId, date: today,
    morning: [
      { title: 'Hydrate + Cold Shower',        startTime: '06:00', endTime: '06:30', isDeepWork: false, checked: autoCheck('06:00'), subtasks: [] },
      { title: 'Zone 2 Cardio / Gym Session',  startTime: '06:30', endTime: '07:45', isDeepWork: false, checked: autoCheck('06:30'), subtasks: [
          { title: 'Warm-up 10 min', checked: autoCheck('06:30') },
          { title: 'Main lift 35 min', checked: autoCheck('06:30') },
          { title: 'Cool-down 10 min', checked: autoCheck('06:30') }
      ]},
      { title: 'Deep Work Session 1 – DSA',    startTime: '08:00', endTime: '10:00', isDeepWork: true,  checked: autoCheck('08:00'), subtasks: [
          { title: 'Solve 2 medium LeetCode problems', checked: autoCheck('08:00') },
          { title: 'Review yesterday\'s solutions', checked: autoCheck('08:00') },
          { title: 'Read CLRS Chapter 7', checked: false }
      ]},
      { title: 'College Lectures',              startTime: '10:30', endTime: '13:30', isDeepWork: false, checked: autoCheck('10:30'), subtasks: [] },
    ],
    afternoon: [
      { title: 'Lunch + Short Walk',            startTime: '13:30', endTime: '14:00', isDeepWork: false, checked: autoCheck('13:30'), subtasks: [] },
      { title: 'Deep Work Session 2 – Project', startTime: '14:30', endTime: '16:30', isDeepWork: true,  checked: false, subtasks: [
          { title: 'Work on final-year project report', checked: false },
          { title: 'Push code to GitHub', checked: false },
          { title: 'Team sync call', checked: false }
      ]},
      { title: 'Admin / Assignments',           startTime: '16:30', endTime: '17:30', isDeepWork: false, checked: false, subtasks: [] },
    ],
    evening: [
      { title: 'Evening Walk / Sport',          startTime: '18:00', endTime: '19:00', isDeepWork: false, checked: false, subtasks: [] },
      { title: 'Deep Work Session 3 – Reading', startTime: '19:30', endTime: '20:30', isDeepWork: true,  checked: false, subtasks: [
          { title: 'Read non-fiction 30 min', checked: false },
          { title: 'Write 3 key insights in Notion', checked: false }
      ]},
    ],
    night: [
      { title: 'Journal + Review Day',          startTime: '21:00', endTime: '21:30', isDeepWork: false, checked: false, subtasks: [] },
      { title: 'Plan Tomorrow',                 startTime: '21:30', endTime: '21:45', isDeepWork: false, checked: false, subtasks: [] },
      { title: 'Wind Down / Skincare',          startTime: '21:45', endTime: '22:15', isDeepWork: false, checked: false, subtasks: [] },
    ],
  });
  const allTasks = [
    ...dailyLog.morning, ...dailyLog.afternoon,
    ...dailyLog.evening, ...dailyLog.night
  ];
  const checked = allTasks.filter(t => t.checked).length;
  console.log(`📅  Created today's daily log – ${checked}/${allTasks.length} tasks auto-checked`);

  // ── 4. Journal Entry for Today ─────────────────────────────────────────────
  await Journal.deleteOne({ userId, date: { $gte: today, $lt: tomorrow } });
  await Journal.create({
    userId, date: today,
    ratings: { workout: 8, studies: 9, diet: 7, sleep: 8 },
    wins: 'Crushed the morning gym session with a new PR on bench press. Solved 3 LeetCode problems on binary trees and finally understood the Morris Traversal algorithm.',
    lessons: 'Spent 20 minutes doom-scrolling before sleeping. Will leave the phone outside the bedroom tonight. Also need to drink more water throughout the day.'
  });
  console.log('📔  Created today\'s journal entry');

  // ── 5. Analytics – 60 days of realistic history ────────────────────────────
  await AnalyticsActivity.deleteMany({ userId });
  const analyticsData = [];

  // Realistic pattern: strong weekdays, lighter weekends, occasional misses
  const deepWorkPattern     = [110, 95, 120, 105, 90,  60,  45]; // Mon-Sun
  const tasksPattern        = [9,   8,  10,  9,   7,   5,   3 ]; //
  const habitScorePattern   = [4,   3,  4,   4,   3,   2,   1 ]; //

  for (let i = 59; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dayOfWeek = d.getDay(); // 0=Sun,1=Mon…6=Sat

    // Skip ~15% of days to simulate occasional misses
    if (Math.random() < 0.12 && i > 3) continue;

    // Add slight daily variation
    const variation = () => Math.floor(Math.random() * 20) - 10;
    const isoDay   = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Mon=0…Sun=6

    analyticsData.push({
      userId,
      date:            d,
      deepWorkMinutes: Math.max(0, deepWorkPattern[isoDay] + variation()),
      tasksCompleted:  Math.max(0, tasksPattern[isoDay]    + Math.floor(Math.random() * 3) - 1),
      habitScore:      Math.min(4, Math.max(0, habitScorePattern[isoDay] + (Math.random() > 0.7 ? 1 : 0)))
    });
  }

  // Always include today
  analyticsData.push({
    userId, date: today,
    deepWorkMinutes: 95,   // this morning's deep work
    tasksCompleted:  checked,
    habitScore:      3
  });

  await AnalyticsActivity.insertMany(analyticsData);
  console.log(`📊  Inserted ${analyticsData.length} analytics records (60-day history)`);

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉  Seed complete! Login with:');
  console.log('    📧  Email   : demo@the1percentclub.app');
  console.log('    🔑  Password: Demo@123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('❌  Seed failed:', err);
  process.exit(1);
});
