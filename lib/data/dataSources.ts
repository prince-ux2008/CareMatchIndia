import { DataSource } from '../types';

export const PRIMARY_DATA_SOURCES: Record<string, DataSource> = {
  src_pmjay: {
    id: 'src_pmjay',
    publisher: 'National Health Authority (PM-JAY Registry)',
    sourceType: 'GOVT_REGISTRY',
    sourceUrl: 'https://hospitals.pmjay.gov.in',
    retrievedAt: '2026-02-15',
    lastAuditedAt: '2026-03-01',
    auditNotes: 'Verified via National Health Authority Empanelled Hospital Registry API.',
  },
  src_nabh: {
    id: 'src_nabh',
    publisher: 'National Accreditation Board for Hospitals & Healthcare Providers (NABH)',
    sourceType: 'NABH_DIRECTORY',
    sourceUrl: 'https://nabh.co/AccreditedHosp.aspx',
    retrievedAt: '2026-01-20',
    lastAuditedAt: '2026-02-10',
    auditNotes: 'Accreditation certificate and quality audit verified with NABH central directory.',
  },
  src_audit: {
    id: 'src_audit',
    publisher: 'CareMatch Field Audit & Public Tariff Benchmarks',
    sourceType: 'TELEPHONE_AUDIT',
    retrievedAt: '2026-03-10',
    lastAuditedAt: '2026-03-15',
    auditNotes: 'Direct telephone audit with Hospital Billing & Medical Superintendents.',
  },
  src_official: {
    id: 'src_official',
    publisher: 'Punjab Health Systems Corporation & Official Hospital Portals',
    sourceType: 'OFFICIAL_PORTAL',
    retrievedAt: '2026-02-28',
    lastAuditedAt: '2026-03-05',
    auditNotes: 'Official public schedule of charges and bed occupancy rate.',
  },
};
