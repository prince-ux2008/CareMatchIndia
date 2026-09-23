import { NextResponse } from 'next/server';
import { VerificationStatus } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { hospitalId, newStatus, auditNotes, verifiedBy = 'Admin Nodal Officer' } = body;

    if (!hospitalId || !newStatus) {
      return NextResponse.json({ success: false, error: 'hospitalId and newStatus are required' }, { status: 400 });
    }

    const auditLog = {
      id: 'audit_' + Date.now(),
      hospitalId,
      newStatus,
      auditNotes: auditNotes || 'Status verified by nodal officer audit',
      verifiedBy,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: `Hospital ${hospitalId} verification status updated to ${newStatus}`,
      auditLog,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Failed to update verification' }, { status: 500 });
  }
}
