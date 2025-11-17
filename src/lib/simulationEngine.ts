interface SubjectData {
  subject_name: string;
  current_grade_estimate: string | null;
  study_hours_per_week: number;
}

interface AcademicRecord {
  subject_name: string;
  grade: string | null;
  score: number | null;
  exam_type: string;
}

interface SimulationInput {
  simulationType: string;
  currentSubjects: SubjectData[];
  academicHistory: AcademicRecord[];
  ccaRecords: any[];
  studyHabits?: {
    hoursPerWeek?: number;
    subjectChanges?: Array<{ add?: string; remove?: string }>;
  };
  targetGoal?: {
    institution: string;
    course: string;
    requiredScore: string;
  };
}

const GRADE_POINTS: Record<string, number> = {
  'A1': 1, 'A2': 2, 'B3': 3, 'B4': 4,
  'C5': 5, 'C6': 6, 'D7': 7, 'E8': 8, 'F9': 9
};

const GRADE_FROM_POINTS: Record<number, string> = {
  1: 'A1', 2: 'A2', 3: 'B3', 4: 'B4',
  5: 'C5', 6: 'C6', 7: 'D7', 8: 'E8', 9: 'F9'
};

function calculateAverageGradePoint(subjects: SubjectData[]): number {
  let totalPoints = 0;
  let count = 0;

  subjects.forEach(subject => {
    if (subject.current_grade_estimate && GRADE_POINTS[subject.current_grade_estimate]) {
      totalPoints += GRADE_POINTS[subject.current_grade_estimate];
      count++;
    }
  });

  return count > 0 ? totalPoints / count : 5;
}

function predictGradeChange(currentGrade: string | null, studyHoursChange: number): string {
  if (!currentGrade || !GRADE_POINTS[currentGrade]) return 'B4';

  const currentPoints = GRADE_POINTS[currentGrade];

  let adjustedPoints = currentPoints;
  if (studyHoursChange > 5) {
    adjustedPoints = Math.max(1, currentPoints - 1);
  } else if (studyHoursChange > 2) {
    adjustedPoints = Math.max(1, currentPoints - 0.5);
  } else if (studyHoursChange < -3) {
    adjustedPoints = Math.min(9, currentPoints + 1);
  }

  const roundedPoints = Math.round(adjustedPoints);
  return GRADE_FROM_POINTS[roundedPoints] || currentGrade;
}

function calculateL1R5(subjects: SubjectData[]): number {
  const subjectPoints = subjects
    .map(s => GRADE_POINTS[s.current_grade_estimate || ''] || 5)
    .sort((a, b) => a - b);

  return subjectPoints.slice(0, 6).reduce((sum, p) => sum + p, 0);
}

export function runSimulation(input: SimulationInput) {
  const { simulationType, currentSubjects, academicHistory, ccaRecords, studyHabits, targetGoal } = input;

  if (simulationType === 'o-level-prediction') {
    return simulateOLevelPrediction(currentSubjects, academicHistory, studyHabits);
  } else if (simulationType === 'subject-change') {
    return simulateSubjectChange(currentSubjects, studyHabits);
  } else if (simulationType === 'pathway-analysis') {
    return simulatePathwayAnalysis(currentSubjects, targetGoal);
  } else if (simulationType === 'leaps-impact') {
    return simulateLeapsImpact(ccaRecords, studyHabits);
  }

  return {
    predicted_outcomes: {},
    confidence_score: 0,
    recommendations: []
  };
}

function simulateOLevelPrediction(
  currentSubjects: SubjectData[],
  academicHistory: AcademicRecord[],
  studyHabits?: { hoursPerWeek?: number }
) {
  const avgGradePoint = calculateAverageGradePoint(currentSubjects);
  const currentL1R5 = calculateL1R5(currentSubjects);

  const currentTotalHours = currentSubjects.reduce((sum, s) => sum + s.study_hours_per_week, 0);
  const newTotalHours = studyHabits?.hoursPerWeek || currentTotalHours;
  const hoursDiff = newTotalHours - currentTotalHours;

  const predictedSubjects = currentSubjects.map(subject => ({
    subject: subject.subject_name,
    current: subject.current_grade_estimate || 'B4',
    predicted: predictGradeChange(subject.current_grade_estimate, hoursDiff / currentSubjects.length)
  }));

  const predictedL1R5 = calculateL1R5(
    predictedSubjects.map((ps, idx) => ({
      ...currentSubjects[idx],
      current_grade_estimate: ps.predicted
    }))
  );

  const improvement = currentL1R5 - predictedL1R5;
  const confidenceScore = 75 + Math.min(15, academicHistory.length * 2);

  const recommendations = [];

  if (predictedL1R5 > 15) {
    recommendations.push({
      type: 'Study Focus',
      message: 'Your predicted L1R5 indicates room for improvement. Focus on weaker subjects.',
      priority: 'high'
    });
  }

  if (hoursDiff < 0) {
    recommendations.push({
      type: 'Study Hours',
      message: 'Reducing study hours may negatively impact your results. Consider maintaining current effort.',
      priority: 'medium'
    });
  }

  recommendations.push({
    type: 'Subject Performance',
    message: `Focus on ${predictedSubjects.filter(s => GRADE_POINTS[s.predicted] > 4).map(s => s.subject).join(', ')} for maximum L1R5 improvement.`,
    priority: 'high'
  });

  return {
    predicted_outcomes: {
      current_l1r5: currentL1R5,
      predicted_l1r5: predictedL1R5,
      improvement: improvement,
      subject_predictions: predictedSubjects,
      study_hours_change: hoursDiff
    },
    confidence_score: confidenceScore,
    recommendations
  };
}

function simulateSubjectChange(
  currentSubjects: SubjectData[],
  studyHabits?: { subjectChanges?: Array<{ add?: string; remove?: string }> }
) {
  const changes = studyHabits?.subjectChanges || [];

  let newSubjects = [...currentSubjects];
  changes.forEach(change => {
    if (change.remove) {
      newSubjects = newSubjects.filter(s => s.subject_name !== change.remove);
    }
    if (change.add) {
      newSubjects.push({
        subject_name: change.add,
        current_grade_estimate: 'B3',
        study_hours_per_week: 3
      });
    }
  });

  const currentL1R5 = calculateL1R5(currentSubjects);
  const newL1R5 = calculateL1R5(newSubjects);

  const recommendations = [];

  if (newL1R5 < currentL1R5) {
    recommendations.push({
      type: 'Subject Change',
      message: 'This subject combination may improve your L1R5 score.',
      priority: 'high'
    });
  } else {
    recommendations.push({
      type: 'Subject Change',
      message: 'Consider your interest and aptitude, not just predicted scores.',
      priority: 'medium'
    });
  }

  return {
    predicted_outcomes: {
      current_l1r5: currentL1R5,
      predicted_l1r5_with_changes: newL1R5,
      difference: currentL1R5 - newL1R5,
      new_subject_list: newSubjects.map(s => s.subject_name)
    },
    confidence_score: 70,
    recommendations
  };
}

function simulatePathwayAnalysis(
  currentSubjects: SubjectData[],
  targetGoal?: { institution: string; course: string; requiredScore: string }
) {
  const currentL1R5 = calculateL1R5(currentSubjects);
  const targetScore = targetGoal?.requiredScore ? parseInt(targetGoal.requiredScore) : 12;

  const gap = currentL1R5 - targetScore;
  const achievable = gap <= 6;

  const recommendations = [];

  if (achievable) {
    recommendations.push({
      type: 'Pathway',
      message: `Your goal of ${targetGoal?.institution} - ${targetGoal?.course} is achievable with focused effort.`,
      priority: 'high'
    });

    if (gap > 0) {
      const subjectsToImprove = Math.ceil(gap);
      recommendations.push({
        type: 'Action Plan',
        message: `Improve ${subjectsToImprove} subjects by one grade to reach your target.`,
        priority: 'high'
      });
    }
  } else {
    recommendations.push({
      type: 'Alternative Pathway',
      message: 'Consider polytechnic pathways or alternative courses that align with your current trajectory.',
      priority: 'high'
    });
  }

  return {
    predicted_outcomes: {
      current_l1r5: currentL1R5,
      target_score: targetScore,
      gap: gap,
      achievable: achievable,
      target_institution: targetGoal?.institution || 'Not specified',
      probability: achievable ? Math.max(50, 100 - (gap * 10)) : Math.max(20, 50 - (gap * 5))
    },
    confidence_score: 80,
    recommendations
  };
}

function simulateLeapsImpact(
  ccaRecords: any[],
  studyHabits?: { hoursPerWeek?: number }
) {
  const currentLeapsPoints = ccaRecords.reduce((sum, cca) => sum + (cca.leaps_points || 0), 0);

  const viaHours = studyHabits?.hoursPerWeek || 0;
  const additionalPoints = Math.min(viaHours, 3);

  const recommendations = [
    {
      type: 'LEAPS 2.0',
      message: `Current LEAPS points: ${currentLeapsPoints}. VIA projects can add up to 3 bonus points.`,
      priority: 'medium'
    },
    {
      type: 'Leadership',
      message: 'Taking leadership roles in CCA or VIA projects significantly boosts your LEAPS profile.',
      priority: 'high'
    }
  ];

  return {
    predicted_outcomes: {
      current_leaps_points: currentLeapsPoints,
      potential_additional_points: additionalPoints,
      projected_total: currentLeapsPoints + additionalPoints,
      via_impact: additionalPoints
    },
    confidence_score: 85,
    recommendations
  };
}
