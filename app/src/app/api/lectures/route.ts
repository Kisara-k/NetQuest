import { NextResponse } from 'next/server';
import { getNormalizedLectures } from '@/lib/lecture-parser';
import { CURRICULUM_MODULES, SECTORS } from '@/data';

export async function GET() {
  try {
    const lectures = getNormalizedLectures();
    const curriculumSummaries = CURRICULUM_MODULES.map((m) => ({
      id: m.id,
      title: m.title,
      shortTitle: m.shortTitle,
      sectorId: m.sectorId,
      sectorName: m.sectorName,
      estimatedMinutes: m.estimatedMinutes,
      osiLayers: m.osiLayers,
      tagline: m.tagline,
      labEngine: m.labConfig.engine,
      conceptCount: m.concepts.length,
      flashcardCount: m.flashcards.length,
      quizCount: m.quiz.length,
    }));

    return NextResponse.json({
      count: lectures.length,
      lectures,
      curriculum: curriculumSummaries,
      sectors: SECTORS,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load normalized lectures', details: String(error) },
      { status: 500 },
    );
  }
}
