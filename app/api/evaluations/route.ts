import { NextResponse } from 'next/server';

type EvalRequest = {
  evaluationId?: string;
  responses?: Array<{ criterionId: string; score: number }>;
};

// Demo mode POST handler - logs and returns success
export async function POST(request: Request) {
  try {
    const body: EvalRequest = await request.json();

    if (!body || !body.evaluationId || !Array.isArray(body.responses)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // In demo mode we just log the payload and return success.
    // Replace this with real persistence / validation as needed.
    // eslint-disable-next-line no-console
    console.info('Received evaluation submission:', {
      evaluationId: body.evaluationId,
      responsesCount: body.responses.length,
    });

    return NextResponse.json({ success: true, message: 'Evaluation recorded' }, { status: 200 });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error processing evaluation submission', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

