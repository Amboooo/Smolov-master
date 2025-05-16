// src/app/workout/[planId]/page.tsx

import WorkoutClient from './WorkoutClient';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return [
    { planId: 'beginner' },
    { planId: 'intermediate' },
    { planId: 'advanced' },
  ];
}

export const metadata: Metadata = {
  title: 'Workout Plan',
  description: 'Track and complete your selected workout plan.',
};

export default function Page({ params }: { params: { planId: string } }) {
  return <WorkoutClient planId={params.planId} />;
}
