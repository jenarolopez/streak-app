import moment from 'moment';
import { NextRequest, NextResponse } from 'next/server';

type Activity = {
  activity: string;
  date: string;
};

type DayState = 'COMPLETED' | 'AT_RISK' | 'SAVED' | 'INCOMPLETE';

type DayData = {
  date: string;
  activities: number;
  state?: DayState;
};

type StreakResponse = {
  activitiesToday: number;
  total: number;
  days: DayData[];
};





// Mock data for different test cases
const mockData: Record<string, Activity[]> = {
  'case1': [
    { date: moment().clone().subtract(3, "days").format("YYYY-MM-DD"), activity: "jogging" },
    { date: moment().clone().format("YYYY-MM-DD"), activity: "walking" },
    { date: moment().clone().format("YYYY-MM-DD"), activity: "reading" },
    { date: moment().clone().format("YYYY-MM-DD"), activity: "meditation" }
  ],
  'case2': [
    { date: moment().clone().subtract(4, "days").format("YYYY-MM-DD"), activity: "walking" },
    { date: moment().clone().subtract(3, "days").format("YYYY-MM-DD"), activity: "jogging" },
    { date: moment().clone().format("YYYY-MM-DD"), activity: "reading" }
  ],
  'case3': [
    { date: moment().clone().subtract(4, "days").format("YYYY-MM-DD"), activity: "walking" },
    { date: moment().clone().format("YYYY-MM-DD"), activity: "jogging" },
    { date: moment().clone().format("YYYY-MM-DD"), activity: "meditation" },
    { date: moment().clone().format("YYYY-MM-DD"), activity: "reading" }
  ],
  'default': [
    { date: moment().clone().subtract(3, "days").format("YYYY-MM-DD"), activity: "jogging" },
    { date: moment().clone().format("YYYY-MM-DD"), activity: "walking" },
    { date: moment().clone().format("YYYY-MM-DD"), activity: "reading" },
    { date: moment().clone().format("YYYY-MM-DD"), activity: "meditation" }
  ],
};

type RawActivity = {
  date: string;
  activity: string;
};

type ActivitySummary = {
  date: string;
  activities: number;
};

type DayEntry = {
  date: string;
  activities: number;
  state?: DayState;
};

function calculateStreak(timeline: DayEntry[]): DayEntry[] {


  let misses = 0;
  let index = 0
  const result = timeline.reduce((acc:Record<string, DayEntry>, entry: DayEntry) => {
    index++;
  
    if(entry.activities === 0) {
      misses++;
      return {
        ...acc,
        [entry.date]: {
          ...entry,
          state: "INCOMPLETE" as DayState,
        }
      };

    }

    return {
      ...acc,
      [entry.date]: {
        ...entry,
        state: "COMPLETED" as DayState,
      }
    };

  }, {});

  return Object.values(result).map((entry, index) => entry);
}


function build7DayTimeline(data: Omit<DayEntry, "state">[]): DayEntry[] {
  if (!data.length) return [];

  // Step 1: Find the earliest date
  const sorted = [...data].sort((a, b) => moment(a.date).diff(moment(b.date)));
  const startDate = moment(sorted[0].date).startOf("day");

  // Step 2: Create a map for quick lookup
  const activityMap = new Map<string, number>();
  for (const entry of data) {
    activityMap.set(moment(entry.date).format("YYYY-MM-DD"), entry.activities);
  }

  // Step 3: Build the 7-day timeline
  const result: DayEntry[] = [];

  for (let i = 0; i < 7; i++) {
    const date = startDate.clone().add(i, "days").format("YYYY-MM-DD");
    result.push({
      date,
      activities: activityMap.get(date) || 0
    });
  }


  // Step 4: Determine the state based on activities
  const dataUntilToday = result.filter((entry) => moment(entry.date).isSameOrBefore(moment(), "day")).sort((a, b) => moment(a.date).diff(moment(b.date)));
  const remainingDays = result.filter((entry) => moment(entry.date).isAfter(moment(), "day"))
    .sort((a, b) => moment(b.date).diff(moment(a.date))).map(entry => ({
      ...entry,
      state: "INCOMPLETE"
    })).reverse() as DayEntry[];


  const dataWithState = dataUntilToday.map((entry, index) => {


    return {
      ...entry,
      state: "COMPLETED",
    }
  }).reverse() as DayEntry[];



  return [...calculateStreak([...dataWithState.reverse()]), ...remainingDays];
}



export function normalizeActivities(raw: RawActivity[]): ActivitySummary[] {


  const reduceActivities = raw.reduce((acc: Record<string, ActivitySummary>, activity) => {

    acc[activity.date] = acc[activity.date] || { date: activity.date, activities: 0 };
    acc[activity.date].activities += 1;

    return acc;
  }, {});


  return reduceActivities ? Object.values(reduceActivities).sort((a, b) => moment(a.date).diff(moment(b.date))) : [];
}


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ case: string }> }
) {
  try {
    // Get the case parameter
    const resParam = await params;
    const caseParam = resParam.case || 'default';

    // Get activities data (in a real app, this would come from a database)
    const activities = mockData[`case${caseParam}`] || mockData.default;

    const days = normalizeActivities(activities);

    const timeline = build7DayTimeline(days);

    // Create response
    const response: StreakResponse = {
      activitiesToday: 1,
      total: 1,
      days: timeline,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing streak data:', error);
    return NextResponse.json(
      { error: 'Failed to process streak data' },
      { status: 500 }
    );
  }
}